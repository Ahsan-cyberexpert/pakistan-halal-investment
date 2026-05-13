'use client';

export default function GlobalHalalETFs() {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-sm border border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">🌍 Global USD Exposure</h2>
          <p className="text-sm text-slate-400">Hedge against PKR devaluation with Halal US Tech ETFs</p>
        </div>
        <span className="text-3xl">💵</span>
      </div>

      <div className="space-y-3">
        <div className="bg-slate-800 p-4 rounded-2xl flex justify-between items-center border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-900 text-blue-300 rounded-xl flex items-center justify-center font-bold">HLAL</div>
            <div>
              <div className="font-bold text-sm">Wahed FTSE USA Shariah</div>
              <div className="text-xs text-slate-400">US Tech & Healthcare</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-emerald-400">+14.2%</div>
            <div className="text-xs text-slate-400">YTD (USD)</div>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-2xl flex justify-between items-center border border-slate-700 hover:border-purple-500 transition-colors cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-900 text-purple-300 rounded-xl flex items-center justify-center font-bold">SPUS</div>
            <div>
              <div className="font-bold text-sm">SP Funds S&P 500 Sharia</div>
              <div className="text-xs text-slate-400">Top 500 Halal US Co.</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-emerald-400">+16.8%</div>
            <div className="text-xs text-slate-400">YTD (USD)</div>
          </div>
        </div>
      </div>
      
      <button className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">
        Convert PKR to Invest (via RDA)
      </button>
    </div>
  );
}
