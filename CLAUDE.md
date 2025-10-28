# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An Express.js e-commerce API built with TypeScript, TypeORM, and PostgreSQL. The project implements domain-driven design principles with a clean architecture approach.

## Technology Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x (strict mode enabled)
- **ORM**: TypeORM 0.3.x with PostgreSQL
- **Testing**: Jest 30.x with @testcontainers/postgresql for E2E tests
- **HTTP Testing**: Supertest 7.x

## Commands

### Development
- `npm install` - Install dependencies
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `docker compose --env-file .env.local up` - Start PostgreSQL database container

### Testing
- `npm test` - Run all tests in watch mode
- `jest --config ./jest.config.js` - Run tests once without watch
- Jest config uses babel-jest transformer with 60s timeout for container-based E2E tests

### Setup
1. Create `.env.local` at project root (copy from `.env`)
2. Fill environment variables: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PW`, `DB_NAME`
3. Start Docker container for database
4. Run `npm install`
5. Start server with `npm run dev`
6. Health check endpoint: `localhost:3000/api/health`

## Architecture Patterns

### Module Structure (Feature-Based Organization)

Each feature follows a vertical slice architecture organized by use case:

```
src/module/{domain}/{useCase}/
├── {useCase}Controller.ts        # Express route handler
├── {useCase}UseCase.ts            # Business logic orchestration
├── {useCase}Repository.ts         # Repository interface (port)
├── {useCase}TypeOrmRepository.ts  # TypeORM implementation (adapter)
└── test/
    ├── {useCase}.spec.ts          # Unit tests with test doubles
    └── {useCase}.e2e.spec.ts      # E2E tests with real database
```

Example: `src/module/product/createProduct/` contains all files needed for the create product feature.

### Dependency Injection & Inversion

- Controllers instantiate concrete repositories and inject them into use cases
- Use cases depend on repository interfaces (ports), not concrete implementations
- This enables easy testing with test doubles and swapping implementations

### Domain Entity Pattern

Domain entities (e.g., `Product.ts`) are TypeORM entities that also contain:
- **Business logic**: validation methods and domain rules
- **Factory-style constructors**: accept plain objects, validate, then construct
- **Update methods**: encapsulate mutation logic with validation
- **Private validation methods**: enforce business rules (price > 0, title length > 2, etc.)

Example from Product.ts:19-25:
```typescript
constructor({title, description, price}: {title: string, description: string, price: number}) {
    this.validatePrice(price);
    this.validateTitle(title);
    this.title = title;
    this.description = description;
    this.price = price;
}
```

### Repository Pattern

- Each use case defines its own repository interface with only required methods
- Example: `CreateProductRepository` has only `save()`, while `UpdateProductRepository` has `findOneById()` and `save()`
- TypeORM implementations use `AppDataSource.getRepository<Entity>(Entity)` to get TypeORM repository
- Repository interfaces live alongside use cases, not in a shared location

### Use Case Pattern

Use cases are the application layer that:
- Accept command objects or DTOs
- Orchestrate domain entities and repositories
- Handle application-level errors and wrap them in user-friendly messages
- Contain minimal logic - delegate to domain entities

### Testing Strategy

#### Unit Tests (`.spec.ts`)
- Use test doubles (dummies, mocks) that implement repository interfaces
- Test business logic in isolation without database
- Follow Given-When-Then structure with French comments
- Test all business rule violations and error cases

Example test double from createProductUseCase.spec.ts:7-11:
```typescript
class CreateProductDummyRepository implements CreateProductRepository {
    async save(product: Product): Promise<void> {
        // Ne fait rien, c'est un dummy
    }
}
```

#### E2E Tests (`.e2e.spec.ts`)
- Use @testcontainers/postgresql to spin up real PostgreSQL containers
- Test full HTTP request/response cycle with supertest
- Override `AppDataSource` with test container DataSource via `Object.assign()`
- Clean database state before each test with `clear()`
- Verify both HTTP response and database state

Key E2E setup pattern from createProduct.e2e.spec.ts:14-40:
1. Start PostgreSQL container in `beforeAll()`
2. Create test DataSource with container connection details
3. Import production `AppDataSource` and replace it: `Object.assign(AppDataSource, dataSource)`
4. Build Express app with `buildApp()`
5. Clean up container and DataSource in `afterAll()`

### Error Handling

- Domain entities throw errors for validation failures with French error messages
- Use cases catch repository errors and re-throw with user-friendly messages
- Controllers catch all errors and return appropriate HTTP status:
  - 400 for domain validation errors
  - 500 for unexpected errors
- Error response format: `{message: string}`

### Configuration

- `src/config/db.config.ts` - TypeORM DataSource singleton with environment variables
- `src/config/app.ts` - Express app factory with middleware and route registration
- TypeORM options:
  - `synchronize: true` - Auto-create tables (development only)
  - `entitySkipConstructor: true` - Required for entities with constructors
  - `logging: false` - Disable SQL logging

### TypeScript Configuration

Notable tsconfig.json settings:
- `experimentalDecorators: true` and `emitDecoratorMetadata: true` - Required for TypeORM decorators
- `strict: true` with `strictNullChecks: false` and `strictPropertyInitialization: false`
- `rootDir: "src"` and `outDir: "build"`
- `target: "es5"` with `module: "commonjs"`

## Code Conventions

### Language
- Error messages and test descriptions in French
- Code identifiers in English
- Test structure follows Given-When-Then with French comments (Étant donné/Quand/Alors)

### Import Style
- Mix of ES6 imports and CommonJS require (transitional codebase)
- Controllers use `module.exports = router`
- Most other files use ES6 `export`

### Naming
- Use cases: `{Action}{Entity}UseCase` (e.g., `CreateProductUseCase`)
- Controllers: `{action}{Entity}Controller.ts`
- Repositories: `{Action}{Entity}Repository` (interface), `{Action}{Entity}TypeOrmRepository` (implementation)
- Test files: `{useCase}.spec.ts` (unit), `{useCase}.e2e.spec.ts` (E2E)

### Controller Pattern
- Each controller is an Express Router
- Instantiate dependencies directly in route handlers (not using DI container)
- Return JSON responses with explicit status codes
- Path pattern: `/api/{resource}` or `/api/{resource}/:id`

## Business Rules

Product domain rules (from specs.md and Product.ts validation):
- Title must be > 2 characters
- Price must be > 0 and < 10,000
- Validation errors thrown by entity, caught by use case, returned by controller
