.PHONY: help install dev build lint test clean db-up db-down db-migrate db-reset pdf-build

# Default target
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ─── Setup ────────────────────────────────────────────────────────────────────

install: ## Install all dependencies
	pnpm install

# ─── Development ──────────────────────────────────────────────────────────────

dev: ## Start all services in development mode
	pnpm turbo dev

dev-web: ## Start web frontend only
	pnpm --filter @bizmanager/web dev

dev-api: ## Start API only
	pnpm --filter @bizmanager/api dev

dev-pdf: ## Start PDF engine only
	cd services/pdf-engine && cargo run

# ─── Build ────────────────────────────────────────────────────────────────────

build: ## Build all packages
	pnpm turbo build

pdf-build: ## Build PDF engine (release)
	cd services/pdf-engine && cargo build --release

# ─── Quality ──────────────────────────────────────────────────────────────────

lint: ## Lint all packages
	pnpm turbo lint

type-check: ## Type-check all packages
	pnpm turbo type-check

test: ## Run all tests
	pnpm turbo test

# ─── Database ─────────────────────────────────────────────────────────────────

db-up: ## Start database services
	docker compose up postgres redis minio -d

db-down: ## Stop database services
	docker compose down

db-migrate: ## Run Prisma migrations
	pnpm --filter @bizmanager/api exec prisma migrate dev

db-migrate-prod: ## Run Prisma migrations (production)
	pnpm --filter @bizmanager/api exec prisma migrate deploy

db-generate: ## Generate Prisma client
	pnpm --filter @bizmanager/api exec prisma generate

db-seed: ## Seed the database
	pnpm --filter @bizmanager/api exec prisma db seed

db-studio: ## Open Prisma Studio
	pnpm --filter @bizmanager/api exec prisma studio

db-reset: ## Reset the database (destructive!)
	pnpm --filter @bizmanager/api exec prisma migrate reset --force

# ─── Docker ───────────────────────────────────────────────────────────────────

up: ## Start all Docker services
	docker compose up -d

down: ## Stop all Docker services
	docker compose down

logs: ## Show Docker logs
	docker compose logs -f

# ─── Cleanup ──────────────────────────────────────────────────────────────────

clean: ## Remove all build artifacts
	pnpm turbo clean
	find . -name "node_modules" -type d -not -path "*/.*" | xargs rm -rf
	find . -name ".nuxt" -type d | xargs rm -rf
	find . -name ".output" -type d | xargs rm -rf
	find . -name "dist" -type d -not -path "*/node_modules/*" | xargs rm -rf
