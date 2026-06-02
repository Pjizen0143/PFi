from uuid import UUID
from fastapi import APIRouter, Depends, status

from app.api.deps import get_current_user, get_uow
from app.schemas.v1.wallet import CreateWalletRequest, WalletResponse
from app.schemas.common.response import ApiResponse, ApiSuccessResponse
from app.services.wallet_service import WalletService
from app.unit_of_work.unit_of_work import UnitOfWork
from app.models.user import User
from app.utils.openapi import exception_response
from app.exceptions.wallet_exception import WalletNotFoundException
from app.exceptions.validation_exception import ValidationException

router = APIRouter(prefix="/wallets", tags=["Wallets"])

@router.post(
    "",
    response_model=ApiSuccessResponse[WalletResponse],
    response_model_exclude_none=True,
    responses=exception_response(WalletNotFoundException, ValidationException),
    status_code=status.HTTP_201_CREATED,
)
def create_wallet(
    request: CreateWalletRequest,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow),
) -> ApiSuccessResponse[WalletResponse]:
    service = WalletService(uow)
    wallet = service.create_wallet(current_user.id, request)
    return ApiResponse.success_response(data=WalletResponse.from_wallet(wallet))

@router.get(
    "",
    response_model=ApiSuccessResponse[list[WalletResponse]],
    response_model_exclude_none=True,
    responses=exception_response(ValidationException)
)
def get_wallets(
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow),
) -> ApiSuccessResponse[list[WalletResponse]]:
    service = WalletService(uow)
    wallets = service.list_wallets(current_user.id)
    return ApiResponse.success_response(
        data=[WalletResponse.from_wallet(w) for w in wallets]
    )

@router.get(
    "/{wallet_id}",
    response_model=ApiSuccessResponse[WalletResponse],
    response_model_exclude_none=True,
    responses=exception_response(WalletNotFoundException, ValidationException)
)
def get_wallet(
    wallet_id: UUID,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow),
) -> ApiSuccessResponse[WalletResponse]:
    service = WalletService(uow)
    wallet = service.get_wallet(wallet_id, current_user.id)
    return ApiResponse.success_response(data=WalletResponse.from_wallet(wallet))

@router.delete(
    "/{wallet_id}",
    response_model_exclude_none=True,
    status_code=status.HTTP_204_NO_CONTENT,
    responses=exception_response(WalletNotFoundException, ValidationException)
)
def delete_wallet(
    wallet_id: UUID,
    current_user: User = Depends(get_current_user),
    uow: UnitOfWork = Depends(get_uow),
):
    service = WalletService(uow)
    service.delete_wallet(wallet_id, current_user.id)
    return
