import { Card } from "@/components/ui/card";
import { Wallet as WalletIcon, Landmark, Coins, CreditCard, Plus } from "lucide-react";
import { Wallet } from "@/features/wallets/types/wallets";

type WalletsProps = {
  wallets?: Wallet[];
};

// Helper function to render a nice icon based on wallet name
function getWalletIcon(name: string) {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes("bank") || lowercaseName.includes("scb") || lowercaseName.includes("kasikorn")) {
    return <Landmark className="h-5 w-5" />;
  }
  if (lowercaseName.includes("cash")) {
    return <Coins className="h-5 w-5" />;
  }
  if (lowercaseName.includes("card")) {
    return <CreditCard className="h-5 w-5" />;
  }
  return <WalletIcon className="h-5 w-5" />;
}

export function Wallets({ wallets = [] }: WalletsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          My Wallets
        </h2>
        <button className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add</span>
        </button>
      </div>

      {wallets.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-foreground/10 text-center bg-foreground/5 cursor-pointer">
          <div className="h-10 w-10 rounded bg-foreground/10 flex items-center justify-center mb-3">
            <Plus className="h-5 w-5 text-foreground/50" />
          </div>
          <p className="text-sm font-semibold text-foreground">Add Your First Wallet</p>
          <p className="text-xs text-foreground/50 mt-1">Keep track of your balances.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {wallets.map((wallet) => {
            const balance = wallet.balance ?? 0;
            const formattedBalance = balance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });

            return (
              <Card
                key={wallet.id}
                className="group relative flex flex-col justify-between p-5 transition-shadow hover:shadow-md cursor-pointer bg-card border border-foreground/5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-foreground/5 text-foreground/60 group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                    {getWalletIcon(wallet.name)}
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
                    {wallet.currency_code}
                  </span>
                </div>

                <div className="mt-6 space-y-1">
                  <p className="text-sm font-medium text-foreground/60 truncate">
                    {wallet.name}
                  </p>
                  <p className="text-xl font-bold tracking-tight text-foreground">
                    {formattedBalance}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
