import { ApiResponse } from "@/lib/types";

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResult = {
  access_token: string;
  token_type: string;
  expires_in: number;
  display_name: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  display_name: string;
};

