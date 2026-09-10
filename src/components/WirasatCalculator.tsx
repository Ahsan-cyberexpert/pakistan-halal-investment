'use client';
import { useState } from 'react';

interface Heirs {
  wife: number;
  husband: boolean;
  father: boolean;
  mother: boolean;
  sons: number;
  daughters: number;
}

export default function WirasatCalculator({ portfolioValue = 2500000 }: { portfolioValue?: number }) {
  const [heirs, setHeirs] = useState<Heirs>({
    wife: 1,
    husband: false,
    father: true,
    mother: true,
    sons: 2,
    daughters: 1
  });
  
  const [debt, setDebt] = useState(0);
  const [wasiyyat, setWasiyyat] = useState(0); // Max 1/3
  const [calculated, setCalculated] = useState(false);

  const calculateShares = () => {
    const netWealth = Math.max(0, portfolioValue - debt - wasiyyat);
    const shares: { name: string, ratio: string, amount: number }[] = [];

    let remaining = netWealth;

    // 1. Wife/Husband Shares
    if (heirs.husband) {
      const share = netWealth * (1/4); // 1/4 if children exist
      shares.push({ name: 'Husband', ratio: '1/4', amount: share });
      remaining -= share;
    } else if (heirs.wife > 0) {
      const share = netWealth * (1/8); // 1/8 if children exist
      shares.push({ name: `Wife (${heirs.wife})`, ratio: '1/8', amount: share });
      remaining -= share;
    }

    // 2. Parents
    if (heirs.father) {
      const share = netWealth * (1/6);
      shares.push({ name: 'Father', ratio: '1/6', amount: share });
      remaining -= share;
    }
    if (heirs.mother) {
      const share = netWealth * (1/6);
      shares.push({ name: 'Mother', ratio: '1/6', amount: share });
      remaining -= share;
    }

    // 3. Children (Residue)
    const totalParts = (heirs.sons * 2) + heirs.daughters;
    if (totalParts > 0) {
      const perPart = remaining / totalParts;
      if (heirs.sons > 0) {
        shares.push({ name: `Sons (${heirs.sons})`, ratio: 'Residue (2x)', amount: perPart * 2 * heirs.sons });
      }
      if (heirs.daughters > 0) {
        shares.push({ name: `Daughters (${heirs.daughters})`, ratio: 'Residue (1x)', amount: perPart * heirs.daughters });
      }
    }

    return shares;
  };

  const results = calculated ? calculateShares() : [];

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80 animate-in fade-in duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Islamic Inheritance</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Wirasat Estate Calculator</h2>
          <p className="text-xs text-slate-500">Algorithmic Quranic estate division & heir share verification</p>
        </div>
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-semibold rounded-full flex-shrink-0">
          Quranic Ratios
        </span>
      </div>

      {!calculated ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Outstanding Debts (PKR)</label>
              <input 
                type="number" 
                placeholder="0"
                className="w-full p-2.5 sm:p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500"
                onChange={(e) => setDebt(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Wasiyyat / Bequest (Max 1/3)</label>
              <input 
                type="number" 
                placeholder="0"
                className="w-full p-2.5 sm:p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500"
                onChange={(e) => setWasiyyat(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Spouse</label>
              <select 
                className="w-full p-2.5 sm:p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500"
                onChange={(e) => setHeirs({ ...heirs, wife: e.target.value === 'wife' ? 1 : 0, husband: e.target.value === 'husband' })}
              >
                <option value="wife">Wife Alive</option>
                <option value="husband">Husband Alive</option>
                <option value="none">None</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Parents</label>
              <select 
                className="w-full p-2.5 sm:p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500"
                onChange={(e) => setHeirs({ ...heirs, father: e.target.value !== 'mother', mother: e.target.value !== 'father' })}
              >
                <option value="both">Both Alive</option>
                <option value="father">Father Only</option>
                <option value="mother">Mother Only</option>
                <option value="none">None</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">No. of Sons</label>
              <input 
                type="number" 
                value={heirs.sons}
                className="w-full p-2.5 sm:p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500"
                onChange={(e) => setHeirs({ ...heirs, sons: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">No. of Daughters</label>
              <input 
                type="number" 
                value={heirs.daughters}
                className="w-full p-2.5 sm:p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500"
                onChange={(e) => setHeirs({ ...heirs, daughters: Number(e.target.value) })}
              />
            </div>
          </div>

          <button 
            onClick={() => setCalculated(true)}
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl transition-all text-xs active:scale-95 shadow-sm mt-1"
          >
            Calculate Shariah Inheritance
          </button>
        </div>
      ) : (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">Net Distributable Estate</span>
            <span className="text-base font-bold text-slate-900">PKR {(portfolioValue - debt - wasiyyat).toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {results.map((res, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50/70 rounded-xl border border-slate-200/70">
                <div>
                  <p className="font-bold text-slate-800 text-xs">{res.name}</p>
                  <p className="text-[9px] font-semibold text-emerald-700 uppercase tracking-wider">{res.ratio} Share</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 text-xs">PKR {res.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <button 
              onClick={() => setCalculated(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all"
            >
              Re-Calculate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
