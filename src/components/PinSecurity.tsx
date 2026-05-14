'use client';
import { useState, useEffect } from 'react';

interface PinSecurityProps {
  onSuccess: () => void;
}

const DEFAULT_PIN = '1234';

export default function PinSecurity({ onSuccess }: PinSecurityProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [storedPin, setStoredPin] = useState(DEFAULT_PIN);
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [step, setStep] = useState<'enter' | 'set-new' | 'confirm-new'>('enter');
  const [confirmPin, setConfirmPin] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('roziq_pin');
    if (saved) setStoredPin(saved);
    else {
      localStorage.setItem('roziq_pin', DEFAULT_PIN);
    }
  }, []);

  const handlePress = (num: string) => {
    if (step === 'enter') {
      if (pin.length < 4) setPin(p => p + num);
    } else if (step === 'set-new') {
      if (newPin.length < 4) setNewPin(p => p + num);
    } else if (step === 'confirm-new') {
      if (confirmPin.length < 4) setConfirmPin(p => p + num);
    }
    setError(false);
  };

  const handleBackspace = () => {
    if (step === 'enter') setPin(p => p.slice(0, -1));
    else if (step === 'set-new') setNewPin(p => p.slice(0, -1));
    else if (step === 'confirm-new') setConfirmPin(p => p.slice(0, -1));
  };

  // Auto-check on 4 digits entered
  useEffect(() => {
    if (step === 'enter' && pin.length === 4) {
      if (pin === storedPin) {
        onSuccess();
      } else {
        setTimeout(() => { setError(true); setPin(''); }, 200);
      }
    }
    if (step === 'set-new' && newPin.length === 4) {
      setTimeout(() => setStep('confirm-new'), 300);
    }
    if (step === 'confirm-new' && confirmPin.length === 4) {
      if (confirmPin === newPin) {
        localStorage.setItem('roziq_pin', newPin);
        setStoredPin(newPin);
        setStep('enter');
        setNewPin('');
        setConfirmPin('');
        setIsSettingPin(false);
      } else {
        setTimeout(() => { setError(true); setConfirmPin(''); setStep('set-new'); setNewPin(''); }, 200);
      }
    }
  }, [pin, newPin, confirmPin, step, storedPin, onSuccess]);

  const currentPin = step === 'enter' ? pin : step === 'set-new' ? newPin : confirmPin;

  const title = step === 'enter' ? 'اپنا پن درج کریں' : step === 'set-new' ? 'نیا پن درج کریں' : 'پن کی تصدیق کریں';
  const subtitle = step === 'enter' ? 'Enter your 4-digit PIN' : step === 'set-new' ? 'Enter new 4-digit PIN' : 'Confirm your new PIN';

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900 flex flex-col items-center justify-center px-8">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        <div className="w-20 h-20 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-4xl mb-8 shadow-2xl shadow-emerald-900/40">
          🇵🇰
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Roziq</h1>
        <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-12">Security Gate</p>

        <h2 className="text-xl font-medium text-slate-300 mb-8 text-center leading-relaxed">
          {title}<br/>
          <span className="text-sm text-slate-500 font-normal">{subtitle}</span>
        </h2>

        <div className="flex gap-6 mb-16">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                currentPin.length > i
                  ? 'bg-emerald-500 border-emerald-500 scale-125 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                  : error ? 'border-red-500 animate-[shake_0.2s_ease-in-out_2]' : 'border-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handlePress(num.toString())}
              className="w-full aspect-square rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-bold text-white hover:bg-white/10 active:scale-90 transition-all duration-200"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handlePress('0')}
            className="w-full aspect-square rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-bold text-white hover:bg-white/10 active:scale-90 transition-all duration-200"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="w-full aspect-square rounded-[2rem] flex items-center justify-center text-2xl text-slate-500 hover:text-white transition-colors"
          >
            ⌫
          </button>
        </div>

        {step === 'enter' && (
          <button
            className="mt-12 text-slate-500 text-xs font-bold hover:text-emerald-400 transition-colors uppercase tracking-widest"
            onClick={() => { setStep('set-new'); setPin(''); setError(false); }}
          >
            Change PIN / پن تبدیل کریں
          </button>
        )}
        {step !== 'enter' && (
          <button
            className="mt-12 text-slate-500 text-xs font-bold hover:text-red-400 transition-colors uppercase tracking-widest"
            onClick={() => { setStep('enter'); setNewPin(''); setConfirmPin(''); setError(false); }}
          >
            Cancel / واپس جائیں
          </button>
        )}
      </div>
    </div>
  );
}
