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
    <div className="premium-card p-0 bg-slate-950 border border-emerald-500/10 text-white relative overflow-hidden rounded-[3rem]">
      
      {/* National Vault Header */}
      <div className="p-8 bg-gradient-to-br from-emerald-900/40 to-slate-900 border-b border-white/5">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">🏛️</div>
            <div>
              <h3 className="text-xl font-black tracking-tight">National Zakat Vault</h3>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Public Sovereignty Fund</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total Collected</p>
            <p className="text-2xl font-black text-white">
              <span className="text-xs text-emerald-500 mr-1">PKR</span>
              {vaultData?.totalVault?.toLocaleString() || '4,580,250'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
            <div className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Your Zakat Due</div>
            <div className="text-2xl font-black tracking-tighter">PKR {zakatDue.toLocaleString()}</div>
          </div>
          <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
            <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Status</div>
            <div className="text-xs font-black flex items-center gap-2 mt-2">
              <span className={`w-2 h-2 rounded-full ${zakatDue > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              {zakatDue > 0 ? 'Action Required' : 'Purified'}
            </div>
          </div>
        </div>

        {zakatDue > 0 && !success ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3">
              {charities.slice(0, 2).map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCharity(c)}
                  className={`p-5 rounded-[2rem] border transition-all flex items-center gap-4 group ${
                    selectedCharity?.id === c.id 
                      ? 'bg-emerald-600 border-emerald-400 shadow-2xl' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-3xl">{c.logo}</div>
                  <div className="text-left">
                    <div className="text-sm font-black">{c.name}</div>
                    <p className="text-[10px] opacity-60 font-medium">{c.desc}</p>
                  </div>
                  {c.id === 0 ? (
                    <div className="ml-auto bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-[8px] font-black uppercase">0.5% Verification Fee</div>
                  ) : (
                    <div className="ml-auto bg-white/10 px-3 py-1 rounded-full text-[8px] font-black uppercase">0% Platform Fee</div>
                  )}
                </button>
              ))}
            </div>

            {selectedCharity && (
              <button
                onClick={handleDistribute}
                disabled={isDistributing}
                className="w-full py-5 bg-white text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-3xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                {isDistributing ? 'Authorizing Ledger...' : `Authorize PKR ${zakatDue.toLocaleString()} Payment`}
              </button>
            )}
          </div>
        ) : success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2.5rem] text-center animate-in zoom-in-95">
            <div className="text-5xl mb-4">✨</div>
            <h4 className="text-xl font-black text-emerald-400 mb-2">Wealth Purified</h4>
            <p className="text-xs text-emerald-100/60 leading-relaxed">
              Your contribution is now in the **National Vault**. You will receive notifications as it is spent on verified impact projects.
            </p>
          </div>
        ) : null}

        {/* Impact Feed */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Personal Impact Tracking</h4>
          <div className="space-y-3">
            {vaultData?.userContributions?.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                <p className="text-[10px] font-bold text-slate-600 italic">No contributions yet. Purify wealth to see live impact.</p>
              </div>
            ) : (
              vaultData?.userContributions?.map((c: any) => (
                <div key={c.id} className="bg-white/5 p-5 rounded-[2rem] border border-white/5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{c.status}</span>
                    <span className="text-[10px] font-mono text-slate-500">{new Date(c.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-black text-white">PKR {c.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-500">Awaiting national distribution...</p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
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
