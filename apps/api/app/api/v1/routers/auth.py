from fastapi import APIRouter, Depends, status

from app.exceptions import (
    EmailAlreadyExistsException,
    InvalidCredentialsException,
    ValidationException
)
from app.api.deps import get_uow
from app.schemas.common.response import ApiResponse, ApiSuccessResponse
from app.schemas.v1.auth import LoginRequest, RegisterRequest, AuthResponse
from app.services.auth_service import (
    AuthService,
)
from app.unit_of_work.unit_of_work import (
    UnitOfWork,
)
from app.utils.openapi import exception_response

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post(
    "/register",
    response_model_exclude_none=True,
    response_model=ApiSuccessResponse[AuthResponse],
    status_code=status.HTTP_201_CREATED,
    responses=exception_response(
        EmailAlreadyExistsException,
        InvalidCredentialsException,
        ValidationException
    )
)
def register(
    request: RegisterRequest,
    uow: UnitOfWork = Depends(get_uow),
) -> ApiSuccessResponse[AuthResponse]:

    service = AuthService(uow)

    return ApiResponse.success_response(data=service.register(request))


@router.post(
    "/login", 
    response_model_exclude_none=True, 
    response_model=ApiSuccessResponse[AuthResponse], 
    responses=exception_response(
        InvalidCredentialsException, 
        ValidationException
        )
)
def login(
    request: LoginRequest,
    uow: UnitOfWork = Depends(get_uow),
) -> ApiSuccessResponse[AuthResponse]:

    service = AuthService(uow)

    return ApiResponse.success_response(data=service.login(request))
