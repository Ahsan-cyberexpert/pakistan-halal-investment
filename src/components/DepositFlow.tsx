'use client';
import { useState } from 'react';

const PAYMENT_METHODS = [
  { id: 'easypaisa', name: 'EasyPaisa', icon: 'EP', color: 'bg-green-50 border-green-200', activeColor: 'bg-green-600', type: 'mobile' },
  { id: 'jazzcash', name: 'JazzCash', icon: 'JC', color: 'bg-red-50 border-red-200', activeColor: 'bg-red-600', type: 'mobile' },
  { id: 'meezan', name: 'Meezan Bank', icon: 'MBL', color: 'bg-blue-50 border-blue-200', activeColor: 'bg-blue-600', type: 'bank' },
  { id: 'hbl', name: 'HBL', icon: 'HBL', color: 'bg-emerald-50 border-emerald-200', activeColor: 'bg-emerald-600', type: 'bank' },
  { id: 'ubl', name: 'UBL', icon: 'UBL', color: 'bg-indigo-50 border-indigo-200', activeColor: 'bg-indigo-600', type: 'bank' },
];

const QUICK_AMOUNTS = [5000, 10000, 25000, 50000, 100000, 500000];

export default function DepositFlow({ onSuccess }: { onSuccess: (data: any) => void }) {
  const [step, setStep] = useState<'method' | 'amount' | 'confirm' | 'processing' | 'success'>('method');
  const [method, setMethod] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const [txRef, setTxRef] = useState('');
  const [instructions, setInstructions] = useState('');
  const [bankDetails, setBankDetails] = useState<any>(null);

  const selectedMethod = PAYMENT_METHODS.find(m => m.id === method);

  const handleMethodSelect = (id: string) => {
    setMethod(id);
    setError('');
    setStep('amount');
  };

  const handleAmountNext = () => {
    const num = parseFloat(amount);
    if (!num || num < 100) { setError('Minimum deposit is PKR 100'); return; }
    if (num > 5000000) { setError('Maximum deposit is PKR 50 Lakh'); return; }
    setError('');
    setStep('confirm');
  };

  const handleConfirm = async () => {
    setStep('processing');
    setError('');
    try {
      const res = await fetch('/api/payment/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount), method, mobileNumber }),
      });
      const data = await res.json();
      if (data.success) {
        setTxRef(data.txRef);
        setInstructions(data.instructions || '');
        setBankDetails(data.bankDetails || null);
        await onSuccess({ type: 'deposit', amount: parseFloat(amount), method: selectedMethod?.name, txRef: data.txRef });
        setStep('success');
      } else {
        setError(data.message || 'Payment failed');
        setStep('confirm');
      }
    } catch {
      setError('Network error. Please try again.');
      setStep('confirm');
    }
  };

  return (
    <div className="space-y-6">
      {/* STEP: Method Selection */}
      {step === 'method' && (
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Add Funds</h2>
          <p className="text-slate-500 text-sm mb-6">Choose your payment method</p>
          <div className="grid grid-cols-1 gap-3">
            {PAYMENT_METHODS.map(m => (
              <button
                key={m.id}
                onClick={() => handleMethodSelect(m.id)}
                className={`touch-target w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all active:scale-95 hover:shadow-md ${m.color}`}
              >
                <span className="text-3xl">{m.icon}</span>
                <div className="text-left">
                  <div className="font-black text-slate-800">{m.name}</div>
                  <div className="text-xs text-slate-500">{m.type === 'mobile' ? 'Mobile Wallet · Instant' : 'Bank Transfer · 1-2 hrs'}</div>
                </div>
                <span className="ml-auto text-slate-400">›</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP: Amount */}
      {step === 'amount' && (
        <div>
          <button onClick={() => setStep('method')} className="text-slate-400 text-sm mb-4 flex items-center gap-1">‹ Back</button>
          <h2 className="text-2xl font-black text-slate-900 mb-1">Enter Amount</h2>
          <p className="text-slate-500 text-sm mb-6">via <span className="font-bold text-slate-700">{selectedMethod?.name}</span></p>

          {selectedMethod?.type === 'mobile' && (
            <div className="mb-4">
              <label htmlFor="deposit-mobile-number" className="text-xs font-black text-slate-400 uppercase tracking-widest">Mobile Number</label>
              <input
                id="deposit-mobile-number"
                type="tel"
                placeholder="03XX-XXXXXXX"
                value={mobileNumber}
                onChange={e => setMobileNumber(e.target.value)}
                aria-describedby="deposit-mobile-help"
                className="w-full mt-2 p-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-400 outline-none font-bold text-slate-800 text-lg"
              />
              <p id="deposit-mobile-help" className="mt-1 text-xs text-slate-400">Account linked to mobile wallet</p>
            </div>
          )}

          <label htmlFor="deposit-amount" className="text-xs font-black text-slate-400 uppercase tracking-widest">Amount (PKR)</label>
          <div className="relative mt-2 mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">₨</span>
            <input
              id="deposit-amount"
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              aria-describedby="deposit-amount-help deposit-error"
              aria-invalid={Boolean(error)}
              className="w-full pl-10 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-400 outline-none font-black text-slate-800 text-2xl"
            />
          </div>
          <p id="deposit-amount-help" className="mb-3 text-xs text-slate-400">Minimum PKR 100. Maximum PKR 50 Lakh.</p>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {QUICK_AMOUNTS.map(a => (
              <button key={a} onClick={() => setAmount(String(a))} className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-bold text-xs transition-all">
                {a >= 100000 ? `${a/100000}L` : `${a/1000}K`}
              </button>
            ))}
          </div>

          {error && <p id="deposit-error" role="alert" className="text-red-500 text-sm mb-3 font-medium">{error}</p>}
          <button onClick={handleAmountNext} className="touch-target w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-900/20">
            Continue →
          </button>
        </div>
      )}

      {/* STEP: Confirm */}
      {step === 'confirm' && (
        <div>
          <button onClick={() => setStep('amount')} className="text-slate-400 text-sm mb-4 flex items-center gap-1">‹ Back</button>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Review Deposit</h2>
          <div className="bg-slate-50 rounded-3xl p-6 space-y-3 mb-6">
            <div className="flex justify-between"><span className="text-slate-500">Method</span><span className="font-black">{selectedMethod?.icon} {selectedMethod?.name}</span></div>
            {mobileNumber && <div className="flex justify-between"><span className="text-slate-500">Mobile</span><span className="font-bold">{mobileNumber}</span></div>}
            <div className="flex justify-between text-lg"><span className="text-slate-500">Amount</span><span className="font-black text-emerald-600">₨ {parseFloat(amount).toLocaleString()}</span></div>
          </div>
          {error && <p id="deposit-confirm-error" role="alert" className="text-red-500 text-sm mb-3 font-medium">{error}</p>}
          <button onClick={handleConfirm} className="touch-target w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-900/20">
            Confirm Deposit
          </button>
        </div>
      )}

      {/* STEP: Processing */}
      {step === 'processing' && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4" role="status" aria-live="polite">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
          <p className="font-black text-slate-800 text-xl">Processing Deposit…</p>
          <p className="text-slate-400 text-sm">Connecting with {selectedMethod?.name}</p>
        </div>
      )}

      {/* STEP: Success */}
      {step === 'success' && (
        <div className="flex flex-col items-center text-center py-8 space-y-4" role="status" aria-live="polite">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
          <h2 className="text-2xl font-black text-slate-900">Deposit Confirmed</h2>
          <p className="text-slate-500">₨ {parseFloat(amount).toLocaleString()} credited to your balance</p>
          {txRef && <p className="text-xs text-slate-400 font-mono bg-slate-100 px-4 py-2 rounded-xl">Ref: {txRef}</p>}
          {instructions && <p className="text-sm text-slate-600 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">{instructions}</p>}
          {bankDetails && (
            <div className="w-full text-left bg-slate-50 rounded-2xl p-4 space-y-2 text-sm">
              <p className="font-black text-slate-700 mb-2">Bank Transfer Details:</p>
              <p><span className="text-slate-400">Account:</span> <span className="font-bold">{bankDetails.accountTitle}</span></p>
              <p><span className="text-slate-400">Number:</span> <span className="font-mono font-bold">{bankDetails.accountNumber}</span></p>
              <p><span className="text-slate-400">IBAN:</span> <span className="font-mono text-xs">{bankDetails.iban}</span></p>
              <p><span className="text-slate-400">Bank:</span> <span className="font-bold">{bankDetails.bank}</span></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
