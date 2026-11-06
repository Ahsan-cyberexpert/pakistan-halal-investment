'use client';
import { useState } from 'react';

interface PurificationTrackerProps {
  onPurify: (amount: number) => void;
}

export default function PurificationTracker({ onPurify }: PurificationTrackerProps) {
  const [totalDividends] = useState(15000); // Mock data
  const [impurePercentage] = useState(2.8); // 2.8% from interest-bearing deposits
  const [selectedCharity, setSelectedCharity] = useState('Edhi Foundation');
  
  const impureAmount = (totalDividends * impurePercentage) / 100;
  const [purified, setPurified] = useState(false);

  const charities = [
    { name: 'Edhi Foundation', icon: '🚑' },
    { name: 'Indus Hospital', icon: '🏥' },
    { name: 'TCF (Education)', icon: '📚' },
  ];

  const handlePurify = () => {
    onPurify(impureAmount);
    setPurified(true);
  };

  return (
    <div className="premium-card p-4 sm:p-6 overflow-hidden relative group h-full flex flex-col justify-between">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 text-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-inner border border-emerald-100 flex-shrink-0">💧</div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">Tathir Router</h2>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-0.5">Algorithmic Purification</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Total Dividends</div>
            <div className="text-base sm:text-lg font-black text-slate-800 tracking-tight">PKR {totalDividends.toLocaleString()}</div>
          </div>
          <div className="p-3 sm:p-4 bg-rose-50 rounded-2xl border border-rose-100">
            <div className="text-xs font-black text-rose-500 uppercase tracking-wider mb-1">Impure ({impurePercentage}%)</div>
            <div className="text-base sm:text-lg font-black text-rose-600 tracking-tight">PKR {impureAmount.toLocaleString()}</div>
          </div>
        </div>

        {!purified ? (
          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 block px-0.5">Route Purification To:</label>
              <div className="flex gap-2 sm:gap-3">
                {charities.map((c) => (
                  <button 
                    key={c.name}
                    onClick={() => setSelectedCharity(c.name)}
                    className={`flex-1 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all duration-200 flex flex-col items-center gap-1 ${
                      selectedCharity === c.name 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-900/10 scale-105' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200 hover:text-emerald-600'
                    }`}
                  >
                    <span className="text-lg sm:text-xl">{c.icon}</span>
                    <span className="text-xs font-black uppercase tracking-tight">{c.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handlePurify}
              className="w-full py-3 sm:py-3.5 bg-emerald-600 text-white font-black rounded-xl sm:rounded-[2rem] shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 active:scale-95 transition-all text-xs sm:text-sm"
            >
              Authorize Auto-Route →
            </button>
          </div>
        ) : (
          <div className="p-5 sm:p-6 bg-emerald-50 rounded-2xl sm:rounded-[2rem] border border-emerald-100 text-center animate-in zoom-in duration-300">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center text-xl sm:text-2xl mx-auto mb-2 sm:mb-3 shadow-sm">✅</div>
            <h3 className="text-base sm:text-lg font-black text-emerald-800 tracking-tight">Wealth Purified</h3>
            <p className="text-xs font-bold text-emerald-600/70 uppercase tracking-widest mt-0.5">Routed to {selectedCharity}</p>
          </div>
        )}

        <p className="mt-4 sm:mt-6 text-xs font-bold text-slate-400 text-center uppercase tracking-widest leading-relaxed">
          *Simulated compliance audit by Roziq AI. <br />AAOIFI Standard No. 21 Inspired Guidelines.
        </p>
      </div>
    </div>
  );
}
