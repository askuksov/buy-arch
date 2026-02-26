.PHONY: help up down dev logs restart clean migrate migrate-create migrate-deploy migrate-status prisma-studio seed install build

# Load environment variables from .env file
ifneq (,$(wildcard .env))
    include .env
    export
endif

# Docker Compose file aliases
COMPOSE_FILE_LOCAL := docker-compose.local.yml
COMPOSE_FILE_PROD := docker-compose.yml
DOCKER_COMPOSE_LOCAL := docker compose -f $(COMPOSE_FILE_LOCAL)
DOCKER_COMPOSE_PROD := docker compose

# Colors for output
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
RESET  := $(shell tput -Txterm sgr0)

help: ## Show this help message
	@echo '$(GREEN)Available commands:$(RESET)'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}'

up: ## Start all containers (production mode)
	@echo "$(GREEN)Starting production containers...$(RESET)"
	$(DOCKER_COMPOSE_PROD) up -d
	@echo "$(GREEN)Production containers started!$(RESET)"
	@echo "$(YELLOW)App: http://localhost:3000$(RESET)"

dev: ## Start development environment with hot reload
	@echo "$(GREEN)Starting development environment...$(RESET)"
	$(DOCKER_COMPOSE_LOCAL) up -d
	@echo "$(GREEN)Development environment started!$(RESET)"
	@echo "$(YELLOW)App: http://localhost:3000$(RESET)"
	@echo "$(YELLOW)Prisma Studio: http://localhost:5555$(RESET)"

down: ## Stop all containers
	@echo "$(GREEN)Stopping containers...$(RESET)"
	@$(DOCKER_COMPOSE_LOCAL) down 2>/dev/null || true
	@$(DOCKER_COMPOSE_PROD) down 2>/dev/null || true
	@echo "$(GREEN)Containers stopped!$(RESET)"

restart: down dev ## Restart all containers

logs: ## Show logs from all containers (dev)
	$(DOCKER_COMPOSE_LOCAL) logs -f

logs-app: ## Show logs from app container (dev)
	$(DOCKER_COMPOSE_LOCAL) logs -f app

logs-db: ## Show logs from database container (dev)
	$(DOCKER_COMPOSE_LOCAL) logs -f postgres

logs-prod: ## Show logs from all containers (production)
	$(DOCKER_COMPOSE_PROD) logs -f

shell-app: ## Open shell in app container (dev)
	docker exec -it purchase-organizer-dev sh

shell-app-prod: ## Open shell in app container (production)
	docker exec -it purchase-organizer-app-prod sh

shell-db: ## Open PostgreSQL shell (dev)
	docker exec -it purchase-organizer-db psql -U postgres -d purchase_organizer

shell-db-prod: ## Open PostgreSQL shell (production)
	docker exec -it purchase-organizer-db-prod psql -U postgres -d purchase_organizer

migrate: ## Run database migrations (development)
	@echo "$(GREEN)Running migrations...$(RESET)"
	$(DOCKER_COMPOSE_LOCAL) exec app npx prisma migrate dev
	@echo "$(GREEN)Migrations complete!$(RESET)"

migrate-create: ## Create a new migration
	@read -p "Enter migration name: " name; \
	$(DOCKER_COMPOSE_LOCAL) exec app npx prisma migrate dev --name $$name --create-only

migrate-deploy: ## Deploy migrations (production)
	@echo "$(GREEN)Deploying migrations...$(RESET)"
	$(DOCKER_COMPOSE_PROD) exec app npx prisma migrate deploy
	@echo "$(GREEN)Migrations deployed!$(RESET)"

migrate-reset: ## Reset database (WARNING: deletes all data)
	@echo "$(YELLOW)WARNING: This will delete all data!$(RESET)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(DOCKER_COMPOSE_LOCAL) exec app npx prisma migrate reset --force; \
	fi

migrate-status: ## Show migration status
	@echo "$(GREEN)Migration status:$(RESET)"
	$(DOCKER_COMPOSE_LOCAL) exec app npx prisma migrate status

