export interface Stock {
  symbol: string; name: string; price: number; change: number;
  debtToEquity: number; interestIncomeRatio: number;
  businessType: string; halalScore: number; sector: string;
  gdpImpact: number; // Scale of 1-10 on national contribution
  jobsCreated: number; // Estimated jobs supported per 1M PKR invested
}

export const MOCK_PSX_STOCKS: Stock[] = [
  // Technology
  { symbol: 'SYS', name: 'Systems Ltd', price: 415.00, change: 1.8, debtToEquity: 4.5, interestIncomeRatio: 0.8, businessType: 'Software', halalScore: 9.1, sector: 'Technology', gdpImpact: 9.5, jobsCreated: 120 },
  { symbol: 'TRG', name: 'TRG Pakistan', price: 124.50, change: 5.2, debtToEquity: 8.1, interestIncomeRatio: 1.2, businessType: 'IT Services', halalScore: 9.5, sector: 'Technology' },
  { symbol: 'NETSOL', name: 'NetSol Technologies', price: 78.40, change: 2.1, debtToEquity: 6.2, interestIncomeRatio: 0.5, businessType: 'Software', halalScore: 9.3, sector: 'Technology' },
  { symbol: 'AVN', name: 'Avanceon Ltd', price: 52.30, change: -0.8, debtToEquity: 9.4, interestIncomeRatio: 1.1, businessType: 'IT Services', halalScore: 8.9, sector: 'Technology' },
  // Cement
  { symbol: 'LUCK', name: 'Lucky Cement', price: 612.50, change: 2.4, debtToEquity: 18.5, interestIncomeRatio: 2.1, businessType: 'Cement', halalScore: 9.2, sector: 'Cement' },
  { symbol: 'PIOC', name: 'Pioneer Cement', price: 98.30, change: -0.5, debtToEquity: 15.2, interestIncomeRatio: 2.9, businessType: 'Cement', halalScore: 8.7, sector: 'Cement' },
  { symbol: 'DGKC', name: 'DG Khan Cement', price: 88.60, change: 1.1, debtToEquity: 22.4, interestIncomeRatio: 3.2, businessType: 'Cement', halalScore: 8.4, sector: 'Cement' },
  { symbol: 'MLCF', name: 'Maple Leaf Cement', price: 44.20, change: -1.2, debtToEquity: 19.8, interestIncomeRatio: 2.7, businessType: 'Cement', halalScore: 8.6, sector: 'Cement' },
  { symbol: 'KOHC', name: 'Kohat Cement', price: 132.40, change: 0.9, debtToEquity: 14.6, interestIncomeRatio: 2.2, businessType: 'Cement', halalScore: 8.9, sector: 'Cement' },
  { symbol: 'CHCC', name: 'Cherat Cement', price: 116.80, change: 1.6, debtToEquity: 16.3, interestIncomeRatio: 2.5, businessType: 'Cement', halalScore: 8.8, sector: 'Cement' },
  // Energy
  { symbol: 'OGDC', name: 'Oil & Gas Dev Co', price: 84.20, change: -0.8, debtToEquity: 12.3, interestIncomeRatio: 1.5, businessType: 'Oil & Gas', halalScore: 8.8, sector: 'Energy' },
  { symbol: 'PPL', name: 'Pakistan Petroleum', price: 74.60, change: 0.6, debtToEquity: 10.8, interestIncomeRatio: 1.3, businessType: 'Oil & Gas', halalScore: 8.9, sector: 'Energy' },
  { symbol: 'MARI', name: 'Mari Petroleum', price: 1842.50, change: 1.2, debtToEquity: 8.4, interestIncomeRatio: 1.0, businessType: 'Oil & Gas', halalScore: 9.1, sector: 'Energy' },
  { symbol: 'POL', name: 'Pakistan Oilfields', price: 412.80, change: 0.4, debtToEquity: 5.2, interestIncomeRatio: 0.9, businessType: 'Oil & Gas', halalScore: 9.3, sector: 'Energy' },
  { symbol: 'PSO', name: 'Pakistan State Oil', price: 192.30, change: -1.4, debtToEquity: 28.6, interestIncomeRatio: 4.1, businessType: 'Oil Marketing', halalScore: 7.8, sector: 'Energy' },
  // Fertilizer
  { symbol: 'FFC', name: 'Fauji Fertilizer', price: 168.40, change: 0.5, debtToEquity: 5.2, interestIncomeRatio: 3.8, businessType: 'Fertilizer', halalScore: 8.5, sector: 'Fertilizer' },
  { symbol: 'EFERT', name: 'Engro Fertilizers', price: 92.60, change: 1.3, debtToEquity: 14.8, interestIncomeRatio: 4.2, businessType: 'Fertilizer', halalScore: 8.2, sector: 'Fertilizer' },
  { symbol: 'FATIMA', name: 'Fatima Fertilizer', price: 48.20, change: 0.7, debtToEquity: 16.4, interestIncomeRatio: 4.0, businessType: 'Fertilizer', halalScore: 8.3, sector: 'Fertilizer' },
  // Chemicals
  { symbol: 'ENGRO', name: 'Engro Corp', price: 312.80, change: 3.1, debtToEquity: 22.4, interestIncomeRatio: 4.2, businessType: 'Chemicals', halalScore: 7.9, sector: 'Chemicals' },
  { symbol: 'ICI', name: 'ICI Pakistan', price: 682.30, change: 1.8, debtToEquity: 11.2, interestIncomeRatio: 2.1, businessType: 'Chemicals', halalScore: 8.7, sector: 'Chemicals' },
  // Islamic Banking
  { symbol: 'MEBL', name: 'Meezan Bank', price: 145.00, change: 1.2, debtToEquity: 0, interestIncomeRatio: 0, businessType: 'Islamic Banking', halalScore: 9.8, sector: 'Islamic Banking', gdpImpact: 9.4, jobsCreated: 60 },
  { symbol: 'BIPL', name: 'BankIslami Pakistan', price: 24.80, change: 0.4, debtToEquity: 0, interestIncomeRatio: 0, businessType: 'Islamic Banking', halalScore: 9.7, sector: 'Islamic Banking' },
  { symbol: 'DIL', name: 'Dubai Islamic Bank PK', price: 19.40, change: 0.6, debtToEquity: 0, interestIncomeRatio: 0, businessType: 'Islamic Banking', halalScore: 9.6, sector: 'Islamic Banking' },
  // Consumer Goods
  { symbol: 'NESTLE', name: 'Nestlé Pakistan', price: 6248.00, change: 0.6, debtToEquity: 14.2, interestIncomeRatio: 1.8, businessType: 'Food & Beverage', halalScore: 9.0, sector: 'Consumer' },
  { symbol: 'COLG', name: 'Colgate-Palmolive PK', price: 2842.00, change: 0.9, debtToEquity: 8.4, interestIncomeRatio: 1.2, businessType: 'Consumer Products', halalScore: 9.1, sector: 'Consumer' },
  { symbol: 'UNITY', name: 'Unity Foods', price: 24.60, change: 1.2, debtToEquity: 20.4, interestIncomeRatio: 3.1, businessType: 'Food Processing', halalScore: 8.2, sector: 'Consumer' },
  // Pharma
  { symbol: 'ABOT', name: 'Abbott Laboratories PK', price: 842.60, change: 0.4, debtToEquity: 6.8, interestIncomeRatio: 0.9, businessType: 'Pharmaceuticals', halalScore: 9.2, sector: 'Pharma' },
  { symbol: 'SEARL', name: 'Searle Pakistan', price: 242.80, change: 1.2, debtToEquity: 9.4, interestIncomeRatio: 1.4, businessType: 'Pharmaceuticals', halalScore: 9.0, sector: 'Pharma' },
  { symbol: 'GLAXO', name: 'GlaxoSmithKline PK', price: 148.60, change: -0.8, debtToEquity: 7.6, interestIncomeRatio: 1.1, businessType: 'Pharmaceuticals', halalScore: 9.1, sector: 'Pharma' },
  // Textile
  { symbol: 'NML', name: 'Nishat Mills', price: 128.40, change: 1.1, debtToEquity: 22.8, interestIncomeRatio: 4.2, businessType: 'Textile', halalScore: 8.0, sector: 'Textile' },
  { symbol: 'GATM', name: 'Gul Ahmed Textile', price: 92.80, change: 1.4, debtToEquity: 21.6, interestIncomeRatio: 4.0, businessType: 'Textile', halalScore: 8.1, sector: 'Textile' },
  { symbol: 'NCL', name: 'Nishat (Chunian)', price: 48.60, change: 0.8, debtToEquity: 24.6, interestIncomeRatio: 4.6, businessType: 'Textile', halalScore: 7.8, sector: 'Textile' },
  // Steel
  { symbol: 'ISL', name: 'International Steels', price: 112.40, change: 0.6, debtToEquity: 24.2, interestIncomeRatio: 4.2, businessType: 'Steel', halalScore: 7.9, sector: 'Materials' },
  { symbol: 'ASTL', name: 'Amreli Steels', price: 48.20, change: 1.8, debtToEquity: 28.6, interestIncomeRatio: 4.8, businessType: 'Steel', halalScore: 7.7, sector: 'Materials' },
  // HARAM — for screening demos
  { symbol: 'HBL', name: 'Habib Bank Ltd', price: 92.10, change: -1.5, debtToEquity: 45.0, interestIncomeRatio: 28.5, businessType: 'Conventional Banking', halalScore: 2.1, sector: 'Banking' },
  { symbol: 'UBL', name: 'United Bank Limited', price: 168.40, change: 0.8, debtToEquity: 42.6, interestIncomeRatio: 26.8, businessType: 'Conventional Banking', halalScore: 2.3, sector: 'Banking' },
  { symbol: 'MCB', name: 'MCB Bank', price: 186.40, change: 1.2, debtToEquity: 40.8, interestIncomeRatio: 27.2, businessType: 'Conventional Banking', halalScore: 2.2, sector: 'Banking' },
  { symbol: 'BAFL', name: 'Bank Alfalah', price: 48.90, change: -2.1, debtToEquity: 38.2, interestIncomeRatio: 25.4, businessType: 'Conventional Banking', halalScore: 2.5, sector: 'Banking' },
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
