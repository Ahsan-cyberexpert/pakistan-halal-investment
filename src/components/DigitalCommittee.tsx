'use client';
import { useState } from 'react';

interface DigitalCommitteeProps {
  onContribute?: (amount: number) => void;
}

export default function DigitalCommittee({ onContribute }: DigitalCommitteeProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'schedule'>('info');
  
  const members = [
    { name: 'You (Organizer)', status: 'Paid', turn: 1, month: 'March 2026', verified: true },
    { name: 'Abbu (Father)', status: 'Paid', turn: 2, month: 'April 2026', verified: true },
    { name: 'Hamza (Brother)', status: 'Paid', turn: 3, month: 'May 2026', verified: true },
    { name: 'Ayesha (Sister)', status: 'Current', turn: 4, month: 'June 2026', verified: true },
  ];

  const currentPot = 100000;
  const contribution = 10000;

  return (
    <div className="premium-card p-0 overflow-hidden group rounded-2xl sm:rounded-[3rem] bg-slate-950 border border-indigo-500/20 shadow-xl mb-4 sm:mb-6 animate-in fade-in duration-500">
      <div className="bg-indigo-950/40 p-4 sm:p-10 text-white relative border-b border-white/5">
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-indigo-500/10 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-8">
            <div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-indigo-500/20 text-indigo-300 text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-indigo-500/30">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
                  Private Family Circle
                </div>
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 text-white text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] px-3 py-1.5 sm:px-4 py-2 rounded-full border border-white/10">
                  Free Service
                </div>
              </div>
              <h2 className="text-xl sm:text-4xl font-black tracking-tighter italic">FAMILY <span className="text-indigo-400">KAMETI</span></h2>
              <p className="text-slate-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mt-0.5 sm:mt-2">Verified Trust-Network Only</p>
            </div>
            <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white/5 rounded-xl sm:rounded-3xl flex items-center justify-center text-xl sm:text-4xl border border-white/10 shadow-lg flex-shrink-0">👨‍👩‍👧‍👦</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 mb-4 sm:mb-8">
            <div className="p-3.5 sm:p-6 bg-white/5 rounded-xl sm:rounded-[2.5rem] border border-white/5 backdrop-blur-xl shadow-sm">
              <p className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5 sm:mb-1">Total Payout</p>
              <p className="text-lg sm:text-2xl font-black text-white italic tracking-tight">PKR {currentPot.toLocaleString()}</p>
            </div>
            <div className="p-3.5 sm:p-6 bg-indigo-500/10 rounded-xl sm:rounded-[2.5rem] border border-indigo-500/20 shadow-sm">
              <p className="text-[8px] sm:text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-0.5 sm:mb-1">Contribution</p>
              <p className="text-lg sm:text-2xl font-black text-indigo-300 italic tracking-tight">PKR {contribution.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-black/40 rounded-xl sm:rounded-2xl border border-white/5">
            <button 
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-2 sm:py-3 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'info' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-white'}`}
            >
              Members
            </button>
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 py-2 sm:py-3 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'schedule' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-white'}`}
            >
              Draw Order
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-10 space-y-4 sm:space-y-8">
        {activeTab === 'info' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-3 sm:mb-6">
              <h3 className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Circle Integrity</h3>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-[8px] sm:text-[9px] font-black text-emerald-400 uppercase tracking-widest">CNIC Verified</span>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              </div>
            </div>
            
            {/* Responsive 2-Column Grid on Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4 mb-4 sm:mb-8 items-start">
              {members.map((m, i) => (
                <div key={i} className="flex justify-between items-center p-3 sm:p-5 bg-white/5 rounded-xl sm:rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all shadow-sm">
                  <div className="flex items-center gap-2.5 sm:gap-4">
                    <div className="w-9 h-9 sm:w-12 sm:h-12 bg-indigo-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center text-xs sm:text-sm font-black text-indigo-400 border border-indigo-500/20 flex-shrink-0">{m.name[0]}</div>
                    <div>
                      <p className="text-xs sm:text-sm font-black text-white tracking-tight">{m.name}</p>
                      <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
                        <span className="text-emerald-400 text-[9px] sm:text-[10px]">✔</span>
                        <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Identity Locked</p>
                      </div>
                    </div>
                  </div>
                  <div className={`text-[8px] sm:text-[10px] font-black px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full border flex-shrink-0 ${m.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    {m.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 sm:p-8 bg-indigo-600/10 rounded-xl sm:rounded-[3rem] border border-indigo-500/20 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-20 text-xl sm:text-4xl pointer-events-none">🔐</div>
              <h4 className="text-[10px] sm:text-xs font-black text-indigo-300 uppercase tracking-widest mb-1 sm:mb-2">Sovereign Identity Lock</h4>
              <p className="text-[9px] sm:text-[11px] text-slate-400 leading-relaxed font-medium max-w-2xl">
                This circle is **Locked to CNIC**. All members are legally verified. Roziq holds the Word of Honor (Zubaan) as a digital record.
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 mb-4 sm:mb-8">
            <p className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 sm:mb-6 text-center italic">"Honoring the trust of your kin"</p>
            {/* Responsive 2-Column Grid on Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4 items-stretch">
              {members.map((m, i) => (
                <div key={i} className={`flex justify-between items-center p-3.5 sm:p-6 rounded-xl sm:rounded-[2.5rem] border shadow-sm ${m.name.includes('You') ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-900/40' : 'bg-white/5 border-white/5'}`}>
                  <div className="flex items-center gap-2.5 sm:gap-5">
                    <span className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 ${m.name.includes('You') ? 'bg-white/20' : 'bg-white/5 text-slate-500'}`}>
                      {m.turn}
                    </span>
                    <div>
                      <p className={`text-xs sm:text-sm font-black tracking-tight ${m.name.includes('You') ? 'text-white' : 'text-slate-200'}`}>{m.month}</p>
                      <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mt-0.5 ${m.name.includes('You') ? 'text-white/60' : 'text-slate-500'}`}>{m.name}</p>
                    </div>
                  </div>
                  {m.name.includes('You') && <span className="text-lg sm:text-2xl animate-bounce flex-shrink-0">🛡️</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2">
          <button 
            onClick={() => onContribute?.(contribution)}
            className="w-full sm:flex-[2] py-3 sm:py-5 bg-indigo-600 text-white font-black text-[11px] sm:text-xs uppercase tracking-[0.2em] rounded-xl sm:rounded-[2rem] hover:bg-indigo-500 transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 text-center"
          >
            Contribute PKR {contribution.toLocaleString()} (PIN Locked)
          </button>
          <button className="w-full sm:flex-1 py-3 sm:py-5 bg-white/5 text-slate-400 font-black text-[11px] sm:text-xs uppercase rounded-xl sm:rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all active:scale-95 text-center">
            Invite Family
          </button>
        </div>
      </div>
    </div>
  );
}
