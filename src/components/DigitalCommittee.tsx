'use client';

export default function DigitalCommittee() {
  const members = [
    { name: 'You', paid: true, status: 'Active' },
    { name: 'Hamza', paid: true, status: 'Active' },
    { name: 'Ayesha', paid: true, status: 'Active' },
    { name: 'Ali', paid: false, status: 'Waiting' },
  ];

  return (
    <div className="premium-card p-0 overflow-hidden group">
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-emerald-900 p-8 text-white relative">
        {/* Glassmorphic Overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                Yield Bearing
              </div>
              <h2 className="text-3xl font-black tracking-tighter">Digital Kameti</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Sovereign ROSCA Hub</p>
            </div>
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-3xl border border-white/10 shadow-2xl">🤝</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Monthly Pool</div>
              <div className="text-xl font-black">PKR 50,000</div>
            </div>
            <div className="p-4 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 backdrop-blur-md">
              <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-1">Sukuk Yield</div>
              <div className="text-xl font-black text-emerald-400">+4.2%</div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest mb-1 px-1">
              <span>Pool Progress</span>
              <span>4/10 Months</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 p-0.5 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Circle</h3>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">TRUSTED</span>
        </div>
        
        <div className="flex -space-x-3 mb-8">
          {members.map((m, i) => (
            <div 
              key={i} 
              className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-black shadow-sm ${
                m.paid ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
              }`}
              title={`${m.name} - ${m.status}`}
            >
              {m.name[0]}
            </div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400">+6</div>
        </div>

        <button className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 hover:-translate-y-1 active:scale-95">
          Join Next Circle →
        </button>
      </div>
    </div>
  );
}
