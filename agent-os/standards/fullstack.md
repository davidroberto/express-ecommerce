# Speckit Constitution - express-ecommerce

## Architectural Style

This project follows **Vertical Slice Architecture** combined with **Clean Architecture** principles, organizing code by feature domains rather than technical layers.

## Core Principles

### 1. Vertical Slice Organization
- Each feature is self-contained within its own directory
- All components for a feature (controller, use case, repository, tests) live together
- Features can be developed, tested, and deployed independently

### 2. Dependency Inversion
- Business logic depends on abstractions (interfaces), not implementations
- Repository interfaces define contracts in the application layer
- Infrastructure implementations (TypeORM) depend on these interfaces

### 3. Domain-Driven Design
- Domain entities encapsulate business rules and validation
- Entities enforce invariants through constructors and methods
- Domain logic is separated from infrastructure concerns

## Project Structure

```
src/
├── config/                          # Infrastructure configuration
│   ├── app.ts                       # Express application factory
│   └── db.config.ts                 # TypeORM DataSource configuration
│
├── module/                          # Feature modules organized by domain
│   └── {domain}/                    # e.g., product, order, user
│       ├── {Domain}Entity.ts        # Shared domain entities
│       └── {feature}/               # Vertical slice per feature
│           ├── {feature}Controller.ts
│           ├── {feature}UseCase.ts
│           ├── {feature}Repository.ts         # Interface
│           ├── {feature}TypeOrmRepository.ts  # Implementation
│           ├── {feature}.e2e.spec.ts
│           └── test/
│               └── {feature}UseCase.spec.ts
│
└── index.ts                         # Application entry point
```

## Layer Responsibilities

### Controller Layer (HTTP Entry Point)
**Location:** `src/module/{domain}/{feature}/{feature}Controller.ts`

**Responsibilities:**
- Handle HTTP requests and responses
- Extract and validate request parameters
- Instantiate use case with dependencies
- Map domain errors to HTTP status codes
- Return appropriate HTTP responses

**Pattern:**
```typescript
import express from "express";
import {Request, Response} from "express";
import {FeatureUseCase} from "./featureUseCase";
import {FeatureTypeOrmRepository} from "./featureTypeOrmRepository";

const router = express.Router();

router.post('/resource', async (request: Request, response: Response) => {
    const {param1, param2} = request.body;

    const repository = new FeatureTypeOrmRepository();
    const useCase = new FeatureUseCase(repository);

    try {
        await useCase.execute({param1, param2});
        return response.status(201).json();
    } catch (error) {
        if (error instanceof Error) {
            return response.status(400).json({message: error.message});
        }
        return response.status(500).json({message: "Internal server error"});
    }
});

module.exports = router;
```

**Conventions:**
- Use Express router pattern
- Export router using `module.exports`
- HTTP 201 for successful creation
- HTTP 400 for domain/validation errors
- HTTP 500 for unexpected errors
- Instantiate dependencies directly in controller (no DI container yet)

### Use Case Layer (Application Logic)
**Location:** `src/module/{domain}/{feature}/{feature}UseCase.ts`

**Responsibilities:**
- Orchestrate business operations
- Coordinate domain entities and repositories
- Transform DTOs into domain objects
- Handle application-level errors
- Enforce business workflows

**Pattern:**
```typescript
import {DomainEntity} from "../domainEntity";
import {FeatureRepository} from "./featureRepository";

export class FeatureUseCase {
    private repository: FeatureRepository;

    constructor(repository: FeatureRepository) {
        this.repository = repository;
    }

    async execute(dto: {param1: string, param2: number}): Promise<void> {
        const entity = new DomainEntity(dto.param1, dto.param2);

        try {
            await this.repository.save(entity);
        } catch (error) {
            throw new Error("descriptive error message in French");
        }
    }
}
```

**Conventions:**
- Depend on repository interface (injected via constructor)
- Accept DTOs as plain objects (no formal DTO classes)
- Instantiate domain entities with validation
- Wrap repository errors with meaningful messages
- Return `Promise<void>` for commands, `Promise<T>` for queries
- Error messages in French

### Domain Layer (Business Logic)
**Location:** `src/module/{domain}/{domain}Entity.ts`

**Responsibilities:**
- Encapsulate core business rules
- Validate invariants
- Contain domain behavior
- Maintain entity consistency

