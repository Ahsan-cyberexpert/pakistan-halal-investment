'use client';
import { useState } from 'react';

export default function WirasatCalculator() {
  const [portfolioValue] = useState(2500000); // 2.5M PKR
  const [calculated, setCalculated] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="text-3xl">⚖️</div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Wirasat (Inheritance)</h2>
          <p className="text-xs text-gray-500">Automated Smart Will per Shariah Law</p>
        </div>
      </div>

      {!calculated ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 font-semibold mb-1 block">Spouse(s)</label>
              <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>1 Wife</option>
                <option>Husband</option>
                <option>None</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold mb-1 block">Parents Alive?</label>
              <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Both</option>
                <option>Father Only</option>
                <option>Mother Only</option>
                <option>None</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold mb-1 block">Sons</label>
              <input type="number" defaultValue="2" className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold mb-1 block">Daughters</label>
              <input type="number" defaultValue="1" className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
            </div>
          </div>
          <button 
            onClick={() => setCalculated(true)}
            className="w-full bg-emerald-700 text-white font-bold py-3 rounded-xl hover:bg-emerald-800"
          >
            Calculate Shariah Shares
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
          <div className="text-xs text-gray-500 mb-3 text-center">Based on PKR {portfolioValue.toLocaleString()} Portfolio</div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center text-sm p-2 bg-white rounded-lg border border-gray-100">
              <span className="font-semibold text-gray-700">Wife (1/8)</span>
              <span className="font-bold text-emerald-700">PKR 312,500</span>
            </div>
            <div className="flex justify-between items-center text-sm p-2 bg-white rounded-lg border border-gray-100">
              <span className="font-semibold text-gray-700">Parents (1/6 each)</span>
              <span className="font-bold text-emerald-700">PKR 833,333</span>
            </div>
            <div className="flex justify-between items-center text-sm p-2 bg-white rounded-lg border border-gray-100">
              <span className="font-semibold text-gray-700">Residue (Sons 2x, Daughters 1x)</span>
              <span className="font-bold text-emerald-700">PKR 1,354,167</span>
            </div>
          </div>
          <button className="w-full bg-gray-900 text-white font-bold py-2 rounded-xl text-sm hover:bg-gray-800">
            Save as Smart Will
          </button>
        </div>
      )}
    </div>
  );
}
