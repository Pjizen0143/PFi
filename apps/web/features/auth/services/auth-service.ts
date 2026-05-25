import { api } from "@/lib/axios";
import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "../types/auth";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/api/v1/auth/login", payload);
  return response.data;
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>("/api/v1/auth/register", payload);
  return response.data;
}
