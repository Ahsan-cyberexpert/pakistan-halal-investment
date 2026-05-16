'use client';
import { useState } from 'react';

export default function DigitalCommittee() {
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
    <div className="premium-card p-0 overflow-hidden group rounded-[3rem] bg-slate-950 border border-indigo-500/20 shadow-4xl">
      <div className="bg-indigo-950/40 p-10 text-white relative border-b border-white/5">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex gap-2 mb-6">
                <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-indigo-500/30">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
                  Private Family Circle
                </div>
                <div className="inline-flex items-center gap-2 bg-white/10 text-white text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-white/10">
                  Free Sovereign Service
                </div>
              </div>
              <h2 className="text-4xl font-black tracking-tighter italic">FAMILY <span className="text-indigo-400">KAMETI</span></h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Verified Trust-Network Only</p>
            </div>
            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-4xl border border-white/10 shadow-2xl">👨‍👩‍👧‍👦</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-6 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Payout</p>
              <p className="text-2xl font-black text-white italic">PKR {currentPot.toLocaleString()}</p>
            </div>
            <div className="p-6 bg-indigo-500/10 rounded-[2.5rem] border border-indigo-500/20">
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Contribution</p>
              <p className="text-2xl font-black text-indigo-300 italic">PKR {contribution.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5">
            <button 
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'info' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white'}`}
            >
              Members
            </button>
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'schedule' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white'}`}
            >
              Draw Order
            </button>
          </div>
        </div>
      </div>

      <div className="p-10 space-y-8">
        {activeTab === 'info' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Circle Integrity</h3>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">CNIC Verified</span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              </div>
            </div>
            
            <div className="space-y-4 mb-10">
              {members.map((m, i) => (
                <div key={i} className="flex justify-between items-center p-5 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-sm font-black text-indigo-400 border border-indigo-500/20">{m.name[0]}</div>
                    <div>
                      <p className="text-sm font-black text-white">{m.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-emerald-400 text-[10px]">✔</span>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Identity Locked</p>
                      </div>
                    </div>
                  </div>
                  <div className={`text-[10px] font-black px-4 py-1.5 rounded-full border ${m.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    {m.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-indigo-600/10 rounded-[3rem] border border-indigo-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20 text-4xl">🔐</div>
              <h4 className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-3">Sovereign Identity Lock</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                This circle is **Locked to CNIC**. All members are legally verified. Roziq holds the Word of Honor (Zubaan) as a digital record.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 mb-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 text-center italic">"Honoring the trust of your kin"</p>
            {members.map((m, i) => (
              <div key={i} className={`flex justify-between items-center p-6 rounded-[2.5rem] border ${m.name.includes('You') ? 'bg-indigo-600 text-white border-indigo-400 shadow-3xl shadow-indigo-900/40' : 'bg-white/5 border-white/5'}`}>
                <div className="flex items-center gap-5">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${m.name.includes('You') ? 'bg-white/20' : 'bg-white/5 text-slate-500'}`}>
                    {m.turn}
                  </span>
                  <div>
                    <p className={`text-sm font-black ${m.name.includes('You') ? 'text-white' : 'text-slate-200'}`}>{m.month}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${m.name.includes('You') ? 'text-white/60' : 'text-slate-500'}`}>{m.name}</p>
                  </div>
                </div>
                {m.name.includes('You') && <span className="text-2xl animate-bounce">🛡️</span>}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          <button className="flex-[2] py-6 bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[2rem] hover:bg-indigo-500 transition-all shadow-4xl hover:-translate-y-1 active:scale-95">
            Contribute PKR {contribution.toLocaleString()}
          </button>
          <button className="flex-1 py-6 bg-white/5 text-slate-400 font-black text-xs uppercase rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all">
            Invite Family
          </button>
        </div>
      </div>
    </div>
  );
}
