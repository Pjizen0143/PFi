import {Wallet} from "@/features/wallets/types/wallets"

export type DashboardResponse = {
  total_asset_value: {
    amount: number;
    currency: string;
    last_updated: string;
  };

  wallets: Wallet[];

  recent_transactions: RecentTransaction[];
};

export type RecentTransaction = {
  id: string;
  wallet_id: string;
  wallet_name: string;

  type: "income" | "expense";

  amount: number;
  category_code: string;

  category: string;
  note: string | null;

  transaction_date: string;
};