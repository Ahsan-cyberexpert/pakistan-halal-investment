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
  const [wasiyyat, setWasiyyat] = useState(0);
  const [calculated, setCalculated] = useState(false);

  const calculateShares = () => {
    const netWealth = Math.max(0, portfolioValue - debt - wasiyyat);
    const shares: { name: string, ratio: string, amount: number }[] = [];

    let remaining = netWealth;

    // 1. Wife/Husband Shares
    if (heirs.husband) {
      const share = netWealth * (1/4);
      shares.push({ name: 'Husband', ratio: '1/4', amount: share });
      remaining -= share;
    } else if (heirs.wife > 0) {
      const share = netWealth * (1/8);
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

    // 3. Children (Residuary)
    const totalChildUnits = (heirs.sons * 2) + heirs.daughters;
    if (totalChildUnits > 0 && remaining > 0) {
      const unitValue = remaining / totalChildUnits;
      if (heirs.sons > 0) {
        shares.push({ name: `Sons (${heirs.sons})`, ratio: `${heirs.sons * 2}/${totalChildUnits} Res.`, amount: unitValue * 2 * heirs.sons });
      }
      if (heirs.daughters > 0) {
        shares.push({ name: `Daughters (${heirs.daughters})`, ratio: `${heirs.daughters}/${totalChildUnits} Res.`, amount: unitValue * heirs.daughters });
      }
    }

    return shares;
  };

  const results = calculated ? calculateShares() : [];

  return (
    <div className="bg-white dark:bg-[#16171b] text-slate-900 dark:text-white rounded-2xl sm:rounded-3xl p-5 shadow-xs border border-slate-200 dark:border-white/10 animate-in fade-in duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Islamic Inheritance</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">Wirasat Estate Calculator</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Algorithmic Quranic estate division & heir share verification</p>
        </div>
        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full flex-shrink-0">
          Quranic Ratios
        </span>
      </div>

      {!calculated ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Outstanding Debts (PKR)</label>
              <input 
                type="number" 
                placeholder="0"
                className="w-full p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                onChange={(e) => setDebt(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Wasiyyat / Bequest (Max 1/3)</label>
              <input 
                type="number" 
                placeholder="0"
                className="w-full p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                onChange={(e) => setWasiyyat(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Spouse</label>
              <select 
                className="w-full p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                onChange={(e) => setHeirs({ ...heirs, wife: e.target.value === 'wife' ? 1 : 0, husband: e.target.value === 'husband' })}
              >
                <option value="wife">Wife Alive</option>
                <option value="husband">Husband Alive</option>
                <option value="none">None</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Parents</label>
              <select 
                className="w-full p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                onChange={(e) => setHeirs({ ...heirs, father: e.target.value !== 'mother', mother: e.target.value !== 'father' })}
              >
                <option value="both">Both Alive</option>
                <option value="father">Father Only</option>
                <option value="mother">Mother Only</option>
                <option value="none">None</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">No. of Sons</label>
              <input 
                type="number" 
                value={heirs.sons}
                className="w-full p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                onChange={(e) => setHeirs({ ...heirs, sons: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">No. of Daughters</label>
              <input 
                type="number" 
                value={heirs.daughters}
                className="w-full p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                onChange={(e) => setHeirs({ ...heirs, daughters: Number(e.target.value) })}
              />
            </div>
          </div>

          <button 
            onClick={() => setCalculated(true)}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all text-xs active:scale-95 shadow-xs mt-1"
          >
            Calculate Shariah Inheritance
          </button>
        </div>
      ) : (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/5 flex justify-between items-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Net Distributable Estate</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">PKR {(portfolioValue - debt - wasiyyat).toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {results.map((res, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/5">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">{res.name}</p>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{res.ratio} Share</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-white text-xs">PKR {res.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <button 
              onClick={() => setCalculated(false)}
              className="w-full py-2.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-all"
            >
              Re-Calculate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
