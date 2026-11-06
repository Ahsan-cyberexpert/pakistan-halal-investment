"use client";
import { useState, useMemo } from "react";

interface Holding {
  symbol: string;
  name: string;
  invested: number;
  currentPrice: number;
  units: number;
  pnl: number;
}

interface PortfolioChartProps {
  balance: number;
  holdings: Holding[];
  totalValue: number;
}

export default function PortfolioChart({ balance, holdings, totalValue }: PortfolioChartProps) {
  const [activeRange, setActiveRange] = useState("1M");

  const totalWealth = balance + totalValue;
  const totalPnL = holdings.reduce((s, h) => s + h.pnl, 0);
  const totalInvested = holdings.reduce((s, h) => s + h.invested, 0);
  const pnlPercent = totalInvested > 0 ? ((totalPnL / totalInvested) * 100).toFixed(2) : "0.00";
  const isPnlPositive = totalPnL >= 0;

  const formatPKR = (n: number) =>
    n >= 10_000_000
      ? `${(n / 10_000_000).toFixed(2)} Cr`
      : n >= 100_000
      ? `${(n / 100_000).toFixed(1)} L`
      : n.toLocaleString("en-PK", { maximumFractionDigits: 0 });

  // Simulated chart data based on real portfolio values
  const chartData = useMemo(() => {
    const base = totalWealth > 0 ? totalWealth : 5_000_000;
    const growthFactor = 1 + (totalPnL / (base || 1)) * 0.5;
    const seed = [0.78, 0.82, 0.79, 0.87, 0.85, 0.92, 0.96, 1.0];
    return seed.map((v) => base * v * (growthFactor > 0.7 ? 1 : growthFactor));
  }, [totalWealth, totalPnL]);

  const max = Math.max(...chartData);
  const min = Math.min(...chartData);
  const range = max - min || 1;
  const points = chartData
    .map((d, i) => `${(i / (chartData.length - 1)) * 100},${100 - ((d - min) / range) * 85 - 5}`)
    .join(" ");

  const allocationPct = totalWealth > 0 ? Math.round((totalValue / totalWealth) * 100) : 0;

  return (
    <div className="premium-card p-5 sm:p-8 overflow-hidden relative group">
      {/* Header Row */}
      <div className="flex justify-between items-start mb-5 sm:mb-6">
        <div>
          <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">
            Total Wealth
          </p>
          <p className="text-2xl sm:text-4xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
            ₨{formatPKR(totalWealth)}
          </p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                isPnlPositive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-red-50 text-red-600 border border-red-100"
              }`}
            >
              {isPnlPositive ? "▲" : "▼"} ₨{formatPKR(Math.abs(totalPnL))} ({isPnlPositive ? "+" : ""}{pnlPercent}%)
            </span>
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Portfolio P&L
            </span>
          </div>
        </div>

        {/* Range Selector */}
        <div className="flex gap-1 sm:gap-1.5 flex-wrap justify-end">
          {["1D", "1W", "1M", "1Y"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveRange(t)}
              className={`text-xs font-black px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl transition-all duration-200 ${
                activeRange === t
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              style={activeRange !== t ? { background: "var(--bg-muted)" } : {}}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative h-28 sm:h-44 w-full mb-5 sm:mb-6">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isPnlPositive ? "#10b981" : "#ef4444"} stopOpacity="0.2" />
              <stop offset="100%" stopColor={isPnlPositive ? "#10b981" : "#ef4444"} stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Subtle grid */}
          {[20, 40, 60, 80].map((v) => (
            <line key={v} x1="0" y1={v} x2="100" y2={v} stroke="currentColor" strokeWidth="0.3" opacity="0.1" />
          ))}
          {/* Area */}
          <polyline points={`0,100 ${points} 100,100`} fill="url(#chartGradient)" />
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={isPnlPositive ? "#10b981" : "#ef4444"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            style={{
              strokeDasharray: 300,
              strokeDashoffset: 300,
              animation: "drawPortfolioLine 1.5s ease-out forwards",
            }}
          />
          {/* End dot */}
          <circle
            cx="100"
            cy={100 - ((chartData[chartData.length - 1] - min) / range) * 85 - 5}
            r="2.5"
            fill={isPnlPositive ? "#10b981" : "#ef4444"}
            stroke="white"
            strokeWidth="1"
          />
        </svg>

        {/* Current value tooltip */}
        <div className="absolute top-1 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-slate-900 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-xl whitespace-nowrap">
            ₨{formatPKR(totalWealth)}
          </div>
        </div>
      </div>

      {/* Allocation Bar */}
      {(balance > 0 || totalValue > 0) && (
        <div className="mb-5">
          <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
            <span>Cash: {100 - allocationPct}%</span>
            <span>Invested: {allocationPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-muted)" }}>
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
              style={{ width: `${allocationPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Breakdown Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 sm:pt-5 border-t" style={{ borderColor: "var(--border-color)" }}>
        {[
          { label: "Cash", value: `₨${formatPKR(balance)}`, color: "text-blue-500" },
          { label: "Invested", value: `₨${formatPKR(totalValue)}`, color: "text-emerald-600" },
          {
            label: "P&L",
            value: `${isPnlPositive ? "+" : ""}₨${formatPKR(Math.abs(totalPnL))}`,
            color: isPnlPositive ? "text-emerald-600" : "text-red-500",
          },
        ].map((item, i) => (
          <div key={i} className={`text-center ${i === 1 ? "border-x" : ""}`} style={{ borderColor: "var(--border-color)" }}>
            <p className="text-xs font-black uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
              {item.label}
            </p>
            <p className={`text-xs sm:text-sm font-black ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Chart Disclaimer */}
      <p className="text-xs text-slate-400 text-center mt-3 pt-2 border-t border-slate-100/60 dark:border-slate-800/60 font-medium">
        Simulated data. Time range: Demo. Last update: not applicable.
      </p>

      <style>{`
        @keyframes drawPortfolioLine {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
