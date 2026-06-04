from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING
from app.models.transaction import TransactionType

if TYPE_CHECKING:
    from app.models.transaction import Transaction

class Category(SQLModel, table=True):
    __tablename__ = "categories"

    code: str = Field(primary_key=True)
    name: str
    type: TransactionType

    transactions: list["Transaction"] = Relationship(
        back_populates="category",
        cascade_delete=True
    )
