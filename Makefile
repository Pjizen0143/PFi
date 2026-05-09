dev:
	ENVIRONMENT=local docker compose up

prod:
	ENVIRONMENT=production docker compose up -d