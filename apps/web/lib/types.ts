export type ValidationError = {
  field: string;
  reason: string;
};

export type ErrorDetail = {
  code: string;
  message: string;
  details: ValidationError[] | null;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  has_next: boolean;
};

export type ApiResponse<T> = {
  data: T | null;
  error: ErrorDetail | null;
  meta: PaginationMeta | null;
};