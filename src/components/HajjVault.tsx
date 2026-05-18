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
    <div className="premium-card p-0 overflow-hidden group rounded-2xl sm:rounded-[3rem] bg-slate-900 border border-emerald-500/20 shadow-xl relative mb-4 sm:mb-6">
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-black p-4 sm:p-10 text-white relative border-b border-white/5">
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-emerald-500/10 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none"></div>
        <div className="absolute top-2 right-4 sm:top-4 sm:right-8 text-5xl sm:text-7xl opacity-10 rotate-12 pointer-events-none">🕋</div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-10">
            <div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-6">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-emerald-500/20 text-emerald-300 text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  Yield Bearing Savings
                </div>
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 text-white text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10">
                  0% Fee
                </div>
              </div>
              <h2 className="text-xl sm:text-4xl font-black tracking-tighter italic">HAJJ <span className="text-emerald-500">VAULT</span></h2>
              <p className="text-slate-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mt-0.5 sm:mt-2">Sovereign Sukuk Backed</p>
            </div>
            <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white/5 rounded-xl sm:rounded-3xl flex items-center justify-center text-xl sm:text-4xl border border-white/10 shadow-lg flex-shrink-0">🌙</div>
          </div>

          <div className="bg-black/40 p-4 sm:p-8 rounded-xl sm:rounded-[2.5rem] border border-white/5 backdrop-blur-xl mb-4 sm:mb-8 shadow-sm">
            <div className="flex justify-between items-end mb-4 sm:mb-6">
              <div>
                <p className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5 sm:mb-1">Current Saved</p>
                <p className="text-lg sm:text-3xl font-black text-white italic tracking-tight">PKR {current.toLocaleString()}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[8px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-0.5 sm:mb-1">Annual Yield</p>
                <p className="text-sm sm:text-xl font-black text-emerald-400 tracking-tight">+{yearlyProfit}%</p>
              </div>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              <div className="w-full bg-white/5 rounded-full h-2 sm:h-3 p-0.5 border border-white/5">
                <div 
                  className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-1000" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[7px] sm:text-[9px] font-black uppercase tracking-widest text-slate-500">
                <span>{percentage.toFixed(1)}% Completed</span>
                <span>Goal: PKR {goal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: 'Umrah', price: '3.5L', active: current >= 350000 },
              { label: 'Economy', price: '12L', active: current >= 1200000 },
              { label: 'VIP', price: '25L', active: current >= 250000 },
            ].map((p, i) => (
              <div key={i} className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border text-center transition-all ${p.active ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/5 text-slate-600'}`}>
                <p className="text-[7px] sm:text-[8px] font-black uppercase mb-0.5 sm:mb-1">{p.label}</p>
                <p className="text-[11px] sm:text-xs font-black">{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8 flex flex-col sm:flex-row gap-2 sm:gap-4 bg-slate-900/50 pt-2">
        <button 
          onClick={() => onDeposit?.(50000)}
          className="w-full sm:flex-[2] py-3 sm:py-5 bg-white text-slate-900 font-black text-[11px] sm:text-xs uppercase tracking-[0.2em] rounded-xl sm:rounded-[1.8rem] hover:bg-emerald-50 transition-all shadow-lg active:scale-95 text-center"
        >
          Auto-Deposit PKR 50,000 (PIN Locked)
        </button>
        <button className="w-full sm:flex-1 py-3 sm:py-5 bg-white/5 text-slate-400 font-black text-[11px] sm:text-xs uppercase rounded-xl sm:rounded-[1.8rem] border border-white/5 hover:bg-white/10 transition-all active:scale-95 text-center">
          Manage
        </button>
      </div>
    </div>
  );
}
