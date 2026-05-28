from pydantic import EmailStr, BaseModel, Field

from app.models.user import User


class UpdateUserRequest(BaseModel):
    display_name: str = Field(..., min_length=1, max_length=16, pattern="^[A-Za-z0-9_]+$")
    profile_image_url: str | None = None


class UserResponse(BaseModel):
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
