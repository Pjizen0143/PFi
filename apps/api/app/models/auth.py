from uuid import UUID, uuid4
from datetime import datetime
from typing import TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship
from app.core.utils import utcnow

if TYPE_CHECKING:
    from apps.api.app.models.user import User


class AuthProvider(SQLModel, table=True):
    __tablename__ = "auth_providers"

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    user_id: UUID = Field(foreign_key="users.id", index=True, ondelete="CASCADE")
    user: "User" = Relationship(back_populates="auth_providers")

    provider: str = Field(index=True)
    """
    For Auth Provider
    """

    provider_user_id: str | None = Field(
        default=None,
        index=True,
    )

    email: str | None = None

    password_hash: str | None = None

    created_at: datetime = Field(default_factory=utcnow)
