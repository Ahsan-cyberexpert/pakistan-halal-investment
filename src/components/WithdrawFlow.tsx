'use client';
import { useState } from 'react';
import DemoModeBanner from './DemoModeBanner';

export default function WithdrawFlow({ onSuccess }: { onSuccess: (data: any) => void }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const methods = [
    { id: 'jazzcash', name: 'JazzCash', icon: '📱' },
    { id: 'easypaisa', name: 'EasyPaisa', icon: '🟢' },
    { id: 'bank', name: 'Bank Account', icon: '🏦' }
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
    <div className="w-full max-w-sm mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <DemoModeBanner compact lang="ur" />
      <h2 className="text-xl font-bold mb-5 text-gray-800">💸 وِڈڈرا کریں</h2>
      {step === 1 && (
        <div className="space-y-4">
          <label htmlFor="withdraw-amount" className="block text-sm font-medium text-gray-700">رقم (PKR)</label>
          <input id="withdraw-amount" type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 2000" aria-describedby="withdraw-amount-help withdraw-error" aria-invalid={Boolean(error)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
          <p id="withdraw-amount-help" className="text-xs text-gray-500">یہ صرف ڈیمو رقم ہے۔ کم از کم PKR 100۔</p>
          <button onClick={() => setStep(2)} className="touch-target w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium">آگے بڑھیں</button>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">رقم وصولی کا طریقہ</label>
          <div className="grid grid-cols-3 gap-3">
            {methods.map((m) => (
                <button key={m.id} onClick={() => setMethod(m.id)} className={`touch-target p-3 border rounded-xl text-center transition ${method === m.id ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'hover:bg-gray-50'}`}>
                <div className="text-2xl mb-1">{m.icon}</div><div className="text-xs font-medium">{m.name}</div>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="touch-target flex-1 py-3 border rounded-xl hover:bg-gray-50">واپس</button>
            <button onClick={() => setStep(3)} disabled={!method} className="touch-target flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50">آگے بڑھیں</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-600 space-y-1">
            <div className="flex justify-between"><span>رقم</span><strong>₨ {Number(amount || 0).toLocaleString()}</strong></div>
            <div className="flex justify-between"><span>طریقہ</span><strong>{methods.find(m => m.id === method)?.name}</strong></div>
          </div>
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">یہ ڈیمو ہے۔ کوئی حقیقی رقم منتقل نہیں ہوگی۔</p>
          <label htmlFor="withdraw-demo-pin" className="block text-sm font-medium text-gray-700">ڈیمو PIN کی تصدیق</label>
          <input id="withdraw-demo-pin" type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} placeholder="****" aria-describedby="withdraw-error" aria-invalid={Boolean(error)} className="w-full p-3 border rounded-xl text-center text-xl tracking-widest focus:ring-2 focus:ring-green-500 outline-none" />
          {error && <p id="withdraw-error" role="alert" className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(2)} className="touch-target flex-1 py-3 border rounded-xl hover:bg-gray-50">واپس</button>
            <button type="submit" disabled={loading} className="touch-target flex-1 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 disabled:opacity-50 font-medium">{loading ? 'ڈیمو پروسیس...' : 'ڈیمو وِڈڈرا کریں'}</button>
          </div>
        </form>
      )}
    </div>
  );
}
