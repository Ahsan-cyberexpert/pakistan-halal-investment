import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

// GET: Return current wallet state
export async function GET() {
  const db = getDb();
  return NextResponse.json(db);
}

// POST: Process a transaction
export async function POST(request: Request) {
  const db = getDb();
  const data = await request.json();
  const { type, amount, symbol, name, units, recipient } = data;

  const txId = Date.now();
  const now = new Date().toISOString();

  switch (type) {
    case 'deposit': {
      db.balance += amount;
      db.transactions.unshift({
        id: txId,
        type: 'deposit',
        amount,
        method: data.method || 'Transfer',
        status: 'success',
        date: now,
      });
      break;
    }

    case 'withdraw': {
      if (db.balance < amount) {
        return NextResponse.json({ success: false, error: 'Insufficient balance' }, { status: 400 });
      }
      db.balance -= amount;
      db.transactions.unshift({
        id: txId,
        type: 'withdraw',
        amount,
        method: data.method || 'Transfer',
        status: 'success',
        date: now,
      });
      break;
    }

    case 'buy_stock': {
      if (db.balance < amount) {
        return NextResponse.json({ success: false, error: 'Insufficient balance' }, { status: 400 });
      }
      db.balance -= amount;

      // Update or add holding
      const existingHolding = db.holdings.find((h: any) => h.symbol === symbol);
      if (existingHolding) {
        existingHolding.invested += amount;
        existingHolding.units += units;
        existingHolding.pnl = existingHolding.invested * 0.04; // 4% simulated gain
      } else {
        db.holdings.push({
          symbol,
          name,
          invested: amount,
          currentPrice: amount / units,
          units,
          pnl: amount * 0.04,
        });
      }

      db.transactions.unshift({
        id: txId,
        type: 'buy_stock',
        amount,
        symbol,
        name,
        units,
        status: 'success',
        date: now,
      });
      break;
    }

    case 'buy_sukuk': {
      if (db.balance < amount) {
        return NextResponse.json({ success: false, error: 'Insufficient balance' }, { status: 400 });
      }
      db.balance -= amount;

      const sukukHolding = db.holdings.find((h: any) => h.symbol === 'SUKUK');
      if (sukukHolding) {
        sukukHolding.invested += amount;
        sukukHolding.units += amount / 1000;
        sukukHolding.pnl = sukukHolding.invested * 0.085;
      } else {
        db.holdings.push({
          symbol: 'SUKUK',
          name: 'GOP Ijarah Sukuk',
          invested: amount,
          currentPrice: 1000,
          units: amount / 1000,
          pnl: amount * 0.085,
        });
      }

      db.transactions.unshift({
        id: txId,
        type: 'buy_sukuk',
        amount,
        symbol: 'SUKUK',
        name: 'GOP Ijarah Sukuk',
        status: 'success',
        date: now,
      });
      break;
    }

    case 'zakat': {
      if (db.balance < amount) {
        return NextResponse.json({ success: false, error: 'Insufficient balance' }, { status: 400 });
      }
      db.balance -= amount;
      db.zakatHistory.unshift({
        date: now,
        amount,
        recipient: recipient || 'General Zakat Fund',
      });
      db.transactions.unshift({
        id: txId,
        type: 'zakat',
        amount,
        recipient: recipient || 'General Zakat Fund',
        status: 'success',
        date: now,
      });
      break;
    }

    default:
      return NextResponse.json({ success: false, error: 'Unknown transaction type' }, { status: 400 });
  }

  saveDb(db);

  return NextResponse.json({
    success: true,
    balance: db.balance,
    transactions: db.transactions,
    holdings: db.holdings,
    zakatHistory: db.zakatHistory,
  });
}
