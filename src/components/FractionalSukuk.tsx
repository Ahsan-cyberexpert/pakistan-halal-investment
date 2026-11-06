'use client';
import { useState } from 'react';
import DemoModeBanner from './DemoModeBanner';

const SUKUKS = [
  { id: 'gop-green', name: 'GoP Green Ijarah Sukuk', yield: '18.5%', yieldRate: 18.5, maturity: '1 Year', type: 'Sovereign', risk: 'Low', minInvestment: 500 },
  { id: 'wapda-energy', name: 'WAPDA Energy Sukuk II', yield: '19.2%', yieldRate: 19.2, maturity: '3 Years', type: 'Corporate', risk: 'Medium', minInvestment: 1000 },
];

type Sukuk = typeof SUKUKS[number];
type SukukPurchase = { type: 'buy_sukuk'; amount: number; symbol: string; name: string; yieldRate: number; maturity: string; risk: string; estimatedAnnualReturn: number; note: string };

export default function FractionalSukuk({ balance, onBuy }: { balance: number; onBuy: (purchase: SukukPurchase) => void }) {
  const [selected, setSelected] = useState<Sukuk>(SUKUKS[0]);
  const [amount, setAmount] = useState<number | ''>('');
  const [step, setStep] = useState<'choose' | 'review'>('choose');
  const [error, setError] = useState('');

  const numericAmount = typeof amount === 'number' ? amount : 0;
  const estimatedAnnualReturn = numericAmount * selected.yieldRate / 100;

  const reviewPurchase = () => {
    setError('');
    if (!numericAmount || numericAmount < selected.minInvestment) return setError(`Minimum demo investment is PKR ${selected.minInvestment.toLocaleString()}.`);
    if (numericAmount > balance) return setError('This amount is higher than your virtual demo cash balance.');
    setStep('review');
  };

  const confirmPurchase = () => {
    onBuy({
      type: 'buy_sukuk',
      amount: numericAmount,
      symbol: selected.id,
      name: selected.name,
      yieldRate: selected.yieldRate,
      maturity: selected.maturity,
      risk: selected.risk,
      estimatedAnnualReturn,
      note: `Simulated ${selected.type} Sukuk · example ${selected.yield}% p.a. · ${selected.maturity} maturity · ${selected.risk} risk.`,
    });
    setAmount('');
    setStep('choose');
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#16171b] text-slate-900 dark:text-white p-5 shadow-xs h-full flex flex-col justify-between">
      <DemoModeBanner compact />
      {step === 'choose' && (
        <>
          <div className="mb-4 mt-4 flex items-start justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Demo fixed income</span>
              </div>
              <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">Sukuk demo vault</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Explore asset-backed Islamic investment concepts with virtual money.</p>
            </div>
            <span className="shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">Simulated terms</span>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {SUKUKS.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSelected(s); setError(''); }}
                aria-pressed={selected.id === s.id}
                className={`flex flex-col justify-between min-h-[85px] w-full rounded-xl border p-3.5 text-left transition-all ${
                  selected.id === s.id
                    ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-500/10 shadow-xs'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-bold text-slate-900 dark:text-white">{s.name}</span>
                  <span className="rounded border border-slate-200 dark:border-white/10 bg-white dark:bg-white/10 px-1.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">{s.maturity}</span>
                </div>
                <div className="text-lg font-bold text-amber-700 dark:text-amber-400">
                  {s.yield} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">example p.a.</span>
                </div>
                <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{s.type} · {s.risk} risk · demo terms</div>
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-3.5">
            <div className="mb-2 flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Minimum virtual amount</span>
              <span className="font-semibold text-slate-900 dark:text-white">PKR {selected.minInvestment.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">PKR</span>
                <input
                  id="sukuk-demo-amount"
                  type="number"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                  placeholder={`Min ${selected.minInvestment}`}
                  aria-describedby="sukuk-demo-help sukuk-demo-error"
                  aria-invalid={Boolean(error)}
                  className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#16171b] py-2 pl-10 pr-3 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-amber-500"
                />
              </div>
              <button
                onClick={reviewPurchase}
                className="shrink-0 rounded-lg bg-amber-600 hover:bg-amber-500 px-5 py-2 text-xs font-semibold text-white shadow-xs"
              >
                Review
              </button>
            </div>
            <p id="sukuk-demo-help" className="mt-2 text-xs text-slate-500 dark:text-slate-400">Virtual money only. Example yield is not a promise or live rate.</p>
            {error && <p id="sukuk-demo-error" role="alert" className="mt-2 text-xs font-bold text-red-600">{error}</p>}
          </div>
        </>
      )}

      {step === 'review' && (
        <div className="mt-4" role="group" aria-labelledby="sukuk-review-title">
          <button onClick={() => setStep('choose')} className="mb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
            ‹ Back
          </button>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Review simulated Sukuk purchase</p>
          <h2 id="sukuk-review-title" className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{selected.name}</h2>
          <div className="mt-4 space-y-2.5 rounded-xl bg-slate-50 dark:bg-white/5 p-4 text-xs">
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Virtual amount</span><strong className="text-slate-900 dark:text-white">PKR {numericAmount.toLocaleString()}</strong></div>
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Example yield</span><strong className="text-amber-600 dark:text-amber-400">{selected.yield}% p.a.</strong></div>
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Example annual amount</span><strong className="text-slate-900 dark:text-white">PKR {Math.round(estimatedAnnualReturn).toLocaleString()}</strong></div>
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Maturity / risk</span><strong className="text-slate-900 dark:text-white">{selected.maturity} · {selected.risk}</strong></div>
            <div className="flex justify-between border-t border-slate-200 dark:border-white/10 pt-2.5"><span className="text-slate-500 dark:text-slate-400">Virtual cash after</span><strong className="text-slate-900 dark:text-white">PKR {Math.round(balance - numericAmount).toLocaleString()}</strong></div>
          </div>
          <p className="mt-3 rounded-lg border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-800 dark:text-amber-300">
            No bank, broker, issuer, or real investment account will be contacted.
          </p>
          <button onClick={confirmPurchase} className="mt-4 w-full rounded-xl bg-amber-600 hover:bg-amber-500 py-3 text-sm font-bold text-white shadow-md transition-all active:scale-95">
            Simulate Sukuk purchase
          </button>
        </div>
      )}
    </div>
  );
}
