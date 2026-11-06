'use client';

interface HajjVaultProps {
  onDeposit?: (amount: number) => void;
}

export default function HajjVault({ onDeposit }: HajjVaultProps) {
  const goal = 1500000;
  const current = 425000;
  const percentage = (current / goal) * 100;
  const yearlyProfit = 8.5; // 8.5% Sukuk Yield

  return (
    <div className="premium-card p-0 overflow-hidden group rounded-2xl sm:rounded-3xl bg-slate-900 border border-emerald-500/20 shadow-lg relative">
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-black p-4 sm:p-5 text-white relative border-b border-white/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute top-2 right-4 text-4xl opacity-10 rotate-12 pointer-events-none">🕋</div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
            <div>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                <div className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  Yield Bearing Savings
                </div>
                <div className="inline-flex items-center gap-1 bg-white/10 text-white text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10">
                  0% Fee
                </div>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight italic">HAJJ <span className="text-emerald-500">VAULT</span></h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">Sovereign Sukuk Backed</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/5 rounded-xl flex items-center justify-center text-lg border border-white/10 shadow-md flex-shrink-0">🌙</div>
          </div>

          <div className="bg-black/40 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5 backdrop-blur-xl mb-3 sm:mb-4 shadow-sm">
            <div className="flex justify-between items-end mb-2.5">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">Current Saved</p>
                <p className="text-base sm:text-lg font-black text-white italic tracking-tight">PKR {current.toLocaleString()}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-0.5">Annual Yield</p>
                <p className="text-xs sm:text-sm font-black text-emerald-400 tracking-tight">+{yearlyProfit}%</p>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="w-full bg-white/5 rounded-full h-2 p-0.5 border border-white/5">
                <div 
                  className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-700" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
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
              <div key={i} className={`p-2 rounded-xl border text-center transition-all ${p.active ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                <p className="text-xs font-black uppercase mb-0.5">{p.label}</p>
                <p className="text-xs font-black">{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 flex flex-col sm:flex-row gap-2 bg-slate-900/50">
        <button 
          onClick={() => onDeposit?.(50000)}
          className="w-full sm:flex-[2] py-2.5 bg-white text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-50 transition-all shadow-md active:scale-95 text-center"
        >
          Auto-Deposit PKR 50,000 (PIN Locked)
        </button>
        <button className="w-full sm:flex-1 py-2.5 bg-white/5 text-slate-300 font-black text-xs uppercase rounded-xl border border-white/5 hover:bg-white/10 transition-all active:scale-95 text-center">
          Manage
        </button>
      </div>
    </div>
  );
}
