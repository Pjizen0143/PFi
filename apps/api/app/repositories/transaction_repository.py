from uuid import UUID
from sqlmodel import Session, select
from app.models.transaction import Transaction

class TransactionRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def add(self, transaction: Transaction) -> None:
        self.session.add(transaction)

    def get_by_id(self, transaction_id: UUID) -> Transaction | None:
        statement = select(Transaction).where(Transaction.id == transaction_id)
        return self.session.exec(statement).first()

    def list_by_wallet_id(self, wallet_id: UUID) -> list[Transaction]:
        statement = select(Transaction).where(Transaction.wallet_id == wallet_id)
        return list(self.session.exec(statement).all())

    def delete(self, transaction: Transaction) -> None:
        self.session.delete(transaction)