**Pattern:**
```typescript
import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class DomainEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: "varchar", length: 255})
    public property1: string;

    @Column({type: "float"})
    public property2: number;

    constructor(property1: string, property2: number) {
        this.validateProperty1(property1);
        this.validateProperty2(property2);

        this.property1 = property1;
        this.property2 = property2;
    }

    update(property1: string, property2: number): void {
        this.validateProperty1(property1);
        this.validateProperty2(property2);

        this.property1 = property1;
        this.property2 = property2;
    }

    private validateProperty1(value: string): void {
        if (value.length <= 2) {
            throw new Error("validation error message in French");
        }
    }

    private validateProperty2(value: number): void {
        if (value < 0) {
            throw new Error("validation error message in French");
        }
    }
}
```

**Conventions:**
- Use TypeORM decorators (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`)
- Public properties (required for TypeORM)
- Validation in constructor and update methods
- Private validation methods with clear names
- Business rules as method-level validation
- Throw errors with French messages
- Provide `update()` method for modification after creation

### Repository Layer (Persistence Abstraction)

#### Interface
**Location:** `src/module/{domain}/{feature}/{feature}Repository.ts`

**Pattern:**
```typescript
import {DomainEntity} from "../domainEntity";

export interface FeatureRepository {
    save(entity: DomainEntity): Promise<void>;
    // Only include methods needed for THIS feature
}
```

**Conventions:**
- Define minimal interface (Interface Segregation Principle)
- Depend on domain entities, not DTOs
- Return `Promise<void>` for commands
- Return `Promise<Entity | null>` for optional queries
- Return `Promise<Entity>` for required queries

#### Implementation
**Location:** `src/module/{domain}/{feature}/{feature}TypeOrmRepository.ts`

**Pattern:**
```typescript
import {FeatureRepository} from "./featureRepository";
import AppDataSource from "../../../config/db.config";
import {DomainEntity} from "../domainEntity";

export class FeatureTypeOrmRepository implements FeatureRepository {
    async save(entity: DomainEntity): Promise<void> {
        const repository = AppDataSource.getRepository<DomainEntity>(DomainEntity);
        await repository.save(entity);
    }
}
```

**Conventions:**
- Implement repository interface
- Use `AppDataSource.getRepository<T>(Entity)` pattern
- Delegate to TypeORM's built-in repository methods
- No business logic in repository implementations
- Import AppDataSource from `../../../config/db.config`

## Configuration

### Database Configuration
**Location:** `src/config/db.config.ts`

**Pattern:**
```typescript
import {DataSource} from "typeorm";
import {DomainEntity} from "../module/domain/domainEntity";

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    entities: [DomainEntity], // Register all entities
    synchronize: true,
    entitySkipConstructor: true,
});

export default AppDataSource;
```

**Conventions:**
- Export as default singleton
- Use environment variables for configuration
- Enable `entitySkipConstructor: true` (required for entities with constructor validation)
- Register all entities explicitly
- Use `synchronize: true` for development (disable in production)

### Application Configuration
**Location:** `src/config/app.ts`

**Pattern:**
```typescript
import express, {Request, Response} from "express";
const cors = require("cors");
const featureController = require("../module/domain/feature/featureController");

export function buildApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.get('/api/health', (req: Request, res: Response) => {
        res.send('OK');
    });

    app.use("/api", featureController);

    return app;
}
```

**Conventions:**
- Export factory function `buildApp()`
- Include health check endpoint at `/api/health`
- Register all feature controllers under `/api` prefix
- Enable CORS and JSON parsing middleware
- Use `require()` for controller imports (CommonJS pattern)

## Testing Strategy

### Unit Tests
**Location:** `src/module/{domain}/{feature}/test/{feature}UseCase.spec.ts`

**Responsibilities:**
- Test use case logic in isolation
- Use test doubles (dummies, mocks) for dependencies
- Verify business rules and validation
- Test error handling

**Pattern:**
```typescript
import {FeatureUseCase} from "../featureUseCase";
import {FeatureRepository} from "../featureRepository";
import {DomainEntity} from "../../domainEntity";

class FeatureDummyRepository implements FeatureRepository {
    async save(entity: DomainEntity): Promise<void> {
        // No-op for success scenarios
    }
}

class FeatureMockFailRepository implements FeatureRepository {
    async save(entity: DomainEntity): Promise<void> {
        throw new Error("fail...");
    }
}

