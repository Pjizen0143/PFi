from uuid import UUID, uuid4
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING
from app.core.utils import utcnow

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.currency import Currency

class Wallet(SQLModel, table=True):
    __tablename__ = "wallets"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id")
    currency_code: str = Field(foreign_key="currencies.code")
    name: str
    balance: float = Field(default=0.0)
    created_at: datetime = Field(default_factory=utcnow)

    user: "User" = Relationship(back_populates="wallets")
    currency: "Currency" = Relationship(back_populates="wallets")
