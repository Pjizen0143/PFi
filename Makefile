dev:
	ENVIRONMENT=local docker compose up --build

prod:
	ENVIRONMENT=production docker compose up -d

test:
	@ENVIRONMENT=test docker compose -p pfi-test run --rm api-test; \
	EXIT_CODE=$$?; \
	ENVIRONMENT=test docker compose -p pfi-test down -v; \
	exit $$EXIT_CODE