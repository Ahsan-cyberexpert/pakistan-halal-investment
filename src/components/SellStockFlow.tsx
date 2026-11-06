'use client';

import { useMemo, useState } from 'react';
import type { Holding } from '@/types';
import DemoModeBanner from './DemoModeBanner';

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
    if (requestedUnits > maxUnits) return setError(`You can sell up to ${maxUnits.toFixed(4)} units in this demo.`);
    setStep('review');
  };

  return (
    <div className="space-y-5" dir="ltr">
      <DemoModeBanner compact />
      {step === 'units' && (
        <div>
          <button onClick={onCancel} className="touch-target mb-3 text-sm font-bold text-slate-500">‹ Back</button>
          <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Sell demo holding</p>
          <h2 className="mt-1 text-2xl font-black text-slate-900">Sell {holding.symbol}</h2>
          <p className="mt-1 text-sm text-slate-500">Choose how many virtual units to sell. No broker order will be placed.</p>

          <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-sm">
            <div><p className="text-slate-500">Available units</p><p className="font-black text-slate-900">{maxUnits.toFixed(4)}</p></div>
            <div><p className="text-slate-500">Estimated value</p><p className="font-black text-slate-900">{formatPKR(holding.invested + holding.pnl)}</p></div>
          </div>

          <label htmlFor="sell-units" className="mt-5 block text-xs font-black uppercase tracking-widest text-slate-500">Units to sell</label>
          <input id="sell-units" type="number" inputMode="decimal" min="0" max={maxUnits} step="any" value={units} onChange={(event) => setUnits(event.target.value)} aria-describedby="sell-units-help sell-units-error" aria-invalid={Boolean(error)} placeholder={`Max ${maxUnits.toFixed(4)}`} className="mt-2 w-full rounded-2xl border-2 border-slate-200 p-4 text-2xl font-black text-slate-900 outline-none focus:border-emerald-400" />
          <p id="sell-units-help" className="mt-1 text-xs text-slate-400">You can sell all units or a partial amount.</p>
          {error && <p id="sell-units-error" role="alert" className="mt-2 text-sm font-bold text-red-600">{error}</p>}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button onClick={() => setUnits(String(maxUnits))} className="touch-target rounded-xl border border-slate-200 text-sm font-black text-slate-700">Sell all</button>
            <button onClick={review} className="touch-target rounded-xl bg-amber-600 text-sm font-black text-white shadow-lg shadow-amber-900/20">Review sale</button>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div>
          <button onClick={() => setStep('units')} className="touch-target mb-3 text-sm font-bold text-slate-500">‹ Back</button>
          <p className="text-xs font-black uppercase tracking-widest text-amber-700">Review simulated sale</p>
          <h2 className="mt-1 text-2xl font-black text-slate-900">Sell {requestedUnits.toFixed(4)} {holding.symbol} units?</h2>
          <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Virtual units</span><strong>{requestedUnits.toFixed(4)}</strong></div>
            <div className="flex justify-between"><span className="text-slate-500">Estimated proceeds</span><strong className="text-emerald-700">{formatPKR(proceeds)}</strong></div>
            <div className="flex justify-between"><span className="text-slate-500">Estimated demo P&amp;L</span><strong className={estimatedPnl >= 0 ? 'text-emerald-700' : 'text-red-600'}>{estimatedPnl >= 0 ? '+' : '-'}{formatPKR(Math.abs(estimatedPnl))}</strong></div>
            <div className="flex justify-between border-t border-slate-200 pt-3"><span className="text-slate-500">Remaining units</span><strong>{(maxUnits - requestedUnits).toFixed(4)}</strong></div>
          </div>
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">This is a presentation simulation. No exchange or real brokerage order will be submitted.</p>
          <button onClick={() => onSuccess({ type: 'sell_stock', symbol: holding.symbol, name: holding.name, units: requestedUnits, amount: proceeds, costBasis, realizedPnl: estimatedPnl })} className="touch-target mt-5 w-full rounded-2xl bg-amber-600 py-4 text-lg font-black text-white shadow-lg shadow-amber-900/20">Simulate sale</button>
        </div>
      )}
    </div>
  );
}
