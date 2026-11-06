'use client';

import { useMemo, useState } from 'react';
import type { Holding } from '@/types';

type SellStockFlowProps = {
  holding: Holding;
  onSuccess: (data: { type: 'sell_stock'; symbol: string; name: string; units: number; amount: number; costBasis: number; realizedPnl: number }) => void;
  onCancel: () => void;
};

const formatPKR = (value: number) => `₨ ${Math.round(value).toLocaleString('en-PK')}`;

export default function SellStockFlow({ holding, onSuccess, onCancel }: SellStockFlowProps) {
  const [step, setStep] = useState<'units' | 'review'>('units');
  const [units, setUnits] = useState('');
  const [error, setError] = useState('');
  const requestedUnits = Number(units);
  const maxUnits = holding.units;
  const costBasis = useMemo(() => holding.units > 0 ? (holding.invested / holding.units) * requestedUnits : 0, [holding.invested, holding.units, requestedUnits]);
  const estimatedPnl = useMemo(() => holding.units > 0 ? (holding.pnl / holding.units) * requestedUnits : 0, [holding.pnl, holding.units, requestedUnits]);
  const proceeds = Math.max(0, costBasis + estimatedPnl);

  const review = () => {
    setError('');
    if (!Number.isFinite(requestedUnits) || requestedUnits <= 0) return setError('Enter a valid number of units.');
    if (requestedUnits > maxUnits) return setError(`You can sell up to ${maxUnits.toFixed(4)} units.`);
    setStep('review');
  };

  return (
    <div className="space-y-5" dir="ltr">
      {step === 'units' && (
        <div>
          <button onClick={onCancel} className="touch-target mb-3 text-sm font-bold text-slate-500">‹ Back</button>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Sell Holding</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Sell {holding.symbol}</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Select the number of units you wish to liquidate from your portfolio.</p>

          <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 text-sm">
            <div><p className="text-slate-500 dark:text-slate-400 text-xs">Available units</p><p className="font-bold text-slate-900 dark:text-white">{maxUnits.toFixed(4)}</p></div>
            <div><p className="text-slate-500 dark:text-slate-400 text-xs">Estimated value</p><p className="font-bold text-slate-900 dark:text-white">{formatPKR(holding.invested + holding.pnl)}</p></div>
          </div>

          <label htmlFor="sell-units" className="mt-5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Units to sell</label>
          <input id="sell-units" type="number" inputMode="decimal" min="0" max={maxUnits} step="any" value={units} onChange={(event) => setUnits(event.target.value)} aria-describedby="sell-units-help sell-units-error" aria-invalid={Boolean(error)} placeholder={`Max ${maxUnits.toFixed(4)}`} className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-3.5 text-xl font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500" />
          <p id="sell-units-help" className="mt-1 text-xs text-slate-400">You can sell all units or a partial amount.</p>
          {error && <p id="sell-units-error" role="alert" className="mt-2 text-sm font-bold text-red-600">{error}</p>}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button onClick={() => setUnits(String(maxUnits))} className="touch-target rounded-xl border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5">Sell all</button>
            <button onClick={review} className="touch-target rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-md hover:bg-emerald-500">Review sale</button>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div>
          <button onClick={() => setStep('units')} className="touch-target mb-3 text-sm font-bold text-slate-500">‹ Back</button>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Confirm Order</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Sell {requestedUnits.toFixed(4)} {holding.symbol} units?</h2>
          <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 text-sm">
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Units</span><strong className="text-slate-900 dark:text-white">{requestedUnits.toFixed(4)}</strong></div>
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Estimated proceeds</span><strong className="text-emerald-600 dark:text-emerald-400">{formatPKR(proceeds)}</strong></div>
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Estimated P&amp;L</span><strong className={estimatedPnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}>{estimatedPnl >= 0 ? '+' : '-'}{formatPKR(Math.abs(estimatedPnl))}</strong></div>
            <div className="flex justify-between border-t border-slate-200 dark:border-white/10 pt-3"><span className="text-slate-500 dark:text-slate-400">Remaining units</span><strong className="text-slate-900 dark:text-white">{(maxUnits - requestedUnits).toFixed(4)}</strong></div>
          </div>
          <button onClick={() => onSuccess({ type: 'sell_stock', symbol: holding.symbol, name: holding.name, units: requestedUnits, amount: proceeds, costBasis, realizedPnl: estimatedPnl })} className="touch-target mt-5 w-full rounded-2xl bg-emerald-600 py-3.5 text-base font-bold text-white shadow-md hover:bg-emerald-500">Execute Order</button>
        </div>
      )}
    </div>
  );
}
