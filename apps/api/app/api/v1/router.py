from fastapi import APIRouter

from app.api.v1.routers.auth import router as auth_router
from app.api.v1.routers.user import router as user_router
from app.api.v1.routers.exchange_rate import router as exchange_rate_router
from app.api.v1.routers.wallets import router as wallets_router
from app.api.v1.routers.transactions import router as transactions_router

from app.core.config import settings

API_V1_PREFIX = settings.API_V1_PREFIX

router = APIRouter(prefix=API_V1_PREFIX)

router.include_router(auth_router)
router.include_router(user_router)
router.include_router(exchange_rate_router)
router.include_router(wallets_router)
router.include_router(transactions_router)