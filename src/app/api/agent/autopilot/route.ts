import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { getHalalStocks } from '@/lib/halal-stock-data';

export async function POST(request: Request) {
  try {
    const { action } = await request.json();
    const db = getDb();
    const halalStocks = getHalalStocks();

    if (action === 'allocate') {
      const { amount } = await request.json();
      if (db.balance < amount) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
      db.balance -= amount;
      db.waliBalance = (db.waliBalance || 0) + amount;
      saveDb(db);
      return NextResponse.json({ success: true, balance: db.balance, waliBalance: db.waliBalance });
    }

    if (action === 'deallocate') {
      const { amount } = await request.json();
      if (db.waliBalance < amount) return NextResponse.json({ error: 'Insufficient Wali funds' }, { status: 400 });
      db.waliBalance -= amount;
      db.balance += amount;
      saveDb(db);
      return NextResponse.json({ success: true, balance: db.balance, waliBalance: db.waliBalance });
    }

    if (action === 'scan') {
      const recommendations = halalStocks
        .filter(s => s.halalScore >= 8.5 && s.change > -2.0)
        .sort((a, b) => (b.halalScore + b.change) - (a.halalScore + a.change))
        .slice(0, 3);

      return NextResponse.json({
        recommendations,
        waliBalance: db.waliBalance,
        message: 'I have scanned the PSX and identified high-purity, stable Shariah-compliant opportunities.',
        urduMessage: 'میں نے پی ایس ایکس کو اسکین کیا ہے اور اعلیٰ پاکیزگی اور مستحکم شریعت کے مطابق مواقع کی نشاندہی کی ہے۔'
      });
    }

    if (action === 'invest') {
      const { symbol } = await request.json();
      if (!db.waliBalance || db.waliBalance <= 0) {
        return NextResponse.json({ error: 'No funds in Wali Vault.' }, { status: 400 });
      }

      const stock = halalStocks.find(s => s.symbol === symbol);
      if (!stock) return NextResponse.json({ error: 'Stock not found' }, { status: 404 });

      // Risk Rule: Max 20% of vault per trade for better safety
      const investAmount = Math.min(db.waliBalance * 0.20, db.waliBalance);
      const quantity = Math.floor(investAmount / stock.price);
      
      if (quantity <= 0) return NextResponse.json({ error: 'Vault balance too low for this unit price.' }, { status: 400 });

      const totalCost = quantity * stock.price;

      db.waliBalance -= totalCost;
      
      const existingHolding = db.holdings.find((h: any) => h.symbol === stock.symbol);
      if (existingHolding) {
        // Harvesting Logic: If there was profit in existing holding, move it to main balance
        const holdQty = existingHolding.quantity ?? existingHolding.units ?? 0;
        const holdAvg = existingHolding.avgPrice ?? existingHolding.currentPrice ?? stock.price;
        const currentVal = holdQty * stock.price;
        const costBasis = holdQty * holdAvg;
        if (currentVal > costBasis) {
          const profit = currentVal - costBasis;
          db.balance += profit; // Profit goes to main wallet automatically!
          existingHolding.avgPrice = stock.price; // Reset cost basis after harvesting profit
        }
        
        existingHolding.quantity = holdQty + quantity;
        existingHolding.units = holdQty + quantity;
        existingHolding.invested = (existingHolding.invested || 0) + totalCost;
      } else {
        db.holdings.push({
          symbol: stock.symbol,
          name: stock.name,
          units: quantity,
          quantity,
          invested: totalCost,
          avgPrice: stock.price,
          currentPrice: stock.price,
          pnl: 0,
          sector: stock.sector,
          isWali: true // Mark as managed by Wali
        });
      }

      db.transactions.push({
        id: Date.now(),
        type: 'wali_investment',
        amount: totalCost,
        symbol: stock.symbol,
        status: 'success',
        date: new Date().toISOString()
      });

      saveDb(db);
      return NextResponse.json({
        success: true,
        stock,
        amount: totalCost,
        balance: db.balance,
        waliBalance: db.waliBalance,
        message: `Invested PKR ${totalCost.toLocaleString()} in ${stock.name}. Profit harvesting is active.`,
        urduMessage: `${stock.name} میں ${totalCost.toLocaleString()} روپے کی سرمایہ کاری کی گئی۔ منافع خود بخود مین والٹ میں منتقل کر دیا جائے گا۔`
      });
    }

    return NextResponse.json({ message: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
