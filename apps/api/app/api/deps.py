from fastapi import Depends
from sqlmodel import Session

from app.core.db import get_session
from app.unit_of_work.unit_of_work import UnitOfWork


def get_uow(session: Session = Depends(get_session)) -> UnitOfWork:
    return UnitOfWork(session)
