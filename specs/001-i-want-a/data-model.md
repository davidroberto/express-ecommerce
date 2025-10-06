# Data Model: Ajouter un produit à une commande

**Feature**: 001-i-want-a
**Date**: 2025-10-06

## Entity Diagram

```
┌─────────────────┐
│     Order       │
├─────────────────┤
│ id: number      │◄────┐
│ createdAt: Date │     │
└─────────────────┘     │
         │              │
         │ 1            │
         │              │
         │              │
         │ *            │
┌─────────────────────┐ │
│    OrderItem        │ │
├─────────────────────┤ │
│ orderId: number     │─┘
│ productId: number   │─────┐
│ quantity: number    │     │
│ unitPrice: number   │     │
└─────────────────────┘     │
                            │
                            │ *
                            │
                            │ 1
                      ┌─────────────────┐
                      │    Product      │
                      ├─────────────────┤
                      │ id: number      │
                      │ title: string   │
                      │ price: number   │
                      │ description     │
                      └─────────────────┘
                       (existing entity)
```

## Entities

### Order

**Purpose**: Aggregate root for customer orders. Manages collection of OrderItems and enforces business invariants.

**Fields**:
| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| id | number | No | Primary key (auto-generated) |
| orderItems | OrderItem[] | No | Collection of line items (default: []) |
| createdAt | Date | No | Order creation timestamp |

**Calculated Properties**:
- `totalAmount(): number` - Sum of all OrderItem subtotals (quantity * unitPrice)
- `distinctProductCount(): number` - Count of unique productIds in orderItems

**Business Rules** (enforced in entity methods):
1. Maximum 5 distinct products per order
2. Total amount must not exceed 500€
3. Each product quantity must not exceed 10 units
4. Cannot add non-existent products (validated via Product existence check)

**Methods**:
```typescript
canAddProduct(product: Product, quantity: number): { allowed: boolean, reason?: string }
addProduct(product: Product, quantity: number): void
```

**Validation Logic**:
- `canAddProduct()`: Pre-flight check returning { allowed: false, reason } if any rule violated
- `addProduct()`: Calls `canAddProduct()` first, throws French error if not allowed
- If product exists in orderItems: increment quantity (check max 10 total)
- If product new: check distinct product count < 5, check total amount <= 500€

**TypeORM Decorators**:
```typescript
@Entity()
@PrimaryGeneratedColumn()
@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
@OneToMany(() => OrderItem, item => item.order, { cascade: true, eager: true })
```

**Validation Messages** (French):
- "le nombre maximum de produits distincts (5) est atteint"
- "le montant total ne doit pas dépasser 500€"
- "la quantité maximale (10) est atteinte pour ce produit"

---

### OrderItem

**Purpose**: Value object / entity representing one product line in an order. Stores quantity and price snapshot.

**Fields**:
| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| id | number | No | Primary key (auto-generated) |
| orderId | number | No | Foreign key to Order |
| productId | number | No | Foreign key to Product |
| quantity | number | No | Number of units (1-10) |
| unitPrice | number | No | Price snapshot at time of addition |

**Business Rules** (enforced in constructor):
1. quantity > 0
2. quantity <= 10
3. unitPrice >= 0

**Methods**:
```typescript
incrementQuantity(amount: number): void
getSubtotal(): number
```

**Validation Logic**:
- Constructor: Validate quantity in range [1, 10], throw if invalid
- `incrementQuantity(amount)`: Validate new total <= 10, throw French error if exceeded
- `getSubtotal()`: Return quantity * unitPrice

**TypeORM Decorators**:
```typescript
@Entity()
@PrimaryGeneratedColumn()
@Column({ type: 'int' })
@ManyToOne(() => Order, order => order.orderItems, { onDelete: 'CASCADE' })
@ManyToOne(() => Product, { eager: true })
```

**Validation Messages** (French):
- "la quantité doit être supérieure à 0"
- "la quantité ne peut pas dépasser 10 unités"

---

### Product

**Purpose**: Existing entity. Represents products available for purchase.

