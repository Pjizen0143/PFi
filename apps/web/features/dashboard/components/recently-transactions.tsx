import { Card } from "@/components/ui/card";
import { RecentTransaction } from "@/features/dashboard/types/dashboard";
import { Utensils, Car, Briefcase, Gift, Tv, HelpCircle, ArrowRight } from "lucide-react";

type RecentlyTransactionsProps = {
  transactions?: RecentTransaction[];
};

function getCategoryIcon(categoryCode: string) {
  switch (categoryCode.toLowerCase()) {
    case "food":
      return <Utensils className="h-4 w-4" />;
    case "transport":
      return <Car className="h-4 w-4" />;
    case "salary":
      return <Briefcase className="h-4 w-4" />;
    case "gift":
      return <Gift className="h-4 w-4" />;
    case "subscription":
    case "entertainment":
      return <Tv className="h-4 w-4" />;
    default:
      return <HelpCircle className="h-4 w-4" />;
  }
}

export function RecentlyTransactions({ transactions = [] }: RecentlyTransactionsProps) {
  return (
    <Card className="bg-card border-foreground/5 flex h-full flex-col overflow-hidden border p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-foreground text-base font-bold tracking-tight sm:text-lg">Recent Transactions</h2>
        <button className="text-primary hover:text-primary/80 flex shrink-0 items-center gap-1 text-xs font-medium underline-offset-4 transition-colors hover:cursor-pointer hover:underline">
          View All
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <div className="bg-foreground/5 mb-3 flex h-10 w-10 items-center justify-center rounded">
            <HelpCircle className="text-foreground/30 h-5 w-5" />
          </div>
          <p className="text-foreground text-sm font-medium">No transactions</p>
        </div>
      ) : (
        <div className="flex-1 space-y-1">
          {transactions.map((txn) => {
            const isExpense = txn.type === "expense";
            const amountFormatted = txn.amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });

            const date = new Date(txn.transaction_date);
            const dateFormatted = date.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={txn.id}
                className="hover:bg-foreground/5 -mx-2 flex cursor-pointer items-center justify-between gap-3 rounded px-2 py-2.5 transition-colors"
              >
                {/* Left Column */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {/* Category Icon */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded ${
                      isExpense ? "bg-danger/10 text-danger" : "bg-brand-green/10 text-brand-green"
                    }`}
                  >
                    {getCategoryIcon(txn.category_code)}
                  </div>

                  {/* Details Container */}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex min-w-0 items-baseline gap-1.5">
                      <span className="text-foreground shrink-0 truncate text-sm font-semibold">{txn.category}</span>
                      {txn.note && (
                        <span className="text-foreground/50 truncate text-xs font-medium">({txn.note})</span>
                      )}
                    </div>
                    <p className="text-foreground/40 truncate text-[11px] font-medium">
                      {dateFormatted} • {txn.wallet_name}
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="shrink-0 pl-1 text-right">
                  <span
                    className={`block text-sm font-bold whitespace-nowrap ${
                      isExpense ? "text-danger" : "text-brand-green"
                    }`}
                  >
                    {isExpense ? "-" : "+"}
                    {amountFormatted}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
