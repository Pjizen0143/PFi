dev:
	ENVIRONMENT=local docker compose up --build

prod:
	ENVIRONMENT=production docker compose up -d

test:
	@docker compose -f docker-compose.test.yml up --build --abort-on-container-exit; \
	EXIT_CODE=$$?; \
	docker compose -f docker-compose.test.yml down -v; \
	exit $$EXIT_CODE