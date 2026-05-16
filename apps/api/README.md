# Backend API

FastAPI-based REST API for the PFi application.

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

# Environment Variables

Create `.env.local` in `apps/api/`:

```env
DATABASE_URL=postgresql+psycopg://user:password@db:5432/pfi
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
EXPIRE_TIME=3600
```

---
