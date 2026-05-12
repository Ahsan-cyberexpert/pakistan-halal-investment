'use client';
import { useState } from 'react';
import { getHalalStocks, Stock } from '@/lib/halal-stock-data';

interface HalalStockScannerProps {
  balance: number;
  onBuy: (symbol: string, amount: number) => void;
}

export default function HalalStockScanner({ balance, onBuy }: HalalStockScannerProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Stock | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const stocks = getHalalStocks().filter(s =>
    s.symbol.toLowerCase().includes(search.toLowerCase()) ||
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleBuy = async () => {
    if (!selected || !amount) return;
    const val = parseFloat(amount);
    if (val > balance) return alert('ناکافی بیلنس');
    if (val < 100) return alert('کم از کم PKR 100 درج کریں');

    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // Simulate exchange processing
    onBuy(selected.symbol, val);
    setLoading(false);
    setSelected(null);
    setAmount('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">📊 حلال اسٹاک اسکینر</h2>
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Shariah Certified</span>
      </div>

      <input
        type="text"
        placeholder="Search symbol or name (e.g. LUCK, Meezan)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-green-500 outline-none"
      />

      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
        {stocks.map(stock => (
          <div key={stock.symbol} 
               className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-green-50 transition cursor-pointer"
               onClick={() => setSelected(stock)}>
            <div>
              <div className="font-bold text-gray-900">{stock.symbol} <span className="text-sm font-normal text-gray-500">- {stock.name}</span></div>
              <div className="text-xs text-gray-500">{stock.sector} • Debt: {stock.debtToEquity}% • Int: {stock.interestIncomeRatio}%</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">PKR {stock.price}</div>
              <div className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stock.change >= 0 ? '▲' : '▼'} {stock.change}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
          <h3 className="font-bold text-green-800 mb-2">Buy {selected.symbol}</h3>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="PKR Amount (min 100)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
            <button
              onClick={handleBuy}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium whitespace-nowrap"
            >
              {loading ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
          <p className="text-xs text-green-700 mt-2">
            ✅ Halal Score: {selected.halalScore}/10 | 🕌 Certified | ⚠️ Purification: {(selected.interestIncomeRatio * 0.1).toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
}
