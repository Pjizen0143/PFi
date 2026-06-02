from uuid import UUID, uuid4
from datetime import datetime
from typing import TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship
from app.core.utils import utcnow

if TYPE_CHECKING:
    from apps.api.app.models.auth import AuthProvider
    from app.models.wallet import Wallet


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    display_name: str
    email: str | None = Field(default=None, index=True, unique=True)

    email_verified: bool = False

    profile_image_url: str | None = None

    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)

    auth_providers: list["AuthProvider"] = Relationship(
        back_populates="user",
        cascade_delete=True
        )
    
    wallets: list["Wallet"] = Relationship(
        back_populates="user",
        cascade_delete=True
        )
