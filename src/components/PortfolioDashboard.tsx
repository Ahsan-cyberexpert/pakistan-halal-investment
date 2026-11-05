"use client";

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
  onSell?: (holding: Holding) => void;
}

const COLORS = [
  "bg-emerald-500", "bg-teal-500", "bg-cyan-500",
  "bg-blue-500", "bg-indigo-500", "bg-violet-500",
];

export default function PortfolioDashboard({ holdings, totalValue, dailyPnl, onSell }: PortfolioDashboardProps) {
  const formatPKR = (n: number) =>
    n >= 10_000_000
      ? `${(n / 10_000_000).toFixed(2)} Cr`
      : n >= 100_000
      ? `${(n / 100_000).toFixed(1)} L`
      : n.toLocaleString("en-PK", { maximumFractionDigits: 0 });

  if (holdings.length === 0) {
    return (
      <div className="premium-card p-6 sm:p-10 text-center overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 to-transparent pointer-events-none rounded-[2rem]" />
        <div className="relative z-10">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center text-3xl mx-auto mb-4 shadow-inner border border-emerald-100">
            📈
          </div>
          <h3 className="text-base sm:text-lg font-black mb-2" style={{ color: "var(--text-primary)" }}>
            Grow Your Halal Wealth
          </h3>
          <p className="text-sm max-w-xs mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Start investing in Shariah-compliant PSX stocks, Sukuks, or Hajj savings to see your portfolio here.
          </p>
        </div>
      </div>
    );
  }

  const dailyPnlPct = totalValue > 0 ? Math.abs((dailyPnl / totalValue) * 100).toFixed(2) : "0.00";
  const isDailyPositive = dailyPnl >= 0;

  return (
    <div className="premium-card p-5 sm:p-7">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">
            Portfolio Value
          </p>
          <p className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
            ₨{formatPKR(totalValue)}
          </p>
        </div>
        <div
          className={`flex flex-col items-end gap-0.5 px-3 sm:px-4 py-2 rounded-2xl font-bold text-[10px] sm:text-xs border ${
            isDailyPositive
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-red-50 text-red-600 border-red-100"
          }`}
        >
          <div className="flex items-center gap-1 font-black">
            {isDailyPositive ? "▲" : "▼"} {dailyPnlPct}%
          </div>
          <div className="text-[7px] sm:text-[8px] font-black uppercase tracking-tight opacity-60 text-right">
            Portfolio P&L
          </div>
        </div>
      </div>

      {/* Allocation Bar */}
      <div className="mb-5">
        <div
          className="flex justify-between text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          <span>Asset Allocation</span>
          <span>{holdings.length} Holdings</span>
        </div>
        <div
          className="w-full h-3 rounded-full overflow-hidden flex p-0.5 gap-0.5"
          style={{ background: "var(--bg-muted)" }}
        >
          {holdings.map((h, i) => {
            const width = (h.invested / totalValue) * 100;
            return (
              <div
                key={h.symbol}
                style={{ width: `${width}%` }}
                className={`h-full ${COLORS[i % COLORS.length]} rounded-full transition-all duration-700`}
                title={`${h.symbol}: ${width.toFixed(1)}%`}
              />
            );
          })}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
          {holdings.slice(0, 5).map((h, i) => (
            <div key={h.symbol} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${COLORS[i % COLORS.length]}`} />
              <span className="text-[9px] font-bold" style={{ color: "var(--text-muted)" }}>{h.symbol}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Holdings List */}
      <div className="space-y-2">
        <h3
          className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          Holdings
        </h3>
        {holdings.map((h) => {
          const currentVal = h.invested + h.pnl;
          const pnlPct = h.invested > 0 ? ((h.pnl / h.invested) * 100).toFixed(1) : "0.0";
          return (
            <div
              key={h.symbol}
              className="group flex justify-between items-center p-3 sm:p-4 rounded-2xl border transition-all duration-200 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5"
              style={{
                background: "var(--bg-muted)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-sm font-black text-emerald-700 group-hover:scale-105 transition-transform shadow-sm border"
                  style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
                >
                  {h.symbol.slice(0, 3)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xs sm:text-sm tracking-tight" style={{ color: "var(--text-primary)" }}>
                      {h.symbol}
                    </span>
                    {h.isWali && (
                      <span className="bg-emerald-500 text-white text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                        Wali
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-bold uppercase mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {h.units.toFixed(2)} units
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-xs sm:text-sm tracking-tight" style={{ color: "var(--text-primary)" }}>
                  ₨{formatPKR(currentVal)}
                </div>
                <div
                  className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wide ${
                    h.pnl >= 0 ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {h.pnl >= 0 ? "+" : ""}{pnlPct}%
                </div>
                {onSell && <button onClick={() => onSell(h)} className="touch-target mt-1 min-h-0 h-7 rounded-lg px-2 text-[9px] font-black text-amber-700 hover:bg-amber-50">Sell demo</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
