# Inventory & Order Management API

A robust backend API for a small warehouse/shop system built with **NestJS + Bun + Turborepo + SQLite + Prisma**.

## Project Structure

```
apps/
└── api/
    ├── src/
    │   ├── database/
    │   │   ├── database.module.ts
    │   │   └── prisma.service.ts
    │   ├── modules/
    │   │   ├── products/
    │   │   │   ├── product.controller.ts
    │   │   │   ├── product.service.ts
    │   │   │   └── product.module.ts
    │   │   ├── orders/
    │   │   ├── users/
    │   │   ├── inventory/
    │   │   └── auth/
    │   ├── app.controller.ts
    │   ├── app.module.ts
    │   └── main.ts
    ├── prisma/
    │   ├── schema.prisma
    │   ├── prisma.service.ts
    │   └── migrations/
    ├── prisma.config.ts
    ├── package.json
    └── tsconfig.json

libs/
├── common/
│   └── src/
│       ├── decorators/
│       ├── dto/
│       ├── guards/
│       └── interceptors/
├── config/
│   └── src/
└── database/
    └── src/
        └── entities/
```

## Architecture

### Module-Based Architecture (NestJS)

- **Modules**: Feature-grouped with controllers, services, and dependencies
- **Controllers**: HTTP request handling and routing
- **Services**: Business logic and data operations
- **DatabaseModule**: Central database service provider for all modules
- **PrismaService**: ORM service for database operations
- **DTOs**: Data transfer objects for validation (future enhancement)

### Database

- **SQLite** for development and production (zero-config, file-based)
- **Prisma ORM** for type-safe database operations
- **Schema-driven**: Database schema defined in `prisma/schema.prisma`
- **Migrations**: Automatic migration management in `prisma/migrations/`

### Dependency Injection

- **DatabaseModule** provides `PrismaService` to all feature modules
- Modules import `DatabaseModule` to access database operations
- Clean separation of concerns with centralized database management

## Tech Stack

- **Runtime**: Bun (fast JS runtime with native TypeScript support)
- **Framework**: NestJS (enterprise-grade Node.js framework)
- **Database**: SQLite + Prisma ORM
- **Monorepo**: Turborepo with apps and libs structure
- **Package Manager**: Bun
- **Language**: TypeScript
- **Build Tool**: NestJS bundler with watch mode

## Getting Started

### Prerequisites

- Bun installed (`curl -fsSL https://bun.sh/install | bash`)

### Install Dependencies

```bash
bun install
```

### Setup Environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### Run Development Server

```bash
bun run dev
```

Server runs on `http://localhost:3000`

Database file auto-creates at `./data/app.db`

### Build for Production

```bash
bun run build
```

### Run Tests

```bash
bun run test
```

## API Endpoints

### Products (`/api/v1/products`)

- `GET /` - List all products
- `GET /:id` - Get product by ID
- `POST /` - Create product
- `PUT /:id` - Update product
- `DELETE /:id` - Delete product
- `GET /stock/low` - Get low-stock products

### Orders (`/api/v1/orders`)

- `GET /` - List all orders (filter by userId, status)
- `GET /:id` - Get order by ID
- `POST /` - Create order
- `PUT /:id/status` - Update order status
- `DELETE /:id` - Cancel order
- `GET /reports/sales` - Sales report by date range

### Inventory (`/api/v1/inventory`)

- `POST /entry` - Record inventory transaction
- `GET /history/:productId` - Product inventory history
- `GET /reports/movements` - Movement report by date range

## Data Models

### Product

```prisma
model Product {
  id            Int      @id @default(autoincrement())
  name          String
  description   String
  price         Float
  stockQuantity Int
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
}
```

Additional models for Orders, Users, and Inventory are defined in `prisma/schema.prisma`

## Configuration

Environment variables are managed via `.env` file in the `apps/api` directory:

```env
DATABASE_URL="file:./database.sqlite"
```

Database connection details are automatically configured in `prisma/schema.prisma`

## Design Decisions

### Why NestJS?

- Enterprise-grade framework with built-in module system
- Dependency injection container for flexible service management
- Decorator-based architecture for clean, readable code
- Strong TypeScript support with full type inference
- Scalable structure for growing applications

### Why Prisma?

- Type-safe database client with auto-generated types
- Schema-first approach for database design
- Automatic migration management
- Support for SQLite, PostgreSQL, MySQL, and other databases
- Excellent developer experience with IntelliSense

### Why Bun?

- Significantly faster runtime than Node.js
- Native TypeScript support without build step overhead
- All-in-one toolchain (runtime, package manager, bundler)
- Drop-in replacement for Node.js with better performance

### Module Structure

- **DatabaseModule**: Centralized database service provider
  - Provides `PrismaService` to all feature modules
  - Ensures single database connection instance
  - Easy to test and mock in unit tests
- **Feature Modules**: Products, Orders, Users, Inventory
  - Each imports `DatabaseModule` for database access
  - Encapsulates domain logic and REST endpoints
  - Independent and testable

## TODO Implementation

- [ ] Complete remaining feature module implementations (Orders, Users, Inventory)
- [ ] Add DTOs and request validation with decorators
- [ ] Implement JWT authentication and role-based access control
- [ ] Add error handling filters for consistent API responses
- [ ] Database transaction support for complex operations
- [ ] Pagination, filtering, and sorting on list endpoints
- [ ] Rate limiting middleware
- [ ] Comprehensive unit and integration tests
- [ ] API documentation with Swagger/OpenAPI
- [ ] Seed data for development and testing
- [ ] Logging service (Winston or Pino)
- [ ] Input sanitization and validation
- [ ] API versioning strategy

## Development Notes

- **Server Status**: Running successfully on `http://localhost:3000`
- **Database**: SQLite file-based at `apps/api/database.sqlite`
- **HotReload**: Watch mode enabled - changes auto-compile and reload
- **Module Setup**: DatabaseModule provides PrismaService to all feature modules
- **Service Injection**: Use constructor dependency injection for PrismaService
- **Type Safety**: All database operations are type-safe through Prisma
- **Migrations**: Managed in `apps/api/prisma/migrations/`

### Adding a New Feature Module

1. Create feature folder under `src/modules/`
2. Create `[feature].controller.ts`, `[feature].service.ts`, `[feature].module.ts`
3. Import `DatabaseModule` in the feature module
4. Inject `PrismaService` in the service constructor
5. Export the module and import in `AppModule`

---

**Stack**: NestJS + Bun + Turborepo + SQLite + Prisma  
**Status**: Development Active  
**Last Updated**: March 2, 2026
