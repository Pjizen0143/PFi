.PHONY: dev dev-db dev-api dev-web dev-build dev-api-build dev-web-build \
        prod-release-all prod-build-all prod-up prod-update test down clean clean-dev

ENVIRONMENT ?= local

DEV_API_TAG := pfi-api:dev
DEV_WEB_TAG := pfi-web:dev

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

dev-build: dev-api-build-only dev-web-build-only
	ENVIRONMENT=local docker compose up

dev-api-build-only:
	docker build -t $(DEV_API_TAG) --label "env=development" ./apps/api

dev-web-build-only:
	docker build --build-arg BACKEND_API_URL=http://api:8000 -t $(DEV_WEB_TAG) --label "env=development" ./apps/web

dev-api-build: dev-api-build-only
	ENVIRONMENT=local docker compose up api db

dev-web-build: dev-web-build-only
	ENVIRONMENT=local docker compose up web --no-deps

# ==============================================================================
# PRODUCTION BUILD & PUSH
# ==============================================================================
prod-build-all:
	@if [ -z "$(VERSION)" ]; then \
		echo "❌ Error: VERSION is not defined!"; \
		echo "Usage: make prod-build-all VERSION=1.0.0"; \
		exit 1; \
	fi

	@echo "Starting Production Build for Version: $(VERSION)..."

	docker buildx build \
		--platform linux/arm64 \
		--label "env=production" \
		--label "version=$(VERSION)" \
		-t $(DOCKERHUB_USERNAME)/pfi-api:$(VERSION) \
		-t $(DOCKERHUB_USERNAME)/pfi-api:latest \
		--push \
		./apps/api

	docker buildx build \
		--platform linux/arm64 \
		--build-arg BACKEND_API_URL=http://api:8000 \
		--label "env=production" \
		--label "version=$(VERSION)" \
		-t $(DOCKERHUB_USERNAME)/pfi-web:$(VERSION) \
		-t $(DOCKERHUB_USERNAME)/pfi-web:latest \
		--push \
		./apps/web

# ==============================================================================
# PRODUCTION RUN (ดึง latest อัตโนมัติหากไม่ระบุ version)
# ==============================================================================

prod-up:
	@RUN_VERSION=$$(if [ -z "$(VERSION)" ]; then echo "latest"; else echo "$(VERSION)"; fi); \
	echo "Starting Production with Version: $$RUN_VERSION..."; \
	ENVIRONMENT=production VERSION=$$RUN_VERSION docker compose up -d

prod-update:
	@RUN_VERSION=$$(if [ -z "$(VERSION)" ]; then echo "latest"; else echo "$(VERSION)"; fi); \
	echo "Updating Production Images to Version: $$RUN_VERSION..."; \
	ENVIRONMENT=production VERSION=$$RUN_VERSION docker compose pull; \
	ENVIRONMENT=production VERSION=$$RUN_VERSION docker compose up -d

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

# Development cleanup: stop containers, remove images with dev tags, and prune intermediate builds
clean-dev:
	@echo "Stopping local development containers..."
	ENVIRONMENT=local docker compose down -v
	@echo "Removing development images with tag..."
	-docker rmi $(DEV_API_TAG) $(DEV_WEB_TAG) 2>/dev/null || true
	@echo "Purging development-labeled intermediate builds..."
	-docker image prune -f --filter "label=env=development"
	@echo "Development build cleaned up successfully!"

# General cleanup: stop containers and prune dangling images to free up space
clean:
	ENVIRONMENT=$(ENVIRONMENT) docker compose down -v
	@echo "Purging leftover dangling images to free up space..."
	docker image prune -f