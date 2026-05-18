'use client';

interface Holding {
  symbol: string;
  name: string;
  invested: number;
  currentPrice: number;
  units: number;
  pnl: number;
  isWali?: boolean;
}

interface PortfolioDashboardProps {
  holdings: Holding[];
  totalValue: number;
  dailyPnl: number;
}

export default function PortfolioDashboard({ holdings, totalValue, dailyPnl }: PortfolioDashboardProps) {
  if (holdings.length === 0) {
    return (
      <div className="premium-card p-5 sm:p-8 text-center mb-4 sm:mb-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-3 sm:mb-4 shadow-inner">📈</div>
          <h3 className="text-base sm:text-lg font-black text-slate-800 mb-1 sm:mb-2">Grow Your Halal Wealth</h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-[240px] mx-auto leading-relaxed">Start investing in Shariah-compliant assets to see your portfolio here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-card p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex justify-between items-end mb-4 sm:mb-6">
        <div>
          <h2 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Portfolio Value</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">PKR {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className={`flex flex-col items-end gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-xs ${dailyPnl >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          <div className="flex items-center gap-1 sm:gap-1.5">
            {dailyPnl >= 0 ? '↗' : '↘'} {Math.abs((dailyPnl / totalValue) * 100).toFixed(2)}%
          </div>
          <div className="text-[7px] sm:text-[8px] font-black uppercase tracking-tighter opacity-60">
            1.5% Success Share Applies on Profit
          </div>
        </div>
      </div>

      {/* Asset Allocation Bar */}
      <div className="mb-5 sm:mb-8">
        <div className="flex justify-between text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-2">
          <span>Asset Allocation</span>
          <span>{holdings.length} Assets</span>
        </div>
        <div className="w-full h-3 sm:h-4 bg-slate-50 rounded-full overflow-hidden flex shadow-inner border border-slate-100 p-0.5">
          {holdings.map((h, i) => {
            const width = (h.invested / totalValue) * 100;
            const colors = ['bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500'];
            return (
              <div 
                key={h.symbol} 
                style={{ width: `${width}%` }} 
                className={`h-full ${colors[i % colors.length]} rounded-full transition-all duration-700 hover:scale-y-125 cursor-pointer first:ml-0 -ml-1 border border-white`}
                title={`${h.symbol}: ${width.toFixed(1)}%`}
              ></div>
            );
          })}
        </div>
      </div>

      {/* Holdings List */}
      <div className="space-y-2.5 sm:space-y-3">
        <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">Top Holdings</h3>
        {holdings.map(h => (
          <div key={h.symbol} className="group flex justify-between items-center p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100/50 hover:bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center text-base sm:text-lg font-black text-emerald-700 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                {h.symbol[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-black text-slate-800 text-xs sm:text-sm tracking-tight">{h.symbol}</div>
                  {h.isWali && (
                    <span className="bg-emerald-500 text-white text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                      <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span>
                      Guardian
                    </span>
                  )}
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">{h.units.toFixed(2)} Units</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-black text-slate-800 text-xs sm:text-sm">PKR {(h.invested + h.pnl).toLocaleString()}</div>
              <div className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${h.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {h.pnl >= 0 ? '+' : '-'}{Math.abs(h.pnl).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
