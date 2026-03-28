.PHONY: install dev build lint test clean db-up db-down db-migrate db-studio

# Install all dependencies
install:
	pnpm install

# Start all services in development mode
dev:
	docker compose up -d postgres redis minio
	pnpm turbo dev

# Build all packages
build:
	pnpm turbo build

# Lint all packages
lint:
	pnpm turbo lint

# Run all tests
test:
	pnpm turbo test

# Type check all packages
type-check:
	pnpm turbo type-check

# Start infrastructure services
db-up:
	docker compose up -d postgres redis minio

# Stop infrastructure services
db-down:
	docker compose down

# Run Prisma migrations
db-migrate:
	pnpm --filter @bizmanager/api prisma migrate dev

# Open Prisma Studio
db-studio:
	pnpm --filter @bizmanager/api prisma studio

# Clean build artifacts
clean:
	pnpm turbo clean
	find . -name 'node_modules' -type d -prune -exec rm -rf {} +
	find . -name '.turbo' -type d -prune -exec rm -rf {} +

# Show help
help:
	@echo "Available commands:"
	@echo "  make install      - Install all dependencies"
	@echo "  make dev          - Start dev environment"
	@echo "  make build        - Build all packages"
	@echo "  make lint         - Lint all packages"
	@echo "  make test         - Run all tests"
	@echo "  make type-check   - Type check all packages"
	@echo "  make db-up        - Start DB services"
	@echo "  make db-down      - Stop DB services"
	@echo "  make db-migrate   - Run DB migrations"
	@echo "  make db-studio    - Open Prisma Studio"
	@echo "  make clean        - Remove build artifacts"
