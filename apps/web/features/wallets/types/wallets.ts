
export type Wallet = {
  id: string;
  name: string;
  currency_code: string;
  balance?: number;
  created_at?: string;
  updated_at?: string;
};

export type CreateWalletPayload = {
  name: string;
  currency_code: string;
};

export type UpdateWalletPayload = {
  name: string;
};
