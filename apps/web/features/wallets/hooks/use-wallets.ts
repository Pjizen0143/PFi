"use client";
import { useState, useEffect, useCallback } from "react";
import { getWallets, createWallet, deleteWallet, updateWallet } from "../services/wallet-service";
import type { Wallet, CreateWalletPayload, UpdateWalletPayload } from "../types/wallets";
import { FormErrorHandler } from "@/lib/utils/error-handler";

export function useWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getWallets();
      if (res?.data) setWallets(res.data);
    } catch (err) {
      setError(FormErrorHandler.getErrorMessage(err, "Failed to load wallets"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const handleCreateWallet = async (payload: CreateWalletPayload): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const res = await createWallet(payload);
      if (res?.data) {
        const created: Wallet = res.data;
        setWallets((prev) => [...prev, created]);
        return true;
      }
      return false;
    } catch (err) {
      setError(FormErrorHandler.getErrorMessage(err, "Failed to create wallet"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWallet = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await deleteWallet(id);
      setWallets((prev) => prev.filter((w) => w.id !== id));
      return true;
    } catch (err) {
      setError(FormErrorHandler.getErrorMessage(err, "Failed to delete wallet"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWallet = async (id: string, payload: UpdateWalletPayload): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const res = await updateWallet(id, payload);
      if (res?.data) {
        const updated: Wallet = res.data;
        setWallets((prev) => prev.map((w) => (w.id === id ? updated : w)));
        return true;
      }
      return false;
    } catch (err) {
      setError(FormErrorHandler.getErrorMessage(err, "Failed to update wallet"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    wallets,
    loading,
    error,
    fetchWallets,
    handleCreateWallet,
    handleDeleteWallet,
    handleUpdateWallet,
  };
}