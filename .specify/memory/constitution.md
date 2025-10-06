<!--
SYNC IMPACT REPORT
Version: 0.0.0 → 1.0.0
Changes:
- Initial constitution creation
- Added 7 core principles based on src/module/product conventions
- Added Development Workflow and Quality Gates sections
- Added Governance section
Templates requiring updates:
✅ plan-template.md - Constitution Check section references this document
✅ spec-template.md - Requirements align with TDD and domain-driven principles
✅ tasks-template.md - Task ordering reflects TDD workflow
Follow-up TODOs: None
-->

# Express E-Commerce Constitution

## Core Principles

### I. Domain-Driven Design (NON-NEGOTIABLE)
Business logic MUST reside in domain entities, not in use cases or controllers. Entities are responsible for validating their own state and enforcing business rules. Use cases orchestrate operations but delegate domain logic to entities.

**Rationale**: Ensures business rules are centralized, testable in isolation, and not scattered across the application. Prevents anemic domain models and maintains clear separation of concerns.

### II. Dependency Inversion
High-level modules (use cases) MUST NOT depend on low-level modules (repositories). Both must depend on abstractions (interfaces). Repository interfaces are defined in the domain layer, implementations in infrastructure.

**Rationale**: Enables testability through dependency injection, allows switching implementations (e.g., different databases), and maintains architectural boundaries.

### III. Test-Driven Development (NON-NEGOTIABLE)
Tests MUST be written before implementation. Follow the Red-Green-Refactor cycle strictly:
1. Write test that fails
2. Implement minimal code to pass test
3. Refactor while keeping tests green

**Rationale**: Ensures all code is testable and tested, drives better design, provides living documentation, and prevents regressions.

### IV. Module Organization by Feature
Code MUST be organized by feature modules (e.g., `src/module/product`, `src/module/order`), not by technical layers. Each module contains its entities, use cases, controllers, and interfaces.

**Rationale**: Improves cohesion, makes features easier to locate and modify, supports future microservice extraction, and reduces cross-cutting changes.

### V. Use Case Pattern
Each business operation MUST be implemented as a separate use case class with a single `execute()` method. Use cases accept DTOs (Data Transfer Objects) and coordinate domain operations.

**Rationale**: Provides clear entry points for business operations, simplifies testing, enables transaction boundaries, and documents application capabilities.

### VI. Type Safety and Validation
TypeScript strict mode MUST be enabled. Domain entities MUST validate all inputs in constructors and throw descriptive errors for invalid states. Controllers MUST validate request completeness before invoking use cases.

**Rationale**: Catches errors at compile time and runtime boundaries, provides better IDE support, documents data structures, and prevents invalid state propagation.

### VII. Test Isolation
Unit tests MUST use test doubles (dummies, mocks, stubs) to isolate the system under test. Repository tests use in-memory implementations. Integration tests use test containers for real database interactions.

**Rationale**: Keeps tests fast and reliable, eliminates external dependencies in unit tests, enables parallel test execution, and provides clear failure diagnostics.

## Development Workflow

### File Naming Conventions
- Entities: PascalCase (e.g., `Product.ts`)
- Use cases: camelCase with `.usecase.ts` suffix (e.g., `createProduct.usecase.ts`)
- Controllers: camelCase with `.controller.ts` suffix (e.g., `createProduct.controller.ts`)
- Interfaces: camelCase with `.interface.ts` suffix (e.g., `productRepository.interface.ts`)
- Tests: Match implementation file with `.spec.ts` suffix (e.g., `createProduct.useCase.spec.ts`)

### Module Structure
Each feature module MUST follow this structure:
```
src/module/{feature}/
├── {Feature}.ts                          # Domain entity
├── {feature}Repository.interface.ts      # Repository interface
├── {operation}/
│   ├── {operation}.usecase.ts           # Use case implementation
│   ├── {operation}.controller.ts        # HTTP controller
│   └── {operation}.useCase.spec.ts      # Unit tests
```

### Testing Strategy
- **Unit tests**: Test domain entities and use cases in isolation using test doubles
- **Integration tests**: Test database interactions using testcontainers
- **Contract tests**: Test HTTP endpoints using supertest
- Tests MUST be written in French to match business domain language (Gherkin-style comments)
- Test structure: Given-When-Then pattern in comments

## Quality Gates

### Code Review Requirements
All changes MUST:
- Have passing tests written before implementation
- Follow the module organization pattern
- Include type-safe interfaces
- Validate inputs at boundaries (entity constructors, controllers)
- Use dependency injection for repositories

### Testing Requirements
- Minimum test coverage: Not specified (focus on critical paths)
- Tests must use descriptive scenario names (e.g., "Scénario 1: création réussie")
- Entity validation rules MUST be tested for both success and failure cases
- Error messages MUST be in French to match domain language

### Performance Standards
- Price validation: Products must have price > 0 and < 10000
- Title validation: Minimum 3 characters
- Response time targets: Not yet specified (TODO: Define based on production requirements)

## Governance

### Amendment Process
1. Constitution changes require documentation of rationale
2. Version bumping follows semantic versioning:
   - MAJOR: Removal or incompatible change to core principles
   - MINOR: Addition of new principles or sections
   - PATCH: Clarifications, wording improvements, non-semantic changes
3. All template files must be checked for consistency after amendments
4. Changes propagate to plan-template.md, spec-template.md, and tasks-template.md

### Compliance Review
- All pull requests MUST verify adherence to principles I-VII
- Constitution violations require explicit justification in plan.md Complexity Tracking section
- Unjustified complexity increases are grounds for rejection
- Development guidance is maintained in agent-specific files (e.g., CLAUDE.md)

### Technology Stack Constraints
- **Language**: TypeScript (version specified in tsconfig.json)
- **Framework**: Express.js for HTTP layer
- **ORM**: TypeORM for database interactions
- **Database**: PostgreSQL (development via Docker Compose)
- **Testing**: Jest with ts-jest, @testcontainers/postgresql for integration tests
- **Linting**: Configuration to be defined (TODO)

**Version**: 1.0.0 | **Ratified**: 2025-10-06 | **Last Amended**: 2025-10-06