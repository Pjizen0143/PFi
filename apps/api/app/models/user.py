from uuid import UUID, uuid4
from datetime import datetime
from sqlmodel import Field, SQLModel
from app.core.utils import utcnow


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    display_name: str
    email: str | None = Field(default=None, index=True, unique=True)

    email_verified: bool = False

    profile_image_url: str | None = None

    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)
