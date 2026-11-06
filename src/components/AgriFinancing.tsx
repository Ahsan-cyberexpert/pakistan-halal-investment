'use client';

export default function AgriFinancing({ onInvest }: { balance?: number; onInvest?: (amount: number) => void }) {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#16171b] shadow-xs overflow-hidden h-full flex flex-col justify-between">
      <div className="bg-gradient-to-br from-amber-500/5 via-transparent to-transparent dark:from-amber-950/30 dark:via-[#16171b] dark:to-transparent p-5 text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-full text-xs font-semibold mb-2 border border-amber-500/20">
              Bay&apos; Al-Salam
            </div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Agri-Sovereign Fund</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Direct Farmer Financing</p>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-amber-600 dark:text-amber-400 flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.5-4.5 10-10 10S2 17.5 2 12A10 10 0 0 1 12 2z"/>
              <path d="M12 6v12M8 10l4-4 4 4M8 14l4-4 4 4"/>
            </svg>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 rounded-xl p-4 mb-4 shadow-xs">
          <div className="flex justify-between items-start mb-2.5">
            <div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Current Opportunity</p>
              <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Wheat Harvest 2026</h4>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Punjab District, PK</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-emerald-600 dark:text-emerald-400 font-bold text-base tracking-tight">+22.5%</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Target Return</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-end text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>Funding Progress</span>
              <span className="font-bold text-slate-900 dark:text-white">75% <span className="font-normal text-slate-500">/ 5M PKR</span></span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Impact</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">12 Families</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Duration</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">6 Months</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50/70 dark:bg-black/20 flex flex-col gap-2">
        <button 
          onClick={() => onInvest?.(50000)} 
          className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-95 transition-all shadow-xs"
        >
          Fund Harvest (Salam)
        </button>
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
          Inspired by PSX Shariah screening principles
        </p>
      </div>
    </div>
  );
}
