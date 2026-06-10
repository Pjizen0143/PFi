import { TotalAssetValue } from "@/features/dashboard/components/total-asset-value";
import { Wallets } from "@/features/dashboard/components/wallets";
import { RecentlyTransactions } from "@/features/dashboard/components/recently-transactions";
import { mock_dashboard } from "@/features/dashboard/mock-data";

export default function DashboardPage() {
  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-primary text-2xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-foreground/50 mt-1 text-sm">Here is a summary of your financial status.</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 @5xl:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 @5xl:col-span-2">
          <TotalAssetValue data={mock_dashboard.total_asset_value} />
          <Wallets wallets={mock_dashboard.wallets} />
        </div>

        {/* Right Column */}
        <div className="@5xl:col-span-1">
          <RecentlyTransactions transactions={mock_dashboard.recent_transactions} />
        </div>
      </div>
    </div>
  );
}
