'use client';

interface Holding {
  symbol: string;
  name: string;
  invested: number;
  currentPrice: number;
  units: number;
  pnl: number;
}

interface PortfolioDashboardProps {
  holdings: Holding[];
  totalValue: number;
  dailyPnl: number;
}

export default function PortfolioDashboard({ holdings, totalValue, dailyPnl }: PortfolioDashboardProps) {
  if (holdings.length === 0) {
    return (
      <div className="premium-card p-10 text-center mb-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner">📈</div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Grow Your Halal Wealth</h3>
          <p className="text-slate-500 text-sm max-w-[240px] mx-auto leading-relaxed">Start investing in Shariah-compliant assets to see your portfolio here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-card p-6 mb-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Portfolio Value</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800">PKR {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-bold text-xs ${dailyPnl >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {dailyPnl >= 0 ? '↗' : '↘'} {Math.abs((dailyPnl / totalValue) * 100).toFixed(2)}%
        </div>
      </div>

      {/* Asset Allocation Bar */}
      <div className="mb-10">
        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
          <span>Asset Allocation</span>
          <span>{holdings.length} Assets</span>
        </div>
        <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden flex shadow-inner border border-slate-100 p-0.5">
          {holdings.map((h, i) => {
            const width = (h.invested / totalValue) * 100;
            const colors = ['bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500'];
            return (
              <div 
                key={h.symbol} 
                style={{ width: `${width}%` }} 
                className={`h-full ${colors[i % colors.length]} rounded-full transition-all duration-700 hover:scale-y-125 cursor-pointer first:ml-0 -ml-1 border-2 border-white`}
                title={`${h.symbol}: ${width.toFixed(1)}%`}
              ></div>
            );
          })}
        </div>
      </div>

      {/* Holdings List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Top Holdings</h3>
        {holdings.map(h => (
          <div key={h.symbol} className="group flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100/50 hover:bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-lg font-black text-emerald-700 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                {h.symbol[0]}
              </div>
              <div>
                <div className="font-black text-slate-800 tracking-tight">{h.symbol}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">{h.units.toFixed(2)} Units</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-black text-slate-800">PKR {(h.invested + h.pnl).toLocaleString()}</div>
              <div className={`text-[10px] font-black uppercase tracking-wider ${h.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {h.pnl >= 0 ? '+' : '-'}{Math.abs(h.pnl).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
