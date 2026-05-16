# PFi - Personal Finance Tracker

Personal Finance Tracker application built with FastAPI backend and Next.js frontend.

## Features

- JWT Authentication
- User Management
- Dockerized Testing Environment
- CI/CD Pipeline

## Tech Stack

### Backend

- FastAPI
- PostgreSQL
- SQLModel

### Frontend

- Next.js
- Tailwind CSS v4.0
- TypeScript

## Monorepo Structure

```
PFi/
├── apps/
│   ├── api/          # FastAPI backend
│   └── web/          # Next.js frontend
├── docs/             # Documentation
├── infra/            # Infrastructure configs
└── Makefile          # Docker build commands
```

## Docker Usage

```bash
# Run project
make dev
```

## Testing

```bash
# Run all tests
make test
```

## Project Documentation

- [Backend API README](apps/api/README.md) - API architecture and setup
- [API Auth Flow](docs/api/auth-flow.md) - Authentication flow diagrams
- [API Response Schema](docs/api/response-schema.md) - Standard response formats
- [Architecture](docs/architecture.md) - System design and patterns

## CI/CD

Tests run on every push via GitHub Actions. See `.github/workflows/` for details.
