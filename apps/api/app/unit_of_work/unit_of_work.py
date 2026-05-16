from sqlmodel import Session

from app.repositories.user_repository import UserRepository
from app.repositories.auth_repository import AuthRepository


class UnitOfWork:
    def __init__(self, session: Session) -> None:
        self.session = session
        self.users = UserRepository(session)
        self.auth = AuthRepository(session)

    def commit(self) -> None:
        self.session.commit()

    def rollback(self) -> None:
        self.session.rollback()

    def refresh(self, instance: object) -> None:
        self.session.refresh(instance)
