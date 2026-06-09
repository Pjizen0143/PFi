import { Card } from "@/components/ui/card";
import { RecentTransaction } from "@/features/dashboard/types/dashboard";
import {
  Utensils,
  Car,
  Briefcase,
  Gift,
  Tv,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  ArrowRight
} from "lucide-react";

type RecentlyTransactionsProps = {
  transactions?: RecentTransaction[];
};

// Map category code to Lucide Icon
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
    <Card className="flex flex-col h-full overflow-hidden p-6 bg-card border border-foreground/5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Recent Transactions
        </h2>
        <button className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
          View All
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <div className="h-10 w-10 rounded bg-foreground/5 flex items-center justify-center mb-3">
            <HelpCircle className="h-5 w-5 text-foreground/30" />
          </div>
          <p className="text-sm font-medium text-foreground">No transactions</p>
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
                className="flex items-center justify-between py-2.5 rounded transition-colors hover:bg-foreground/5 cursor-pointer px-2 -mx-2"
              >
                <div className="flex items-center gap-3">
                  {/* Category Icon */}
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded ${
                      isExpense
                        ? "bg-danger/10 text-danger"
                        : "bg-brand-green/10 text-brand-green"
                    }`}
                  >
                    {getCategoryIcon(txn.category_code)}
                  </div>

                  {/* Details */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-foreground">
                        {txn.category}
                      </span>
                      {txn.note && (
                        <span className="text-xs text-foreground/50 font-medium">
                          ({txn.note})
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-foreground/40 font-medium">
                      {dateFormatted} • {txn.wallet_name}
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right space-y-0.5">
                  <span
                    className={`text-sm font-bold block ${
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
