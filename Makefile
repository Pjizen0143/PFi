.PHONY: dev dev-db dev-api dev-web dev-build dev-api-build dev-web-build \
        prod-release-all prod-build-all prod-up prod-update test down clean

ENVIRONMENT ?= local

ifneq ($(filter prod-%,$(MAKECMDGOALS)),)
    ENVIRONMENT := production
endif

ENV_FILE := .env.$(ENVIRONMENT)

ifneq ($(wildcard $(ENV_FILE)),)
    include $(ENV_FILE)
    export $(shell sed 's/=.*//' $(ENV_FILE))
endif

# ==============================================================================
# DEVELOPMENT
# ==============================================================================

dev:
	ENVIRONMENT=local docker compose up

dev-db:
	ENVIRONMENT=local docker compose up db -d

dev-api:
	ENVIRONMENT=local docker compose up api db

dev-web:
	ENVIRONMENT=local docker compose up web --no-deps

# ==============================================================================
# DEVELOPMENT BUILD
# ==============================================================================

dev-build:
	ENVIRONMENT=local docker compose up --build

dev-api-build:
	ENVIRONMENT=local docker compose up api db --build

dev-web-build:
	ENVIRONMENT=local docker compose up web --build --no-deps

# ==============================================================================
# PRODUCTION BUILD & PUSH (Multi-Arch)
# ==============================================================================

prod-build-all:
	@echo "Building & Pushing Multi-Arch Images..."

	docker buildx build \
		--platform linux/amd64,linux/arm64 \
		-t $(DOCKERHUB_USERNAME)/pfi-api:latest \
		--push \
		./apps/api

	docker buildx build \
		--platform linux/amd64,linux/arm64 \
		--build-arg BACKEND_API_URL=http://api:8000 \
		-t $(DOCKERHUB_USERNAME)/pfi-web:latest \
		--push \
		./apps/web

# ==============================================================================
# PRODUCTION RUN
# ==============================================================================

prod-up:
	ENVIRONMENT=production docker compose up -d

prod-update:
	ENVIRONMENT=production docker compose pull
	ENVIRONMENT=production docker compose up -d

# ==============================================================================
# TESTING & CLEANUP
# ==============================================================================

test:
	@ENVIRONMENT=test docker compose -f docker-compose.test.yml up --build --abort-on-container-exit; \
	EXIT_CODE=$$?; \
	ENVIRONMENT=test docker compose -f docker-compose.test.yml down -v; \
	exit $$EXIT_CODE

down:
	ENVIRONMENT=$(ENVIRONMENT) docker compose down

clean:
	ENVIRONMENT=$(ENVIRONMENT) docker compose down -v
	@echo "Purging leftover dangling images to free up space..."
	docker image prune -f