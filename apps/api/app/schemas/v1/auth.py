from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    display_name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

    user_id: str
    email: EmailStr
    display_name: str
