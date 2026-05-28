from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models import (
    AuthProvider,
    User
)

from app.schemas.v1.auth import (
    AuthResponse,
    LoginRequest,
    RegisterRequest,
)
from app.unit_of_work.unit_of_work import (
    UnitOfWork,
)
from app.exceptions.auth_exception import InvalidCredentialsException
from app.exceptions.user_exception import (
    UserNotFoundException,
    EmailAlreadyExistsException,
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
            raise EmailAlreadyExistsException()

        user = User(
            display_name=request.display_name,
            email=request.email,
        )

        auth_provider = AuthProvider(
            user=user,
            provider="local",
            email=request.email,
            password_hash=hash_password(
                request.password,
            ),
        )

        self.uow.users.add(user)

        self.uow.auth.add(auth_provider)

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

        if not auth_provider or not auth_provider.password_hash:
            raise InvalidCredentialsException()

        if not verify_password(request.password, auth_provider.password_hash):
            raise InvalidCredentialsException()

        user = auth_provider.user

        if not user:
            raise UserNotFoundException()

        access_token = create_access_token(
            str(user.id),
        )

        return AuthResponse(
            access_token=access_token,
            user_id=str(user.id),
            email=user.email,
            display_name=user.display_name,
        )
