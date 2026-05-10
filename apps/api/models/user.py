from sqlmodel import Field, SQLModel
from datetime import datetime, UTC
from uuid import uuid4, UUID


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    display_name: str
    email: str | None = Field(default=None, index=True, unique=True)

    email_verified: bool = False

    profile_image_url: str | None = None

    is_active: bool = True
    is_guest: bool = False

    last_login_at: datetime | None = None

    created_at: datetime = Field(default_factory=datetime.now(UTC), nullable=False)
    updated_at: datetime = Field(default_factory=datetime.now(UTC), nullable=False)
