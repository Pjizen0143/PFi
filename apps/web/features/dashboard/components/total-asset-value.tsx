import { Card } from "@/components/ui/card";
import { ChevronRight, Clock, Wallet } from "lucide-react";
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
    <Card className="bg-card border-foreground/5 flex flex-col justify-between border p-6 shadow-sm md:flex-row md:items-center">
      <div className="space-y-3">
        <div className="text-foreground/60 flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          <h2 className="text-sm font-medium">Total Balance</h2>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-foreground text-3xl font-bold tracking-tight">{formattedAmount}</span>
          <span className="text-foreground/50 text-base font-semibold">{currency}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-start gap-3 md:mt-0 md:items-end">
        <div className="text-foreground hover:bg-foreground/5 border-foreground/10 flex items-center gap-1.5 rounded border px-2.5 py-1 hover:cursor-pointer">
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold">Show Details</span>
        </div>
        <div className="text-foreground/40 flex items-center gap-1.5 text-[11px] font-medium">
          <Clock className="h-3 w-3" />
          <span>Updated: {formattedDate}</span>
        </div>
      </div>
    </Card>
  );
}
