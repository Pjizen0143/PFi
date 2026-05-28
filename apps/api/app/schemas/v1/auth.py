from pydantic import EmailStr, BaseModel, Field
from app.core.config import settings


EXPIRE_TIME = settings.EXPIRE_TIME


class RegisterRequest(BaseModel):
    display_name: str = Field(..., min_length=1, max_length=16, pattern="^[A-Za-z0-9_]+$")
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = EXPIRE_TIME

    display_name: str
