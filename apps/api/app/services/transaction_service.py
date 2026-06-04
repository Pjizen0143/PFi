from uuid import UUID
from app.unit_of_work.unit_of_work import UnitOfWork
from app.models.transaction import Transaction, TransactionType
from app.schemas.v1.transaction import TransactionCreateRequest, TransactionUpdateRequest
from app.exceptions.transaction_exception import TransactionNotFoundException, CategoryNotFoundException
from app.exceptions.wallet_exception import WalletNotFoundException


class TransactionService:
    def __init__(self, uow: UnitOfWork) -> None:
        self.uow = uow

    def _apply_balance_change(self, wallet, transaction_type: TransactionType, amount: float, revert: bool = False) -> None:
        multiplier = -1 if revert else 1
        if transaction_type == TransactionType.INCOME:
            wallet.balance += amount * multiplier
        elif transaction_type == TransactionType.EXPENSE:
            wallet.balance -= amount * multiplier

    async def create_transaction(self, user_id: UUID, request: TransactionCreateRequest) -> Transaction:
        wallet = self.uow.wallets.get_by_id(request.wallet_id)
        if not wallet or wallet.user_id != user_id:
            raise WalletNotFoundException()
            
        if request.category_code is not None:
            category = self.uow.categories.get_by_code(request.category_code)
            if not category:
                raise CategoryNotFoundException()

        transaction = Transaction(
            wallet_id=request.wallet_id,
            category_code=request.category_code,
            type=request.type,
            amount=request.amount,
            note=request.note,
            transaction_date=request.transaction_date,
        )

        self._apply_balance_change(wallet, transaction.type, float(transaction.amount))

        self.uow.transactions.add(transaction)
        self.uow.commit()
        self.uow.refresh(transaction)
        self.uow.refresh(wallet)
        
        return transaction

    async def get_transaction(self, user_id: UUID, transaction_id: UUID) -> Transaction:
        transaction = self.uow.transactions.get_by_id(transaction_id)
        if not transaction:
            raise TransactionNotFoundException()
            
        wallet = self.uow.wallets.get_by_id(transaction.wallet_id)
        if not wallet or wallet.user_id != user_id:
            raise TransactionNotFoundException()
            
        return transaction

    async def list_wallet_transactions(self, user_id: UUID, wallet_id: UUID) -> list[Transaction]:
        wallet = self.uow.wallets.get_by_id(wallet_id)
        if not wallet or wallet.user_id != user_id:
            raise WalletNotFoundException()
            
        return self.uow.transactions.list_by_wallet_id(wallet_id)

    async def update_transaction(self, user_id: UUID, transaction_id: UUID, request: TransactionUpdateRequest) -> Transaction:
        transaction = self.uow.transactions.get_by_id(transaction_id)
        if not transaction:
            raise TransactionNotFoundException()

        wallet = self.uow.wallets.get_by_id(transaction.wallet_id)
        if not wallet or wallet.user_id != user_id:
            raise TransactionNotFoundException()

        update_data = request.model_dump(exclude_unset=True)
        if "category_code" in update_data:
            if update_data["category_code"] is not None:
                category = self.uow.categories.get_by_code(update_data["category_code"])
                if not category:
                    raise CategoryNotFoundException()
            transaction.category_code = update_data["category_code"]

        # Revert old balance
        self._apply_balance_change(wallet, transaction.type, float(transaction.amount), revert=True)

        # Update fields
        if request.type is not None:
            transaction.type = request.type
        if request.amount is not None:
            transaction.amount = request.amount
        if request.note is not None:
            transaction.note = request.note
        if request.transaction_date is not None:
            transaction.transaction_date = request.transaction_date

        # Apply new balance
        self._apply_balance_change(wallet, transaction.type, float(transaction.amount))

        self.uow.commit()
        self.uow.refresh(transaction)
        self.uow.refresh(wallet)
        
        return transaction

    async def delete_transaction(self, user_id: UUID, transaction_id: UUID) -> None:
        transaction = self.uow.transactions.get_by_id(transaction_id)
        if not transaction:
            raise TransactionNotFoundException()

        wallet = self.uow.wallets.get_by_id(transaction.wallet_id)
        if not wallet or wallet.user_id != user_id:
            raise TransactionNotFoundException()

        # Revert balance
        self._apply_balance_change(wallet, transaction.type, float(transaction.amount), revert=True)

        self.uow.transactions.delete(transaction)
        self.uow.commit()
        self.uow.refresh(wallet)
