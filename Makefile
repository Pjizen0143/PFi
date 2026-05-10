dev:
	ENVIRONMENT=local docker compose up --build

prod:
	ENVIRONMENT=production docker compose up -d