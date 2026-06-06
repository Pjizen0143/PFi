from uuid import UUID, uuid4
from datetime import datetime
from decimal import Decimal
from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING
from app.core.utils import utcnow
from enum import StrEnum


if TYPE_CHECKING:
    from app.models.wallet import Wallet
    from app.models.category import Category


class TransactionType(StrEnum):
    INCOME = "income"
    EXPENSE = "expense"


class Transaction(SQLModel, table=True):
    __tablename__ = "transactions"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    wallet_id: UUID = Field(foreign_key="wallets.id")
    category_code: str | None = Field(default=None, foreign_key="categories.code")
    type: TransactionType
    amount: Decimal = Field(default=0, max_digits=18, decimal_places=4)
    note: str | None = None
    transaction_date: datetime = Field(default_factory=utcnow)
    created_at: datetime = Field(default_factory=utcnow)

    wallet: "Wallet" = Relationship(back_populates="transactions")
    category: "Category" = Relationship(back_populates="transactions")
