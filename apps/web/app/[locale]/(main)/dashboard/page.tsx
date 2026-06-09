import { TotalAssetValue } from "@/features/dashboard/components/total-asset-value";
import { Wallets } from "@/features/dashboard/components/wallets";
import { RecentlyTransactions } from "@/features/dashboard/components/recently-transactions";
import { mock_dashboard } from "@/features/dashboard/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-foreground/50 mt-1">
          Welcome back! Here is a summary of your financial status.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Total Asset & Wallets list */}
        <div className="lg:col-span-2 space-y-6">
          <TotalAssetValue data={mock_dashboard.total_asset_value} />
          <Wallets wallets={mock_dashboard.wallets} />
        </div>

        {/* Right Column: Recent Transactions list */}
        <div className="lg:col-span-1">
          <RecentlyTransactions transactions={mock_dashboard.recent_transactions} />
        </div>
      </div>
    </div>
  );
}
