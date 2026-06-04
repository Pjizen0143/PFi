# ==============================================================================
# DEVELOPMENT (Standard Run - Fast, reuses existing images, no image buildup)
# ==============================================================================

# Start all services in the foreground
dev:
	ENVIRONMENT=local docker compose up

# Start the database service in the background
dev-db:
	ENVIRONMENT=local docker compose up db -d

# Start both API and Database services
dev-api:
	ENVIRONMENT=local docker compose up api db

# Start the Web service without its dependencies (standalone mode)
dev-web:
	ENVIRONMENT=local docker compose up web --no-deps


# ==============================================================================
# DEVELOPMENT BUILD (Use only when changing Dockerfiles or adding new packages)
# ==============================================================================

# Rebuild and start all services
dev-build:
	ENVIRONMENT=local docker compose up --build

# Rebuild and start API and Database services
dev-api-build:
	ENVIRONMENT=local docker compose up api db --build

# Rebuild and start the Web service without restarting dependencies
dev-web-build:
	ENVIRONMENT=local docker compose up web --build --no-deps


# ==============================================================================
# TESTING & CLEANUP
# ==============================================================================

# Run automated tests and automatically shut down test containers afterward
test:
	@docker compose -f docker-compose.test.yml up --build --abort-on-container-exit; \
	EXIT_CODE=$$?; \
	docker compose -f docker-compose.test.yml down -v; \
	exit $$EXIT_CODE

# Stop and remove all running containers
down:
	ENVIRONMENT=$(or $(ENVIRONMENT),local) docker compose down

# Stop containers, remove volumes, and purge all leftover build trash (dangling images)
clean:
	ENVIRONMENT=$(or $(ENVIRONMENT),local) docker compose down -v
	@echo "Purging leftover dangling images to free up space..."
	docker image prune -f