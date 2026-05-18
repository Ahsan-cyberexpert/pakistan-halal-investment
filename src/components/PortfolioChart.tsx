'use client';
import { useState, useMemo } from 'react';

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
  const [activeRange, setActiveRange] = useState('1M');

  const totalWealth = balance + totalValue;
  const totalPnL = holdings.reduce((s, h) => s + h.pnl, 0);
  const pnlPercent = totalValue > 0 ? ((totalPnL / totalValue) * 100).toFixed(2) : '0.00';
  const isPnlPositive = totalPnL >= 0;

  // Build a realistic chart curve from real data
  const chartData = useMemo(() => {
    const base = totalWealth > 0 ? totalWealth : 250000;
    // Simulate 8 historical data points trending toward current value
    const growthFactor = 1 + (totalPnL / (base || 1)) * 0.5;
    return [
      base * 0.78,
      base * 0.82,
      base * 0.79,
      base * 0.87,
      base * 0.85,
      base * 0.92,
      base * 0.96,
      base,
    ].map(v => v * (growthFactor > 0.7 ? 1 : growthFactor));
  }, [totalWealth, totalPnL]);

  const max = Math.max(...chartData);
  const min = Math.min(...chartData);
  const range = max - min || 1;
  const points = chartData
    .map((d, i) => `${(i / (chartData.length - 1)) * 100},${100 - ((d - min) / range) * 90}`)
    .join(' ');

  return (
    <div className="premium-card p-4 sm:p-8 overflow-hidden relative group mb-4 sm:mb-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <div>
          <h3 className="text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5 sm:mb-1">
            Total Wealth
          </h3>
          <p className="text-xl sm:text-3xl font-black text-slate-800 tracking-tighter">
            ₨{totalWealth.toLocaleString('en-PK', { maximumFractionDigits: 0 })}
          </p>
          <div className={`flex items-center gap-1 sm:gap-1.5 mt-1 sm:mt-1.5`}>
            <span className={`text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-lg ${isPnlPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {isPnlPositive ? '▲' : '▼'} {Math.abs(totalPnL).toLocaleString('en-PK', { maximumFractionDigits: 0 })} ({isPnlPositive ? '+' : ''}{pnlPercent}%)
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">portfolio P&L</span>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-1.5 flex-wrap justify-end">
          {['1D', '1W', '1M', '1Y'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveRange(t)}
              className={`text-[9px] sm:text-[10px] font-black px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl transition-all ${
                activeRange === t ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-28 sm:h-44 w-full">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isPnlPositive ? '#10b981' : '#ef4444'} stopOpacity="0.25" />
              <stop offset="100%" stopColor={isPnlPositive ? '#10b981' : '#ef4444'} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid */}
          {[20, 40, 60, 80].map(v => (
            <line key={v} x1="0" y1={v} x2="100" y2={v} stroke="#f1f5f9" strokeWidth="0.5" />
          ))}
          {/* Area fill */}
          <polyline
            points={`0,100 ${points} 100,100`}
            fill="url(#chartGradient)"
          />
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={isPnlPositive ? '#10b981' : '#ef4444'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_4px_8px_rgba(16,185,129,0.4)]"
            style={{
              strokeDasharray: 300,
              strokeDashoffset: 300,
              animation: 'drawLine 1.5s ease-out forwards',
            }}
          />
          {/* End dot */}
          <circle cx="100" cy={100 - ((chartData[7] - min) / range) * 90} r="2" fill={isPnlPositive ? '#10b981' : '#ef4444'} />
        </svg>

        {/* Tooltip */}
        <div className="absolute top-[5%] right-[2%] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-slate-900 text-white text-[9px] sm:text-[10px] font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl shadow-xl whitespace-nowrap">
            ₨{totalWealth.toLocaleString('en-PK', { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-50">
        <div className="text-center">
          <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-wider">Cash</p>
          <p className="text-xs sm:text-sm font-black text-slate-700 mt-0.5 sm:mt-1">₨{balance.toLocaleString('en-PK', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="text-center border-x border-slate-100">
          <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-wider">Invested</p>
          <p className="text-xs sm:text-sm font-black text-slate-700 mt-0.5 sm:mt-1">₨{totalValue.toLocaleString('en-PK', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="text-center">
          <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-wider">P&L</p>
          <p className={`text-xs sm:text-sm font-black mt-0.5 sm:mt-1 ${isPnlPositive ? 'text-emerald-600' : 'text-red-500'}`}>
            {isPnlPositive ? '+' : ''}₨{totalPnL.toLocaleString('en-PK', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
