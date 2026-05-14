import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  return NextResponse.json(db);
}

export async function POST(req: NextRequest) {
  try {
    const { type, amount, symbol, name, units, recipient } = await req.json();
    
    // Security: Prevent negative or zero amounts
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const db = getDb();

    // 1. Validate Balance for outflows
    if (['withdraw', 'buy_stock', 'buy_sukuk', 'zakat'].includes(type)) {
      if (amount > db.balance) {
        return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
      }
    }

    // 2. Process Transaction
    if (type === 'deposit') {
      db.balance += amount;
    } else if (['withdraw', 'zakat'].includes(type)) {
      db.balance -= amount;
      if (type === 'zakat') {
        db.zakatHistory.unshift({ date: new Date().toISOString(), amount, recipient });
      }
    } else if (type === 'buy_stock') {
      db.balance -= amount;
      const existing = db.holdings.find((h: any) => h.symbol === symbol);
      if (existing) {
        existing.units += units;
        existing.invested += amount;
      } else {
        db.holdings.push({ symbol, name, invested: amount, units, currentPrice: amount / units, pnl: 0 });
      }
    } else if (type === 'buy_sukuk') {
      db.balance -= amount;
      // Fractional Sukuks are added as a holding type
      db.holdings.push({ symbol: 'SUKUK', name: 'Fractional Sukuk', invested: amount, units: 1, currentPrice: amount, pnl: 0 });
    }

    // 3. Log Transaction
    db.transactions.unshift({
      id: Date.now(),
      type,
      amount,
      symbol,
      recipient,
      status: 'success',
      date: new Date().toISOString()
    });

    saveDb(db);
    return NextResponse.json({ success: true, ...db });
  } catch (e) {
    console.error('Transaction Error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
