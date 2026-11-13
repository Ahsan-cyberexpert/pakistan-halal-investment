'use client';
import { useState } from 'react';

interface PaymentMethod {
  id: string;
  name: string;
  badge: string;
  badgeLight: string;
  badgeDark: string;
  type: 'mobile' | 'bank';
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'easypaisa',
    name: 'EasyPaisa',
    badge: 'EP',
    badgeLight: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    badgeDark: 'dark:bg-emerald-800 dark:text-white dark:border-emerald-600',
    type: 'mobile',
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    badge: 'JC',
    badgeLight: 'bg-rose-100 text-rose-800 border-rose-300',
    badgeDark: 'dark:bg-rose-700 dark:text-white dark:border-rose-500',
    type: 'mobile',
  },
  {
    id: 'meezan',
    name: 'Meezan Bank',
    badge: 'MBL',
    badgeLight: 'bg-sky-100 text-sky-800 border-sky-300',
    badgeDark: 'dark:bg-sky-700 dark:text-white dark:border-sky-500',
    type: 'bank',
  },
  {
    id: 'hbl',
    name: 'HBL',
    badge: 'HBL',
    badgeLight: 'bg-teal-100 text-teal-800 border-teal-300',
    badgeDark: 'dark:bg-teal-700 dark:text-white dark:border-teal-500',
    type: 'bank',
  },
  {
    id: 'ubl',
    name: 'UBL',
    badge: 'UBL',
    badgeLight: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    badgeDark: 'dark:bg-indigo-700 dark:text-white dark:border-indigo-500',
    type: 'bank',
  },
];

const QUICK_AMOUNTS = [5000, 10000, 25000, 50000, 100000, 500000];

