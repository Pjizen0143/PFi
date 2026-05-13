from sqlmodel import Session, select

from app.models.auth import (
    AuthProvider,
)


class AuthRepository:
    def __init__(
        self,
        session: Session,
    ):
        self.session = session

    def add(
        self,
        auth_provider: AuthProvider,
    ) -> None:
        self.session.add(auth_provider)

    def get_local_by_email(
        self,
        email: str,
    ) -> AuthProvider | None:
        statement = (
            select(AuthProvider)
            .where(
                AuthProvider.provider == "local",
            )
            .where(
                AuthProvider.email == email,
            )
        )

        return self.session.exec(statement).first()

    def get_by_provider(
        self,
        provider: str,
        provider_user_id: str,
    ) -> AuthProvider | None:
        statement = (
            select(AuthProvider)
            .where(
                AuthProvider.provider == provider,
            )
            .where(
                AuthProvider.provider_user_id == provider_user_id,
            )
        )

        return self.session.exec(statement).first()
