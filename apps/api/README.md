# Backend API

FastAPI-based REST API for the PFi application.

---

# Requirements

- Python 3.13+
- PostgreSQL
- uv

---

# Local Development Setup

## 1. Create Environment File

Before running the application, create `.env.local` from `.env.example`:

```bash
# /apps/api/
cp .env.example .env.local
```

Then update the environment variables if needed.

---

## 2. Install Dependencies

Using `uv`:

```bash
uv sync
```

---

## 3. Start PostgreSQL

Make sure PostgreSQL is running before starting the API server.

Example using Docker:

```bash
docker compose up -d db
```

---

## 4. Start Development Server

Using FastAPI CLI:

```bash
fastapi dev app/main.py
```

Or using Uvicorn:

```bash
uvicorn app.main:app --reload
```

---

## API Documentation

- Swagger UI → http://localhost:8000/docs
- ReDoc → http://localhost:8000/redoc

---

# Environment Variables

```env
DATABASE_URL=postgresql+psycopg://user:password@db:5432/pfi
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
EXPIRE_TIME=3600
```

---

# Architecture Overview

## Design Patterns

- Repository Pattern — Data access abstraction layer (`repositories/`)
- Service Layer — Business logic (`services/`)
- Unit of Work Pattern — Transaction management (`unit_of_work/`)
- Dependency Injection — FastAPI dependencies (`deps.py`)
- Exception Handling — Custom exceptions (`exceptions/`)

---

# Request Flow

```text
HTTP Request
    ↓
Router (api/v1/routers/)
    ↓
Service Layer
    ↓
Repository Layer
    ↓
Database
```

---

# Folder Structure

```text
app/
├── __init__.py
├── main.py              # FastAPI app initialization
├── api/
│   ├── deps.py          # Dependency injection
│   ├── health.py        # Health check endpoint
│   └── v1/
│       ├── router.py    # API v1 router
│       └── routers/     # Endpoint handlers
│           ├── auth.py
│           └── user.py
├── core/
│   ├── config.py        # Settings (env vars)
│   ├── db.py            # Database connection
│   ├── security.py      # JWT & password hashing
│   └── utils.py         # Helper functions
├── exceptions/
│   ├── app_exception.py
│   ├── auth_exception.py
│   └── user_exception.py
├── models/              # SQLModel ORM models
├── repositories/        # Data access layer
├── schemas/             # Request/response schemas
├── services/            # Business logic
├── unit_of_work/        # Transaction management
└── tests/               # Test suite
```

---
