# Inventory & Order Management API

A robust backend API for a small warehouse/shop system built with **NestJS + Bun + Turborepo + SQLite/TypeORM**.

## Project Structure

```
packages/
└── api/
    ├── src/
    │   ├── modules/
    │   │   ├── product/
    │   │   │   ├── entities/
    │   │   │   │   └── product.entity.ts
    │   │   │   ├── dto/
    │   │   │   │   └── product.dto.ts
    │   │   │   ├── product.controller.ts
    │   │   │   ├── product.service.ts
    │   │   │   └── product.module.ts
    │   │   ├── order/
    │   │   │   ├── entities/
    │   │   │   │   ├── order.entity.ts
    │   │   │   │   └── order-item.entity.ts
    │   │   │   ├── dto/
    │   │   │   │   └── order.dto.ts
    │   │   │   ├── order.controller.ts
    │   │   │   ├── order.service.ts
    │   │   │   └── order.module.ts
    │   │   └── inventory/
    │   │       ├── entities/
    │   │       │   └── inventory.entity.ts
    │   │       ├── inventory.controller.ts
    │   │       ├── inventory.service.ts
    │   │       └── inventory.module.ts
    │   ├── app.module.ts
    │   └── main.ts
    └── package.json
```

## Architecture

### Module-Based Architecture (NestJS)

- **Modules**: Feature-grouped with controllers, services, entities
- **Controllers**: HTTP request handling, routing
- **Services**: Business logic, orchestration
- **Entities**: TypeORM database models with relations
- **DTOs**: Data transfer objects for validation

### Database

- **SQLite** for development (file-based, zero-config)
- **TypeORM** for ORM with automatic migrations
- **Relations**: Orders ↔ OrderItems, Products, Inventory tracking

## Tech Stack

- **Runtime**: Bun (fast JS runtime with native TypeScript support)
- **Framework**: NestJS (enterprise-grade backend framework)
- **Database**: SQLite + TypeORM
- **Monorepo**: Turborepo
- **Package Manager**: Bun
- **Environment**: Flox
- **Language**: TypeScript

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

- `id` (UUID) - Primary key
- `sku` (string, unique) - Stock keeping unit
- `name`, `description`
- `categoryId`
- `price`, `stock`, `reorderLevel`
- Timestamps

### Order

- `id` (UUID)
- `userId`
- `items` (OrderItem[]) - One-to-many relation
- `status` - pending | processing | shipped | delivered | cancelled
- `totalAmount`
- Timestamps, optional shippedAt/deliveredAt

### OrderItem

- Links Order to Product
- `quantity`, `unitPrice`

### Inventory

- `id` (UUID)
- `productId`, `action` (in | out | adjustment)
- `quantity`, `reason`
- Optional `orderId` for traceability

## Configuration

edit `.env`:

```env
PORT=3000
NODE_ENV=development
DB_PATH=./data/app.db
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000
```

## Design Decisions

### Why NestJS?

- Enterprise OOP structure with modules, dependency injection
- Built-in decorators for validation, guards, middleware
- Strong TypeORM integration
- Scalable for medium-to-large projects

### Why SQLite (with migration to Postgres)?

- **SQLite**: Zero config, file-based, perfect for development
- **Postgres path**: For production scaling, ACID compliance, concurrent writes
- TypeORM abstracts provider, easy migration

### Why Turborepo?

- Multi-package support (api, shared utilities, shared types)
- Build caching, parallel task execution
- Enforces clean dependencies between packages

### Role-Based Access

- Admin: full CRUD on products
- User: view products, create/view own orders
- (JWT auth guards TBD in implementation)

## TODO Implementation

- [ ] Input validation with class-validator decorators
- [ ] JWT auth guards and role-based access
- [ ] Error handling filters for consistent responses
- [ ] Database transaction support for order creation
- [ ] Pagination on list endpoints
- [ ] Rate limiting middleware
- [ ] Comprehensive unit/integration tests
- [ ] API documentation (Swagger)
- [ ] Seed data for testing
- [ ] Logging service (Winston or Pino)

## Development Notes

- Each module is independently testable
- Services encapsulate business logic
- Entities auto-sync on `NODE_ENV=development`
- Use TypeORM QueryBuilder for complex queries
- DTOs for request validation via class-validator

---

**Stack**: NestJS + Bun + Turborepo + SQLite/TypeORM  
**Deadline**: March 9, 2026
