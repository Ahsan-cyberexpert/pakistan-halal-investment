'use client';

export default function HajjVault() {
  const goal = 1500000;
  const current = 425000;
  const percentage = (current / goal) * 100;
  const yearlyProfit = 8.5; // 8.5% Sukuk Yield

  return (
    <div className="premium-card p-0 overflow-hidden group rounded-[3rem] bg-slate-900 border border-emerald-500/20 shadow-4xl relative">
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-black p-10 text-white relative border-b border-white/5">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-4 right-8 text-7xl opacity-10 rotate-12">🕋</div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <div className="flex gap-2 mb-6">
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  Yield Bearing Savings
                </div>
                <div className="inline-flex items-center gap-2 bg-white/10 text-white text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-white/10">
                  0% Platform Fee
                </div>
              </div>
              <h2 className="text-4xl font-black tracking-tighter italic">HAJJ <span className="text-emerald-500">VAULT</span></h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Sovereign Sukuk Backed</p>
            </div>
            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-4xl border border-white/10 shadow-2xl">🌙</div>
          </div>

          <div className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl mb-8">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Saved</p>
                <p className="text-3xl font-black text-white italic">PKR {current.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Annual Yield</p>
                <p className="text-xl font-black text-emerald-400">+{yearlyProfit}%</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="w-full bg-white/5 rounded-full h-3 p-0.5 border border-white/5">
                <div 
                  className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-1000" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                <span>{percentage.toFixed(1)}% Completed</span>
                <span>Goal: PKR {goal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Umrah', price: '3.5L', active: current >= 350000 },
              { label: 'Economy', price: '12L', active: current >= 1200000 },
              { label: 'VIP', price: '25L', active: current >= 2500000 },
            ].map((p, i) => (
              <div key={i} className={`p-4 rounded-2xl border text-center transition-all ${p.active ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/5 text-slate-600'}`}>
                <p className="text-[8px] font-black uppercase mb-1">{p.label}</p>
                <p className="text-xs font-black">{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8 flex gap-4 bg-slate-900/50">
        <button className="flex-[2] py-5 bg-white text-slate-900 font-black text-xs uppercase tracking-[0.2em] rounded-[1.8rem] hover:bg-emerald-50 transition-all shadow-4xl active:scale-95">
          Auto-Deposit On
        </button>
        <button className="flex-1 py-5 bg-white/5 text-slate-400 font-black text-xs uppercase rounded-[1.8rem] border border-white/5 hover:bg-white/10 transition-all">
          Manage
        </button>
      </div>
    </div>
  );
}
