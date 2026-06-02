from sqlmodel import Session, select
from app.models.currency import Currency

class CurrencyRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def add(self, currency: Currency) -> None:
        self.session.add(currency)

    def get_by_code(self, code: str) -> Currency | None:
        statement = select(Currency).where(Currency.code == code)
        return self.session.exec(statement).first()

    def list(self) -> list[Currency]:
        statement = select(Currency)
        return list(self.session.exec(statement).all())

    def delete(self, currency: Currency) -> None:
        self.session.delete(currency)
