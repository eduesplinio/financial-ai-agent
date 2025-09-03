// Open Finance types - placeholder implementation
export interface OpenFinanceConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
}
