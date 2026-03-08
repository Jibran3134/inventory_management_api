# Inventory Management API

## Overview

The **Inventory Management API** is a backend service designed to manage inventory operations such as product management, stock tracking, customer orders, payments, and reporting.
The API is built using modern backend technologies and follows a modular architecture to ensure scalability and maintainability.

This system allows administrators to manage inventory while enabling users to place and view orders efficiently.

---

## Tech Stack

The project is built using the following technologies:

- **NestJS** – Backend framework for building scalable Node.js applications
- **Prisma ORM** – Type-safe database access
- **SQLite** – Lightweight database for development
- **Redis** – In-memory caching for faster data access
- **Logger** – Centralized logging for monitoring and debugging
- **Flox** – Development environment manager
- **Node.js / Bun** – Runtime environment and package execution
- **Role-Based Access Control (RBAC)** – Different permissions for Admin and User

---

## Features

### Product Management

- Add new products
- Update product details
- Track product quantities
- View low-stock products

### Order Management

- Place orders
- View order history
- Track order status

### Report Management

- Generate inventory reports
- Track sales trends
- Monitor stock movements

### Scalability & Performance

- **Redis cache** for frequently accessed data
- **Centralized logger** for monitoring API activity
- Modular architecture for easy feature additions
- Efficient database queries with Prisma ORM

---

## Project Structure

```
inventory_management_api
│
├── apps
│   └── api
│       ├── src
│       │   ├── products
│       │   ├── orders
│       │   ├── payments
│       │   ├── reports
│       │   └── common   # logger, caching, utilities
│       │
│       ├── prisma
│       │   └── schema.prisma
│       │
│       ├── .env
│       └── main.ts
│
├── package.json
└── flox.toml
```

---

## Author

Muhammad Jibran
FAST – National University of Computer and Emerging Sciences
