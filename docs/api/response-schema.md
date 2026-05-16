# API Response Schema

This document is based on `apps/api/schemas/common/response.py`.

## Purpose

Defines a shared API response format so every endpoint returns a consistent structure that is easy for clients to consume.

## Schema Models

### `BaseSchema`

Base schema for all response models.

- Inherits from `SQLModel`
- Uses `model_config` with:
  - `extra="forbid"` (reject unknown fields)
  - `arbitrary_types_allowed=True`
- Overrides:
  - `model_dump()` with default `exclude_none=True`
  - `model_dump_json()` with default `exclude_none=True`

### `ErrorDetail`

Used to provide error information when a request fails.

- `code: str` - System or business error code
- `details: dict[str, Any] | None` - Additional error details (if available)

### `PaginationMeta`

Used to hold metadata for paginated responses.

- `page: int` - Current page number
- `limit: int` - Number of items per page
- `total: int` - Total number of items
- `has_next: bool` - Whether there is a next page

### `ApiResponse[T]`

Main response wrapper for all endpoints, where `T` is the concrete type of `data`.

- `success: bool = True` - Request result status (defaults to `true`)
- `message: str` - Human-readable result message
- `data: T | None` - Response payload (if available)
- `error: ErrorDetail | None` - Error payload (if available)
- `meta: PaginationMeta | None` - Supplemental metadata such as pagination (if available)

`ApiResponse` inherits serialization behavior from `BaseSchema`, so `None` fields are excluded by default when serialized with `model_dump()` and `model_dump_json()`.

## Helper Constructors

### `ApiResponse.success_response(...)`

Factory method for a successful response:

- `message: str`
- `data: T | None = None`
- `meta: PaginationMeta | None = None`

Returns `ApiResponse[T]` with `success=True`.

### `ApiResponse.error_response(...)`

Factory method for an error response:

- `message: str`
- `code: str`
- `details: dict[str, Any] | None = None`

Returns `ApiResponse[None]` with `success=False` and an `error` object.

## Standard JSON Shape

Standard response structure example:

```json
{
  "success": true,
  "message": "...",
  "data": {},
  "meta": {}
}
```

> Note: Any field with value `null` (`None`) is omitted from the serialized response output.

## Usage Examples

### Success Response

```json
{
  "success": true,
  "message": "Request completed",
  "data": {
    "id": 1,
    "name": "example"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {
      "field": "email",
      "reason": "invalid format"
    }
  }
}
```
