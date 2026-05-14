import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'SYS.KA';

  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    const data = await response.json();
    const result = data.chart.result[0];
    
    return NextResponse.json({
      symbol: result.meta.symbol,
      price: result.meta.regularMarketPrice,
      currency: result.meta.currency,
      exchange: result.meta.exchangeName,
      change: result.meta.regularMarketPrice - result.meta.chartPreviousClose,
      changePercent: ((result.meta.regularMarketPrice - result.meta.chartPreviousClose) / result.meta.chartPreviousClose) * 100
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch PSX data' }, { status: 500 });
  }
}
