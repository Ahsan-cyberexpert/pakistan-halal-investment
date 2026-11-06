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
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#16171b] shadow-xs overflow-hidden">
      <div className="p-5 text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-blue-500/20">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                Private Family Circle
              </div>
              <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/10">
                Free Service
              </div>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">FAMILY KAMETI</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mt-0.5">Verified Trust-Network Only</p>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-blue-600 dark:text-blue-400 flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/5">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">Total Payout</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">PKR {currentPot.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-blue-50/50 dark:bg-blue-500/10 rounded-xl border border-blue-200/60 dark:border-blue-500/20">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-0.5">Contribution</p>
            <p className="text-lg font-bold text-blue-700 dark:text-blue-300 tracking-tight">PKR {contribution.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/5 mb-4">
          <button 
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'info' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Members
          </button>
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'schedule' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Payout Schedule
          </button>
        </div>

        {activeTab === 'info' ? (
          <div className="space-y-2">
            {members.map((m, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold text-xs flex items-center justify-center">
                    {m.turn}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{m.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{m.month}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-center">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Next Turn: <strong className="text-slate-900 dark:text-white">Ayesha (Sister)</strong> in June 2026
            </p>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50/70 dark:bg-black/20">
        <button
          onClick={() => onContribute?.(contribution)}
          className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-xl font-semibold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xs"
        >
          Pay Monthly Contribution (PKR {contribution.toLocaleString()})
        </button>
      </div>
    </div>
  );
}
