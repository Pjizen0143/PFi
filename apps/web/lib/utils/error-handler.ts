import { ApiResponse, ValidationError } from "@/lib/types";

/**
 * Utility class to handle and parse standardized API error responses
 * for frontend forms and user interface components.
 */
export class FormErrorHandler {
  /**
   * Extracts an array of field-specific validation errors from an unknown error object
   * caught during an API request (typically from Axios).
   * * @param error - The caught error object from a try-catch block.
   * @returns An array of ValidationError objects if present, otherwise null.
   */
  static getValidationErrors(error: unknown): ValidationError[] | null {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as any;
      const serverError = axiosError.response?.data as ApiResponse<unknown> | undefined;
      
      if (serverError?.error?.details) {
        return serverError.error.details;
      }
    }
    return null;
  }

  /**
   * Extracts the main corporate/business error message from the API error response.
   * Falls back to a provided default message if the specific structure is missing.
   * * @param error - The caught error object from a try-catch block.
   * @param defaultMessage - The fallback message to display if no server message is found.
   * @returns The error message string.
   */
  static getErrorMessage(error: unknown, defaultMessage = "Something went wrong"): string {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as any;
      const serverError = axiosError.response?.data as ApiResponse<unknown> | undefined;
      
      if (serverError?.error?.message) {
        return serverError.error.message;
      }
    }
    return defaultMessage;
  }

  /**
   * Searches through the list of validation errors to find a reason matching a specific field name.
   * This is useful for rendering localized input error tags beneath individual form controls.
   * * @param errors - The array of validation errors extracted from the backend response.
   * @param fieldName - The specific input name to look up (e.g., 'email', 'password').
   * @returns The failure reason string if found, otherwise undefined.
   */
  static getFieldError(errors: ValidationError[] | null, fieldName: string): string | undefined {
    if (!errors) return undefined;
    const found = errors.find((err) => err.field === fieldName);
    return found?.reason;
  }
}