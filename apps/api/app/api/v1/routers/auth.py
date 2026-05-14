from fastapi import APIRouter, Depends

from app.api.deps import get_uow
from app.schemas.common.response import ApiResponse
from app.schemas.v1.auth import LoginRequest, RegisterRequest, AuthResponse
from app.services.auth_service import (
    AuthService,
)
from app.unit_of_work.unit_of_work import (
    UnitOfWork,
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post(
    "/register",
    response_model_exclude_none=True,
    response_model=ApiResponse[AuthResponse],
)
def register(
    request: RegisterRequest,
    uow: UnitOfWork = Depends(get_uow),
) -> ApiResponse[AuthResponse]:

    service = AuthService(uow)

    return ApiResponse.success_response(data=service.register(request))


@router.post(
    "/login", response_model_exclude_none=True, response_model=ApiResponse[AuthResponse]
)
def login(
    request: LoginRequest,
    uow: UnitOfWork = Depends(get_uow),
) -> ApiResponse[AuthResponse]:

    service = AuthService(uow)

    return ApiResponse.success_response(data=service.login(request))
