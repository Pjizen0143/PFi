from uuid import UUID

from sqlmodel import Session
import jwt
from fastapi import Depends

from app.core.db import get_session
from app.exceptions.auth_exception import InvalidCredentialsException
from app.exceptions.user_exception import UserNotFoundException
from app.core.security import decode_access_token
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.unit_of_work.unit_of_work import UnitOfWork


def get_uow(session: Session = Depends(get_session)) -> UnitOfWork:
    return UnitOfWork(session)


def _authenticate_user(
    token: str,
    uow: UnitOfWork = Depends(get_uow),
) -> User:

    try:
        payload = decode_access_token(token)

        user_id: str | None = payload.get("sub")

        if user_id is None:
            raise InvalidCredentialsException()

    except jwt.PyJWTError as exc:
        raise InvalidCredentialsException() from exc

    user_repo = UserRepository(uow.session)

    user = user_repo.get_by_id(UUID(user_id))

    if user is None:
        raise UserNotFoundException()

    return user


def get_current_user(user: User = Depends(_authenticate_user)) -> User:
    return user
