# Technology Stack

## Backend Framework
- **TypeScript** - Type safety and enhanced developer experience with IntelliSense, compile-time error detection, and self-documenting code
- **Express.js** - Minimalist, flexible web framework for Node.js that teaches fundamental HTTP concepts without excessive abstraction
- **Node.js** - JavaScript runtime enabling full-stack JavaScript development

## Database & ORM
- **PostgreSQL** - Industry-standard relational database teaching SQL, ACID transactions, and relational data modeling
- **TypeORM** - TypeScript-first ORM providing decorators, migrations, query builder, and proper entity relationship management
- **Testcontainers** - Containerized test databases ensuring isolated, reproducible tests without mocking

## Testing
- **Jest** - Comprehensive testing framework with built-in assertions, mocking, coverage reporting, and TypeScript support
- **Supertest** - HTTP assertion library for integration testing REST endpoints
- **Testcontainers for PostgreSQL** - Spin up real PostgreSQL instances for integration tests

## Authentication & Security
- **bcrypt** - Industry-standard password hashing library using adaptive hashing algorithm
- **jsonwebtoken (JWT)** - Stateless authentication tokens for API authorization
- **express-validator** - Middleware for request validation and sanitization
- **helmet** - Security middleware setting HTTP headers to prevent common vulnerabilities

## API Development
- **REST** - Architectural style using HTTP methods (GET, POST, PUT, DELETE) for resource operations
- **express.json()** - Built-in middleware for parsing JSON request bodies
- **CORS** - Cross-Origin Resource Sharing middleware for controlled API access

## Development Tools
- **ts-node** - TypeScript execution environment for development without compilation step
- **nodemon** - Auto-restart server on file changes during development
- **ESLint** - Linting tool enforcing code quality and consistency
- **Prettier** - Opinionated code formatter ensuring consistent style

## Architecture Patterns
- **Clean Architecture** - Separation of concerns with layers: entities, use cases, repositories, controllers
- **Repository Pattern** - Abstraction over data access enabling testability and database-agnostic code
- **Dependency Inversion** - High-level modules depend on abstractions, not concrete implementations
- **Use Case Pattern** - Business logic encapsulated in single-responsibility use case classes

## Environment & Configuration
- **dotenv** - Environment variable management for configuration (database URLs, JWT secrets, ports)
- **TypeScript Configuration** - Strict type checking, modern ES features, source maps for debugging

## Optional/Future Enhancements
- **Redis** - Caching layer for session management and performance optimization
- **Bull** - Queue system for background jobs (email sending, order processing)
- **Swagger/OpenAPI** - API documentation and exploration interface
- **Winston** - Structured logging framework for production monitoring
- **Docker** - Containerization for consistent deployment environments
- **GitHub Actions** - CI/CD pipeline for automated testing and deployment

## Learning Rationale

### Why TypeScript?
Teaches type systems, catches errors at compile time, and prepares students for enterprise development where TypeScript is increasingly standard.

### Why Express.js?
Minimal abstraction teaches HTTP fundamentals, middleware concept, and request/response cycle without framework magic.

### Why TypeORM?
Decorators introduce metadata programming, migrations teach schema evolution, and query builder provides escape hatch from raw SQL while maintaining control.

### Why PostgreSQL?
Industry-standard RDBMS teaching SQL, transactions, constraints, and relational design. More feature-rich than MySQL, better for learning advanced concepts.

### Why Jest & Testcontainers?
Jest provides complete testing solution with minimal configuration. Testcontainers teach real integration testing without mocks, preparing students for production test strategies.

### Why Clean Architecture?
Introduces professional code organization, testability through dependency inversion, and separation of business logic from infrastructure concerns.

### Why JWT?
Stateless authentication scales horizontally, teaches token-based auth (now industry norm), and demonstrates security concepts like token expiration and refresh strategies.
