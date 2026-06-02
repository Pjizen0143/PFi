from uuid import UUID
from sqlmodel import Session, select
from app.models.wallet import Wallet

class WalletRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def add(self, wallet: Wallet) -> None:
        self.session.add(wallet)

    def get_by_id(self, wallet_id: UUID) -> Wallet | None:
        statement = select(Wallet).where(Wallet.id == wallet_id)
        return self.session.exec(statement).first()

    def list_by_user_id(self, user_id: UUID) -> list[Wallet]:
        statement = select(Wallet).where(Wallet.user_id == user_id)
        return list(self.session.exec(statement).all())

    def delete(self, wallet: Wallet) -> None:
        self.session.delete(wallet)
