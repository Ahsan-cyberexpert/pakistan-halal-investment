'use client';

export default function PortfolioChart() {
  // Mock data for wealth growth
  const data = [10, 25, 18, 45, 38, 75, 62, 95];
  const max = Math.max(...data);
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d / max) * 100}`).join(' ');

  return (
    <div className="premium-card p-8 overflow-hidden relative group">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Growth Overview</h3>
          <p className="text-2xl font-black text-slate-800 tracking-tighter">Wealth Performance</p>
        </div>
        <div className="flex gap-2">
          {['1D', '1W', '1M', '1Y'].map((t) => (
            <button 
              key={t} 
              className={`text-[10px] font-black px-3 py-1 rounded-lg transition-all ${
                t === '1M' ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-48 w-full mt-4">
        {/* SVG Chart */}
        <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Grid Lines */}
          {[0, 25, 50, 75, 100].map(v => (
            <line key={v} x1="0" y1={v} x2="100" y2={v} stroke="#f1f5f9" strokeWidth="0.5" />
          ))}

          {/* Area */}
          <polyline
            points={`0,100 ${points} 100,100`}
            fill="url(#chartGradient)"
            className="animate-chart-path"
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_4px_8px_rgba(16,185,129,0.3)]"
          />
        </svg>

        {/* Hover Point Tooltip (Simplified) */}
        <div className="absolute top-[5%] left-[71.5%] -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 opacity-0 transition-opacity duration-300">
          <div className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap">
            PKR 256,708
          </div>
          <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white absolute top-full left-1/2 -translate-x-1/2 translate-y-1 shadow-lg"></div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Market Data</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-black text-emerald-600">+ Pakistan Stock Exchange</span>
        </div>
      </div>

      <style jsx>{`
        .animate-chart-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw 2s ease-out forwards;
        }
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
