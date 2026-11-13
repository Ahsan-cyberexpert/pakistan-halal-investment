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
      <div className="space-y-2.5 sm:space-y-3">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="bg-white dark:bg-[#15181F] rounded-2xl sm:rounded-3xl p-3 sm:p-4 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-3.5 bg-[#E8EDEA] dark:bg-[#232936] rounded w-24" />
                <div className="h-2.5 bg-[#E8EDEA] dark:bg-[#232936] rounded w-32" />
              </div>
              <div className="h-5 bg-[#E8EDEA] dark:bg-[#232936] rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-50 dark:bg-emerald-950/600 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-xs font-bold text-slate-400">Market feed · {lastUpdated}</span>
        </div>
        <button onClick={fetchStocks} className="text-xs text-emerald-600 font-bold hover:underline">↻ Refresh</button>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
        <input
          type="text"
          placeholder="Search stocks..."
          aria-label="Search PSX stocks"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2 sm:py-2.5 rounded-xl border border-[#E3ECE7] dark:border-[#262B35] focus:border-emerald-400 outline-none text-xs font-medium shadow-inner"
        />
      </div>

      {error && <p className="text-amber-600 text-xs font-medium bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 rounded-xl">{error}</p>}

      {/* Stock List — Contained in a streamlined scrollable box */}
      <div className="space-y-1.5 max-h-[300px] sm:max-h-[360px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
        {filtered.map(stock => (
          <div key={stock.symbol}>
            <button
              onClick={() => setSelectedStock(selectedStock?.symbol === stock.symbol ? null : stock)}
              className={`w-full flex justify-between items-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all duration-150 active:scale-95 ${
                selectedStock?.symbol === stock.symbol
                  ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 shadow-sm shadow-emerald-100'
                  : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-emerald-500/50 hover:shadow-sm text-slate-900 dark:text-white'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-2.5 text-left">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#E8EDEA] dark:bg-[#232936] flex items-center justify-center font-black text-xs text-[#374151] dark:text-[#CBD5E1] flex-shrink-0">
                  {stock.symbol.slice(0,3)}
                </div>
                <div>
                  <div className="font-black text-[#0B1F17] dark:text-[#F0F4F2] text-xs tracking-tight">{stock.symbol}</div>
                  <div className="text-xs text-slate-400 truncate max-w-[130px] sm:max-w-none">{stock.name} · {stock.sector}</div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-black text-[#0B1F17] dark:text-[#F0F4F2] text-xs">₨{stock.price.toLocaleString()}</div>
                <div className={`text-xs font-bold ${stock.changePercent >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stock.changePercent >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
                </div>
              </div>
            </button>

            {/* Inline Buy Panel */}
            {selectedStock?.symbol === stock.symbol && (
              <div className="mt-1 mx-0.5 bg-white dark:bg-[#15181F] border border-emerald-200 rounded-2xl p-3.5 sm:p-4 space-y-2.5 sm:space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-md">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Your Balance</span>
                  <span className="font-black text-emerald-600">₨{balance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Price/Share</span>
                  <span className="font-black">₨{stock.price.toLocaleString()}</span>
                </div>
                <div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">₨</span>
                    <input
                      type="number"
                      placeholder="Investment amount (PKR)"
                      inputMode="decimal"
                      value={buyAmount}
                      onChange={e => setBuyAmount(e.target.value)}
                      className="w-full pl-6 pr-3 py-2 rounded-xl border border-[#E3ECE7] dark:border-[#262B35] focus:border-emerald-400 outline-none font-bold text-[#0B1F17] dark:text-[#F0F4F2] text-xs"
                    />
                  </div>
                  {buyAmount && parseFloat(buyAmount) > 0 && (
                    <p className="text-xs text-slate-400 mt-1 pl-1 font-medium">
                      ≈ {(parseFloat(buyAmount) / stock.price).toFixed(2)} shares
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { setSelectedStock(null); setBuyAmount(''); }} className="py-2 rounded-xl border border-[#E3ECE7] dark:border-[#262B35] font-black text-slate-600 hover:bg-[#F4F7F5] dark:bg-[#1C2029] active:scale-95 transition-all text-xs">Cancel</button>
                  <button
                    onClick={handleBuy}
                    disabled={buying || !buyAmount || parseFloat(buyAmount) > balance}
                    className="py-2 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-700 disabled:opacity-50 active:scale-95 transition-all text-xs shadow-md"
                  >
                    {buying ? 'Processing...' : 'Buy Shares'}
                  </button>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
