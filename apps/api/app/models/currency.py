from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.wallet import Wallet

class Currency(SQLModel, table=True):
    __tablename__ = "currencies"

    code: str = Field(primary_key=True)
    name: str
    symbol: str

    wallets: list["Wallet"] = Relationship(back_populates="currency")
