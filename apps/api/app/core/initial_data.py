from sqlmodel import Session, select
from app.core.db import engine
from app.models.category import Category
from app.models.currency import Currency

DEFAULT_CURRENCIES = [
    {"code": "USD", "name": "US Dollar", "symbol": "$"},
    {"code": "THB", "name": "Thai Baht", "symbol": "฿"},
    {"code": "EUR", "name": "Euro", "symbol": "€"},
]

DEFAULT_CATEGORIES = [
    {"code": "FOOD_DINING", "name": "Food & Dining", "type": "expense"},
    {"code": "TRANSPORTATION", "name": "Transportation", "type": "expense"},
    {"code": "SHOPPING", "name": "Shopping", "type": "expense"},
    {"code": "ENTERTAINMENT", "name": "Entertainment", "type": "expense"},
    {"code": "BILLS_UTILITIES", "name": "Bills & Utilities", "type": "expense"},
    {"code": "SALARY", "name": "Salary", "type": "income"},
    {"code": "INVESTMENT", "name": "Investment", "type": "income"},
    {"code": "GIFT", "name": "Gift", "type": "income"},
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

def init_categories() -> None:
    with Session(engine) as session:
        for category_data in DEFAULT_CATEGORIES:
            existing_category = session.exec(
                select(Category).where(Category.code == category_data["code"])
            ).first()
            if not existing_category:
                new_category = Category(**category_data)
                session.add(new_category)
        session.commit()
