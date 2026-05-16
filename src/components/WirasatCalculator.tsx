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
    <div className="premium-card p-0 overflow-hidden group rounded-[3rem] bg-white border border-slate-100 shadow-4xl relative">
      <div className="bg-slate-950 p-10 text-white relative border-b border-white/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex gap-2 mb-6">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  Shariah Legacy Engine
                </div>
                <div className="inline-flex items-center gap-2 bg-slate-800 text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-white/5">
                  Free Sovereign Service
                </div>
              </div>
              <h2 className="text-4xl font-black tracking-tighter italic text-white">SOVEREIGN <span className="text-emerald-500">WIRASAT</span></h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Algorithmic Inheritance Distribution</p>
            </div>
            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-4xl border border-white/10 shadow-2xl">⚖️</div>
          </div>

          {!calculated ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Deductions (PKR)</label>
                  <div className="flex gap-3">
                    <input 
                      type="number" 
                      placeholder="Outstanding Debts"
                      className="w-1/2 p-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold text-white focus:bg-white/10 outline-none"
                      onChange={(e) => setDebt(Number(e.target.value))}
                    />
                    <input 
                      type="number" 
                      placeholder="Wasiyyat (Max 1/3)"
                      className="w-1/2 p-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold text-white focus:bg-white/10 outline-none"
                      onChange={(e) => setWasiyyat(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Primary Spouse</label>
                  <select 
                    className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold text-white outline-none"
                    onChange={(e) => setHeirs({ ...heirs, wife: e.target.value === 'wife' ? 1 : 0, husband: e.target.value === 'husband' })}
                  >
                    <option value="wife" className="text-black">Wife Alive</option>
                    <option value="husband" className="text-black">Husband Alive</option>
                    <option value="none" className="text-black">None</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Parents</label>
                  <select 
                    className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold text-white outline-none"
                    onChange={(e) => setHeirs({ ...heirs, father: e.target.value !== 'mother', mother: e.target.value !== 'father' })}
                  >
                    <option value="both" className="text-black">Both Alive</option>
                    <option value="father" className="text-black">Father Only</option>
                    <option value="mother" className="text-black">Mother Only</option>
                    <option value="none" className="text-black">None</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 block">No. of Sons</label>
                  <input 
                    type="number" 
                    value={heirs.sons}
                    className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold text-white outline-none"
                    onChange={(e) => setHeirs({ ...heirs, sons: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 block">No. of Daughters</label>
                  <input 
                    type="number" 
                    value={heirs.daughters}
                    className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold text-white outline-none"
                    onChange={(e) => setHeirs({ ...heirs, daughters: Number(e.target.value) })}
                  />
                </div>
              </div>

              <button 
                onClick={() => setCalculated(true)}
                className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/30 hover:bg-emerald-500 transition-all text-xs uppercase tracking-widest"
              >
                Generate Legal Shariah Will
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Net Distributable Estate</p>
                <p className="text-3xl font-black text-white italic">PKR {(portfolioValue - debt - wasiyyat).toLocaleString()}</p>
              </div>

              <div className="space-y-3">
                {results.map((res, i) => (
                  <div key={i} className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                    <div>
                      <p className="font-black text-white text-xs">{res.name}</p>
                      <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">{res.ratio} Share</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-white text-sm">PKR {res.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      <button className="text-[7px] font-black text-emerald-400 uppercase tracking-tighter mt-1 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">Link CNIC</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => setCalculated(false)}
                  className="flex-1 py-5 bg-white/5 text-slate-400 font-black text-[10px] uppercase rounded-2xl border border-white/5"
                >
                  Edit Family
                </button>
                <button 
                  className="flex-[2] py-5 bg-white text-slate-900 font-black text-[10px] uppercase rounded-2xl shadow-4xl"
                >
                  Lock Heir CNICs 🔒
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
