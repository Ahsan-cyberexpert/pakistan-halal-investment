export * from '@/lib/constants';

export const APP_CONFIG = {
  name: 'Pakistan Halal Investment & Wealth Management',
  shortName: 'Roziq Halal Invest',
  version: '1.0.0',
  defaultBalance: 5000000, // PKR 5M default sandbox portfolio
  currency: 'PKR',
  currencySymbol: '₨',
  supportEmail: 'support@halalinvest.pk',
  supportPhone: '+92 21 111-HALAL (42525)',
} as const;

/**
 * Islamic Finance & Shariah Benchmarks (AAOIFI Standard)
 */
export const ISLAMIC_BENCHMARKS = {
  maxDebtRatio: 0.33, // Debt to Total Assets <= 33%
  minIlliquidAssetsRatio: 0.20, // Illiquid Assets >= 20%
  maxNonPermissibleIncomeRatio: 0.05, // Non-halal income <= 5% (Requires purification)
  goldNisabGrams: 87.48, // 7.5 Tolas Gold
  silverNisabGrams: 612.36, // 52.5 Tolas Silver
  approxSilverNisabPKR: 175000, // Current benchmark silver nisab threshold
  approxGoldNisabPKR: 2450000, // Current benchmark gold nisab threshold
  zakatRate: 0.025, // 2.5%
} as const;

/**
 * Main Navigation Tabs
 */
export const NAVIGATION_TABS = [
  { id: 'home', labelEn: 'Overview', labelUr: 'جائزہ', icon: '🏠' },
  { id: 'portfolio', labelEn: 'Portfolio & PSX', labelUr: 'پورٹ فولیو', icon: '📈' },
  { id: 'assets', labelEn: 'Halal Assets', labelUr: 'حلال اثاثے', icon: '💎' },
  { id: 'kameti', labelEn: 'Digital Kameti', labelUr: 'ڈیجیٹل کمیٹی', icon: '🤝' },
  { id: 'zakat', labelEn: 'Zakat & Purification', labelUr: 'زکوٰۃ و تطہیر', icon: '🕋' },
  { id: 'settings', labelEn: 'Settings & Security', labelUr: 'ترتیبات', icon: '⚙️' },
] as const;

/**
 * Supported Overseas Diaspora Countries
 */
export const OVERSEAS_COUNTRIES = [
  'Saudi Arabia', 'UAE', 'United Kingdom', 'United States', 'Canada', 
  'Australia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Germany', 'Italy', 'Other'
] as const;

/**
 * Local Storage Keys namespace
 */
export const STORAGE_KEYS = {
  LANG: 'roziq_lang',
  DARK_MODE: 'roziq_dark',
  ONBOARDED: 'roziq_onboarded',
  USER_PROFILE: (cnic: string) => `roziq_user_${cnic}`,
  BALANCE: (cnic: string) => `roziq_balance_${cnic}`,
  HOLDINGS: (cnic: string) => `roziq_holdings_${cnic}`,
  TRANSACTIONS: (cnic: string) => `roziq_tx_${cnic}`,
  ZAKAT_HISTORY: (cnic: string) => `roziq_zakat_${cnic}`,
} as const;
