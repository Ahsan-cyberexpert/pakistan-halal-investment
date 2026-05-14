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
    <div className="premium-card p-8 overflow-hidden relative group">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-emerald-100">💧</div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Tathir Router</h2>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Algorithmic Purification</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Total Dividends</div>
            <div className="text-xl font-black text-slate-800 tracking-tight">PKR {totalDividends.toLocaleString()}</div>
          </div>
          <div className="p-5 bg-rose-50 rounded-[2rem] border border-rose-100">
            <div className="text-[10px] font-black text-rose-500 uppercase tracking-wider mb-2">Impure ({impurePercentage}%)</div>
            <div className="text-xl font-black text-rose-600 tracking-tight">PKR {impureAmount.toLocaleString()}</div>
          </div>
        </div>

        {!purified ? (
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3 block px-1">Route Purification To:</label>
              <div className="flex gap-3">
                {charities.map((c) => (
                  <button 
                    key={c.name}
                    onClick={() => setSelectedCharity(c.name)}
                    className={`flex-1 p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-1 ${
                      selectedCharity === c.name 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-900/10 scale-105' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200 hover:text-emerald-600'
                    }`}
                  >
                    <span className="text-xl">{c.icon}</span>
                    <span className="text-[8px] font-black uppercase tracking-tight">{c.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handlePurify}
              className="w-full py-4 bg-emerald-600 text-white font-black rounded-[2rem] shadow-2xl shadow-emerald-900/20 hover:bg-emerald-700 hover:-translate-y-1 active:scale-95 transition-all"
            >
              Authorize Auto-Route →
            </button>
          </div>
        ) : (
          <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 text-center animate-in zoom-in duration-500">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">✅</div>
            <h3 className="text-lg font-black text-emerald-800 tracking-tight">Wealth Purified</h3>
            <p className="text-xs font-bold text-emerald-600/70 uppercase tracking-widest mt-1">Routed to {selectedCharity}</p>
          </div>
        )}

        <p className="mt-8 text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest leading-relaxed">
          *Real-time compliance audit by Roziq AI. <br />AAOIFI Standard No. 21 Compliant.
        </p>
      </div>
    </div>
  );
}
