'use client';
import { useState, useEffect } from 'react';

const charities = [
  { id: 0, name: 'Roziq Direct', desc: 'Direct-to-family verified distribution via CNIC.', logo: '🇵🇰', verified: true },
  { id: 1, name: 'Edhi Foundation', desc: 'Largest ambulance network and social welfare.', logo: '🚑', verified: true },
  { id: 2, name: 'Shaukat Khanum', desc: 'Cancer hospital providing free treatment.', logo: '🏥', verified: true },
  { id: 3, name: 'Saylani Trust', desc: 'Feeding thousands and vocational training.', logo: '🍲', verified: true },
  { id: 4, name: 'Akhuwat', desc: 'Interest-free microfinance for the poor.', logo: '🤝', verified: true },
];

export default function ZakatDistribution({ balance, portfolioValue }: { balance: number, portfolioValue: number }) {
  const totalWealth = balance + portfolioValue;
  const nisab = 300000;
  const zakatDue = totalWealth >= nisab ? totalWealth * 0.025 : 0;
  
  const [selectedCharity, setSelectedCharity] = useState<any>(null);
  const [isDistributing, setIsDistributing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [vaultData, setVaultData] = useState<any>(null);

  // Fetch National Vault Data
  useEffect(() => {
    fetch('/api/zakat/vault').then(r => r.json()).then(setVaultData);
  }, [success]);

  const handleDistribute = async () => {
    setIsDistributing(true);
    if (selectedCharity.id === 0) {
      // National Vault Logic
      const res = await fetch('/api/zakat/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: zakatDue })
      });
      if (res.ok) {
        setSuccess(true);
        window.dispatchEvent(new CustomEvent('balanceUpdate'));
      }
    } else {
      // Direct NGO Logic
      await new Promise(r => setTimeout(r, 2000));
      setSuccess(true);
    }
    setIsDistributing(false);
  };

  return (
    <div className="premium-card p-0 bg-slate-950 border border-emerald-500/10 text-white relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg mb-4 sm:mb-6">
      
      {/* National Vault Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-900/40 to-slate-900 border-b border-white/5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-lg sm:text-xl shadow-md shadow-emerald-500/20 flex-shrink-0">🏛️</div>
            <div>
              <h3 className="text-sm sm:text-base font-black tracking-tight">National Zakat Vault</h3>
              <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Public Sovereignty Fund</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[8px] font-bold text-slate-400 uppercase mb-0.5">Total Collected</p>
            <p className="text-base sm:text-lg font-black text-white tracking-tight">
              <span className="text-[9px] text-emerald-400 mr-1">PKR</span>
              {vaultData?.totalVault?.toLocaleString() || '4,580,250'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <div className="bg-white/5 p-3 rounded-xl sm:rounded-2xl border border-white/5">
            <div className="text-[8px] sm:text-[9px] font-bold text-emerald-400 uppercase mb-0.5">Your Zakat Due</div>
            <div className="text-base sm:text-lg font-black tracking-tight">PKR {zakatDue.toLocaleString()}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl sm:rounded-2xl border border-white/5">
            <div className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase mb-0.5">Status</div>
            <div className="text-xs font-black flex items-center gap-1.5 mt-1">
              <span className={`w-1.5 h-1.5 rounded-full ${zakatDue > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              {zakatDue > 0 ? 'Action Required' : 'Purified'}
            </div>
          </div>
        </div>

        {zakatDue > 0 && !success ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              {charities.slice(0, 2).map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCharity(c)}
                  className={`p-3 rounded-xl sm:rounded-2xl border transition-all flex items-center gap-2.5 group ${
                    selectedCharity?.id === c.id 
                      ? 'bg-emerald-600 border-emerald-400 shadow-md' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xl sm:text-2xl flex-shrink-0">{c.logo}</div>
                  <div className="text-left">
                    <div className="text-xs font-black">{c.name}</div>
                    <p className="text-[9px] opacity-70 font-medium truncate max-w-[200px] sm:max-w-none">{c.desc}</p>
                  </div>
                  {c.id === 0 ? (
                    <div className="ml-auto bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[7px] font-black uppercase flex-shrink-0">0.5% Fee</div>
                  ) : (
                    <div className="ml-auto bg-white/10 px-2 py-0.5 rounded-full text-[7px] font-black uppercase flex-shrink-0">0% Fee</div>
                  )}
                </button>
              ))}
            </div>

            {selectedCharity && (
              <button
                onClick={handleDistribute}
                disabled={isDistributing}
                className="w-full py-2.5 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:bg-emerald-50 active:scale-95 transition-all"
              >
                {isDistributing ? 'Authorizing Ledger...' : `Authorize PKR ${zakatDue.toLocaleString()} Payment`}
              </button>
            )}
          </div>
        ) : success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-center animate-in zoom-in-95">
            <div className="text-2xl mb-1">✨</div>
            <h4 className="text-sm sm:text-base font-black text-emerald-400 mb-0.5">Wealth Purified</h4>
            <p className="text-[10px] sm:text-xs text-emerald-100/70 leading-relaxed">
              Your contribution is now in the **National Vault**. You will receive notifications as it is spent on verified impact projects.
            </p>
          </div>
        ) : null}

        {/* Impact Feed */}
        <div className="space-y-2">
          <h4 className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">Personal Impact Tracking</h4>
          <div className="space-y-1.5">
            {vaultData?.userContributions?.length === 0 ? (
              <div className="p-4 text-center border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-[9px] font-bold text-slate-500 italic">No contributions yet. Purify wealth to see live impact.</p>
              </div>
            ) : (
              vaultData?.userContributions?.map((c: any) => (
                <div key={c.id} className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">{c.status}</span>
                    <span className="text-[8px] font-mono text-slate-400">{new Date(c.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs font-black text-white">PKR {c.amount.toLocaleString()}</p>
                      <p className="text-[8px] text-slate-400">Awaiting national distribution...</p>
                    </div>
                    <div className="w-7 h-7 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 text-xs flex-shrink-0">
                      🔒
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
