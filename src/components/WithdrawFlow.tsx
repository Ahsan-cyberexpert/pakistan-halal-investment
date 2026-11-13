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
    { id: 'bank', name: 'Bank Account', icon: 'BANK' },
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
    await new Promise((r) => setTimeout(r, 1200));
    onSuccess({ type: 'withdraw', amount: Number(amount), method, pin: '****' });
    setLoading(false);
  };

  return (
    <div className="w-full text-[#0B1F17] dark:text-[#F0F4F2]" dir="rtl">
      <h2 className="text-xl font-black mb-4 text-[#0B1F17] dark:text-white tracking-tight">
        رقم نکلوائیں (Withdraw)
      </h2>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="withdraw-amount"
              className="block text-xs font-bold text-[#55695F] dark:text-[#94A3B8] mb-1.5"
            >
              رقم (PKR)
            </label>
            <input
              id="withdraw-amount"
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="مثلاً 2000"
              className="w-full p-3.5 border-2 rounded-2xl border-[#E3ECE7] dark:border-[#262B35] bg-[#F4F7F5] dark:bg-[#1C2029] text-[#0B1F17] dark:text-white font-bold text-lg focus:border-[#047857] dark:focus:border-emerald-400 outline-none transition-colors"
            />
            <p id="withdraw-amount-help" className="text-[11px] text-[#55695F] dark:text-[#94A3B8] mt-1">
              کم از کم PKR 100۔
            </p>
          </div>

          <button
            onClick={() => {
              if (!amount || Number(amount) < 100) {
                setError('کم از کم PKR 100 درج کریں');
                return;
              }
              setError('');
              setStep(2);
            }}
            className="w-full py-3.5 bg-[#047857] hover:bg-[#036046] active:scale-[0.98] text-white rounded-2xl font-bold text-sm transition-all shadow-md shadow-emerald-900/20"
          >
            آگے بڑھیں
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <label className="block text-xs font-bold text-[#55695F] dark:text-[#94A3B8]">
            رقم وصولی کا طریقہ منتخب کریں
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  method === m.id
                    ? 'border-[#047857] dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-[#047857]/20'
                    : 'border-[#E3ECE7] dark:border-[#262B35] bg-[#F4F7F5] dark:bg-[#1C2029] hover:bg-slate-100 dark:hover:bg-[#232936]'
                }`}
              >
                <div className="text-base font-black mb-1 text-[#047857] dark:text-emerald-400">
                  {m.icon}
                </div>
                <div className="text-[11px] font-bold text-[#0B1F17] dark:text-white">
                  {m.name}
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 border border-[#E3ECE7] dark:border-[#262B35] rounded-2xl hover:bg-slate-100 dark:hover:bg-[#232936] text-[#0B1F17] dark:text-slate-300 font-semibold text-xs"
            >
              واپس
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!method}
              className="flex-1 py-3 bg-[#047857] hover:bg-[#036046] text-white rounded-2xl font-bold text-xs disabled:opacity-40 shadow-sm"
            >
              آگے بڑھیں
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-2xl bg-[#F4F7F5] dark:bg-[#1C2029] border border-[#E3ECE7] dark:border-[#262B35] p-4 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#55695F] dark:text-[#94A3B8]">رقم:</span>
              <strong className="text-sm font-black text-[#047857] dark:text-emerald-400">
                ₨ {Number(amount || 0).toLocaleString()}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#55695F] dark:text-[#94A3B8]">طریقہ:</span>
              <strong className="font-bold text-[#0B1F17] dark:text-white">
                {methods.find((m) => m.id === method)?.name}
              </strong>
            </div>
          </div>

          <div>
            <label
              htmlFor="withdraw-pin"
              className="block text-xs font-bold text-[#55695F] dark:text-[#94A3B8] mb-1.5"
            >
              سیکیورٹی PIN کی تصدیق (4 ہندسے)
            </label>
            <input
              id="withdraw-pin"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-full p-3.5 border-2 border-[#E3ECE7] dark:border-[#262B35] bg-[#F4F7F5] dark:bg-[#1C2029] text-[#0B1F17] dark:text-white rounded-2xl text-center text-xl tracking-widest focus:border-[#047857] dark:focus:border-emerald-400 outline-none"
            />
          </div>

          {error && (
            <p role="alert" className="text-red-500 dark:text-red-400 text-xs text-center font-semibold">
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 py-3 border border-[#E3ECE7] dark:border-[#262B35] rounded-2xl hover:bg-slate-100 dark:hover:bg-[#232936] text-[#0B1F17] dark:text-slate-300 font-semibold text-xs"
            >
              واپس
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#047857] hover:bg-[#036046] active:scale-[0.98] text-white rounded-2xl font-bold text-xs disabled:opacity-40 shadow-md shadow-emerald-900/20"
            >
              {loading ? 'پروسیسنگ...' : 'رقم منتقل کریں'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
