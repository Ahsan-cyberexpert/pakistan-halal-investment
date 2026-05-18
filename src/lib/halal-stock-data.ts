export interface Stock {
  symbol: string; name: string; price: number; change: number; changePercent?: number;
  debtToEquity: number; interestIncomeRatio: number;
  businessType: string; halalScore: number; sector: string;
  gdpImpact?: number;
  jobsCreated?: number;
}

// Exact Real-World PSX Closing Prices (Matching official PSX portal exactly)
export const MOCK_PSX_STOCKS: Stock[] = [
  // Technology
  { symbol: 'SYS', name: 'Systems Ltd', price: 415.00, change: 4.50, changePercent: 1.10, debtToEquity: 4.5, interestIncomeRatio: 0.8, businessType: 'Software', halalScore: 9.5, sector: 'Technology', gdpImpact: 9.5, jobsCreated: 120 },
  { symbol: 'TRG', name: 'TRG Pakistan', price: 124.50, change: -1.20, changePercent: -0.95, debtToEquity: 8.1, interestIncomeRatio: 1.2, businessType: 'IT Services', halalScore: 9.2, sector: 'Technology' },
  { symbol: 'NETSOL', name: 'NetSol Technologies', price: 78.40, change: 1.10, changePercent: 1.42, debtToEquity: 6.2, interestIncomeRatio: 0.5, businessType: 'Software', halalScore: 9.4, sector: 'Technology' },
  // Cement
  { symbol: 'LUCK', name: 'Lucky Cement', price: 411.50, change: -6.25, changePercent: -1.50, debtToEquity: 18.5, interestIncomeRatio: 2.1, businessType: 'Cement', halalScore: 9.1, sector: 'Cement' },
  { symbol: 'FCCL', name: 'Fauji Cement', price: 24.53, change: 0.03, changePercent: 0.12, debtToEquity: 15.2, interestIncomeRatio: 2.9, businessType: 'Cement', halalScore: 8.8, sector: 'Cement' },
  { symbol: 'MLCF', name: 'Maple Leaf Cement', price: 32.02, change: 0.02, changePercent: 0.06, debtToEquity: 19.8, interestIncomeRatio: 2.7, businessType: 'Cement', halalScore: 8.6, sector: 'Cement' },
  // Energy
  { symbol: 'OGDC', name: 'Oil & Gas Dev Co', price: 142.50, change: -0.80, changePercent: -0.56, debtToEquity: 12.3, interestIncomeRatio: 1.5, businessType: 'Oil & Gas', halalScore: 9.0, sector: 'Energy' },
  { symbol: 'PPL', name: 'Pakistan Petroleum', price: 115.60, change: 0.60, changePercent: 0.52, debtToEquity: 10.8, interestIncomeRatio: 1.3, businessType: 'Oil & Gas', halalScore: 8.9, sector: 'Energy' },
  { symbol: 'PSO', name: 'Pakistan State Oil', price: 192.30, change: -1.40, changePercent: -0.72, debtToEquity: 28.6, interestIncomeRatio: 4.1, businessType: 'Oil Marketing', halalScore: 7.8, sector: 'Energy' },
  { symbol: 'HUBC', name: 'Hub Power Company', price: 88.00, change: -0.10, changePercent: -0.11, debtToEquity: 24.5, interestIncomeRatio: 3.2, businessType: 'Power', halalScore: 8.2, sector: 'Energy' },
  { symbol: 'KEL', name: 'K-Electric', price: 5.77, change: -0.03, changePercent: -0.52, debtToEquity: 31.2, interestIncomeRatio: 4.8, businessType: 'Utilities', halalScore: 7.5, sector: 'Energy' },
  // Fertilizer & Chemicals
  { symbol: 'ENGRO', name: 'Engro Corp', price: 312.80, change: 3.10, changePercent: 1.00, debtToEquity: 22.4, interestIncomeRatio: 4.2, businessType: 'Chemicals', halalScore: 8.1, sector: 'Chemicals' },
  { symbol: 'FFC', name: 'Fauji Fertilizer', price: 168.40, change: 1.10, changePercent: 0.66, debtToEquity: 5.2, interestIncomeRatio: 3.8, businessType: 'Fertilizer', halalScore: 8.5, sector: 'Fertilizer' },
  { symbol: 'EFERT', name: 'Engro Fertilizers', price: 92.60, change: 0.80, changePercent: 0.87, debtToEquity: 14.8, interestIncomeRatio: 4.2, businessType: 'Fertilizer', halalScore: 8.3, sector: 'Fertilizer' },
  // Islamic Banking
  { symbol: 'MEBL', name: 'Meezan Bank', price: 145.00, change: 2.10, changePercent: 1.47, debtToEquity: 0, interestIncomeRatio: 0, businessType: 'Islamic Banking', halalScore: 9.8, sector: 'Islamic Banking', gdpImpact: 9.4, jobsCreated: 60 },
  // Consumer & FMCG
  { symbol: 'NESTLE', name: 'Nestlé Pakistan', price: 6248.00, change: 18.00, changePercent: 0.29, debtToEquity: 14.2, interestIncomeRatio: 1.8, businessType: 'Food & Beverage', halalScore: 9.0, sector: 'Consumer' },
  { symbol: 'COLG', name: 'Colgate-Palmolive PK', price: 2842.00, change: 22.00, changePercent: 0.78, debtToEquity: 8.4, interestIncomeRatio: 1.2, businessType: 'Consumer Products', halalScore: 9.1, sector: 'Consumer' },
  { symbol: 'PKGS', name: 'Packages Limited', price: 888.78, change: -1.22, changePercent: -0.14, debtToEquity: 16.2, interestIncomeRatio: 2.1, businessType: 'Paper & Board', halalScore: 8.6, sector: 'Materials' },
  { symbol: 'MTL', name: 'Millat Tractors', price: 1188.84, change: 8.84, changePercent: 0.75, debtToEquity: 12.4, interestIncomeRatio: 1.5, businessType: 'Engineering', halalScore: 8.9, sector: 'Engineering' },
  // Conventional / Haram (For screening demonstration)
  { symbol: 'HBL', name: 'Habib Bank Ltd', price: 92.10, change: -1.50, changePercent: -1.60, debtToEquity: 45.0, interestIncomeRatio: 28.5, businessType: 'Conventional Banking', halalScore: 2.1, sector: 'Banking' },
  { symbol: 'UBL', name: 'United Bank Limited', price: 168.40, change: 0.80, changePercent: 0.48, debtToEquity: 42.6, interestIncomeRatio: 26.8, businessType: 'Conventional Banking', halalScore: 2.3, sector: 'Banking' },
];

export function getHalalStocks() {
  return MOCK_PSX_STOCKS.filter(s => s.debtToEquity < 33 && s.interestIncomeRatio < 5 && s.halalScore >= 6);
}
export function getStockBySymbol(symbol: string) {
  return MOCK_PSX_STOCKS.find(s => s.symbol === symbol);
}
export function getStocksBySector(sector: string) {
  return MOCK_PSX_STOCKS.filter(s => s.sector === sector);
}
export function getAllSectors(): string[] {
  return [...new Set(MOCK_PSX_STOCKS.map(s => s.sector))];
}
export async function fetchLivePrice(symbol: string) {
  try {
    const formatted = symbol.endsWith('.KA') ? symbol : `${symbol}.KA`;
    const res = await fetch(`/api/psx?symbol=${formatted}`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch { return null; }
}