export default function DepositFlow({ onSuccess }: { onSuccess: (data: any) => void }) {
  const [step, setStep] = useState<'method' | 'amount' | 'confirm' | 'processing' | 'success'>('method');
  const [method, setMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const [txRef, setTxRef] = useState('');
  const [instructions, setInstructions] = useState('');
  const [bankDetails, setBankDetails] = useState<any>(null);

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === method);

  const handleMethodSelect = (id: string) => {
    setMethod(id);
    setError('');
    setStep('amount');
  };

  const handleAmountNext = () => {
    const num = parseFloat(amount);
    if (!num || num < 100) {
      setError('Minimum deposit is PKR 100');
      return;
    }
    if (num > 5000000) {
      setError('Maximum deposit is PKR 50 Lakh');
      return;
    }
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
        await onSuccess({
          type: 'deposit',
          amount: parseFloat(amount),
          method: selectedMethod?.name,
          txRef: data.txRef,
        });
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
    <div className="space-y-5 text-[#0B1F17] dark:text-[#F0F4F2]">
      {/* STEP 1: Method Selection */}
      {step === 'method' && (
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B1F17] dark:text-white tracking-tight">
            Add Funds
          </h2>
          <p className="text-xs sm:text-sm text-[#55695F] dark:text-[#94A3B8] mt-1 mb-5">
            Choose your payment method
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => handleMethodSelect(m.id)}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#E3ECE7] dark:border-[#262B35] bg-[#F4F7F5] dark:bg-[#1C2029] hover:bg-emerald-50/70 dark:hover:bg-[#232936] hover:border-[#047857]/40 dark:hover:border-emerald-500/50 transition-all duration-150 active:scale-[0.98] text-left group shadow-xs"
              >
                {/* Brand Badge */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm border shrink-0 transition-transform group-hover:scale-105 ${m.badgeLight} ${m.badgeDark}`}
                >
                  {m.badge}
                </div>

                {/* Name & Subtitle */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm sm:text-base text-[#0B1F17] dark:text-white leading-tight">
                    {m.name}
                  </div>
                  <div className="text-[11px] text-[#55695F] dark:text-[#94A3B8] mt-0.5">
                    {m.type === 'mobile' ? 'Mobile Wallet · Instant' : 'Bank Transfer · 1-2 hrs'}
                  </div>
                </div>

                {/* Arrow */}
                <span className="text-[#8C9B93] dark:text-[#64748B] text-base group-hover:translate-x-0.5 group-hover:text-[#047857] dark:group-hover:text-emerald-400 transition-all">
                  ›
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Amount Entry */}
      {step === 'amount' && (
        <div>
          <button
            onClick={() => setStep('method')}
            className="text-xs font-semibold text-[#55695F] dark:text-[#94A3B8] hover:text-[#047857] dark:hover:text-emerald-400 mb-3 flex items-center gap-1 transition-colors"
          >
            ‹ Back to payment methods
          </button>

          <h2 className="text-xl sm:text-2xl font-black text-[#0B1F17] dark:text-white">
            Enter Amount
          </h2>
          <p className="text-xs sm:text-sm text-[#55695F] dark:text-[#94A3B8] mt-0.5 mb-5">
            via <span className="font-bold text-[#047857] dark:text-emerald-400">{selectedMethod?.name}</span>
          </p>

          {selectedMethod?.type === 'mobile' && (
            <div className="mb-4">
              <label
                htmlFor="deposit-mobile-number"
                className="text-[11px] font-bold text-[#55695F] dark:text-[#94A3B8] uppercase tracking-wider"
              >
                Mobile Number
              </label>
              <input
                id="deposit-mobile-number"
                type="tel"
                placeholder="03XX-XXXXXXX"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full mt-1.5 p-3.5 rounded-2xl border border-[#E3ECE7] dark:border-[#262B35] bg-[#F4F7F5] dark:bg-[#1C2029] text-[#0B1F17] dark:text-white font-bold text-base focus:border-[#047857] dark:focus:border-emerald-500 outline-none transition-colors"
              />
              <p className="mt-1 text-[11px] text-[#55695F] dark:text-[#94A3B8]">
                Account linked to your {selectedMethod.name} wallet
              </p>
            </div>
          )}

          <label
            htmlFor="deposit-amount"
            className="text-[11px] font-bold text-[#55695F] dark:text-[#94A3B8] uppercase tracking-wider"
          >
            Amount (PKR)
          </label>
          <div className="relative mt-1.5 mb-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C9B93] dark:text-[#64748B] font-bold text-lg">
              ₨
            </span>
            <input
              id="deposit-amount"
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-[#E3ECE7] dark:border-[#262B35] bg-[#F4F7F5] dark:bg-[#1C2029] text-[#0B1F17] dark:text-white font-extrabold text-2xl focus:border-[#047857] dark:focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
          <p className="mb-4 text-[11px] text-[#55695F] dark:text-[#94A3B8]">
            Minimum PKR 100. Maximum PKR 50 Lakh.
          </p>

          {/* Quick amount chips */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {QUICK_AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(String(a))}
                className="py-2.5 px-3 rounded-xl bg-[#F4F7F5] dark:bg-[#1C2029] border border-[#E3ECE7] dark:border-[#262B35] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-[#047857] dark:hover:text-emerald-300 text-[#0B1F17] dark:text-[#F0F4F2] font-bold text-xs transition-colors"
              >
                ₨ {a >= 100000 ? `${a / 100000} Lakh` : `${a / 1000}K`}
              </button>
            ))}
          </div>

          {error && (
            <p role="alert" className="text-red-500 dark:text-red-400 text-xs mb-3 font-semibold">
              {error}
            </p>
          )}

          <button
            onClick={handleAmountNext}
            className="w-full py-3.5 bg-[#047857] hover:bg-[#036046] active:scale-[0.98] text-white rounded-2xl font-bold text-sm sm:text-base transition-all shadow-md shadow-emerald-900/20"
          >
            Continue →
          </button>
        </div>
      )}

      {/* STEP 3: Confirm Review */}
      {step === 'confirm' && (
        <div>
          <button
            onClick={() => setStep('amount')}
            className="text-xs font-semibold text-[#55695F] dark:text-[#94A3B8] hover:text-[#047857] dark:hover:text-emerald-400 mb-3 flex items-center gap-1 transition-colors"
          >
            ‹ Back to amount
          </button>

          <h2 className="text-xl sm:text-2xl font-black text-[#0B1F17] dark:text-white mb-1">
            Review Deposit
          </h2>
          <p className="text-xs text-[#55695F] dark:text-[#94A3B8] mb-5">
            Confirm your transaction details
          </p>

          <div className="bg-[#F4F7F5] dark:bg-[#1C2029] border border-[#E3ECE7] dark:border-[#262B35] rounded-2xl p-4 sm:p-5 space-y-3 mb-5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-[#55695F] dark:text-[#94A3B8]">Payment Method</span>
              <span className="font-bold text-[#0B1F17] dark:text-white">
                {selectedMethod?.name}
              </span>
            </div>

            {mobileNumber && (
              <div className="flex justify-between items-center">
                <span className="text-[#55695F] dark:text-[#94A3B8]">Mobile Account</span>
                <span className="font-mono font-bold text-[#0B1F17] dark:text-white">
                  {mobileNumber}
                </span>
              </div>
            )}

            <div className="pt-2 border-t border-[#E3ECE7] dark:border-[#262B35] flex justify-between items-center">
              <span className="text-[#55695F] dark:text-[#94A3B8] font-medium">Deposit Amount</span>
              <span className="font-black text-lg text-[#047857] dark:text-emerald-400">
                ₨ {parseFloat(amount || '0').toLocaleString()}
              </span>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-red-500 dark:text-red-400 text-xs mb-3 font-semibold">
              {error}
            </p>
          )}

          <button
            onClick={handleConfirm}
            className="w-full py-3.5 bg-[#047857] hover:bg-[#036046] active:scale-[0.98] text-white rounded-2xl font-bold text-sm sm:text-base transition-all shadow-md shadow-emerald-900/20"
          >
            Confirm & Deposit
          </button>
        </div>
      )}

      {/* STEP 4: Processing Animation */}
      {step === 'processing' && (
        <div className="flex flex-col items-center justify-center py-12 space-y-3" role="status">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-200 dark:border-emerald-900 border-t-[#047857] dark:border-t-emerald-400 animate-spin" />
          <p className="font-bold text-[#0B1F17] dark:text-white text-base">
            Processing Deposit…
          </p>
          <p className="text-xs text-[#55695F] dark:text-[#94A3B8]">
            Connecting with {selectedMethod?.name} secure gateway
          </p>
        </div>
      )}

      {/* STEP 5: Success Confirmation */}
      {step === 'success' && (
        <div className="flex flex-col items-center text-center py-6 space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-[#047857] dark:text-emerald-400">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h2 className="text-xl font-black text-[#0B1F17] dark:text-white">
            Deposit Confirmed
          </h2>
          <p className="text-xs text-[#55695F] dark:text-[#94A3B8]">
            ₨ {parseFloat(amount || '0').toLocaleString()} successfully credited to your sovereign balance.
          </p>

          {txRef && (
            <p className="text-[11px] text-[#55695F] dark:text-[#94A3B8] font-mono bg-[#F4F7F5] dark:bg-[#1C2029] border border-[#E3ECE7] dark:border-[#262B35] px-3.5 py-1.5 rounded-xl">
              Ref: {txRef}
            </p>
          )}

          {instructions && (
            <p className="text-xs text-[#0B1F17] dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3 text-left w-full leading-relaxed">
              {instructions}
            </p>
          )}

          {bankDetails && (
            <div className="w-full text-left bg-[#F4F7F5] dark:bg-[#1C2029] border border-[#E3ECE7] dark:border-[#262B35] rounded-2xl p-4 space-y-1.5 text-xs">
              <p className="font-bold text-[#0B1F17] dark:text-white mb-2">
                Bank Transfer Details:
              </p>
              <p className="flex justify-between">
                <span className="text-[#55695F] dark:text-[#94A3B8]">Account Title:</span>
                <span className="font-bold text-[#0B1F17] dark:text-white">{bankDetails.accountTitle}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#55695F] dark:text-[#94A3B8]">Account Number:</span>
                <span className="font-mono font-bold text-[#0B1F17] dark:text-white">{bankDetails.accountNumber}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#55695F] dark:text-[#94A3B8]">IBAN:</span>
                <span className="font-mono text-[11px] text-[#0B1F17] dark:text-white">{bankDetails.iban}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#55695F] dark:text-[#94A3B8]">Bank Name:</span>
                <span className="font-bold text-[#0B1F17] dark:text-white">{bankDetails.bank}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
