from pydantic import EmailStr
from sqlmodel import SQLModel

from app.models.user import User


class UpdateUserRequest(SQLModel):
    display_name: str | None = None
    profile_image_url: str | None = None


class UserResponse(SQLModel):
    id: str
    display_name: str
    email: EmailStr | None
    email_verified: bool
    profile_image_url: str | None = None

    @classmethod
    def from_user(cls, user: User) -> "UserResponse":
        return cls(
            id=str(user.id),
            display_name=user.display_name,
            email=user.email,
            email_verified=user.email_verified,
            profile_image_url=user.profile_image_url,
        )
