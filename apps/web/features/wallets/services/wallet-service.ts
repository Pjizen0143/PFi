import { api } from "@/lib/axios";
import type { 
  CreateWalletPayload, 
  UpdateWalletPayload, 
  WalletResponse, 
  WalletListResponse 
} from "../types/wallets";

export async function getWallets(): Promise<WalletListResponse> {
  const response = await api.get<WalletListResponse>("/api/v1/wallets");
  return response.data;
}

export async function getWallet(id: string): Promise<WalletResponse> {
  const response = await api.get<WalletResponse>(`/api/v1/wallets/${id}`);
  return response.data;
}
    
export async function createWallet(payload: CreateWalletPayload): Promise<WalletResponse> {
  const response = await api.post<WalletResponse>("/api/v1/wallets", payload);
  return response.data;
}

export async function updateWallet(id: string, payload: UpdateWalletPayload): Promise<WalletResponse> {
  const response = await api.patch<WalletResponse>(`/api/v1/wallets/${id}`, payload);
  return response.data;
}

export async function deleteWallet(id: string): Promise<void> {
  await api.delete<void>(`/api/v1/wallets/${id}`);
}