'use client';

export default function AgriFinancing({ onInvest }: { balance?: number; onInvest?: (amount: number) => void }) {
  return (
    <div className="premium-card p-4 sm:p-5 bg-gradient-to-br from-amber-900 to-amber-950 text-white relative overflow-hidden group rounded-2xl sm:rounded-3xl shadow-lg">
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay group-hover:scale-105 transition-transform duration-[5s] pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div>
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-0.5">Bay&apos; Al-Salam</h3>
            <p className="text-lg sm:text-xl font-black tracking-tight">Agri-Sovereign Fund</p>
            <p className="text-xs font-bold text-amber-200/60 uppercase mt-0.5">Direct Farmer Financing</p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-xl flex items-center justify-center text-lg shadow-md backdrop-blur-md flex-shrink-0">🌾</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 mb-3 sm:mb-4 backdrop-blur-md">
          <div className="flex justify-between items-start mb-2.5">
            <div>
              <p className="text-xs font-bold text-amber-200">Current Opportunity</p>
              <h4 className="text-sm sm:text-base font-black tracking-tight">Wheat Harvest 2026</h4>
              <p className="text-xs font-bold text-slate-400 uppercase">Punjab District, PK</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-emerald-400 font-black text-sm sm:text-base tracking-tight">+22.5%</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Target Return</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-end">
              <p className="text-xs font-black uppercase text-slate-400">Funding Progress</p>
              <p className="text-xs font-black">75% <span className="text-slate-400 font-bold">/ 5M PKR</span></p>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 p-0.5">
              <div className="bg-gradient-to-r from-amber-500 to-emerald-500 h-1 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-xs flex-shrink-0">🚜</div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase">Impact</p>
              <p className="text-xs font-bold">12 Families</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-xs flex-shrink-0">📅</div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase">Duration</p>
              <p className="text-xs font-bold">6 Months</p>
            </div>
          </div>
        </div>

        <button onClick={() => onInvest?.(50000)} className="w-full bg-white text-amber-950 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-amber-50 active:scale-95 transition-all shadow-md">
          Fund Harvest (Salam)
        </button>

        <p className="text-center mt-2.5 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-amber-500"></span>
          Shariah Certified by PSX Shariah Board
        </p>
      </div>
    </div>
  );
}