**Fields** (from existing implementation):
| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| id | number | No | Primary key |
| title | string | No | Product name (min 3 chars) |
| description | string | Yes | Product description |
| price | number | No | Unit price (>0, <10000) |

**Existing Validation** (in Product.ts constructor):
- title.length > 2 (error: "titre trop court")
- price > 0 (error: "le prix doit être supérieur à 0")
- price < 10000 (error: "le prix doit être inférieur à 10000")

**Usage in this feature**: Read-only. Product price is copied to OrderItem.unitPrice at time of addition.

---

## Relationships

1. **Order → OrderItem**: One-to-many (composition)
   - Cascade: true (deleting Order deletes OrderItems)
   - Eager loading: true (load items with order)
   - Owner: Order (aggregate root)

2. **OrderItem → Product**: Many-to-one (reference)
   - Eager loading: true (load product details with item)
   - No cascade (Product lifecycle independent)
   - ProductId + unitPrice stored for historical accuracy

3. **Order ← OrderItem**: Many-to-one (inverse)
   - OrderItem belongs to exactly one Order
   - onDelete: CASCADE (DB-level constraint)

---

## State Transitions

**Order state** (for this feature, no status field):
```
[Created empty]
    ↓ addProduct(product, qty=1)
[1 product, qty=1]
    ↓ addProduct(same product, qty=1)
[1 product, qty=2]
    ↓ addProduct(different product, qty=1)
[2 products]
    ...
    ↓ addProduct(6th distinct product)
[ERROR: max 5 products]
```

**OrderItem state**:
```
[Created with qty=1, unitPrice=X]
    ↓ incrementQuantity(1)
[qty=2]
    ...
    ↓ incrementQuantity(1) when qty=10
[ERROR: max 10 units]
```

---

## Persistence Strategy

**Technology**: TypeORM entities with PostgreSQL

**Migration needed**:
- Create `order` table (id, createdAt)
- Create `order_item` table (id, orderId, productId, quantity, unitPrice)
- Foreign key constraints: order_item.orderId → order.id (ON DELETE CASCADE)
- Foreign key constraints: order_item.productId → product.id (ON DELETE RESTRICT)

**Indexes recommended**:
- order_item(orderId) - for loading items by order
- order_item(orderId, productId) - for uniqueness check (composite unique constraint)

**Data integrity**:
- Unique constraint on (orderId, productId) to prevent duplicate products in same order
- CHECK constraint: quantity BETWEEN 1 AND 10
- CHECK constraint: unitPrice >= 0

---

## Validation Summary

| Rule | Enforced By | Error Message (French) |
|------|-------------|------------------------|
| quantity > 0 | OrderItem constructor | "la quantité doit être supérieure à 0" |
| quantity <= 10 | OrderItem constructor + incrementQuantity | "la quantité ne peut pas dépasser 10 unités" |
| max 5 distinct products | Order.addProduct | "le nombre maximum de produits distincts (5) est atteint" |
| total amount <= 500€ | Order.addProduct | "le montant total ne doit pas dépasser 500€" |
| product exists | AddProductToOrderUsecase | "produit non trouvé" |
| order exists | AddProductToOrderUsecase | "commande non trouvée" |

---

## Example Data Flow

**Scenario**: Add product (id=5, price=30€) with quantity=2 to order (id=10)

1. Controller receives: `POST /api/orders/10/products { productId: 5, quantity: 2 }`
2. Use case loads Order (id=10) and Product (id=5) via repositories
3. Use case calls `order.addProduct(product, 2)`
4. Order checks:
   - distinctProductCount() < 5? ✓
   - totalAmount() + (30 * 2) <= 500? ✓
   - quantity (2) <= 10? ✓
5. Order creates/updates OrderItem:
   - If product 5 not in orderItems: new OrderItem(orderId=10, productId=5, quantity=2, unitPrice=30)
   - If product 5 exists with qty=3: item.incrementQuantity(2) → qty=5
6. Use case saves Order (cascade saves OrderItems)
7. Controller returns 200 with order summary

---