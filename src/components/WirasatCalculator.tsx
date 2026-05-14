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
    const netWealth = portfolioValue - debt - wasiyyat;
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
    <div className="premium-card p-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-emerald-100">⚖️</div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Sovereign Wirasat</h2>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Smart Inheritance Engine</p>
          </div>
        </div>

        {!calculated ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 block">Deductions (PKR)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Debts/Loans"
                    className="w-1/2 p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none"
                    onChange={(e) => setDebt(Number(e.target.value))}
                  />
                  <input 
                    type="number" 
                    placeholder="Wasiyyat (Max 1/3)"
                    className="w-1/2 p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none"
                    onChange={(e) => setWasiyyat(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 block">Spouse Status</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none"
                  onChange={(e) => setHeirs({ ...heirs, wife: e.target.value === 'wife' ? 1 : 0, husband: e.target.value === 'husband' })}
                >
                  <option value="wife">Wife Alive</option>
                  <option value="husband">Husband Alive</option>
                  <option value="none">None</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 block">Parents</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none"
                  onChange={(e) => setHeirs({ ...heirs, father: e.target.value !== 'mother', mother: e.target.value !== 'father' })}
                >
                  <option value="both">Both Alive</option>
                  <option value="father">Father Only</option>
                  <option value="mother">Mother Only</option>
                  <option value="none">None</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 block">Number of Sons</label>
                <input 
                  type="number" 
                  value={heirs.sons}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none"
                  onChange={(e) => setHeirs({ ...heirs, sons: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 block">Number of Daughters</label>
                <input 
                  type="number" 
                  value={heirs.daughters}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none"
                  onChange={(e) => setHeirs({ ...heirs, daughters: Number(e.target.value) })}
                />
              </div>
            </div>

            <button 
              onClick={() => setCalculated(true)}
              className="w-full py-4 bg-emerald-600 text-white font-black rounded-[2rem] shadow-xl shadow-emerald-900/10 hover:bg-emerald-700 hover:-translate-y-1 active:scale-95 transition-all"
            >
              Generate Smart Will
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 text-center">
              <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Net Distributable Wealth</div>
              <div className="text-2xl font-black text-slate-800 tracking-tight">PKR {(portfolioValue - debt - wasiyyat).toLocaleString()}</div>
            </div>

            <div className="space-y-3">
              {results.map((res, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div>
                    <div className="font-black text-slate-800 text-sm tracking-tight">{res.name}</div>
                    <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{res.ratio} Share</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-slate-800">PKR {res.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setCalculated(false)}
                className="w-1/2 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all text-sm"
              >
                ← Back
              </button>
              <button 
                className="w-1/2 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all text-sm"
              >
                Legalize Will
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
