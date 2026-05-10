from typing import Generic, TypeVar, Any
from sqlmodel import SQLModel


T = TypeVar("T")


class ErrorDetail(SQLModel):
    code: str
    details: dict[str, Any] | None = None


class PaginationMeta(SQLModel):
    page: int
    limit: int
    total: int
    has_next: bool


class ApiResponse[T](SQLModel, Generic[T]):
    success: bool
    message: str

    data: T | None = None
    error: ErrorDetail | None = None
    meta: PaginationMeta | None = None
