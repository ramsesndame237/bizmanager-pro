# BizManager Pro

Business management system for multi-sector repair shops (Telecom, IT, Appliances).

## Architecture

```
bizmanager-pro/
├── apps/
│   ├── web/          # Nuxt 3 — Web dashboard (SSR)
│   └── mobile/       # Nuxt 3 + Capacitor — iOS & Android app (SPA/offline-first)
├── services/
│   └── pdf-engine/   # Rust (axum) — PDF generation microservice
├── packages/
│   ├── shared-types/ # TypeScript types shared across all apps
│   └── ui/           # Vue 3 component library
├── prisma/           # Prisma schema & migrations (PostgreSQL)
└── docker-compose.yml
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Web Frontend | Nuxt 3, Vue 3, Pinia, Tailwind CSS |
| Mobile | Nuxt 3, Capacitor.js, Dexie (offline) |
| API | NestJS, Prisma, BullMQ, WebSocket |
| Database | PostgreSQL 16, Redis 7 |
| Object Storage | MinIO (S3-compatible) |
| PDF Engine | Rust (axum, printpdf) |
| Monorepo | pnpm workspaces, Turborepo |

## Prerequisites

- Node.js 22+
- pnpm 9+
- Rust (latest stable)
- Docker & Docker Compose

## Getting Started

```bash
# 1. Clone and install dependencies
git clone https://github.com/ramsesndame237/bizmanager-pro.git
cd bizmanager-pro
pnpm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your values

# 3. Start infrastructure (PostgreSQL, Redis, MinIO)
make db-up

# 4. Run database migrations
make db-migrate

# 5. Start all services in dev mode
make dev
```

### Services

| Service | URL |
|---------|-----|
| Web app | http://localhost:3000 |
| API | http://localhost:3001/api/v1 |
| API Docs (Swagger) | http://localhost:3001/api/docs |
| PDF Engine | http://localhost:3002 |
| MinIO Console | http://localhost:9001 |
| Prisma Studio | `make db-studio` |

## Development

```bash
make dev          # Start everything
make dev-web      # Web only
make dev-api      # API only
make dev-pdf      # PDF engine only (Rust)

make lint         # Lint all packages
make type-check   # TypeScript check
make test         # Run all tests
```

## Modules

| Module | Description |
|--------|-------------|
| **A - Stock** | Product catalog, inventory, stock movements |
| **B - Billing** | Invoices, quotes, payments, clients |
| **C - Repairs** | Customer repair tickets, status tracking |
| **D - Equipment** | Internal equipment, fault management |
| **E - HR** | Employees, attendance, payroll, leaves |
| **F - Dashboard** | KPIs, charts, reports |

## Roles

- `ADMIN` — Full access
- `CASHIER` — Billing, stock, repairs
- `TECHNICIAN` — Repairs, equipment
- `HR` — HR & payroll module
- `EMPLOYEE` — Read-only own data (leave requests)

## License

Private — All rights reserved.
