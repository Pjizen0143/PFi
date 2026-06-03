"use client";

import { useWallets } from "../hooks/use-wallets";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Navbar } from "@/components/shared/navbar";
import { CreateWalletModal } from "./create-wallet-modal";

export function WalletDashboard() {
  const { wallets, loading, error, handleCreateWallet } = useWallets();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-3xl font-bold">Your Wallets</h1>

        {error && <p className="mb-4 text-red-500">{error}</p>}

        {loading && wallets.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <svg className="text-primary h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : wallets.length === 0 ? (
          <div className="bg-card border-border mx-auto mt-12 max-w-md rounded-2xl border p-8 text-center shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">Create Your First Wallet</h2>
            <p className="text-foreground/70 mb-6">You don't have any wallets yet. Please create one to get started.</p>
            <Button onClick={() => setIsModalOpen(true)} className="mt-4">
              Create Wallet
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="bg-card border-border flex flex-col justify-between rounded-2xl border p-6 shadow-sm"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{wallet.name}</h3>
                    <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-bold">
                      {wallet.currency_code}
                    </span>
                  </div>
                  <p className="mt-2 text-3xl font-bold">
                    {(wallet.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}

            <div 
              onClick={() => setIsModalOpen(true)}
              className="bg-card border-border hover:bg-card/80 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center transition"
            >
              <span className="text-primary mb-2 text-4xl">+</span>
              <p className="text-foreground/70 font-semibold">Create New Wallet</p>
            </div>
          </div>
        )}
      </div>

      <CreateWalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleCreateWallet={handleCreateWallet}
        loading={loading}
      />
    </main>
  );
}
