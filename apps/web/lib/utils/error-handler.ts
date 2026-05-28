import { ApiResponse, ValidationError } from "@/lib/types";
import { AxiosError } from "axios";

export class FormErrorHandler {
  static getValidationErrors(error: unknown): ValidationError[] | null {
    if (error instanceof AxiosError) {
      const serverError = error.response?.data as ApiResponse<unknown> | undefined;

      if (serverError?.error?.details) {
        return serverError.error.details;
      }
    }

    return null;
  }

  static getErrorMessage(
    error: unknown,
    defaultMessage = "Something went wrong"
  ): string {
    if (error instanceof AxiosError) {
      const serverError = error.response?.data as ApiResponse<unknown> | undefined;

      if (serverError?.error?.message) {
        return serverError.error.message;
      }
    }

    return defaultMessage;
  }

  static getFieldError(
    errors: ValidationError[] | null,
    fieldName: string
  ): string | undefined {
    if (!errors) return undefined;

    const found = errors.find((err) => err.field === fieldName);

    return found?.reason;
  }
}