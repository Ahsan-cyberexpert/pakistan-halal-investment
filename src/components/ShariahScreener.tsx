'use client';
import { useState, useEffect } from 'react';

const mockStocks = [
  { symbol: 'SYS', name: 'Systems Limited', status: 'Halal', debt: '2.5%', income: '0.1%', shariah: 'Compliant' },
  { symbol: 'LUCK', name: 'Lucky Cement', status: 'Halal', debt: '12.4%', income: '1.2%', shariah: 'Compliant' },
  { symbol: 'MEBL', name: 'Meezan Bank', status: 'Halal', debt: '0%', income: '0%', shariah: 'Islamic Bank' },
  { symbol: 'ENGRO', name: 'Engro Corp', status: 'Halal', debt: '28.1%', income: '4.2%', shariah: 'Compliant' },
  { symbol: 'TRG', name: 'TRG Pakistan', status: 'Halal', debt: '8.1%', income: '1.2%', shariah: 'Compliant' },
  { symbol: 'HBL', name: 'Habib Bank', status: 'Doubtful', debt: 'N/A', income: 'Conventional', shariah: 'Non-Compliant' },
];

export default function ShariahScreener() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [livePrice, setLivePrice] = useState<any>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  useEffect(() => {
    if (!selected) return;
    setLivePrice(null);
    setLoadingPrice(true);

    // Direct client-side fetch to Yahoo Finance (no server route needed)
    const symbol = `${selected.symbol}.KA`;
    fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`)
      .then(r => r.json())
      .then(data => {
        const result = data?.chart?.result?.[0];
        if (result) {
          const price = result.meta.regularMarketPrice;
          const prev = result.meta.chartPreviousClose;
          setLivePrice({
            price,
            changePercent: ((price - prev) / prev) * 100,
          });
        }
      })
      .catch(() => setLivePrice(null))
      .finally(() => setLoadingPrice(false));
  }, [selected]);

  const filtered = mockStocks.filter(s =>
    s.symbol.toLowerCase().includes(query.toLowerCase()) ||
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="premium-card p-8">
      <div className="mb-8">
        <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Stock Guard</h3>
        <p className="text-2xl font-black text-slate-800 tracking-tighter">Shariah Screener</p>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search Symbol (e.g. LUCK, SYS)..."
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 text-lg">🔍</span>
      </div>

      <div className="space-y-3">
        {query && filtered.map(s => (
          <button
            key={s.symbol}
            onClick={() => setSelected(s)}
            className="w-full flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-50 hover:border-emerald-100 hover:shadow-lg transition-all text-left"
          >
            <div>
              <div className="font-black text-slate-800">{s.symbol}</div>
              <div className="text-xs font-bold text-slate-400 uppercase">{s.name}</div>
            </div>
            <div className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${
              s.status === 'Halal' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}>
              {s.status}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="text-xl font-black tracking-tighter">{selected.name}</h4>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Compliance Audit</p>
                {loadingPrice && <span className="text-xs text-slate-500 font-bold animate-pulse">Fetching demo price...</span>}
                {livePrice && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                    livePrice.changePercent >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    DEMO: PKR {livePrice.price.toLocaleString()} ({livePrice.changePercent >= 0 ? '+' : ''}{livePrice.changePercent.toFixed(2)}%)
                  </span>
                )}
              </div>
            </div>
            <button onClick={() => { setSelected(null); setLivePrice(null); }} className="text-slate-500 hover:text-white text-2xl">✕</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Debt Ratio</div>
              <div className="text-lg font-black">{selected.debt}</div>
              <div className="text-xs text-emerald-500 font-bold uppercase mt-1">Limit: &lt;33%</div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Impure Income</div>
              <div className="text-lg font-black">{selected.income}</div>
              <div className="text-xs text-emerald-500 font-bold uppercase mt-1">Limit: &lt;5%</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl flex items-center gap-3">
            <span className="text-xl text-emerald-400">🛡️</span>
            <p className="text-xs font-bold leading-relaxed">
              This stock is <strong>{selected.shariah}</strong> according to the latest Shariah audit.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
