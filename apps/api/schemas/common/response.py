from typing import Any, Generic, TypeVar

from pydantic import ConfigDict
from sqlmodel import SQLModel


T = TypeVar("T")


class BaseSchema(SQLModel):
    """
    Base schema for all response models.
    """

    model_config = ConfigDict(
        extra="forbid",
        arbitrary_types_allowed=True,
    )

    def model_dump(self, **kwargs: Any) -> dict[str, Any]:
        kwargs.setdefault("exclude_none", True)
        return super().model_dump(**kwargs)

    def model_dump_json(self, **kwargs: Any) -> str:
        kwargs.setdefault("exclude_none", True)
        return super().model_dump_json(**kwargs)


class ErrorDetail(BaseSchema):
    """
    Error detail response model.
    """

    code: str
    details: dict[str, Any] | None = None


class PaginationMeta(BaseSchema):
    """
    Pagination metadata.
    """

    page: int
    limit: int
    total: int
    has_next: bool


class ApiResponse[T](BaseSchema, Generic[T]):
    """
    Generic API response model.
    """

    success: bool = True
    message: str

    data: T | None = None
    error: ErrorDetail | None = None
    meta: PaginationMeta | None = None

    @classmethod
    def success_response(
        cls,
        message: str,
        data: T | None = None,
        meta: PaginationMeta | None = None,
    ) -> "ApiResponse[T]":
        return cls(
            success=True,
            message=message,
            data=data,
            meta=meta,
        )

    @classmethod
    def error_response(
        cls,
        message: str,
        code: str,
        details: dict[str, Any] | None = None,
    ) -> "ApiResponse[None]":
        return cls(
            success=False,
            message=message,
            error=ErrorDetail(
                code=code,
                details=details,
            ),
        )
