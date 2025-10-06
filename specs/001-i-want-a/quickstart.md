# Quickstart: Ajouter un produit à une commande

**Feature**: 001-i-want-a
**Date**: 2025-10-06
**Purpose**: Manual validation scenarios for acceptance testing

## Prerequisites

1. **Database running**:
   ```bash
   docker compose --env-file .env.local up
   ```

2. **Server running**:
   ```bash
   npm run dev
   ```

3. **Test data setup** (run once):
   ```bash
   # Create test products
   curl -X POST http://localhost:3000/api/product \
     -H "Content-Type: application/json" \
     -d '{"title": "Produit A", "description": "Test", "price": 50}'
   # Note the returned ID (e.g., 1)

   curl -X POST http://localhost:3000/api/product \
     -H "Content-Type: application/json" \
     -d '{"title": "Produit B", "description": "Test", "price": 100}'
   # Note the returned ID (e.g., 2)

   curl -X POST http://localhost:3000/api/product \
     -H "Content-Type: application/json" \
     -d '{"title": "Produit C", "description": "Test", "price": 75}'
   # Note the returned ID (e.g., 3)

   curl -X POST http://localhost:3000/api/product \
     -H "Content-Type: application/json" \
     -d '{"title": "Produit D", "description": "Test", "price": 25}'
   # Note the returned ID (e.g., 4)

   curl -X POST http://localhost:3000/api/product \
     -H "Content-Type: application/json" \
     -d '{"title": "Produit E", "description": "Test", "price": 30}'
   # Note the returned ID (e.g., 5)

   curl -X POST http://localhost:3000/api/product \
     -H "Content-Type: application/json" \
     -d '{"title": "Produit F", "description": "Test", "price": 40}'
   # Note the returned ID (e.g., 6)

   # Create test order (empty)
   curl -X POST http://localhost:3000/api/orders \
     -H "Content-Type: application/json"
   # Note the returned ID (e.g., 10)
   ```

   **Update IDs below** with actual values from responses.

---

## Scenario 1: Add new product successfully

**Given**: Order 10 exists and is empty
**When**: Add product 1 (Produit A, 50€) with quantity 1
**Then**: Product added, order total = 50€, itemCount = 1

```bash
curl -X POST http://localhost:3000/api/orders/10/products \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 1}'
```

**Expected Response** (200):
```json
{
  "message": "Produit ajouté à la commande",
  "order": {
    "id": 10,
    "totalAmount": 50,
    "itemCount": 1
  }
}
```

✅ **Pass** / ❌ **Fail**: _______

---

## Scenario 2: Increment existing product quantity

**Given**: Order 10 contains product 1 (quantity: 1)
**When**: Add product 1 again with quantity 2
**Then**: Quantity incremented to 3, order total = 150€, itemCount = 1

```bash
curl -X POST http://localhost:3000/api/orders/10/products \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2}'
```

**Expected Response** (200):
```json
{
  "message": "Quantité du produit incrémentée",
  "order": {
    "id": 10,
    "totalAmount": 150,
    "itemCount": 1
  }
}
```

✅ **Pass** / ❌ **Fail**: _______

---

## Scenario 3: Add 4 more distinct products (within limits)

**Given**: Order 10 contains 1 product (product 1, qty 3)
**When**: Add products 2, 3, 4, 5 sequentially
**Then**: All succeed, itemCount = 5, total < 500€

```bash
# Add product 2 (100€)
curl -X POST http://localhost:3000/api/orders/10/products \
  -H "Content-Type: application/json" \
  -d '{"productId": 2, "quantity": 1}'

# Add product 3 (75€)
curl -X POST http://localhost:3000/api/orders/10/products \
  -H "Content-Type: application/json" \
  -d '{"productId": 3, "quantity": 1}'

# Add product 4 (25€)
curl -X POST http://localhost:3000/api/orders/10/products \
  -H "Content-Type: application/json" \
  -d '{"productId": 4, "quantity": 1}'

# Add product 5 (30€)
curl -X POST http://localhost:3000/api/orders/10/products \
  -H "Content-Type: application/json" \
  -d '{"productId": 5, "quantity": 1}'
```

**Expected Final State**:
- itemCount: 5
- totalAmount: 150 + 100 + 75 + 25 + 30 = 380€

✅ **Pass** / ❌ **Fail**: _______

---

## Scenario 4: Reject 6th distinct product

**Given**: Order 10 contains 5 distinct products
**When**: Try to add product 6 (Produit F, 40€)
**Then**: Error 400 - max 5 products reached

```bash
curl -X POST http://localhost:3000/api/orders/10/products \
  -H "Content-Type: application/json" \
  -d '{"productId": 6, "quantity": 1}'
```

