from fastapi import APIRouter
from datetime import datetime, UTC

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.now(UTC), "service": "pfi-api"}
