from fastapi import status
from app.exceptions.app_exception import AppException
from app.exceptions.error_codes import ErrorCode

class WalletNotFoundException(AppException):
    status_code = status.HTTP_404_NOT_FOUND
    code = ErrorCode.NOT_FOUND
    message = "Wallet not found"

class CurrencyNotFoundException(AppException):
    status_code = status.HTTP_404_NOT_FOUND
    code = ErrorCode.NOT_FOUND
    message = "Currency not found"
