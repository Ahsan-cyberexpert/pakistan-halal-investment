'use client';

interface HajjVaultProps {
  onDeposit?: (amount: number) => void;
}

export default function HajjVault({ onDeposit }: HajjVaultProps) {
  const goal = 1500000;
  const current = 425000;
  const percentage = (current / goal) * 100;
  const yearlyProfit = 8.5;

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#16171b] shadow-xs overflow-hidden h-full flex flex-col justify-between">
      <div className="bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent dark:from-emerald-950/40 dark:via-[#16171b] dark:to-transparent p-5 text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5">
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
            <div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Yield Bearing Savings
                </div>
                <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/10">
                  0% Fee
                </div>
              </div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">HAJJ VAULT</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mt-0.5">Sovereign Sukuk Backed</p>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200/60 dark:border-white/5 mb-4 shadow-xs">
            <div className="flex justify-between items-end mb-2.5">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">Current Saved</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">PKR {current.toLocaleString()}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-0.5">Annual Yield</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">+{yearlyProfit}%</p>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>{percentage.toFixed(1)}% Completed</span>
                <span>Goal: PKR {goal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Umrah', price: '3.5L', active: current >= 350000 },
              { label: 'Economy', price: '12L', active: current >= 1200000 },
              { label: 'VIP', price: '25L', active: current >= 250000 },
            ].map((p, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  p.active
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-white/5 border-slate-200/60 dark:border-white/5 text-slate-500 dark:text-slate-400'
                }`}
              >
                <p className="text-xs font-semibold uppercase mb-0.5">{p.label}</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col sm:flex-row gap-2 bg-slate-50/70 dark:bg-black/20">
        <button 
          onClick={() => onDeposit?.(50000)}
          className="w-full sm:flex-[2] py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xs active:scale-95 text-center"
        >
          Auto-Deposit PKR 50,000 (PIN Locked)
        </button>
        <button className="w-full sm:flex-1 py-2.5 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95 text-center">
          Manage
        </button>
      </div>
    </div>
  );
}