describe("Feature Use Case", () => {
    it("should succeed with valid input", async () => {
        const repository = new FeatureDummyRepository();
        const useCase = new FeatureUseCase(repository);

        await expect(useCase.execute({param: "valid"}))
            .resolves.not.toThrow();
    });

    it("should throw error for invalid input", async () => {
        const repository = new FeatureDummyRepository();
        const useCase = new FeatureUseCase(repository);

        await expect(useCase.execute({param: "x"}))
            .rejects.toThrow("expected error message");
    });

    it("should handle repository errors", async () => {
        const repository = new FeatureMockFailRepository();
        const useCase = new FeatureUseCase(repository);

        await expect(useCase.execute({param: "valid"}))
            .rejects.toThrow();
    });
});
```

**Conventions:**
- Create test double classes implementing repository interfaces
- Use descriptive class names (Dummy, Mock, Stub, Fake)
- Test both success and failure scenarios
- Verify validation rules from domain entities
- Use Jest's `expect().resolves` / `rejects` for async tests

### E2E Tests
**Location:** `src/module/{domain}/{feature}/{feature}.e2e.spec.ts`

**Responsibilities:**
- Test complete vertical slice end-to-end
- Verify HTTP API contracts
- Test against real database
- Validate side effects (data persistence)

**Pattern:**
```typescript
import {buildApp} from "../../../config/app";
import AppDataSource from "../../../config/db.config";
import {PostgreSqlContainer} from "@testcontainers/postgresql";
import request from "supertest";

