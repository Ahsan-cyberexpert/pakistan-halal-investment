'use client';
import { useState } from 'react';

const SUKUKS = [
  { id: 'gop-green', name: 'GoP Green Ijarah Sukuk', yield: '18.5%', maturity: '1 Year', type: 'Sovereign', risk: 'Low', minInvestment: 500 },
  { id: 'wapda-energy', name: 'WAPDA Energy Sukuk II', yield: '19.2%', maturity: '3 Years', type: 'Corporate', risk: 'Medium', minInvestment: 1000 },
];

export default function FractionalSukuk({ balance, onBuy }: { balance: number, onBuy: (amount: number) => void }) {
  const [selected, setSelected] = useState(SUKUKS[0]);
  const [amount, setAmount] = useState<number | ''>('');

  const handleBuy = () => {
    if (typeof amount === 'number' && amount >= selected.minInvestment && balance >= amount) {
      onBuy(amount);
      setAmount('');
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Fixed Income</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Fractional Sukuk Vault</h2>
          <p className="text-xs text-slate-500">Government & Corporate Asset-Backed Islamic Bonds</p>
        </div>
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-semibold rounded-full flex-shrink-0">
          Sovereign Grade
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
        {SUKUKS.map(s => (
          <button 
            key={s.id}
            onClick={() => setSelected(s)}
            className={`p-3.5 rounded-xl border text-left transition-all ${selected.id === s.id ? 'border-emerald-600 bg-emerald-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'}`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-800 truncate">{s.name}</span>
              <span className="text-[9px] font-semibold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">{s.maturity}</span>
            </div>
            <div className="text-lg font-bold text-emerald-700">{s.yield} <span className="text-[10px] font-normal text-slate-500">p.a.</span></div>
            <div className="text-[10px] text-slate-500 mt-0.5">{s.type} · {s.risk} Risk</div>
          </button>
        ))}
      </div>

      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-slate-500">Minimum Entry</span>
          <span className="font-semibold text-slate-800">PKR {selected.minInvestment.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">PKR</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder={`Min ${selected.minInvestment}`}
              className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-emerald-500 font-semibold text-sm sm:text-xs text-slate-900 outline-none"
            />
          </div>
          <button 
            onClick={handleBuy}
            disabled={!amount || amount < selected.minInvestment || amount > balance}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white px-5 py-2 rounded-lg font-semibold text-xs transition-all flex-shrink-0 shadow-sm"
          >
            Invest
          </button>
        </div>
      </div>
    </div>
  );
}
