'use client';
import { useState } from 'react';

interface PurificationTrackerProps {
  onPurify: (amount: number) => void;
}

export default function PurificationTracker({ onPurify }: PurificationTrackerProps) {
  const [totalDividends] = useState(15000);
  const [impurePercentage] = useState(2.8);
  const [selectedCharity, setSelectedCharity] = useState('Edhi Foundation');
  
  const impureAmount = (totalDividends * impurePercentage) / 100;
  const [purified, setPurified] = useState(false);

  const charities = [
    { name: 'Edhi Foundation', code: 'EF' },
    { name: 'Indus Hospital', code: 'IH' },
    { name: 'TCF (Education)', code: 'TCF' },
  ];

  const handlePurify = () => {
    onPurify(impureAmount);
    setPurified(true);
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#16171b] p-5 shadow-xs overflow-hidden h-full flex flex-col justify-between text-slate-900 dark:text-white">
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Tathir Router</h2>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mt-0.5">Algorithmic Dividend Purification</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/5">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Dividends</div>
            <div className="text-base font-bold text-slate-900 dark:text-white tracking-tight">PKR {totalDividends.toLocaleString()}</div>
          </div>
          <div className="p-3.5 bg-rose-50/60 dark:bg-rose-500/10 rounded-xl border border-rose-200/60 dark:border-rose-500/20">
            <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">Impure ({impurePercentage}%)</div>
            <div className="text-base font-bold text-rose-600 dark:text-rose-400 tracking-tight">PKR {impureAmount.toLocaleString()}</div>
          </div>
        </div>

        {!purified ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                Route Purification To:
              </label>
              <div className="flex gap-2">
                {charities.map((c) => (
                  <button 
                    key={c.name}
                    onClick={() => setSelectedCharity(c.name)}
                    className={`flex-1 p-2.5 rounded-xl border text-center transition-all ${
                      selectedCharity === c.name
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shadow-xs'
                        : 'border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold mb-0.5">{c.code}</div>
                    <div className="text-xs font-medium truncate">{c.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handlePurify}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
            >
              Purify PKR {impureAmount.toLocaleString()} Now
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              Purification Complete — Routed to {selectedCharity}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cryptographic receipt ready in audit tab</p>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-4">
        Follows AAOIFI standard on non-permissible dividend purification
      </p>
    </div>
  );
}
