from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.auth import (
    AuthProvider,
)
from app.models.user import User
from app.schemas.v1.auth import (
    AuthResponse,
    LoginRequest,
    RegisterRequest,
)
from app.unit_of_work.unit_of_work import (
    UnitOfWork,
)


class AuthService:
    def __init__(
        self,
        uow: UnitOfWork,
    ):
        self.uow = uow

    def register(
        self,
        request: RegisterRequest,
    ) -> AuthResponse:
        existing_user = self.uow.users.get_by_email(
            request.email,
        )

        if existing_user:
            raise ValueError(
                "Email already exists",
            )

        user = User(
            display_name=request.display_name,
            email=request.email,
        )

        self.uow.users.add(user)

        self.uow.session.flush()

        auth_provider = AuthProvider(
            user_id=user.id,
            provider="local",
            email=request.email,
            password_hash=hash_password(
                request.password,
            ),
        )

        self.uow.auth.add(
            auth_provider,
        )

        self.uow.commit()

        self.uow.refresh(user)

        access_token = create_access_token(
            str(user.id),
        )

        return AuthResponse(
            access_token=access_token,
            user_id=str(user.id),
            email=user.email,
            display_name=user.display_name,
        )

    def login(
        self,
        request: LoginRequest,
    ) -> AuthResponse:
        auth_provider = self.uow.auth.get_local_by_email(
            request.email,
        )

        if not auth_provider:
            raise ValueError(
                "Invalid credentials",
            )

        if not auth_provider.password_hash:
            raise ValueError(
                "Invalid credentials",
            )

        is_valid = verify_password(
            request.password,
            auth_provider.password_hash,
        )

        if not is_valid:
            raise ValueError(
                "Invalid credentials",
            )

        user = self.uow.users.get_by_id(
            auth_provider.user_id,
        )

        if not user:
            raise ValueError(
                "User not found",
            )

        access_token = create_access_token(
            str(user.id),
        )

        return AuthResponse(
            access_token=access_token,
            user_id=str(user.id),
            email=user.email,
            display_name=user.display_name,
        )
