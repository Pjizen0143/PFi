from sqlmodel import SQLModel, Field
from pydantic import EmailStr
from app.core.config import settings

EXPIRE_TIME = settings.EXPIRE_TIME


class RegisterRequest(SQLModel):
    display_name: str = Field(
        ..., min_length=1, max_length=16, pattern=r"^[A-Za-z0-9_]+$"
    )
    email: EmailStr
    password: str


class LoginRequest(SQLModel):
    email: EmailStr
    password: str


class AuthResponse(SQLModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = EXPIRE_TIME

    display_name: str
