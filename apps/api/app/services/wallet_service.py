from uuid import UUID
from app.models.wallet import Wallet
from app.schemas.v1.wallet import CreateWalletRequest
from app.unit_of_work.unit_of_work import UnitOfWork
from app.exceptions.wallet_exception import WalletNotFoundException, CurrencyNotFoundException

class WalletService:
    def __init__(self, uow: UnitOfWork) -> None:
        self.uow = uow

    def create_wallet(self, user_id: UUID, request: CreateWalletRequest) -> Wallet:
        currency = self.uow.currencies.get_by_code(request.currency_code)
        if not currency:
            raise CurrencyNotFoundException()
        
        wallet = Wallet(
            user_id=user_id,
            currency_code=request.currency_code,
            name=request.name
        )
        self.uow.wallets.add(wallet)
        self.uow.commit()
        self.uow.refresh(wallet)
        return wallet

    def get_wallet(self, wallet_id: UUID, user_id: UUID) -> Wallet:
        wallet = self.uow.wallets.get_by_id(wallet_id)
        if not wallet or wallet.user_id != user_id:
            raise WalletNotFoundException()
        return wallet

    def list_wallets(self, user_id: UUID) -> list[Wallet]:
        return self.uow.wallets.list_by_user_id(user_id)

    def delete_wallet(self, wallet_id: UUID, user_id: UUID) -> None:
        wallet = self.get_wallet(wallet_id, user_id)
        self.uow.wallets.delete(wallet)
        self.uow.commit()
