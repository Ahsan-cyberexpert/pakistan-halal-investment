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
      alert('Sukuk Purchased Successfully!');
    } else {
      alert('Invalid amount or insufficient balance.');
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-4 sm:mb-6">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight">📜 Fractional Sukuk</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Government & Corporate Islamic Bonds</p>
        </div>
        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-bold rounded-full flex-shrink-0">Stable Yield</span>
      </div>

      <div className="flex space-x-2.5 sm:space-x-3 overflow-x-auto pb-3 sm:pb-4 mb-3 sm:mb-4 scrollbar-none">
        {SUKUKS.map(s => (
          <button 
            key={s.id}
            onClick={() => setSelected(s)}
            className={`flex-shrink-0 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 text-left min-w-[170px] sm:min-w-[200px] transition-all ${selected.id === s.id ? 'border-emerald-600 bg-emerald-50 shadow-sm' : 'border-gray-100 hover:border-emerald-200'}`}
          >
            <div className="text-xs sm:text-sm font-bold text-gray-800 truncate">{s.name}</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 sm:mt-2">{s.yield}</div>
            <div className="text-[10px] sm:text-xs text-gray-500 mt-1">{s.maturity} • {s.risk} Risk</div>
          </button>
        ))}
      </div>

      <div className="bg-gray-50 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl">
        <div className="flex justify-between text-xs sm:text-sm mb-3 sm:mb-4">
          <span className="text-gray-600">Minimum Investment</span>
          <span className="font-bold">PKR {selected.minInvestment}</span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs sm:text-sm">PKR</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder={`Min ${selected.minInvestment}`}
              className="w-full pl-11 pr-3 py-2.5 sm:pl-14 sm:pr-4 sm:py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-xs sm:text-sm outline-none"
            />
          </div>
          <button 
            onClick={handleBuy}
            className="bg-emerald-700 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-bold hover:bg-emerald-800 shadow-md text-xs sm:text-sm flex-shrink-0"
          >
            Invest
          </button>
        </div>
      </div>
    </div>
  );
}
