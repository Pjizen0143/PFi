# Backend API Implementation Rules & Styles

This document outlines the architectural patterns, coding styles, and rules for implementing features in the `apps/api` (Backend) service.

## 1. Tech Stack

- **Framework**: FastAPI (`fastapi[standard]`)
- **Python Version**: >= 3.13
- **ORM**: SQLModel
- **Database**: PostgreSQL (Driver: `psycopg[binary]`)
- **Package Management**: `uv`
- **Testing**: `pytest`, `pytest-asyncio`

## 2. Architecture Overview

The backend strictly follows a layered architecture. You must respect this separation of concerns:

### 2.1 Repository Pattern (`app/repositories/`)

- **Purpose**: Direct database interaction.
- **Rule**: Repositories receive `sqlmodel.Session` via `__init__`.
- **Rule**: NEVER call `commit()` or `refresh()` inside a repository method. Repositories only execute statements (`self.session.exec(...)`, `self.session.add(...)`, etc.).

### 2.2 Unit of Work (`app/unit_of_work/`)

- **Purpose**: Managing database transaction lifecycles across multiple repositories.
- **Rule**: The `UnitOfWork` class initializes repositories internally (e.g., `self.users = UserRepository(session)`).
- **Rule**: Exposes `commit()`, `rollback()`, and `refresh()` methods to be used by the Service Layer.

### 2.3 Service Layer (`app/services/`)

- **Purpose**: Contains all business logic.
- **Rule**: Services are injected with a `UnitOfWork` instance via their constructor.
- **Rule**: Use `self.uow` to interact with repositories and perform transactions.
- **Rule**: Call `self.uow.commit()` and `self.uow.refresh(entity)` at the end of data modifications.
- **Rule**: Do not return HTTP Responses here. Return domain models or raise custom domain exceptions.

### 2.4 Routers (`app/api/v1/routers/`)

- **Purpose**: FastAPI route definitions.
- **Rule**: Use FastAPI's `Depends` to inject `UnitOfWork` (via `get_uow` from `deps.py`).
- **Rule**: Parse requests using Pydantic schemas, call the appropriate Service layer, and return standard API responses.

## 3. Dependency Injection (`app/api/deps.py`)

- Use `Depends(get_uow)` to inject the Unit of Work into your router endpoints.
- Use `Depends(get_current_user)` to secure endpoints and inject the authenticated `User` model.
- Avoid directly injecting database sessions (`get_session`) into routers unless absolutely necessary.

## 4. Error Handling

- **Rule**: Never raise a generic `HTTPException` directly in the service layer.
- **Rule**: Create custom domain exceptions inside `app/exceptions/` by extending `AppException`.
- **Rule**: Define the standard `ErrorCode` (from `app/exceptions/error_codes.py`) and a `message` within your custom exception class.
- The global exception handler (`app_exception_handler` in `app_exception.py`) will automatically intercept these and format them into the standard error response schema.

## 5. Request & Response Schemas

- **Requests**: Use Pydantic `BaseModel` to define incoming payload schemas in `app/schemas/`.
- **Responses**: Every successful API response MUST be wrapped in the generic `ApiResponse` model:

  ```python
  from app.schemas.common.response import ApiResponse, ApiSuccessResponse

  @router.get(
      "",
      response_model=ApiSuccessResponse[ExchangeRateResponse],
      response_model_exclude_none=True,
      responses=exception_response(
          ValidationException
          )
  )
  async def get_exchange_rates(
      base: str = "USD"
  ) -> ApiSuccessResponse[ExchangeRateResponse]:
      return await ApiResponse.success_response(data=await service.get_rates(base))
  ```

- **Generics**: Take advantage of Python 3.12+ PEP 695 generic type syntax (e.g., `class MyResponse[T]`).

## 6. Coding Conventions

- **Type Hinting**: Always use strict typing (Python 3.13 features).
- **IDs**: Use UUIDs for database primary keys (`Field(default_factory=uuid4)`).
- **Timestamps**: Use `utcnow` from `app.core.utils` for `created_at` and `updated_at` fields.
- **Naming**: `snake_case` for variables, files, and functions. `PascalCase` for classes and Pydantic schemas.