prisma-studio: ## Open Prisma Studio
	@echo "$(GREEN)Opening Prisma Studio...$(RESET)"
	@echo "$(YELLOW)Prisma Studio: http://localhost:5555$(RESET)"
	$(DOCKER_COMPOSE_LOCAL) exec app npx prisma studio

prisma-generate: ## Generate Prisma Client (dev)
	@echo "$(GREEN)Generating Prisma Client...$(RESET)"
	$(DOCKER_COMPOSE_LOCAL) exec app npx prisma generate
	@echo "$(GREEN)Prisma Client generated!$(RESET)"

seed: ## Seed the database (dev)
	@echo "$(GREEN)Seeding database...$(RESET)"
	$(DOCKER_COMPOSE_LOCAL) exec app npm run db:seed
	@echo "$(GREEN)Database seeded!$(RESET)"

install: ## Install dependencies (dev)
	@echo "$(GREEN)Installing dependencies...$(RESET)"
	$(DOCKER_COMPOSE_LOCAL) exec app npm install
	@echo "$(GREEN)Dependencies installed!$(RESET)"

build: ## Build production image
	@echo "$(GREEN)Building production image...$(RESET)"
	$(DOCKER_COMPOSE_PROD) build
	@echo "$(GREEN)Build complete!$(RESET)"

clean: ## Clean up containers, volumes, and images
	@echo "$(YELLOW)Cleaning up...$(RESET)"
	@$(DOCKER_COMPOSE_LOCAL) down -v 2>/dev/null || true
	@$(DOCKER_COMPOSE_PROD) down -v 2>/dev/null || true
	docker system prune -f
	@echo "$(GREEN)Cleanup complete!$(RESET)"

init: ## Initialize project (first time setup)
	@echo "$(GREEN)Initializing project...$(RESET)"
	@if [ ! -f .env ]; then \
		echo "Creating .env file..."; \
		cp .env.example .env; \
		echo "$(YELLOW)Please update .env with your NEXTAUTH_SECRET$(RESET)"; \
		echo "$(YELLOW)Generate with: openssl rand -base64 32$(RESET)"; \
	fi
	@echo "Starting development containers..."
	$(MAKE) dev
	@echo "Waiting for containers to be ready..."
	@sleep 10
	@echo "Installing dependencies..."
	$(DOCKER_COMPOSE_LOCAL) exec app npm install
	@echo "Generating Prisma Client..."
	$(DOCKER_COMPOSE_LOCAL) exec app npx prisma generate
	@echo "Running migrations..."
	$(DOCKER_COMPOSE_LOCAL) exec app npx prisma migrate dev --name init
	@echo "$(GREEN)Project initialized!$(RESET)"
	@echo "$(YELLOW)App: http://localhost:3000$(RESET)"
	@echo "$(YELLOW)Prisma Studio: http://localhost:5555$(RESET)"

status: ## Show status of all containers
	@if [ "$(NODE_ENV)" = "production" ]; then \
		echo "$(GREEN)Production containers (NODE_ENV=production):$(RESET)"; \
		CONTAINERS=$$(docker ps --filter "name=purchase-organizer-app-prod" --filter "name=purchase-organizer-db-prod" --format "{{.Names}}" 2>/dev/null); \
		if [ -z "$$CONTAINERS" ]; then \
			echo "$(YELLOW)No production containers running$(RESET)"; \
		else \
			docker ps --filter "name=purchase-organizer-app-prod" --filter "name=purchase-organizer-db-prod" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"; \
		fi \
	else \
		echo "$(GREEN)Development containers (NODE_ENV=development):$(RESET)"; \
		CONTAINERS=$$(docker ps --filter "name=purchase-organizer-dev" --filter "name=purchase-organizer-db" --format "{{.Names}}" 2>/dev/null); \
		if [ -z "$$CONTAINERS" ]; then \
			echo "$(YELLOW)No development containers running$(RESET)"; \
		else \
			docker ps --filter "name=purchase-organizer-dev" --filter "name=purchase-organizer-db" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"; \
		fi \
	fi
