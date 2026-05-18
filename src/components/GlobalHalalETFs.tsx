'use client';

export default function GlobalHalalETFs() {
  return (
    <div className="bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-sm border border-slate-800 mb-4 sm:mb-6">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div>
          <h2 className="text-base sm:text-xl font-bold tracking-tight">🌍 Global USD Exposure</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Hedge against PKR devaluation with Halal US Tech ETFs</p>
        </div>
        <span className="text-2xl sm:text-3xl flex-shrink-0">💵</span>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <div className="bg-slate-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex justify-between items-center border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer active:scale-95 duration-200">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-900 text-blue-300 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0">HLAL</div>
            <div>
              <div className="font-bold text-xs sm:text-sm tracking-tight">Wahed FTSE USA Shariah</div>
              <div className="text-[10px] sm:text-xs text-slate-400">US Tech & Healthcare</div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-bold text-xs sm:text-sm text-emerald-400">+14.2%</div>
            <div className="text-[9px] sm:text-xs text-slate-400">YTD (USD)</div>
          </div>
        </div>

        <div className="bg-slate-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex justify-between items-center border border-slate-700 hover:border-purple-500 transition-colors cursor-pointer active:scale-95 duration-200">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-900 text-purple-300 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0">SPUS</div>
            <div>
              <div className="font-bold text-xs sm:text-sm tracking-tight">SP Funds S&P 500 Sharia</div>
              <div className="text-[10px] sm:text-xs text-slate-400">Top 500 Halal US Co.</div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-bold text-xs sm:text-sm text-emerald-400">+16.8%</div>
            <div className="text-[9px] sm:text-xs text-slate-400">YTD (USD)</div>
          </div>
        </div>
      </div>
      
      <button className="w-full mt-4 bg-blue-600 text-white font-bold py-2.5 sm:py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all text-xs sm:text-sm shadow-md">
        Convert PKR to Invest (via RDA)
      </button>
    </div>
  );
}
