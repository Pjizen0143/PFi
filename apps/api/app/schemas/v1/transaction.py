from uuid import UUID
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field
from app.models.transaction import TransactionType

class TransactionCreateRequest(BaseModel):
    wallet_id: UUID
    category_code: str | None = None
    type: TransactionType
    amount: Decimal = Field(gt=0, description="Amount must be positive")
    note: str | None = None
    transaction_date: datetime

class TransactionUpdateRequest(BaseModel):
    category_code: str | None = None
    type: TransactionType | None = Field(None, description="Must be 'income' or 'expense'")
    amount: Decimal | None = Field(None, gt=0, description="Amount must be positive")
    note: str | None = None
    transaction_date: datetime | None = None

class TransactionResponse(BaseModel):
    id: UUID
    wallet_id: UUID
    category_code: str | None
    type: TransactionType
    amount: Decimal
    note: str | None
    transaction_date: datetime
    created_at: datetime
