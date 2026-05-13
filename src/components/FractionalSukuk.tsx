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
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">📜 Fractional Sukuk</h2>
          <p className="text-sm text-gray-500">Government & Corporate Islamic Bonds</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Stable Yield</span>
      </div>

      <div className="flex space-x-3 overflow-x-auto pb-4 mb-4">
        {SUKUKS.map(s => (
          <button 
            key={s.id}
            onClick={() => setSelected(s)}
            className={`flex-shrink-0 p-4 rounded-2xl border-2 text-left min-w-[200px] transition-all ${selected.id === s.id ? 'border-emerald-600 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200'}`}
          >
            <div className="text-sm font-bold text-gray-800 truncate">{s.name}</div>
            <div className="text-2xl font-black text-emerald-700 mt-2">{s.yield}</div>
            <div className="text-xs text-gray-500 mt-1">{s.maturity} • {s.risk} Risk</div>
          </button>
        ))}
      </div>

      <div className="bg-gray-50 p-5 rounded-2xl">
        <div className="flex justify-between text-sm mb-4">
          <span className="text-gray-600">Minimum Investment</span>
          <span className="font-bold">PKR {selected.minInvestment}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">PKR</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder={`Min ${selected.minInvestment}`}
              className="w-full pl-14 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
            />
          </div>
          <button 
            onClick={handleBuy}
            className="bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-800 shadow-md"
          >
            Invest
          </button>
        </div>
      </div>
    </div>
  );
}
