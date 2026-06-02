from sqlmodel import Session, select
from app.core.db import engine
from app.models.currency import Currency

DEFAULT_CURRENCIES = [
    {"code": "USD", "name": "US Dollar", "symbol": "$"},
    {"code": "THB", "name": "Thai Baht", "symbol": "฿"},
    {"code": "EUR", "name": "Euro", "symbol": "€"},
]

def init_currencies() -> None:
    with Session(engine) as session:
        for currency_data in DEFAULT_CURRENCIES:
            existing_currency = session.exec(
                select(Currency).where(Currency.code == currency_data["code"])
            ).first()
            if not existing_currency:
                new_currency = Currency(**currency_data)
                session.add(new_currency)
        session.commit()
