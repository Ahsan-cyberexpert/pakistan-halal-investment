import { NextRequest, NextResponse } from 'next/server';

// Mock state (replace with DB in production)
let balance = 0;
let transactions: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const { type, amount, method, symbol, recipient } = await req.json();
    
    if (type === 'deposit') {
      balance += amount;
      transactions.unshift({ id: Date.now(), type, amount, method, status: 'success', date: new Date().toISOString() });
      return NextResponse.json({ success: true, newBalance: balance });
    }

    if (type === 'withdraw' || type === 'buy_stock' || type === 'zakat') {
      if (amount > balance) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
      balance -= amount;
      transactions.unshift({ id: Date.now(), type, amount, method, symbol, recipient, status: 'success', date: new Date().toISOString() });
      return NextResponse.json({ success: true, newBalance: balance });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ balance, transactions: transactions.slice(0, 10) });
}
