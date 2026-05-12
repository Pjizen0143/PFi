from uuid import UUID

from sqlmodel import Session, select

from app.models.user import User


class UserRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def add(self, user: User) -> None:
        self.session.add(user)

    def get_by_id(self, user_id: UUID) -> User | None:
        statement = select(User).where(User.id == user_id)
        return self.session.exec(statement).first()

    def get_by_email(self, email: str) -> User | None:
        statement = select(User).where(User.email == email)
        return self.session.exec(statement).first()

    def list(self) -> list[User]:
        statement = select(User)
        return list(self.session.exec(statement).all())

    def delete(self, user: User) -> None:
        self.session.delete(user)
