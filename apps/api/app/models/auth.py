from uuid import UUID, uuid4
from datetime import datetime
from sqlmodel import Field, SQLModel
from app.core.utils import utcnow


class AuthProvider(SQLModel, table=True):
    __tablename__ = "auth_providers"

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    user_id: UUID = Field(foreign_key="users.id", index=True, ondelete="CASCADE")

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
