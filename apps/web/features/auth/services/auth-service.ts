import { serverApi } from "@/lib/axios";
import type { LoginPayload, RegisterPayload, AuthResult} from "../types/auth";

export async function login(payload: LoginPayload): Promise<AuthResult> {
  const response = await serverApi.post<AuthResult>("/api/v1/auth/login", payload);
  return response.data;
}

export async function register(payload: RegisterPayload): Promise<AuthResult> {
  const response = await serverApi.post<AuthResult>("/api/v1/auth/register", payload);
  return response.data;
}
