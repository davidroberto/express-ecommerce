
# Implementation Plan: Ajouter un produit à une commande

**Branch**: `001-i-want-a` | **Date**: 2025-10-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-i-want-a/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code, or `AGENTS.md` for all other agents).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 8. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Implementation of order management functionality to add products to orders with business constraints:
- Maximum 5 distinct products per order
- Maximum 500€ total amount per order
- Maximum 10 units per product
- Smart quantity increment when adding existing product
- Full validation of product and order existence
- Authentication required for all operations

## Technical Context
**Language/Version**: TypeScript (as per tsconfig.json)
**Primary Dependencies**: Express.js, TypeORM, Jest, @testcontainers/postgresql
**Storage**: PostgreSQL (via TypeORM)
**Testing**: Jest with ts-jest, @testcontainers/postgresql for integration tests
**Target Platform**: Node.js server (backend API)
**Project Type**: single (existing Express.js backend with module-based structure)
**Performance Goals**: Standard web API response times (<200ms p95 as per constitution TODO)
**Constraints**:
- Must validate all business rules in domain entities (Constitution I)
- Must use dependency injection via repository interfaces (Constitution II)
- Tests written before implementation (Constitution III - TDD)
- French error messages to match business domain
**Scale/Scope**:
- New Order and OrderItem entities
- New addProductToOrder use case
- Integration with existing Product entity
- HTTP POST endpoint for adding products to orders

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Domain-Driven Design ✅ COMPLIANT
- Order entity will enforce: max 5 distinct products, max 500€ total, product existence
- OrderItem entity will enforce: max 10 quantity limit
- Use case orchestrates but delegates validation to entities

### II. Dependency Inversion ✅ COMPLIANT
- OrderRepository interface defined in domain layer
- Use case depends on abstraction, not concrete implementation
- Follows existing pattern from ProductRepository

### III. Test-Driven Development ✅ COMPLIANT
- Contract tests written first (Phase 1)
- Unit tests for entities written before entity implementation
- Integration tests for use case written before use case implementation
- Red-Green-Refactor cycle enforced

### IV. Module Organization by Feature ✅ COMPLIANT
- New `src/module/order/` directory structure
- Follows existing pattern from `src/module/product/`
- Contains entities, use cases, controllers, interfaces per feature

### V. Use Case Pattern ✅ COMPLIANT
- `AddProductToOrderUsecase` with single `execute()` method
- Accepts DTO: `{ orderId, productId, quantity?: number }`
- Follows existing pattern from CreateProductUsecase

### VI. Type Safety and Validation ✅ COMPLIANT
- TypeScript strict mode already enabled
- Order entity validates constraints in constructor
- OrderItem entity validates quantity limits
- Controller validates request completeness
- French error messages as per convention

### VII. Test Isolation ✅ COMPLIANT
- Unit tests use DummyOrderRepository and DummyProductRepository
- Integration tests use testcontainers for real DB
- Follows existing test pattern from product module

**Initial Assessment**: NO VIOLATIONS - All constitutional principles satisfied

## Project Structure

### Documentation (this feature)
```
specs/001-i-want-a/
├── plan.md              # This file (/plan command output)
├── spec.md              # Feature specification (input)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
│   └── add-product-to-order.openapi.yml
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/module/order/
├── Order.ts                               # Domain entity
├── OrderItem.ts                           # Domain entity (value object or entity)
├── orderRepository.interface.ts           # Repository interface
├── addProductToOrder/
│   ├── addProductToOrder.usecase.ts       # Use case implementation
│   ├── addProductToOrder.controller.ts    # HTTP controller
│   └── addProductToOrder.useCase.spec.ts  # Unit tests

src/module/product/
└── (existing Product entity reused)
```

**Structure Decision**: Single project structure using existing `src/module/{feature}` pattern established by the Product module. The Order module will coexist alongside Product following identical conventions per Constitution IV.

## Phase 0: Outline & Research

No unknowns require research. All technical context is clear:
- TypeScript, Express.js, TypeORM, Jest already in use
- Module structure pattern established by existing Product module
- Repository pattern established by existing ProductRepository interface
- Testing approach established by existing createProduct.useCase.spec.ts

**Output**: research.md (minimal - confirming existing tech stack and patterns)

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

### Entities to Design:

1. **Order Entity** (`src/module/order/Order.ts`):
   - Fields: id (number), orderItems (OrderItem[]), createdAt (Date)
   - Calculated: totalAmount(), distinctProductCount()
   - Validations in methods:
     - `canAddProduct(product, quantity)`: checks 5 product limit, 500€ limit, 10 qty limit
     - `addProduct(product, quantity)`: enforces rules, increments if exists
   - Business rules enforced in entity (Constitution I)

2. **OrderItem Entity** (`src/module/order/OrderItem.ts`):
   - Fields: productId (number), quantity (number), unitPrice (number)
   - Validation in constructor: quantity > 0, quantity <= 10
   - Method: `incrementQuantity(amount)` with max 10 validation

3. **OrderRepository Interface** (`src/module/order/orderRepository.interface.ts`):
   - `findById(id: number): Promise<Order | null>`
   - `save(order: Order): Promise<void>`

### API Contracts:

**POST /api/orders/:orderId/products**
- Request: `{ productId: number, quantity?: number }` (quantity defaults to 1)
- Success 200: `{ message: string, order: { id, totalAmount, itemCount } }`
- Error 400: `{ message: string }` (validation errors)
- Error 404: `{ message: string }` (order or product not found)
- Error 401: `{ message: string }` (not authenticated)

Contract file: `contracts/add-product-to-order.openapi.yml`

### Test Scenarios (from spec):

1. Add new product successfully (quantity = 1)
2. Increment existing product quantity
3. Reject 6th distinct product
4. Reject when total would exceed 500€
5. Accept when total stays under 500€
6. Reject non-existent product
7. Reject non-existent order
8. Reject when quantity would exceed 10

**Output**: data-model.md, contracts/add-product-to-order.openapi.yml, quickstart.md, CLAUDE.md update

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Contract test for POST /api/orders/:orderId/products [P]
- OrderItem entity with validation [P]
- Order entity with business rules [P]
- OrderRepository interface [P]
- AddProductToOrderUsecase with 8 unit test scenarios
- Controller with request validation
- Integration test with testcontainers

**Ordering Strategy**:
- TDD order: Tests before implementation
- OrderItem before Order (dependency)
- Entities before use case
- Use case before controller
- Mark [P] for parallel execution (different files)

**Estimated Output**: ~20 numbered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

No violations detected. All constitutional principles are satisfied by the design.

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command)
- [x] Phase 4: Implementation complete (/implement command)
- [x] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none)

**Post-Design Constitution Re-evaluation**:

All 7 constitutional principles remain satisfied after Phase 1 design:

I. ✅ Domain-Driven Design: Order.addProduct() and OrderItem validation enforce all business rules
II. ✅ Dependency Inversion: OrderRepository + ProductRepository interfaces used by use case
III. ✅ TDD: Contract, data model, and quickstart specs ready for test-first implementation
IV. ✅ Module Organization: src/module/order/ follows existing src/module/product/ pattern
V. ✅ Use Case Pattern: AddProductToOrderUsecase.execute(dto) follows CreateProductUsecase pattern
VI. ✅ Type Safety: TypeORM entities with TypeScript strict mode, French validation messages
VII. ✅ Test Isolation: DummyOrderRepository/DummyProductRepository for unit tests planned

**No design changes required.** Ready for /tasks command.

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*