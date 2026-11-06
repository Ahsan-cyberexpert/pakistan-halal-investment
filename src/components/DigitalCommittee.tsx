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
    <div className="premium-card p-0 overflow-hidden group rounded-2xl sm:rounded-3xl bg-slate-950 border border-indigo-500/20 shadow-lg animate-in fade-in duration-300">
      <div className="bg-indigo-950/40 p-4 sm:p-5 text-white relative border-b border-white/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
            <div>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-indigo-500/30">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
                  Private Family Circle
                </div>
                <div className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10">
                  Free Service
                </div>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight italic">FAMILY <span className="text-indigo-400">KAMETI</span></h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">Verified Trust-Network Only</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/5 rounded-xl flex items-center justify-center text-lg sm:text-xl border border-white/10 shadow-md flex-shrink-0">👨‍👩‍👧‍👦</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 backdrop-blur-xl shadow-sm">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Payout</p>
              <p className="text-base sm:text-lg font-black text-white italic tracking-tight">PKR {currentPot.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-sm">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-0.5">Contribution</p>
              <p className="text-base sm:text-lg font-black text-indigo-300 italic tracking-tight">PKR {contribution.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-1.5 p-1 bg-black/40 rounded-xl border border-white/5">
            <button 
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'info' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Members
            </button>
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'schedule' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Draw Order
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
        {activeTab === 'info' ? (
          <div className="animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-2.5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Circle Integrity</h3>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">CNIC Verified</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              </div>
            </div>
            
            {/* Responsive 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5 mb-3 items-start">
              {members.map((m, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 sm:p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-indigo-500/20 rounded-xl flex items-center justify-center text-xs font-black text-indigo-400 border border-indigo-500/20 flex-shrink-0">{m.name[0]}</div>
                    <div>
                      <p className="text-xs font-black text-white tracking-tight">{m.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-emerald-400 text-xs">✔</span>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Identity Locked</p>
                      </div>
                    </div>
                  </div>
                  <div className={`text-xs font-black px-2 py-0.5 rounded-full border flex-shrink-0 ${m.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    {m.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-indigo-600/10 rounded-xl border border-indigo-500/20 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-2 opacity-20 text-xl pointer-events-none">🔐</div>
              <h4 className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-0.5">Sovereign Identity Lock</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium max-w-xl">
                This circle is **Locked to CNIC**. All members are legally verified. Roziq holds the Word of Honor (Zubaan) as a digital record.
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-200 mb-3">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 text-center italic">&quot;Honoring the trust of your kin&quot;</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5 items-stretch">
              {members.map((m, i) => (
                <div key={i} className={`flex justify-between items-center p-3 rounded-xl border shadow-sm ${m.name.includes('You') ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-900/40' : 'bg-white/5 border-white/5'}`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 ${m.name.includes('You') ? 'bg-white/20' : 'bg-white/5 text-slate-400'}`}>
                      {m.turn}
                    </span>
                    <div>
                      <p className={`text-xs font-black tracking-tight ${m.name.includes('You') ? 'text-white' : 'text-slate-200'}`}>{m.month}</p>
                      <p className={`text-xs font-bold uppercase tracking-widest mt-0.5 ${m.name.includes('You') ? 'text-white/70' : 'text-slate-400'}`}>{m.name}</p>
                    </div>
                  </div>
                  {m.name.includes('You') && <span className="text-base animate-bounce flex-shrink-0">🛡️</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button 
            onClick={() => onContribute?.(contribution)}
            className="w-full sm:flex-[2] py-2.5 bg-indigo-600 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-indigo-500 transition-all shadow-md active:scale-95 text-center"
          >
            Contribute PKR {contribution.toLocaleString()} (PIN Locked)
          </button>
          <button className="w-full sm:flex-1 py-2.5 bg-white/5 text-slate-300 font-black text-xs uppercase rounded-xl border border-white/5 hover:bg-white/10 transition-all active:scale-95 text-center">
            Invite Family
          </button>
        </div>
      </div>
    </div>
  );
}
