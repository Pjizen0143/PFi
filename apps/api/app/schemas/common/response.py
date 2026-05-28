from typing import Any, TypeVar, overload

from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class BaseSchema(BaseModel):
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


class ValidationError(BaseSchema):
    field: str
    reason: str


class ErrorDetail(BaseSchema):
    code: str
    message: str 
    details: list[ValidationError] | None = None


class PaginationMeta(BaseSchema):
    page: int
    limit: int
    total: int
    has_next: bool


class ApiSuccessResponse[T](BaseSchema):
    data: T


class ApiSuccessResponseWithMeta[T](ApiSuccessResponse[T]):
    meta: PaginationMeta


class ApiErrorResponse(BaseSchema):
    error: ErrorDetail


class ApiResponse[T](BaseSchema):
    """
    Generic API response model.
    """

    data: T | None = None
    error: ErrorDetail | None = None
    meta: PaginationMeta | None = None

    @overload
    @classmethod
    def success_response(
        cls,
        data: T,
        meta: None = None,
    ) -> ApiSuccessResponse[T]: ...

    @overload
    @classmethod
    def success_response(
        cls,
        data: T,
        meta: PaginationMeta,
    ) -> ApiSuccessResponseWithMeta[T]: ...

    @classmethod
    def success_response(
        cls,
        data: T,
        meta: PaginationMeta | None = None,
    ) -> ApiSuccessResponse[T] | ApiSuccessResponseWithMeta[T]:
        if meta is not None:
            return ApiSuccessResponseWithMeta(
                data=data,
                meta=meta,
            )
        return ApiSuccessResponse(
            data=data,
        )

    @classmethod
    def error_response(
        cls,
        code: str,
        message: str = "Unexpected error occurred.",
        details: list[ValidationError] | None = None,
    ) -> ApiErrorResponse:
        return ApiErrorResponse(
            error=ErrorDetail(
                code=code,
                message=message,
                details=details,
            ),
        )