describe("Feature E2E", () => {
    let container: PostgreSqlContainer;

    beforeAll(async () => {
        container = await new PostgreSqlContainer().start();

        process.env.DB_HOST = container.getHost();
        process.env.DB_PORT = container.getPort().toString();
        process.env.DB_USER = container.getUsername();
        process.env.DB_PW = container.getPassword();
        process.env.DB_NAME = container.getDatabase();

        await AppDataSource.initialize();
    });

    afterAll(async () => {
        await AppDataSource.destroy();
        await container.stop();
    });

    it("should create resource successfully", async () => {
        const app = buildApp();

        const response = await request(app)
            .post("/api/resource")
            .send({param1: "value", param2: 100});

        expect(response.status).toBe(201);
    });

    it("should return 400 for invalid input", async () => {
        const app = buildApp();

        const response = await request(app)
            .post("/api/resource")
            .send({param1: "x", param2: 100});

        expect(response.status).toBe(400);
        expect(response.body.message).toContain("expected error");
    });
});
```

**Conventions:**
- Use `@testcontainers/postgresql` for isolated test database
- Configure database connection in `beforeAll`
- Initialize AppDataSource after container starts
- Clean up resources in `afterAll`
- Use `supertest` for HTTP requests
- Test both success (201) and error (400, 500) paths
- Verify response status codes and error messages

## Naming Conventions

### Files
- Controllers: `{feature}Controller.ts`
- Use Cases: `{feature}UseCase.ts`
- Repository Interfaces: `{feature}Repository.ts`
- Repository Implementations: `{feature}TypeOrmRepository.ts`
- Domain Entities: `{domain}Entity.ts` (shared) or `{Domain}.ts`
- Unit Tests: `{feature}UseCase.spec.ts`
- E2E Tests: `{feature}.e2e.spec.ts`

### Classes
- Controllers: Export via `module.exports` (not named export)
- Use Cases: `{Feature}UseCase`
- Repositories: `{Feature}Repository` (interface), `{Feature}TypeOrmRepository` (implementation)
- Entities: `{Domain}` (e.g., `Product`, `Category`)
- Test Doubles: `{Feature}DummyRepository`, `{Feature}MockFailRepository`

### Directories
- Feature modules: lowercase (e.g., `createProduct`, `updateProduct`)
- Domain modules: lowercase (e.g., `product`, `category`)
- Test subdirectory: `test/` (for unit tests)

## Technology Stack

### Core
- **Language:** TypeScript (strict mode)
- **Framework:** Express.js
- **ORM:** TypeORM
- **Database:** PostgreSQL

### Testing
- **Test Framework:** Jest
- **HTTP Testing:** supertest
- **Test Containers:** @testcontainers/postgresql

### Middleware
- **CORS:** cors package
- **Body Parsing:** express.json()

## Key Patterns

### 1. Repository Pattern
- Abstraction layer between domain and data access
- Interface defines contract
- Multiple implementations possible (TypeORM, in-memory, etc.)

### 2. Use Case Pattern
- Single responsibility per use case
- Orchestrates domain objects and repositories
- Represents application-level operations

### 3. Dependency Injection
- Constructor injection for repositories into use cases
- Manual instantiation in controllers (no DI container)
- Prefer interfaces over concrete implementations

### 4. Factory Pattern
- `buildApp()` factory for Express application
- Improves testability by avoiding global state
- Allows multiple app instances (useful for testing)

### 5. Test Double Pattern
- Create lightweight implementations of interfaces for testing
- Dummy: minimal implementation for success paths
- Mock: controlled failures for error scenarios

## Error Handling

### Domain Errors
- Throw `Error` with descriptive French messages
- Validation errors thrown from entity constructors
- Business rule violations thrown from entity methods

### Application Errors
- Catch repository errors and rethrow with context
- Map domain errors to HTTP 400 (Bad Request)
- Map unexpected errors to HTTP 500 (Internal Server Error)

### HTTP Error Response Format
```typescript
{
    "message": "error message in French"
}
```

## Database Conventions

### Entity Mapping
- Use `@Entity()` decorator (no table name override)
- Use `@PrimaryGeneratedColumn()` for auto-increment IDs
- Use `@Column()` with explicit type and constraints

### Column Types
- Text: `{type: "varchar", length: 255}` or `{type: "text"}`
- Numbers: `{type: "float"}` for decimals
- Nullable: `{nullable: true}` when optional

### Important Settings
- `entitySkipConstructor: true` - Required when entities have constructor logic
- `synchronize: true` - Auto-create schema (development only)

## Language and Localization

### Error Messages
- All user-facing errors in French
- Examples:
  - "le prix doit être supérieur à 0"
  - "titre trop court"
  - "erreur lors de la création du produit"

### Code
- Variable names, class names, function names: English
- Comments: English (if needed)
- Error messages: French

## Anti-Patterns to Avoid

### 1. Leaking Infrastructure Concerns
- Don't expose TypeORM entities directly in controllers
- Don't let HTTP concerns leak into use cases
- Don't reference AppDataSource outside repository implementations

### 2. Anemic Domain Models
- Don't create entities with only getters/setters
- Don't put business logic in use cases when it belongs in entities
- Don't skip validation in entity constructors

### 3. Shared Mutable State
- Don't use global variables for configuration
- Don't share repository instances across requests
- Don't cache DataSource configuration mutably

### 4. God Objects
- Don't create repositories with all CRUD methods if feature only needs subset
- Don't create use cases handling multiple operations
- Don't create controllers handling multiple routes

## Extension Guidelines

### Adding a New Feature
1. Create directory: `src/module/{domain}/{newFeature}/`
2. Create controller: `{newFeature}Controller.ts`
3. Create use case: `{newFeature}UseCase.ts`
4. Create repository interface: `{newFeature}Repository.ts`
5. Create repository implementation: `{newFeature}TypeOrmRepository.ts`
6. Create unit tests: `test/{newFeature}UseCase.spec.ts`
7. Create E2E tests: `{newFeature}.e2e.spec.ts`
8. Register controller in `src/config/app.ts`

### Adding a New Domain
1. Create directory: `src/module/{newDomain}/`
2. Create entity: `{newDomain}Entity.ts`
3. Register entity in `src/config/db.config.ts`
4. Follow "Adding a New Feature" steps

### Modifying Entities
1. Update entity class with new properties
2. Add validation in constructor if needed
3. Update `update()` method if applicable
4. TypeORM will auto-sync schema (development mode)
5. Create migration for production

## Documentation Standards

### Code Comments
- Minimal comments; prefer self-documenting code
- Comment "why" not "what"
- Document non-obvious business rules

### API Documentation
- Not currently implemented
- Consider adding OpenAPI/Swagger in future

## Version Control

### Branching
- Current branch: `m2-b`
- Main branch: (to be determined)

### Commit Messages
- Not specified; use conventional commits recommended

## Future Improvements

### Identified Technical Debt
1. No DI container (manual instantiation in controllers)
2. No formal DTO classes (using object literals)
3. No Value Objects (could extract Price, Title, etc.)
4. No domain exception types (using generic Error)
5. Controllers return empty JSON (could return created resource)

### Recommended Enhancements
1. Add dependency injection container (e.g., InversifyJS, tsyringe)
2. Create formal DTO classes with validation
3. Extract Value Objects for domain concepts
4. Create custom exception hierarchy
5. Return created resources from POST endpoints
6. Add API documentation (OpenAPI/Swagger)
7. Implement logging strategy
8. Add request validation middleware
9. Implement pagination for list queries
10. Add database migrations for production

---

**Constitution Version:** 1.0
**Last Updated:** 2025-10-21
**Based on Analysis of:** createProduct, updateProduct, createProductCategory vertical slices


