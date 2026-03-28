# BizManager Pro

Business management platform for SMEs in Cameroon and Sub-Saharan Africa.

## Architecture

```
bizmanager-pro/
├── apps/
│   ├── web/          # Nuxt 3 dashboard (SSR)
│   ├── mobile/       # Nuxt 3 + Capacitor (iOS/Android)
│   └── api/          # NestJS REST API
├── services/
│   └── pdf-engine/   # Rust/axum microservice for PDF generation
├── packages/
│   ├── shared-types/ # TypeScript enums & interfaces
│   └── ui/           # Vue 3 component library
└── prisma/           # Database schema & migrations
```

## Stack

| Layer | Technology |
|-------|------------|
| Web Dashboard | Nuxt 3 (SSR), TailwindCSS, Pinia |
| Mobile | Nuxt 3 (SPA) + Capacitor |
| API | NestJS, Fastify, Prisma ORM |
| PDF Engine | Rust (axum) |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Storage | MinIO (S3-compatible) |
| Monorepo | pnpm workspaces + Turborepo |

## Getting Started

### Prerequisites

- Node.js 22 LTS
- pnpm 9+
- Docker & Docker Compose
- Rust (for pdf-engine)

### Setup

```bash
# Clone the repository
git clone https://github.com/ramsesndame237/bizmanager-pro.git
cd bizmanager-pro

# Copy environment variables
cp .env.example .env
# Edit .env with your values

# Install dependencies
make install

# Start infrastructure services
make db-up

# Run migrations
make db-migrate

# Start development servers
make dev
```

### Available Commands

```bash
make install      # Install all dependencies
make dev          # Start dev environment
make build        # Build all packages
make lint         # Lint all packages
make test         # Run all tests
make type-check   # Type check all packages
make db-up        # Start DB services (Docker)
make db-down      # Stop DB services
make db-migrate   # Run DB migrations
make db-studio    # Open Prisma Studio
make clean        # Clean build artifacts
```

## Development Workflow

- `main` → Production
- `staging` → Pre-production
- `develop` → Integration (default branch)
- `feat/*`, `fix/*`, `refactor/*` → Feature branches from `develop`

## License

Private — All rights reserved.
