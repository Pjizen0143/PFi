from typing import Never
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_uow
from app.schemas.v1.user import CreateUserRequest, UpdateUserRequest, UserResponse
from app.services.user_service import UserService
from app.unit_of_work.unit_of_work import UnitOfWork

router = APIRouter(prefix="/users", tags=["Users"])


def _raise_http_for_value_error(exc: ValueError) -> Never:
    msg = str(exc)
    if msg == "Email already exists":
        raise HTTPException(status.HTTP_409_CONFLICT, detail=msg) from exc
    if msg == "User not found":
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=msg) from exc
    raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=msg) from exc


@router.post("", response_model=UserResponse, response_model_exclude_none=True)
def create_user(
    request: CreateUserRequest,
    uow: UnitOfWork = Depends(get_uow),
) -> UserResponse:
    service = UserService(uow)
    try:
        user = service.create_user(request)
    except ValueError as exc:
        _raise_http_for_value_error(exc)
    return UserResponse.from_user(user)


@router.get("/{user_id}", response_model=UserResponse, response_model_exclude_none=True)
def get_user(
    user_id: UUID,
    uow: UnitOfWork = Depends(get_uow),
) -> UserResponse:
    service = UserService(uow)
    try:
        user = service.get_user(user_id)
    except ValueError as exc:
        _raise_http_for_value_error(exc)
    return UserResponse.from_user(user)


@router.get("", response_model=list[UserResponse], response_model_exclude_none=True)
def list_users(uow: UnitOfWork = Depends(get_uow)) -> list[UserResponse]:
    service = UserService(uow)
    users = service.list_users()
    return [UserResponse.from_user(u) for u in users]


@router.patch(
    "/{user_id}", response_model=UserResponse, response_model_exclude_none=True
)
def update_user(
    user_id: UUID,
    request: UpdateUserRequest,
    uow: UnitOfWork = Depends(get_uow),
) -> UserResponse:
    service = UserService(uow)
    try:
        user = service.update_user(user_id, request)
    except ValueError as exc:
        _raise_http_for_value_error(exc)
    return UserResponse.from_user(user)


@router.delete("/{user_id}", response_model_exclude_none=True)
def delete_user(
    user_id: UUID,
    uow: UnitOfWork = Depends(get_uow),
) -> dict[str, str]:
    service = UserService(uow)
    try:
        service.delete_user(user_id)
    except ValueError as exc:
        _raise_http_for_value_error(exc)
    return {"message": "User deleted"}
