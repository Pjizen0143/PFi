from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.api.deps import get_current_user, get_uow
from app.schemas.v1.user import UpdateUserRequest, UserResponse
from app.schemas.common.response import ApiResponse
from app.services.user_service import UserService
from app.unit_of_work.unit_of_work import UnitOfWork
from app.models.user import User


router = APIRouter(prefix="/users", tags=["Users"])


@router.get(
    "/me",
    response_model=ApiResponse[UserResponse],
    response_model_exclude_none=True,
)
def get_user(
    currenent_user: User = get_current_user(),
) -> ApiResponse[UserResponse]:
    return ApiResponse.success_response(data=UserResponse.from_user(currenent_user))


@router.patch(
    "/me",
    response_model=ApiResponse[UserResponse],
    response_model_exclude_none=True,
)
def update_user(
    request: UpdateUserRequest,
    currenent_user: User = get_current_user(),
    uow: UnitOfWork = Depends(get_uow),
) -> ApiResponse[UserResponse]:
    service = UserService(uow)
    user = service.update_user(currenent_user.id, request)
    return ApiResponse.success_response(data=UserResponse.from_user(user))


@router.delete(
    "/me",
    response_model_exclude_none=True,
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_user(
    uow: UnitOfWork = Depends(get_uow),
    currenent_user: User = get_current_user(),
):
    service = UserService(uow)
    service.delete_user(currenent_user.id)
    return
