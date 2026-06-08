import { api } from "@/lib/axios";
import type { 
  CreateWalletPayload, 
  UpdateWalletPayload, 
  Wallet
} from "../types/wallets";

export async function getWallets(): Promise<Wallet[]> {
  const response = await api.get<Wallet[]>("/api/v1/wallets");
  return response.data;
}

export async function getWallet(id: string): Promise<Wallet> {
  const response = await api.get<Wallet>(`/api/v1/wallets/${id}`);
  return response.data;
}
    
export async function createWallet(payload: CreateWalletPayload): Promise<Wallet> {
  const response = await api.post<Wallet>("/api/v1/wallets", payload);
  return response.data;
}

export async function updateWallet(id: string, payload: UpdateWalletPayload): Promise<Wallet> {
  const response = await api.patch<Wallet>(`/api/v1/wallets/${id}`, payload);
  return response.data;
}

export async function deleteWallet(id: string): Promise<void> {
  await api.delete<void>(`/api/v1/wallets/${id}`);
}