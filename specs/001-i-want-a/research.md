# Research: Ajouter un produit à une commande

**Feature**: 001-i-want-a
**Date**: 2025-10-06
**Status**: Complete

## Technology Stack Confirmation

### Decision: Use Existing Stack
**Rationale**: All required technologies are already in place and working:
- TypeScript with strict mode enabled
- Express.js for HTTP routing
- TypeORM for database ORM
- PostgreSQL for persistence
- Jest with ts-jest for unit testing
- @testcontainers/postgresql for integration testing

**Alternatives considered**: None - consistent with existing codebase

### Decision: Follow Existing Module Pattern
**Rationale**: The `src/module/product` structure provides a proven template:
- Domain entities at module root (Product.ts)
- Repository interfaces at module root (productRepository.interface.ts)
- Use case subdirectories with controller + use case + tests
- French language for business domain terms and error messages

**Evidence**: Reviewed existing files:
- `src/module/product/Product.ts` (entity with validation in constructor)
- `src/module/product/productRepository.interface.ts` (repository interface pattern)
- `src/module/product/createProduct/createProduct.usecase.ts` (use case pattern)
- `src/module/product/createProduct/createProduct.useCase.spec.ts` (test pattern with French)

**Alternatives considered**: None - constitutional requirement (Principle IV)

## Design Patterns Confirmation

### Decision: Repository Pattern with Dependency Injection
**Rationale**: Established by constitution and existing code
- Repository interface defined in domain layer
- Use case constructor accepts repository interface
- Test doubles (DummyProductRepository) used in unit tests
- Real implementations injected via controllers

**Evidence**: `CreateProductUsecase` constructor accepts `ProductRepository` interface

**Alternatives considered**: None - constitutional requirement (Principle II)

### Decision: Domain Validation in Entity Constructors
**Rationale**: Constitutional requirement (Principle I - Domain-Driven Design)
- Product entity validates title length (> 2 chars)
- Product entity validates price range (> 0, < 10000)
- Validation throws French error messages
- Same pattern required for Order and OrderItem entities

**Evidence**: `Product.ts` lines 19-29 show validation in constructor

**Alternatives considered**: None - constitutional requirement

## Testing Approach Confirmation

### Decision: Three-Layer Testing Strategy
**Rationale**: Established by constitution and existing code

1. **Unit Tests** (test doubles):
   - Test entities in isolation
   - Test use cases with DummyRepository
   - Given-When-Then comments in French
   - Example: `createProduct.useCase.spec.ts`

2. **Integration Tests** (testcontainers):
   - Test database interactions
   - Use @testcontainers/postgresql
   - Constitutional requirement (Principle VII)

3. **Contract Tests** (supertest):
   - Test HTTP endpoints
   - Validate request/response schemas
   - Constitutional requirement

**Evidence**:
- `createProduct.useCase.spec.ts` shows unit test pattern with DummyProductRepository
- `package.json` includes @testcontainers/postgresql

**Alternatives considered**: None - constitutional requirements (Principles III, VII)

## Entity Relationships

### Decision: Order has-many OrderItems, OrderItem references Product
**Rationale**: Standard e-commerce domain model
- Order aggregates OrderItems (composition)
- OrderItem stores productId + snapshot of unitPrice
- OrderItem quantity managed within item
- Product remains independent entity (already exists)

**Alternatives considered**:
- Embed product data in OrderItem: Rejected - violates normalization, loses price updates
- Direct Order-Product relationship: Rejected - can't store quantities per product

## Business Rule Enforcement Strategy

### Decision: Multi-Layer Validation
**Rationale**: Defense in depth per constitution

1. **Entity-level** (OrderItem):
   - Constructor validates quantity > 0 and <= 10
   - `incrementQuantity()` validates result <= 10

2. **Aggregate-level** (Order):
   - `canAddProduct()` checks all constraints before mutation
   - `addProduct()` enforces: 5 product limit, 500€ limit, quantity limit
   - Checks if product already exists → increment vs add

3. **Controller-level**:
   - Validates request completeness (orderId, productId present)
   - Returns appropriate HTTP status codes

4. **Use Case-level**:
   - Validates product exists (calls ProductRepository)
   - Validates order exists (calls OrderRepository)
   - Delegates business logic to Order.addProduct()

**Evidence**: Product entity validation pattern in constructor
**Alternatives considered**: Validation only at use case level - Rejected, violates Constitution I

## API Design

### Decision: REST endpoint POST /api/orders/:orderId/products
**Rationale**: RESTful convention for adding sub-resources
- Idiomatic HTTP verb (POST = create/add)
- Clear resource hierarchy (order contains products)
- Follows existing /api/product pattern

**Request Body**: `{ productId: number, quantity?: number }`
- quantity defaults to 1 if omitted
- Simple, focused payload

**Response Codes**:
- 200: Success (product added or quantity incremented)
- 400: Validation error (business rule violation)
- 404: Order or product not found
- 401: Not authenticated

**Alternatives considered**:
- PUT /api/orders/:orderId: Rejected - less clear intent, would require full order payload
- PATCH /api/orders/:orderId: Rejected - unclear semantics for adding vs updating

## No Unknowns Remaining

All technical decisions confirmed by existing codebase patterns and constitutional requirements. Ready for Phase 1 (Design & Contracts).