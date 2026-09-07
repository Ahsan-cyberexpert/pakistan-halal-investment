export interface UserProfile {
  name: string;
  cnic: string;
  mobile: string;
  location?: string;
  isOverseas: boolean;
  country?: string;
  tradingPin?: string;
  tradingPinHash?: string;
}

export interface Holding {
  symbol: string;
  name: string;
  invested: number;
  currentPrice: number;
  units: number;
  pnl: number;
  sector?: string;
  isWali?: boolean;
  quantity?: number;
  avgPrice?: number;
  change?: string;
  dayPnl?: number;
}

export interface Transaction {
  id: number;
  type: 'deposit' | 'withdraw' | 'buy_stock' | 'buy_sukuk' | 'zakat' | 'zakat_vault' | 'sell_stock' | 'wali_investment' | 'health_save' | 'overseas_invest' | string;
  amount: number;
  symbol?: string;
  name?: string;
  units?: number;
  recipient?: string;
  profit?: number;
  fee?: number;
  method?: string;
  status: 'success' | 'pending' | 'failed' | 'SUCCESS' | 'PENDING' | 'FAILED' | string;
  date: string;
  reference?: string;
  note?: string;
  notes?: string;
}

export interface ZakatRecord {
  id?: string | number;
  date: string;
  amount: number;
  recipient: string;
  category?: string;
  receiptId?: string;
}

export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  shariahStatus: 'HALAL' | 'SCREENING' | 'NON_COMPLIANT' | 'Compliant' | 'Non-Compliant' | 'Under Review';
  isLive: boolean;
  halalScore?: number;
  debtRatio?: number;
  interestIncomeRatio?: number;
  purificationPercent?: number;
  dividendYield?: number;
  peRatio?: number;
  marketCap?: string;
}

export interface DbSchema {
  balance: number;
  waliBalance: number;
  globalZakatVault: number;
  transactions: Transaction[];
  holdings: Holding[];
  zakatHistory: ZakatRecord[];
  isPremium?: boolean;
  waliSubscriptionExpiry?: string | null;
  totalInvestedHistory?: number;
  totalRealizedProfit?: number;
  userZakatContributions?: Array<any>;
}
