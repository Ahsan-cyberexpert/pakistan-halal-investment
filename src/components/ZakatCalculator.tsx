'use client';
import { useState } from 'react';

interface ZakatCalculatorProps {
  balance: number;
  portfolioValue: number;
  onDonate: (amount: number, recipient: string) => void;
}

const NISAB_THRESHOLD = 300000; // Mock Gold Nisab value (approx 87g gold)

export default function ZakatCalculator({ balance, portfolioValue, onDonate }: ZakatCalculatorProps) {
  const totalWealth = balance + portfolioValue;
  const zakatAmount = totalWealth * 0.025;
  const isEligible = totalWealth >= NISAB_THRESHOLD;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [donated, setDonated] = useState(false);

  const recipients = [
    { name: 'Edhi Foundation', icon: '🚑', focus: 'Emergency' },
    { name: 'Al-Khidmat', icon: '🤲', focus: 'Social' },
    { name: 'TCF (Education)', icon: '📚', focus: 'Education' },
    { name: 'Indus Hospital', icon: '🏥', focus: 'Health' },
  ];

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) return;
    
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000)); // Simulate processing
    onDonate(zakatAmount, selectedRecipient);
    setLoading(false);
    setDonated(true);
  };

  if (donated) {
    return (
      <div className="premium-card p-10 text-center animate-in zoom-in duration-500 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm animate-bounce">🤲</div>
          <h2 className="text-2xl font-black text-emerald-800 tracking-tight">JazakAllah Khair</h2>
          <p className="text-slate-500 font-medium mt-2 max-w-[240px] mx-auto">Your purification of wealth is complete. May your wealth be blessed and multiplied.</p>
          <div className="mt-8 pt-8 border-t border-emerald-100">
            <button 
              onClick={() => { setDonated(false); setModalOpen(false); }} 
              className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-900/10"
            >
              Back to Portfolio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="premium-card p-8 overflow-hidden relative group">
        {/* Background Aura */}
        <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[80px] transition-all duration-1000 ${
          isEligible ? 'bg-amber-100 opacity-60' : 'bg-[#E8EDEA] dark:bg-[#232936] opacity-40'
        }`}></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#F4F7F5] dark:bg-[#1C2029] text-slate-400 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-[#E3ECE7] dark:border-[#262B35]">🤲</div>
              <div>
                <h2 className="text-xl font-black text-[#0B1F17] dark:text-[#F0F4F2] tracking-tight">Zakat OS</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Nisab Tracker & Distribution</p>
              </div>
            </div>
            {isEligible ? (
              <span className="text-xs font-black text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 rounded-full border border-amber-200 uppercase tracking-widest animate-pulse">Liability Due</span>
            ) : (
              <span className="text-xs font-black text-slate-400 bg-[#F4F7F5] dark:bg-[#1C2029] px-3 py-1.5 rounded-full border border-[#E3ECE7] dark:border-[#262B35] uppercase tracking-widest">Below Nisab</span>
            )}
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Nisab Progress</span>
              <span>{( (totalWealth / NISAB_THRESHOLD) * 100 ).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-[#F4F7F5] dark:bg-[#1C2029] rounded-full h-3 p-0.5 overflow-hidden border border-[#E3ECE7] dark:border-[#262B35] shadow-inner">
              <div className={`h-full rounded-full transition-all duration-1000 ${
                isEligible ? 'bg-gradient-to-r from-amber-400 to-emerald-400' : 'bg-slate-200'
              }`} style={{ width: `${Math.min((totalWealth / NISAB_THRESHOLD) * 100, 100)}%` }}></div>
            </div>
          </div>

          {isEligible ? (
            <div className="p-6 bg-amber-50 dark:bg-amber-950/60 rounded-[2.5rem] border border-amber-100 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-xs font-black text-amber-700 uppercase tracking-widest mb-1">Total Zakat Payable</div>
                <div className="text-3xl font-black text-amber-800 tracking-tighter">PKR {zakatAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                <button 
                  onClick={() => setModalOpen(true)}
                  className="mt-6 w-full py-4 bg-amber-600 text-white font-black rounded-2xl hover:bg-amber-700 transition-all active:scale-95 shadow-xl shadow-amber-900/10"
                >
                  Fulfill Duty Now
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#F4F7F5] dark:bg-[#1C2029] rounded-[2.5rem] border border-[#E3ECE7] dark:border-[#262B35] text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                Nisab threshold: PKR {NISAB_THRESHOLD.toLocaleString()}<br />
                Your wealth is currently safe from liability.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Noble Design */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 z-[70] animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#15181F] rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500 relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-500 transition-colors text-2xl font-light">✕</button>
            
            <div className="mb-8">
              <h3 className="text-2xl font-black text-[#0B1F17] dark:text-[#F0F4F2] tracking-tight">Select Recipient</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Purify wealth through impact</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {recipients.map(r => (
                <button
                  key={r.name}
                  onClick={() => setSelectedRecipient(r.name)}
                  className={`p-4 border rounded-[2rem] text-left transition-all duration-300 ${
                    selectedRecipient === r.name 
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 shadow-xl shadow-amber-900/5 ring-2 ring-amber-200' 
                      : 'border-[#E3ECE7] dark:border-[#262B35] hover:bg-[#F4F7F5] dark:bg-[#1C2029]'
                  }`}
                >
                  <div className="text-2xl mb-2">{r.icon}</div>
                  <div className="font-black text-[#0B1F17] dark:text-[#F0F4F2] text-xs tracking-tight">{r.name}</div>
                  <div className="text-xs font-black text-slate-400 uppercase mt-0.5">{r.focus}</div>
                </button>
              ))}
            </div>

            {selectedRecipient && (
              <form onSubmit={handleDonate} className="space-y-6 animate-in slide-in-from-top-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl text-emerald-800 text-xs font-bold text-center uppercase tracking-widest leading-relaxed">
                  Impact: Your PKR {zakatAmount.toLocaleString()} will provide meals, clean water, and education to those in need.
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 block px-1">Security PIN</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full p-4 bg-[#F4F7F5] dark:bg-[#1C2029] border border-[#E3ECE7] dark:border-[#262B35] rounded-2xl text-center text-3xl font-black tracking-[1em] focus:bg-white dark:bg-[#15181F] focus:border-amber-500 outline-none transition-all"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading || pin.length !== 4} 
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] hover:bg-slate-800 disabled:opacity-50 font-black text-lg transition-all shadow-2xl shadow-slate-900/20 active:scale-95"
                >
                  {loading ? 'Fulfilling Duty...' : `Confirm PKR ${zakatAmount.toLocaleString()}`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
