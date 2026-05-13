from fastapi import APIRouter, Depends

from app.api.deps import get_uow
from app.schemas.v1.auth import (
    LoginRequest,
    RegisterRequest,
)
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
)
def register(
    request: RegisterRequest,
    uow: UnitOfWork = Depends(get_uow),
):
    service = AuthService(uow)

    return service.register(request)


@router.post(
    "/login",
    response_model_exclude_none=True,
)
def login(
    request: LoginRequest,
    uow: UnitOfWork = Depends(get_uow),
):
    service = AuthService(uow)

    return service.login(request)
