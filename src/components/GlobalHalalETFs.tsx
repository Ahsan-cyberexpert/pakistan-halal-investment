'use client';

interface GlobalHalalETFsProps {
  onInvest?: (amount: number, etfName: string) => void;
}

export default function GlobalHalalETFs({ onInvest }: GlobalHalalETFsProps) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-slate-900 shadow-sm border border-slate-200/80 animate-in fade-in duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Global Assets</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Global Halal ETFs (USD)</h2>
          <p className="text-xs text-slate-500">Hedge against PKR inflation with Shariah-compliant US Equities</p>
        </div>
        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-semibold rounded-full flex-shrink-0">
          Forex Hedged
        </span>
      </div>

      <div className="space-y-2.5 mb-4">
        <div 
          onClick={() => onInvest?.(100000, 'HLAL Wahed FTSE USA Shariah ETF')}
          className="bg-slate-50 p-3.5 rounded-xl flex justify-between items-center border border-slate-200/80 hover:border-emerald-300 transition-colors cursor-pointer active:scale-95 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0">HLAL</div>
            <div>
              <div className="font-bold text-xs text-slate-900">Wahed FTSE USA Shariah</div>
              <div className="text-[10px] text-slate-500">Apple, Microsoft, Alphabet (Halal Filtered)</div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-bold text-xs text-emerald-600">+14.2%</div>
            <div className="text-[9px] text-slate-400 font-medium">YTD Return</div>
          </div>
        </div>

        <div 
          onClick={() => onInvest?.(100000, 'SPUS S&P 500 Sharia ETF')}
          className="bg-slate-50 p-3.5 rounded-xl flex justify-between items-center border border-slate-200/80 hover:border-emerald-300 transition-colors cursor-pointer active:scale-95 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-100 text-indigo-800 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0">SPUS</div>
            <div>
              <div className="font-bold text-xs text-slate-900">SP Funds S&P 500 Sharia</div>
              <div className="text-[10px] text-slate-500">Standard & Poor's Top Shariah 500</div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-bold text-xs text-emerald-600">+16.8%</div>
            <div className="text-[9px] text-slate-400 font-medium">YTD Return</div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => onInvest?.(100000, 'SPUS S&P 500 Sharia ETF')}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl active:scale-95 transition-all text-xs shadow-sm text-center"
      >
        Convert PKR to USD (via Roshan Digital Account)
      </button>
    </div>
  );
}