**Expected Response** (400):
```json
{
  "message": "le nombre maximum de produits distincts (5) est atteint"
}
```

✅ **Pass** / ❌ **Fail**: _______

---

## Scenario 5: Reject when total exceeds 500€

**Setup**: Create new order with products totaling 450€

```bash
# Create new order
curl -X POST http://localhost:3000/api/orders
# Note ID (e.g., 11)

# Add product 2 (100€) x 4 = 400€
curl -X POST http://localhost:3000/api/orders/11/products \
  -H "Content-Type: application/json" \
  -d '{"productId": 2, "quantity": 4}'

# Add product 1 (50€) x 1 = 50€, total = 450€
curl -X POST http://localhost:3000/api/orders/11/products \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 1}'
```

**Test**: Try to add product 3 (75€) → would make total 525€

```bash
curl -X POST http://localhost:3000/api/orders/11/products \
  -H "Content-Type: application/json" \
  -d '{"productId": 3, "quantity": 1}'
```

**Expected Response** (400):
```json
{
  "message": "le montant total ne doit pas dépasser 500€"
}
```

✅ **Pass** / ❌ **Fail**: _______

---

## Scenario 6: Accept when total stays under 500€

**Given**: Order 11 has total 450€ (from Scenario 5)
**When**: Add product 4 (25€)
**Then**: Success, total = 475€

```bash
curl -X POST http://localhost:3000/api/orders/11/products \
  -H "Content-Type: application/json" \
  -d '{"productId": 4, "quantity": 1}'
```

**Expected Response** (200):
```json
{
  "message": "Produit ajouté à la commande",
  "order": {
    "id": 11,
    "totalAmount": 475,
    "itemCount": 3
  }
}
```

✅ **Pass** / ❌ **Fail**: _______

---

## Scenario 7: Reject non-existent product

**Given**: Order 10 exists
**When**: Try to add product 9999 (does not exist)
**Then**: Error 404 - product not found

```bash
curl -X POST http://localhost:3000/api/orders/10/products \
  -H "Content-Type: application/json" \
  -d '{"productId": 9999, "quantity": 1}'
```

**Expected Response** (404):
```json
{
  "message": "produit non trouvé"
}
```

✅ **Pass** / ❌ **Fail**: _______

---

## Scenario 8: Reject non-existent order

**Given**: Order 9999 does not exist
**When**: Try to add product 1
**Then**: Error 404 - order not found

```bash
curl -X POST http://localhost:3000/api/orders/9999/products \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 1}'
```

**Expected Response** (404):
```json
{
  "message": "commande non trouvée"
}
```

✅ **Pass** / ❌ **Fail**: _______

---

## Scenario 9: Reject quantity exceeding 10

**Setup**: Create new order and add product with qty 8

```bash
# Create new order
curl -X POST http://localhost:3000/api/orders
# Note ID (e.g., 12)

# Add product 1 with quantity 8
curl -X POST http://localhost:3000/api/orders/12/products \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 8}'
```

**Test**: Try to increment by 3 → would make total 11

```bash
curl -X POST http://localhost:3000/api/orders/12/products \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 3}'
```

**Expected Response** (400):
```json
{
  "message": "la quantité ne peut pas dépasser 10 unités"
}
```

✅ **Pass** / ❌ **Fail**: _______

---

## Scenario 10: Accept quantity at max limit (10)

**Given**: Order 12 has product 1 with qty 8
**When**: Increment by 2 (total = 10)
**Then**: Success

```bash
curl -X POST http://localhost:3000/api/orders/12/products \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2}'
```

**Expected Response** (200):
```json
{
  "message": "Quantité du produit incrémentée",
  "order": {
    "id": 12,
    "totalAmount": 500,
    "itemCount": 1
  }
}
```

✅ **Pass** / ❌ **Fail**: _______

---

## Summary

| Scenario | Description | Status |
|----------|-------------|--------|
| 1 | Add new product successfully | __ |
| 2 | Increment existing quantity | __ |
| 3 | Add 4 more products (5 total) | __ |
| 4 | Reject 6th distinct product | __ |
| 5 | Reject when total > 500€ | __ |
| 6 | Accept when total < 500€ | __ |
| 7 | Reject non-existent product | __ |
| 8 | Reject non-existent order | __ |
| 9 | Reject quantity > 10 | __ |
| 10 | Accept quantity = 10 | __ |

**Overall**: ___ / 10 scenarios passing

---

## Cleanup

```bash
# Delete test orders and products if needed
# (Implementation depends on DELETE endpoints - not in scope for this feature)
```

---

## Notes

- All error messages must be in French
- Authentication check not tested (scope: "authentication required" but implementation details excluded)
- Order status management not tested (out of scope per spec OS-001)