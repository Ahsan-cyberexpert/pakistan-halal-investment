export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number; // Daily % change
  debtToEquity: number; // %
  interestIncomeRatio: number; // %
  businessType: string;
  halalScore: number; // 1-10
  sector: string;
}

// Realistic PSX dataset with authentic Shariah metrics
export const MOCK_PSX_STOCKS: Stock[] = [
  { symbol: 'LUCK', name: 'Lucky Cement', price: 612.50, change: 2.4, debtToEquity: 18.5, interestIncomeRatio: 2.1, businessType: 'Cement & Power', halalScore: 9.2, sector: 'Cement' },
  { symbol: 'OGDC', name: 'Oil & Gas Dev Co', price: 84.20, change: -0.8, debtToEquity: 12.3, interestIncomeRatio: 1.5, businessType: 'Oil & Gas', halalScore: 8.8, sector: 'Energy' },
  { symbol: 'MEBL', name: 'Meezan Bank', price: 145.00, change: 1.2, debtToEquity: 0, interestIncomeRatio: 0, businessType: 'Islamic Banking', halalScore: 9.8, sector: 'Banking' },
  { symbol: 'FFC', name: 'Fauji Fertilizer', price: 168.40, change: 0.5, debtToEquity: 5.2, interestIncomeRatio: 3.8, businessType: 'Fertilizer', halalScore: 8.5, sector: 'Fertilizer' },
  { symbol: 'HBL', name: 'Habib Bank Ltd', price: 92.10, change: -1.5, debtToEquity: 45.0, interestIncomeRatio: 28.5, businessType: 'Conventional Banking', halalScore: 2.1, sector: 'Banking' },
  { symbol: 'ENGRO', name: 'Engro Corp', price: 312.80, change: 3.1, debtToEquity: 22.4, interestIncomeRatio: 4.2, businessType: 'Chemicals', halalScore: 7.9, sector: 'Chemicals' },
  { symbol: 'TRG', name: 'TRG Pakistan', price: 124.50, change: 5.2, debtToEquity: 8.1, interestIncomeRatio: 1.2, businessType: 'IT Services', halalScore: 9.5, sector: 'Technology' },
  { symbol: 'BAFL', name: 'Bank Alfalah', price: 48.90, change: -2.1, debtToEquity: 38.2, interestIncomeRatio: 25.4, businessType: 'Conventional Banking', halalScore: 2.5, sector: 'Banking' },
  { symbol: 'SYS', name: 'Systems Ltd', price: 415.00, change: 1.8, debtToEquity: 4.5, interestIncomeRatio: 0.8, businessType: 'Software', halalScore: 9.1, sector: 'Technology' },
  { symbol: 'PIOC', name: 'Pioneer Cement', price: 98.30, change: -0.5, debtToEquity: 15.2, interestIncomeRatio: 2.9, businessType: 'Cement', halalScore: 8.7, sector: 'Cement' }
];

// Shariah Screening Filter (AAOIFI Standards)
export function getHalalStocks() {
  return MOCK_PSX_STOCKS.filter(s => 
    s.debtToEquity < 33 && 
    s.interestIncomeRatio < 5 && 
    s.halalScore >= 6
  );
}

export function getStockBySymbol(symbol: string) {
  return MOCK_PSX_STOCKS.find(s => s.symbol === symbol);
}

export async function fetchLivePrice(symbol: string) {
  try {
    const formattedSymbol = symbol.endsWith('.KA') ? symbol : `${symbol}.KA`;
    const response = await fetch(`/api/psx?symbol=${formattedSymbol}`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Error fetching live price:', error);
    return null;
  }
}
