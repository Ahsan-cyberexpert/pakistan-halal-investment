'use client';
import { useState } from 'react';

interface PurificationTrackerProps {
  onPurify: (amount: number) => void;
}

export default function PurificationTracker({ onPurify }: PurificationTrackerProps) {
  const [totalDividends] = useState(15000); // Mock data
  const [impurePercentage] = useState(2.8); // 2.8% from interest-bearing deposits
  
  const impureAmount = (totalDividends * impurePercentage) / 100;
  const [purified, setPurified] = useState(false);

  const handlePurify = () => {
    onPurify(impureAmount);
    setPurified(true);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60"></div>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">💧 Dividend Purification (Tathir)</h2>
          <p className="text-xs text-gray-500 mt-1">Automatically calculates non-compliant income for charity.</p>
        </div>
        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-2xl">
          <div className="text-xs text-gray-500 mb-1">Total Dividends Earned</div>
          <div className="text-lg font-bold text-gray-800">PKR {totalDividends.toLocaleString()}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-2xl">
          <div className="text-xs text-red-500 mb-1">Impure Portion ({impurePercentage}%)</div>
          <div className="text-lg font-bold text-red-600">PKR {impureAmount.toLocaleString()}</div>
        </div>
      </div>

      {purified ? (
        <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl text-sm font-medium flex items-center justify-center">
          ✅ Purification complete. May Allah accept it!
        </div>
      ) : (
        <button 
          onClick={handlePurify}
          className="w-full bg-emerald-700 text-white font-semibold py-4 rounded-xl hover:bg-emerald-800 transition-colors shadow-lg shadow-emerald-200"
        >
          Purify Now (Donate PKR {impureAmount.toLocaleString()})
        </button>
      )}
      
      <div className="mt-4 text-xs text-gray-400 text-center">
        *Based on the latest financial sheets of your holdings. AAOIFI mandates giving away income derived from interest.
      </div>
    </div>
  );
}
