from pydantic import BaseModel
from datetime import datetime
from app.models.wallet import Wallet


class CreateWalletRequest(BaseModel):
    name: str
    currency_code: str


class UpdateWalletRequest(BaseModel):
    name: str | None = None


class WalletResponse(BaseModel):
    id: str
    currency_code: str
    name: str
    balance: float
    created_at: datetime

    @classmethod
    def from_wallet(cls, wallet: Wallet) -> "WalletResponse":
        return cls(
            id=str(wallet.id),
            currency_code=wallet.currency_code,
            name=wallet.name,
            balance=wallet.balance,
            created_at=wallet.created_at
        )
