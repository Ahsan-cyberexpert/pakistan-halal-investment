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
    <div className="premium-card p-0 overflow-hidden group rounded-2xl sm:rounded-[3rem] bg-white border border-slate-100 shadow-xl relative mb-4 sm:mb-6 animate-in fade-in duration-500">
      <div className="bg-slate-950 p-4 sm:p-10 text-white relative border-b border-white/5">
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-500/10 rounded-full blur-[50px] sm:blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-8">
            <div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-emerald-500/10 text-emerald-400 text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  Shariah Legacy Engine
                </div>
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-slate-800 text-slate-400 text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/5">
                  Free Service
                </div>
              </div>
              <h2 className="text-xl sm:text-4xl font-black tracking-tighter italic text-white">SOVEREIGN <span className="text-emerald-500">WIRASAT</span></h2>
              <p className="text-slate-500 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mt-0.5 sm:mt-2">Algorithmic Inheritance Distribution</p>
            </div>
            <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white/5 rounded-xl sm:rounded-3xl flex items-center justify-center text-xl sm:text-4xl border border-white/10 shadow-lg flex-shrink-0">⚖️</div>
          </div>

          {!calculated ? (
            <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 items-end">
                <div className="sm:col-span-2 md:col-span-3">
                  <label className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-2 block">Deductions (PKR)</label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <input 
                      type="number" 
                      placeholder="Outstanding Debts"
                      className="w-full sm:w-1/2 p-3 sm:p-4 bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl text-xs font-bold text-white focus:bg-white/10 outline-none focus:border-emerald-500 transition-all"
                      onChange={(e) => setDebt(Number(e.target.value))}
                    />
                    <input 
                      type="number" 
                      placeholder="Wasiyyat (Max 1/3)"
                      className="w-full sm:w-1/2 p-3 sm:p-4 bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl text-xs font-bold text-white focus:bg-white/10 outline-none focus:border-emerald-500 transition-all"
                      onChange={(e) => setWasiyyat(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-2 block">Primary Spouse</label>
                  <select 
                    className="w-full p-3 sm:p-4 bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl text-xs font-bold text-white outline-none focus:border-emerald-500 transition-all"
                    onChange={(e) => setHeirs({ ...heirs, wife: e.target.value === 'wife' ? 1 : 0, husband: e.target.value === 'husband' })}
                  >
                    <option value="wife" className="text-black">Wife Alive</option>
                    <option value="husband" className="text-black">Husband Alive</option>
                    <option value="none" className="text-black">None</option>
                  </select>
                </div>

                <div>
                  <label className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-2 block">Parents</label>
                  <select 
                    className="w-full p-3 sm:p-4 bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl text-xs font-bold text-white outline-none focus:border-emerald-500 transition-all"
                    onChange={(e) => setHeirs({ ...heirs, father: e.target.value !== 'mother', mother: e.target.value !== 'father' })}
                  >
                    <option value="both" className="text-black">Both Alive</option>
                    <option value="father" className="text-black">Father Only</option>
                    <option value="mother" className="text-black">Mother Only</option>
                    <option value="none" className="text-black">None</option>
                  </select>
                </div>

                <div>
                  <label className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-2 block">No. of Sons</label>
                  <input 
                    type="number" 
                    value={heirs.sons}
                    className="w-full p-3 sm:p-4 bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl text-xs font-bold text-white outline-none focus:border-emerald-500 transition-all"
                    onChange={(e) => setHeirs({ ...heirs, sons: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-2 block">No. of Daughters</label>
                  <input 
                    type="number" 
                    value={heirs.daughters}
                    className="w-full p-3 sm:p-4 bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl text-xs font-bold text-white outline-none focus:border-emerald-500 transition-all"
                    onChange={(e) => setHeirs({ ...heirs, daughters: Number(e.target.value) })}
                  />
                </div>
              </div>

              <button 
                onClick={() => setCalculated(true)}
                className="w-full py-3 sm:py-5 bg-emerald-600 text-white font-black rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-900/30 hover:bg-emerald-500 transition-all text-xs uppercase tracking-widest active:scale-95 mt-2"
              >
                Generate Legal Shariah Will
              </button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="p-4 sm:p-6 bg-white/5 rounded-xl sm:rounded-[2rem] border border-white/5 text-center shadow-sm">
                <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1 italic">Net Distributable Estate</p>
                <p className="text-xl sm:text-3xl font-black text-white italic tracking-tight">PKR {(portfolioValue - debt - wasiyyat).toLocaleString()}</p>
              </div>

              {/* Responsive 2-Column Grid on Desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-start">
                {results.map((res, i) => (
                  <div key={i} className="flex justify-between items-center p-3.5 sm:p-5 bg-white/5 rounded-xl sm:rounded-2xl border border-white/5 hover:bg-white/10 transition-all shadow-sm">
                    <div>
                      <p className="font-black text-white text-xs sm:text-sm tracking-tight">{res.name}</p>
                      <p className="text-[8px] sm:text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">{res.ratio} Share</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-black text-white text-xs sm:text-sm">PKR {res.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      <button className="text-[7px] font-black text-emerald-400 uppercase tracking-tighter mt-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 active:scale-95 transition-all">Link CNIC</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6 pt-2">
                <button 
                  onClick={() => setCalculated(false)}
                  className="w-full sm:flex-1 py-3 sm:py-5 bg-white/5 text-slate-400 font-black text-[9px] sm:text-[10px] uppercase rounded-xl sm:rounded-2xl border border-white/5 active:scale-95 transition-all text-center"
                >
                  Edit Family
                </button>
                <button 
                  className="w-full sm:flex-[2] py-3 sm:py-5 bg-white text-slate-900 font-black text-[9px] sm:text-[10px] uppercase rounded-xl sm:rounded-2xl shadow-lg active:scale-95 transition-all text-center"
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
