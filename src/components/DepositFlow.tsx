'use client';
import { useState } from 'react';

export default function DepositFlow({ onSuccess }: { onSuccess: (data: any) => void }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bankStatus, setBankStatus] = useState<'idle' | 'connecting' | 'processing' | 'success' | 'failed'>('idle');

  const methods = [
    { id: 'jazzcash', name: 'JazzCash', color: 'bg-red-50 border-red-200', icon: '📱' },
    { id: 'easypaisa', name: 'EasyPaisa', color: 'bg-green-50 border-green-200', icon: '🟢' },
    { id: 'bank', name: 'Bank Transfer', color: 'bg-blue-50 border-blue-200', icon: '🏦' }
  ];

  const validate = () => {
    setError('');
    if (!amount || Number(amount) < 100) { setError('کم از کم PKR 100 درج کریں'); return false; }
    if (!method) { setError('ادائیگی کا طریقہ منتخب کریں'); return false; }
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) { setError('4 ہندسوں کا درست PIN درج کریں'); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setBankStatus('connecting');

    try {
      // Simulate Bank Connection Phase
      setTimeout(() => setBankStatus('processing'), 1000);

      // Call our API
      const response = await fetch('/api/payment/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), method, pin })
      });

      const result = await response.json();

      if (response.ok) {
        setBankStatus('success');
        // Wait 1 second then close modal and update parent
        setTimeout(() => {
          onSuccess({ type: 'deposit', amount: Number(amount), method, ref: result.ref });
        }, 1500);
      } else {
        setBankStatus('failed');
        setError(result.message || 'Transaction Failed');
      }
    } catch (err) {
      setBankStatus('failed');
      setError('Network Error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (bankStatus !== 'idle' && !loading && bankStatus !== 'success' && bankStatus !== 'failed') {
    return (
      <div className="w-full max-w-sm mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
        {bankStatus === 'connecting' && (
          <div className="flex flex-col items-center animate-pulse">
            <div className="text-4xl mb-4">🏦</div>
            <h3 className="text-lg font-bold text-gray-800">Connecting to Bank...</h3>
            <p className="text-sm text-gray-500 mt-2">Please wait while we secure your connection.</p>
          </div>
        )}
        {bankStatus === 'processing' && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-bold text-gray-800">Processing Payment...</h3>
            <p className="text-sm text-gray-500 mt-2">Confirming PKR {amount} via {method}</p>
            <p className="text-xs text-gray-400 mt-1">Do not close this window</p>
          </div>
        )}
      </div>
    );
  }

  if (bankStatus === 'success') {
    return (
      <div className="w-full max-w-sm mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h3 className="text-xl font-bold text-green-700">Payment Successful!</h3>
        <p className="text-gray-600 mt-2">PKR {amount} has been added to your Roziq Wallet.</p>
        <p className="text-xs text-gray-400 mt-4">Redirecting...</p>
      </div>
    );
  }

  if (bankStatus === 'failed') {
    return (
      <div className="w-full max-w-sm mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">❌</span>
        </div>
        <h3 className="text-xl font-bold text-red-700">Payment Failed</h3>
        <p className="text-red-500 mt-2 text-sm">{error}</p>
        <button
          onClick={() => { setBankStatus('idle'); setError(''); }}
          className="mt-6 px-6 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-xl font-bold mb-5 text-gray-800">💰 ڈیپوزٹ کریں</h2>

      {step === 1 && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">رقم (PKR)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 5000"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
          />
          <button onClick={() => setStep(2)} className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium">
            آگے بڑھیں
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">ادائیگی کا طریقہ</label>
          <div className="grid grid-cols-3 gap-3">
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`p-3 border rounded-xl text-center transition ${method === m.id ? `${m.color} ring-2 ring-green-500` : 'hover:bg-gray-50'
                  }`}
              >
                <div className="text-2xl mb-1">{m.icon}</div>
                <div className="text-xs font-medium">{m.name}</div>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="flex-1 py-3 border rounded-xl hover:bg-gray-50">واپس</button>
            <button onClick={() => setStep(3)} className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700">آگے بڑھیں</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-yellow-50 rounded-lg text-yellow-800 text-xs text-center mb-2">
            🔒 Secure connection to {method.toUpperCase()}
          </div>
          <label className="block text-sm font-medium text-gray-700">4 ہندسوں کا PIN</label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="****"
            className="w-full p-3 border rounded-xl text-center text-xl tracking-widest focus:ring-2 focus:ring-green-500 outline-none"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 border rounded-xl hover:bg-gray-50">واپس</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 font-medium">
              {loading ? 'پروسیس...' : 'تصدیق کریں'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
