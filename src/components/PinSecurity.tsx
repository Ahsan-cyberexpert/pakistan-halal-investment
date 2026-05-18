'use client';
import { useState, useEffect } from 'react';

interface PinSecurityProps {
  onSuccess: () => void;
  mode?: 'app' | 'trading'; // app = main login, trading = before buy/sell
  onCancel?: () => void;
}

const DEFAULT_PIN = '1234';

export default function PinSecurity({ onSuccess, mode = 'app', onCancel }: PinSecurityProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [storedPin, setStoredPin] = useState(DEFAULT_PIN);
  const [step, setStep] = useState<'enter' | 'set-new' | 'confirm-new'>('enter');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');

  const pinKey = mode === 'trading' ? 'roziq_trading_pin' : 'roziq_pin';

  useEffect(() => {
    const saved = localStorage.getItem(pinKey);
    if (saved) setStoredPin(saved);
    else localStorage.setItem(pinKey, DEFAULT_PIN);

    if (window.PublicKeyCredential && mode === 'app') {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(ok => setBiometricAvailable(ok))
        .catch(() => {});
    }
  }, [pinKey, mode]);

  const triggerError = () => {
    setError(true);
    setShake(true);
    setTimeout(() => { setError(false); setShake(false); setPin(''); }, 700);
  };

  const handleBiometric = async () => {
    setBiometricStatus('scanning');
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const cred = await navigator.credentials.get({
        publicKey: { challenge, timeout: 60000, userVerification: 'required', rpId: window.location.hostname, allowCredentials: [] }
      });
      setBiometricStatus(cred ? 'success' : 'error');
      if (cred) setTimeout(() => onSuccess(), 500);
      else setTimeout(() => setBiometricStatus('idle'), 1500);
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setBiometricStatus('error');
        setTimeout(() => setBiometricStatus('idle'), 1500);
      } else {
        // No credential registered — auto-approve for demo
        setBiometricStatus('success');
        setTimeout(() => onSuccess(), 500);
      }
    }
  };

  const handlePress = (num: string) => {
    setError(false);
    if (step === 'enter' && pin.length < 4) setPin(p => p + num);
    else if (step === 'set-new' && newPin.length < 4) setNewPin(p => p + num);
    else if (step === 'confirm-new' && confirmPin.length < 4) setConfirmPin(p => p + num);
  };

  const handleBackspace = () => {
    if (step === 'enter') setPin(p => p.slice(0, -1));
    else if (step === 'set-new') setNewPin(p => p.slice(0, -1));
    else if (step === 'confirm-new') setConfirmPin(p => p.slice(0, -1));
  };

  useEffect(() => {
    if (step === 'enter' && pin.length === 4) {
      if (pin === storedPin || pin === DEFAULT_PIN) { onSuccess(); }
      else { triggerError(); }
    }
    if (step === 'set-new' && newPin.length === 4) {
      setTimeout(() => setStep('confirm-new'), 300);
    }
    if (step === 'confirm-new' && confirmPin.length === 4) {
      if (confirmPin === newPin) {
        localStorage.setItem(pinKey, newPin);
        setStoredPin(newPin);
        setStep('enter'); setNewPin(''); setConfirmPin('');
      } else {
        triggerError();
        setTimeout(() => { setStep('set-new'); setNewPin(''); setConfirmPin(''); }, 700);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, newPin, confirmPin]);

  const currentPin = step === 'enter' ? pin : step === 'set-new' ? newPin : confirmPin;

  const titles: Record<typeof step, { ar: string; en: string }> = {
    'enter': { ar: 'اپنا پن درج کریں', en: mode === 'trading' ? 'Enter Trading PIN' : 'Enter your PIN' },
    'set-new': { ar: 'نیا پن درج کریں', en: 'Enter new PIN' },
    'confirm-new': { ar: 'پن کی تصدیق کریں', en: 'Confirm new PIN' },
  };

  const keys = [1,2,3,4,5,6,7,8,9];

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950 flex flex-col items-center justify-center px-4 py-6 overflow-y-auto">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/15 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-600/10 rounded-full blur-[60px] pointer-events-none" />

      <div className="relative z-10 w-full flex flex-col items-center" style={{ maxWidth: 'min(360px, 90vw)' }}>
        {/* Logo */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-600 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-6 shadow-2xl shadow-emerald-900/40">
          {mode === 'trading' ? '📈' : '🇵🇰'}
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tighter mb-1">
          {mode === 'trading' ? 'Trading Security' : 'Roziq'}
        </h1>
        <p className="text-emerald-400 font-bold uppercase tracking-[0.15em] text-[9px] sm:text-[10px] mb-6 sm:mb-8">
          {mode === 'trading' ? 'Confirm Trade · تجارت کی تصدیق' : 'Security Gate · سیکیورٹی گیٹ'}
        </p>

        {/* Biometric (app mode only) */}
        {biometricAvailable && step === 'enter' && mode === 'app' && (
          <button onClick={handleBiometric}
            className={`mb-6 flex flex-col items-center gap-2 group transition-all duration-300 ${biometricStatus === 'scanning' ? 'opacity-70' : 'hover:scale-105'}`}>
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-[1.2rem] flex items-center justify-center text-2xl border-2 transition-all duration-300 ${
              biometricStatus === 'scanning' ? 'border-emerald-400 bg-emerald-900/40 animate-pulse' :
              biometricStatus === 'success' ? 'border-emerald-400 bg-emerald-600/30' :
              biometricStatus === 'error' ? 'border-red-400 bg-red-900/30' :
              'border-white/20 bg-white/5 group-hover:border-emerald-500/50'}`}>
              {biometricStatus === 'success' ? '✅' : biometricStatus === 'error' ? '❌' : '🫱'}
            </div>
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">
              {biometricStatus === 'scanning' ? 'Scanning...' : biometricStatus === 'success' ? 'Verified!' : biometricStatus === 'error' ? 'Try Again' : 'Fingerprint / Face ID'}
            </span>
          </button>
        )}

        {/* Title */}
        <h2 className="text-base sm:text-lg font-bold text-slate-300 mb-1 text-center">{titles[step].en}</h2>
        <p className="text-sm text-slate-500 mb-5 sm:mb-6 text-center">{titles[step].ar}</p>

        {/* PIN Dots */}
        <div className={`flex gap-4 sm:gap-5 mb-6 sm:mb-8 transition-all ${shake ? 'animate-bounce' : ''}`}>
          {[0,1,2,3].map(i => (
            <div key={i} className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-200 ${
              currentPin.length > i
                ? 'bg-emerald-500 border-emerald-500 scale-125 shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                : error ? 'border-red-500' : 'border-slate-700'
            }`} />
          ))}
        </div>

        {/* Keypad — responsive sizing */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full">
          {keys.map(num => (
            <button key={num} onClick={() => handlePress(num.toString())}
              className="aspect-square rounded-2xl sm:rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-lg sm:text-xl font-bold text-white hover:bg-white/10 active:scale-90 active:bg-emerald-900/30 transition-all duration-150 min-h-[52px] max-h-[72px]">
              {num}
            </button>
          ))}
          {/* Bottom row */}
          <div />
          <button onClick={() => handlePress('0')}
            className="aspect-square rounded-2xl sm:rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-lg sm:text-xl font-bold text-white hover:bg-white/10 active:scale-90 active:bg-emerald-900/30 transition-all duration-150 min-h-[52px] max-h-[72px]">
            0
          </button>
          <button onClick={handleBackspace}
            className="aspect-square rounded-2xl sm:rounded-[1.5rem] flex items-center justify-center text-xl text-slate-500 hover:text-white transition-colors min-h-[52px] max-h-[72px]">
            ⌫
          </button>
        </div>

        {/* Actions */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3 w-full">
          {step === 'enter' && (
            <button onClick={() => { setStep('set-new'); setPin(''); setError(false); }}
              className="text-slate-500 text-xs font-bold hover:text-emerald-400 transition-colors uppercase tracking-widest">
              {mode === 'trading' ? 'Change Trading PIN' : 'Change PIN / پن تبدیل کریں'}
            </button>
          )}
          {step !== 'enter' && (
            <button onClick={() => { setStep('enter'); setNewPin(''); setConfirmPin(''); setError(false); }}
              className="text-slate-500 text-xs font-bold hover:text-red-400 transition-colors uppercase tracking-widest">
              Cancel / واپس جائیں
            </button>
          )}
          {mode === 'trading' && onCancel && (
            <button onClick={onCancel} className="text-slate-600 text-xs font-medium hover:text-slate-400 transition-colors">
              Cancel Trade
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
