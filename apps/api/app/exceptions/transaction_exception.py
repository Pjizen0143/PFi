from fastapi import status
from app.exceptions.app_exception import AppException
from app.exceptions.error_codes import ErrorCode

class TransactionNotFoundException(AppException):
    status_code = status.HTTP_404_NOT_FOUND
    code = ErrorCode.NOT_FOUND
    message = "Transaction not found"

class CategoryNotFoundException(AppException):
    status_code = status.HTTP_404_NOT_FOUND
    code = ErrorCode.NOT_FOUND
    message = "Category not found"

class InvalidTransactionAmountException(AppException):
    status_code = status.HTTP_400_BAD_REQUEST
    code = ErrorCode.VALIDATION_ERROR
    message = "Invalid transaction amount"
