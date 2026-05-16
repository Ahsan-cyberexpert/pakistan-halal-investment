import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  return NextResponse.json({
    totalVault: db.globalZakatVault,
    userContributions: db.userZakatContributions,
    recentImpacts: [
      { id: 1, type: 'Medical', amount: 45000, location: 'Peshawar', status: 'delivered', date: new Date().toISOString() },
      { id: 2, type: 'Education', amount: 12000, location: 'Quetta', status: 'in-transit', date: new Date().toISOString() },
      { id: 3, type: 'Ration', amount: 8000, location: 'Lahore', status: 'verified', date: new Date().toISOString() },
    ]
  });
}

export async function POST(request: Request) {
  const { amount } = await request.json();
  const db = getDb();

  if (db.balance < amount) {
    return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
  }

  // 1. Deduct from user balance
  db.balance -= amount;
  
  // 2. Add to National Vault
  db.globalZakatVault = (db.globalZakatVault || 0) + amount;
  
  // 3. Track user contribution
  const contribution = {
    id: Date.now(),
    amount,
    date: new Date().toISOString(),
    status: 'vaulted', // Money is now in the Roziq Central Vault
    remaining: amount,
    impacts: [] // This will be populated as money is spent
  };
  
  db.userZakatContributions = db.userZakatContributions || [];
  db.userZakatContributions.push(contribution);
  
  db.transactions.push({
    id: Date.now(),
    type: 'zakat_vault',
    amount,
    status: 'success',
    date: new Date().toISOString(),
    note: 'Contributed to Roziq National Zakat Vault'
  });

  saveDb(db);
  return NextResponse.json({ success: true, balance: db.balance, totalVault: db.globalZakatVault });
}
