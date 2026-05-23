import { api } from "@/lib/axios";
import type { LoginPayload, LoginResponse } from "../types/auth";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/api/v1/auth/login", payload);
  return response.data;
}
