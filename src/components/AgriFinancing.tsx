'use client';

export default function AgriFinancing({ balance, onInvest }: { balance?: number, onInvest?: (amount: number) => void }) {
  return (
    <div className="premium-card p-4 sm:p-8 bg-gradient-to-br from-amber-900 to-amber-950 text-white relative overflow-hidden group mb-4 sm:mb-6 rounded-2xl sm:rounded-[3rem]">
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay group-hover:scale-110 transition-transform duration-[5s]"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4 sm:mb-8">
          <div>
            <h3 className="text-[8px] sm:text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-0.5 sm:mb-1">Bay' Al-Salam</h3>
            <p className="text-xl sm:text-2xl font-black tracking-tighter">Agri-Sovereign Fund</p>
            <p className="text-[9px] sm:text-[10px] font-bold text-amber-200/50 uppercase mt-0.5 sm:mt-1">Direct Farmer Financing</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-xl backdrop-blur-md flex-shrink-0">🌾</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 sm:mb-8 backdrop-blur-md">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-amber-200">Current Opportunity</p>
              <h4 className="text-base sm:text-lg font-black tracking-tight">Wheat Harvest 2026</h4>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">Punjab District, PK</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-emerald-400 font-black text-base sm:text-lg tracking-tighter">+22.5%</p>
              <p className="text-[7px] sm:text-[8px] font-bold text-slate-500 uppercase">Target Return</p>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-4">
            <div className="flex justify-between items-end">
              <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400">Funding Progress</p>
              <p className="text-[11px] sm:text-xs font-black">75% <span className="text-slate-500 font-bold">/ 5M PKR</span></p>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 sm:h-2.5 p-0.5">
              <div className="bg-gradient-to-r from-amber-500 to-emerald-500 h-1 sm:h-1.5 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-8">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 flex items-center justify-center text-xs sm:text-sm flex-shrink-0">🚜</div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase">Impact</p>
              <p className="text-[11px] sm:text-xs font-bold">12 Families</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 flex items-center justify-center text-xs sm:text-sm flex-shrink-0">📅</div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase">Duration</p>
              <p className="text-[11px] sm:text-xs font-bold">6 Months</p>
            </div>
          </div>
        </div>

        <button onClick={() => onInvest?.(50000)} className="w-full bg-white text-amber-950 py-3 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-black text-xs sm:text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
          Fund Harvest (Salam)
        </button>

        <p className="text-center mt-4 sm:mt-6 text-[7px] sm:text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-amber-500"></span>
          Shariah Certified by PSX Shariah Board
        </p>
      </div>
    </div>
  );
}
