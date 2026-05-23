import { ApiResponse } from "@/lib/types";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResult = {
  access_token: string;
  token_type: string;
  expires_in: number;
  display_name: string;
};

export type LoginResponse = ApiResponse<LoginResult>;
