'use client';
import { useState } from 'react';

const charities = [
  { id: 1, name: 'Edhi Foundation', desc: 'Largest ambulance network and social welfare.', logo: '🚑' },
  { id: 2, name: 'Shaukat Khanum', desc: 'Cancer hospital providing free treatment.', logo: '🏥' },
  { id: 3, name: 'Saylani Trust', desc: 'Feeding thousands and vocational training.', logo: '🍲' },
  { id: 4, name: 'Akhuwat', desc: 'Interest-free microfinance for the poor.', logo: '🤝' },
];

export default function ZakatDistribution({ balance, portfolioValue }: { balance: number, portfolioValue: number }) {
  const totalWealth = balance + portfolioValue;
  const nisab = 300000; // Mock Nisab in PKR
  const zakatDue = totalWealth >= nisab ? totalWealth * 0.025 : 0;
  
  const [selectedCharity, setSelectedCharity] = useState<any>(null);
  const [isDistributing, setIsDistributing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDistribute = () => {
    setIsDistributing(true);
    setTimeout(() => {
      setIsDistributing(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <div className="premium-card p-8 bg-emerald-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Tathir Engine</h3>
            <p className="text-2xl font-black tracking-tighter">Zakat Al-Mal</p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">🕋</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="text-[10px] font-bold text-emerald-300 uppercase mb-1">Calculated Zakat</div>
            <div className="text-xl font-black">PKR {zakatDue.toLocaleString()}</div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="text-[10px] font-bold text-emerald-300 uppercase mb-1">Nisab Threshold</div>
            <div className="text-xl font-black">PKR {nisab.toLocaleString()}</div>
          </div>
        </div>

        {zakatDue > 0 ? (
          <div className="space-y-4">
            <p className="text-xs font-bold text-emerald-100/60 uppercase tracking-widest">Select Verified Recipient</p>
            <div className="grid grid-cols-2 gap-3">
              {charities.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCharity(c)}
                  className={`p-4 rounded-2xl border transition-all text-left group ${
                    selectedCharity?.id === c.id 
                      ? 'bg-emerald-500 border-emerald-400 shadow-lg' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="text-2xl mb-2">{c.logo}</div>
                  <div className="text-xs font-black">{c.name}</div>
                </button>
              ))}
            </div>

            {selectedCharity && (
              <button
                onClick={handleDistribute}
                disabled={isDistributing || success}
                className={`w-full mt-6 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all ${
                  success ? 'bg-emerald-400 text-emerald-900 cursor-default' : 'bg-white text-emerald-900 hover:scale-[1.02] active:scale-95 shadow-2xl'
                }`}
              >
                {isDistributing ? 'Processing...' : success ? '✅ Distributed Successfully' : `Purify PKR ${zakatDue.toLocaleString()} via ${selectedCharity.name}`}
              </button>
            )}
          </div>
        ) : (
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
            <p className="text-xs font-bold text-emerald-100">Wealth is currently below Nisab threshold. No Zakat due at this time.</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">📖</div>
          <p className="text-[10px] text-emerald-100/40 italic">
            "The example of those who spend their wealth in the way of Allah is like a seed of grain..." (2:261)
          </p>
        </div>
      </div>
    </div>
  );
}
