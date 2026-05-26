export type ErrorDetail = {
  code: string;
  details: Record<string, unknown> | null;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  has_next: boolean;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  error: ErrorDetail | null;
  meta: PaginationMeta | null;
};
