'use client';
import { useState, useEffect, useCallback } from 'react';

interface Stock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  shariahStatus: string;
  isLive: boolean;
}

export default function HalalStockScanner({ balance, onBuy }: { balance: number; onBuy: (symbol: string, amount: number) => void }) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [buyAmount, setBuyAmount] = useState('');
  const [buying, setBuying] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchStocks = useCallback(async () => {
    try {
      const res = await fetch('/api/psx');
      const data = await res.json();
      if (data.stocks) {
        setStocks(data.stocks);
        setIsLive(data.stocks.some((s: Stock) => s.isLive));
        setLastUpdated(new Date(data.lastUpdated).toLocaleTimeString());
      }
    } catch {
      setError('Could not load market data. Showing cached prices.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, [fetchStocks]);

  const filtered = stocks.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.symbol.toLowerCase().includes(search.toLowerCase()) ||
    s.sector.toLowerCase().includes(search.toLowerCase())
  );

  const handleBuy = async () => {
    if (!selectedStock || !buyAmount) return;
    const amount = parseFloat(buyAmount);
    if (amount > balance) { return; }
    setBuying(true);
    await onBuy(selectedStock.symbol, amount);
    setBuying(false);
    setSelectedStock(null);
    setBuyAmount('');
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="bg-white rounded-3xl p-4 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded w-24" />
                <div className="h-3 bg-slate-100 rounded w-32" />
              </div>
              <div className="h-6 bg-slate-100 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-xs font-bold text-slate-400">{isLive ? `Live · ${lastUpdated}` : `Simulated · ${lastUpdated}`}</span>
        </div>
        <button onClick={fetchStocks} className="text-xs text-emerald-600 font-bold hover:underline">↻ Refresh</button>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          type="text"
          placeholder="Search stocks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-400 outline-none text-sm font-medium"
        />
      </div>

      {error && <p className="text-amber-600 text-xs font-medium bg-amber-50 px-4 py-2 rounded-xl">{error}</p>}

      {/* Stock List */}
      <div className="space-y-2">
        {filtered.map(stock => (
          <div key={stock.symbol}>
            <button
              onClick={() => setSelectedStock(selectedStock?.symbol === stock.symbol ? null : stock)}
              className={`w-full flex justify-between items-center p-4 rounded-3xl border-2 transition-all duration-300 active:scale-95 ${
                selectedStock?.symbol === stock.symbol
                  ? 'border-emerald-300 bg-emerald-50 shadow-md shadow-emerald-100'
                  : 'border-slate-100 bg-white hover:border-emerald-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-xs text-slate-700">
                  {stock.symbol.slice(0,3)}
                </div>
                <div>
                  <div className="font-black text-slate-800 text-sm">{stock.symbol}</div>
                  <div className="text-xs text-slate-400">{stock.name} · {stock.sector}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-slate-800">₨{stock.price.toLocaleString()}</div>
                <div className={`text-xs font-bold ${stock.changePercent >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stock.changePercent >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
                </div>
              </div>
            </button>

            {/* Inline Buy Panel */}
            {selectedStock?.symbol === stock.symbol && (
              <div className="mt-1 mx-1 bg-white border-2 border-emerald-200 rounded-3xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-300">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Your Balance</span>
                  <span className="font-black text-emerald-600">₨{balance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Price/Share</span>
                  <span className="font-black">₨{stock.price.toLocaleString()}</span>
                </div>
                <div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">₨</span>
                    <input
                      type="number"
                      placeholder="Investment amount"
                      value={buyAmount}
                      onChange={e => setBuyAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-400 outline-none font-bold text-slate-800"
                    />
                  </div>
                  {buyAmount && parseFloat(buyAmount) > 0 && (
                    <p className="text-xs text-slate-400 mt-1 pl-1">
                      ≈ {(parseFloat(buyAmount) / stock.price).toFixed(2)} shares
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setSelectedStock(null); setBuyAmount(''); }} className="py-3 rounded-2xl border-2 border-slate-200 font-black text-slate-600 hover:bg-slate-50 active:scale-95 transition-all">Cancel</button>
                  <button
                    onClick={handleBuy}
                    disabled={buying || !buyAmount || parseFloat(buyAmount) > balance}
                    className="py-3 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-700 disabled:opacity-50 active:scale-95 transition-all"
                  >
                    {buying ? 'Buying...' : 'Buy ✓'}
                  </button>
                </div>
                <p className="text-center text-xs text-emerald-600 font-medium">✓ AAOIFI Shariah Certified</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
