'use client';
import { useState, useEffect } from 'react';

const charities = [
  { id: 0, name: 'Roziq Direct', desc: 'Direct-to-family verified distribution via CNIC.', badge: 'RD', verified: true },
  { id: 1, name: 'Edhi Foundation', desc: 'Largest ambulance network and social welfare.', badge: 'EF', verified: true },
  { id: 2, name: 'Shaukat Khanum', desc: 'Cancer hospital providing free treatment.', badge: 'SK', verified: true },
  { id: 3, name: 'Saylani Trust', desc: 'Feeding thousands and vocational training.', badge: 'ST', verified: true },
  { id: 4, name: 'Akhuwat', desc: 'Interest-free microfinance for the poor.', badge: 'AK', verified: true },
];

export default function ZakatDistribution({ balance, portfolioValue }: { balance: number, portfolioValue: number }) {
  const totalWealth = balance + portfolioValue;
  const nisab = 300000;
  const zakatDue = totalWealth >= nisab ? totalWealth * 0.025 : 0;
  
  const [selectedCharity, setSelectedCharity] = useState<any>(null);
  const [isDistributing, setIsDistributing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [, setVaultData] = useState<any>(null);

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
      await new Promise(r => setTimeout(r, 1500));
      setSuccess(true);
    }
    setIsDistributing(false);
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#16171b] text-slate-900 dark:text-white relative overflow-hidden shadow-xs">
      
      {/* National Vault Header */}
      <div className="p-5 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent dark:from-emerald-950/40 dark:via-[#16171b] dark:to-transparent border-b border-slate-100 dark:border-white/5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="21" x2="21" y2="21"/>
                <line x1="4" y1="10" x2="20" y2="10"/>
                <polyline points="12 3 20 10 4 10 12 3"/>
                <line x1="6" y1="10" x2="6" y2="21"/>
                <line x1="10" y1="10" x2="10" y2="21"/>
                <line x1="14" y1="10" x2="14" y2="21"/>
                <line x1="18" y1="10" x2="18" y2="21"/>
              </svg>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white">National Zakat Vault</h3>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Public Sovereignty Fund</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 rounded-full">
              Audit Trail Verified
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Due amount and explanation */}
        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Calculated Zakat obligation (2.5%)</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">PKR {zakatDue.toLocaleString()}</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
            {totalWealth >= nisab ? 'Nisab Exceeded' : 'Below Nisab'}
          </span>
        </div>

        {/* Charity Selector */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
            Select Verified Recipient
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {charities.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCharity(c)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  selectedCharity?.id === c.id
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-xs'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {c.badge}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{c.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        {selectedCharity && (
          <div className="pt-2">
            <button
              onClick={handleDistribute}
              disabled={isDistributing || success}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
            >
              {isDistributing
                ? 'Processing Simulated Routing...'
                : success
                ? 'Donation Complete — Receipt Issued'
                : `Route PKR ${zakatDue.toLocaleString()} to ${selectedCharity.name}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
