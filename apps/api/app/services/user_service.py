from uuid import UUID

from app.core.utils import utcnow
from app.models.user import User
from app.schemas.v1.user import CreateUserRequest, UpdateUserRequest
from app.unit_of_work.unit_of_work import UnitOfWork
from app.exceptions.user_exception import (
    UserNotFoundException,
)


class UserService:
    def __init__(self, uow: UnitOfWork) -> None:
        self.uow = uow

    def get_user(self, user_id: UUID) -> User:
        user = self.uow.users.get_by_id(user_id)
        if not user:
            raise UserNotFoundException()
        return user

    def update_user(self, user_id: UUID, request: UpdateUserRequest) -> User:
        user = self.get_user(user_id)

        if request.display_name is not None:
            user.display_name = request.display_name

        if request.profile_image_url is not None:
            user.profile_image_url = request.profile_image_url

        if request.display_name is not None or request.profile_image_url is not None:
            user.updated_at = utcnow()

        self.uow.commit()
        self.uow.refresh(user)
        return user

    def delete_user(self, user_id: UUID) -> None:
        user = self.get_user(user_id)
        self.uow.users.delete(user)
        self.uow.commit()
