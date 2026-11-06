'use client';
import { useState } from 'react';

export default function WithdrawFlow({ onSuccess }: { onSuccess: (data: any) => void }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const methods = [
    { id: 'jazzcash', name: 'JazzCash', icon: 'JC' },
    { id: 'easypaisa', name: 'EasyPaisa', icon: 'EP' },
    { id: 'bank', name: 'Bank Account', icon: 'BANK' }
  ];

  const validate = () => {
    setError('');
    if (!amount || Number(amount) < 100) return setError('کم از کم PKR 100 درج کریں');
    if (!method) return setError('رقم وصولی کا طریقہ منتخب کریں');
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) return setError('4 ہندسوں کا درست PIN درج کریں');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    onSuccess({ type: 'withdraw', amount: Number(amount), method, pin: '****' });
    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-white dark:bg-[#16171b] rounded-2xl shadow-xl border border-slate-200 dark:border-white/10" dir="rtl">
      <h2 className="text-xl font-bold mb-5 text-slate-900 dark:text-white">رقم نکلوائیں (Withdraw)</h2>
      {step === 1 && (
        <div className="space-y-4">
          <label htmlFor="withdraw-amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">رقم (PKR)</label>
          <input id="withdraw-amount" type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="مثلاً 2000" aria-describedby="withdraw-amount-help withdraw-error" aria-invalid={Boolean(error)} className="w-full p-3 border rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
          <p id="withdraw-amount-help" className="text-xs text-slate-400">کم از کم PKR 100۔</p>
          <button onClick={() => setStep(2)} className="touch-target w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 font-bold">آگے بڑھیں</button>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">رقم وصولی کا طریقہ</label>
          <div className="grid grid-cols-3 gap-3">
            {methods.map((m) => (
                <button key={m.id} onClick={() => setMethod(m.id)} className={`touch-target p-3 border rounded-xl text-center transition ${method === m.id ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30' : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                <div className="text-lg font-bold mb-1 text-emerald-600 dark:text-emerald-400">{m.icon}</div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{m.name}</div>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="touch-target flex-1 py-3 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300">واپس</button>
            <button onClick={() => setStep(3)} disabled={!method} className="touch-target flex-1 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 font-bold disabled:opacity-50">آگے بڑھیں</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 text-sm text-slate-700 dark:text-slate-300 space-y-1">
            <div className="flex justify-between"><span>رقم</span><strong className="text-slate-900 dark:text-white">₨ {Number(amount || 0).toLocaleString()}</strong></div>
            <div className="flex justify-between"><span>طریقہ</span><strong className="text-slate-900 dark:text-white">{methods.find(m => m.id === method)?.name}</strong></div>
          </div>
          <label htmlFor="withdraw-pin" className="block text-sm font-medium text-slate-700 dark:text-slate-300">سیکیورٹی PIN کی تصدیق</label>
          <input id="withdraw-pin" type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} placeholder="••••" aria-describedby="withdraw-error" aria-invalid={Boolean(error)} className="w-full p-3 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl text-center text-xl tracking-widest focus:ring-2 focus:ring-emerald-500 outline-none" />
          {error && <p id="withdraw-error" role="alert" className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(2)} className="touch-target flex-1 py-3 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300">واپس</button>
            <button type="submit" disabled={loading} className="touch-target flex-1 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 disabled:opacity-50 font-bold">{loading ? 'پروسیسنگ...' : 'رقم منتقل کریں'}</button>
          </div>
        </form>
      )}
    </div>
  );
}
