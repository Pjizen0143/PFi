from uuid import UUID
from fastapi import APIRouter, Depends, status

from app.api.deps import get_current_user, get_uow
from app.schemas.v1.transaction import TransactionCreateRequest, TransactionUpdateRequest, TransactionResponse
from app.schemas.common.response import ApiResponse, ApiSuccessResponse
from app.services.transaction_service import TransactionService
from app.unit_of_work.unit_of_work import UnitOfWork
from app.models.user import User
from app.utils.openapi import exception_response
from app.exceptions.transaction_exception import TransactionNotFoundException, CategoryNotFoundException
from app.exceptions.wallet_exception import WalletNotFoundException
from app.exceptions.validation_exception import ValidationException


router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post(
    "",
    response_model=ApiSuccessResponse[TransactionResponse],
    response_model_exclude_none=True,
    responses=exception_response(WalletNotFoundException, CategoryNotFoundException, ValidationException),
    status_code=status.HTTP_201_CREATED,
)
async def create_transaction(
    request: TransactionCreateRequest,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow),
) -> ApiSuccessResponse[TransactionResponse]:
    service = TransactionService(uow)
    transaction = await service.create_transaction(current_user.id, request)
    return ApiResponse.success_response(data=transaction)


@router.get(
    "/wallet/{wallet_id}",
    response_model=ApiSuccessResponse[list[TransactionResponse]],
    response_model_exclude_none=True,
    responses=exception_response(WalletNotFoundException, ValidationException)
)
async def get_wallet_transactions(
    wallet_id: UUID,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow),
) -> ApiSuccessResponse[list[TransactionResponse]]:
    service = TransactionService(uow)
    transactions = await service.list_wallet_transactions(current_user.id, wallet_id)
    return ApiResponse.success_response(data=transactions)


@router.get(
    "/{transaction_id}",
    response_model=ApiSuccessResponse[TransactionResponse],
    response_model_exclude_none=True,
    responses=exception_response(TransactionNotFoundException, ValidationException)
)
async def get_transaction(
    transaction_id: UUID,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow),
) -> ApiSuccessResponse[TransactionResponse]:
    service = TransactionService(uow)
    transaction = await service.get_transaction(current_user.id, transaction_id)
    return ApiResponse.success_response(data=transaction)


@router.delete(
    "/{transaction_id}",
    response_model_exclude_none=True,
    status_code=status.HTTP_204_NO_CONTENT,
    responses=exception_response(TransactionNotFoundException, ValidationException)
)
async def delete_transaction(
    transaction_id: UUID,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow),
):
    service = TransactionService(uow)
    await service.delete_transaction(current_user.id, transaction_id)
    return


@router.patch(
    "/{transaction_id}",
    response_model=ApiSuccessResponse[TransactionResponse],
    response_model_exclude_none=True,
    responses=exception_response(TransactionNotFoundException, CategoryNotFoundException, ValidationException)
)
async def update_transaction(
    transaction_id: UUID,
    request: TransactionUpdateRequest,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow),
) -> ApiSuccessResponse[TransactionResponse]:
    service = TransactionService(uow)
    transaction = await service.update_transaction(current_user.id, transaction_id, request)
    return ApiResponse.success_response(data=transaction)
