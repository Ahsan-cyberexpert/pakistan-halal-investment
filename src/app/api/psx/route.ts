import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'SYS.KA';

  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) throw new Error('Yahoo Finance fetch failed');

    const data = await response.json();
    const result = data?.chart?.result?.[0];

    if (!result) throw new Error('No data found');

    const meta = result.meta;
    const price = meta.regularMarketPrice;
    const previousClose = meta.previousClose || meta.chartPreviousClose;
    const change = price - previousClose;
    const changePercent = ((change / previousClose) * 100).toFixed(2);

    return NextResponse.json({
      symbol,
      price: price.toFixed(2),
      previousClose: previousClose.toFixed(2),
      change: change.toFixed(2),
      changePercent,
      currency: meta.currency,
      exchange: meta.exchangeName,
      marketState: meta.marketState,
    });
  } catch (error) {
    // Return mock data as fallback so the app still works
    const mockData: Record<string, any> = {
      'SYS.KA': { price: '415.00', change: '7.47', changePercent: '1.80', previousClose: '407.53' },
      'LUCK.KA': { price: '612.50', change: '14.70', changePercent: '2.40', previousClose: '597.80' },
      'MEBL.KA': { price: '145.00', change: '1.74', changePercent: '1.20', previousClose: '143.26' },
      'TRG.KA': { price: '124.50', change: '6.15', changePercent: '5.20', previousClose: '118.35' },
      'OGDC.KA': { price: '84.20', change: '-0.67', changePercent: '-0.80', previousClose: '84.87' },
    };

    const fallback = mockData[symbol] || { price: '100.00', change: '0.00', changePercent: '0.00', previousClose: '100.00' };

    return NextResponse.json({
      symbol,
      ...fallback,
      currency: 'PKR',
      exchange: 'KAR',
      marketState: 'CLOSED',
      isMock: true,
    });
  }
}
