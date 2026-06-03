"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { CreateWalletPayload } from "../types/wallets";

interface CreateWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleCreateWallet: (data: CreateWalletPayload) => Promise<boolean>;
  loading: boolean;
}

export function CreateWalletModal({ isOpen, onClose, handleCreateWallet, loading }: CreateWalletModalProps) {
  const [name, setName] = useState("");
  const [currencyCode, setCurrencyCode] = useState("USD");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleCreateWallet({ name, currency_code: currencyCode });
    if (success) {
      setName("");
      setCurrencyCode("USD");
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Wallet">
      <form onSubmit={onSubmit} className="space-y-4 text-left">
        <Input
          label="Wallet Name"
          placeholder="My Wallet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
        <div className="flex flex-col gap-2">
          <label className="text-foreground text-sm font-semibold">Currency</label>
          <select
            value={currencyCode}
            onChange={(e) => setCurrencyCode(e.target.value)}
            className="bg-background border-input ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm transition focus:ring-4 focus:outline-none disabled:opacity-50"
            disabled={loading}
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="THB">THB - Thai Baht</option>
          </select>
        </div>
        <Button type="submit" disabled={loading} className="mt-4">
          {loading ? "Creating..." : "Create Wallet"}
        </Button>
      </form>
    </Modal>
  );
}
