from sqlmodel import Session

from app.repositories.user_repository import UserRepository
from app.repositories.auth_repository import AuthRepository
from app.repositories.currency_repository import CurrencyRepository
from app.repositories.wallet_repository import WalletRepository


class UnitOfWork:
    def __init__(self, session: Session) -> None:
        self.session = session
        self.users = UserRepository(session)
        self.auth = AuthRepository(session)
        self.currencies = CurrencyRepository(session)
        self.wallets = WalletRepository(session)

    def commit(self) -> None:
        self.session.commit()

    def rollback(self) -> None:
        self.session.rollback()

    def refresh(self, instance: object) -> None:
        self.session.refresh(instance)
