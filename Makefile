dev:
	ENVIRONMENT=local docker compose up --build

dev-db:
	ENVIRONMENT=local docker compose up db -d

dev-api:
	ENVIRONMENT=local docker compose up api --build --no-deps

dev-api-db:
	ENVIRONMENT=local docker compose up api db --build

dev-web:
	ENVIRONMENT=local docker compose up web --build --no-deps

prod:
	ENVIRONMENT=production docker compose up -d

test:
	@docker compose -f docker-compose.test.yml up --build --abort-on-container-exit; \
	EXIT_CODE=$$?; \
	docker compose -f docker-compose.test.yml down -v; \
	exit $$EXIT_CODE

down:
	ENVIRONMENT=$(or $(ENVIRONMENT),local) docker compose down

clean:
	ENVIRONMENT=$(or $(ENVIRONMENT),local) docker compose down -v