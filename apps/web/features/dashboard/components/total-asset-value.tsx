import { Card } from "@/components/ui/card";
import { TrendingUp, Clock, Wallet } from "lucide-react";
import { DashboardResponse } from "@/features/dashboard/types/dashboard";

type TotalAssetValueProps = {
  data?: DashboardResponse["total_asset_value"];
};

export function TotalAssetValue({ data }: TotalAssetValueProps) {
  const amount = data?.amount ?? 0;
  const currency = data?.currency ?? "THB";
  const lastUpdated = data?.last_updated ? new Date(data.last_updated) : null;

  const formattedAmount = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedDate = lastUpdated
    ? lastUpdated.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <Card className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-card border border-foreground/5 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-foreground/60">
          <Wallet className="h-4 w-4" />
          <h2 className="text-sm font-medium">Total Balance</h2>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {formattedAmount}
          </span>
          <span className="text-base font-semibold text-foreground/50">
            {currency}
          </span>
        </div>
      </div>

      <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-green/10 text-brand-green">
          <TrendingUp className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold">+2.4%</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground/40">
          <Clock className="h-3 w-3" />
          <span>Updated: {formattedDate}</span>
        </div>
      </div>
    </Card>
  );
}
