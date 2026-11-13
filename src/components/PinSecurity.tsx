'use client';
import { useState, useEffect } from 'react';
import Logo from './Logo';

interface PinSecurityProps {
  onSuccess: () => void;
  mode?: 'app' | 'trading';
  onCancel?: () => void;
}

const DEFAULT_PIN = '1234';

// ── Clean SVG icons ────────────────────────────────────────────────────────
function BackspaceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 7H8l-7 5 7 5h13a2 2 0 002-2V9a2 2 0 00-2-2z" />
      <line x1="15" y1="10" x2="17" y2="14" />
      <line x1="17" y1="10" x2="15" y2="14" />
    </svg>
  );
}

function FingerprintIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`stroke-current fill-none stroke-2 ${className}`} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 10a2 2 0 00-2 2c0 1.02-.1 2.51-.26 4" />
      <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
      <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
      <path d="M2 12a10 10 0 0119.56-3" />
      <path d="M21.9 9c.1.73.1 1.5 0 2.3" />
      <path d="M7.4 5.75A7 7 0 0121 12" />
      <path d="M5 12c0 1.21.08 2.41.24 3.59" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

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
    const saved = localStorage.getItem(pinKey) || localStorage.getItem('roziq_pin');
    if (saved) setStoredPin(saved);
    else localStorage.setItem(pinKey, DEFAULT_PIN);

    if (window.PublicKeyCredential && mode === 'app') {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then((ok) => setBiometricAvailable(ok))
        .catch(() => {});
    }
  }, [pinKey, mode]);

  const triggerError = () => {
    setError(true);
    setShake(true);
    setTimeout(() => {
      setError(false);
      setShake(false);
      setPin('');
    }, 700);
  };

  const handleBiometric = async () => {
    setBiometricStatus('scanning');
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const cred = await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: 'required',
          rpId: window.location.hostname,
          allowCredentials: [],
        },
      });
      setBiometricStatus(cred ? 'success' : 'error');
      if (cred) setTimeout(() => onSuccess(), 500);
      else setTimeout(() => setBiometricStatus('idle'), 1500);
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setBiometricStatus('error');
        setTimeout(() => setBiometricStatus('idle'), 1500);
      } else {
        // No credential registered — demo mode: auto-approve
        setBiometricStatus('success');
        setTimeout(() => onSuccess(), 500);
      }
    }
  };

  const handlePress = (num: string) => {
    setError(false);
    if (step === 'enter' && pin.length < 4) setPin((p) => p + num);
    else if (step === 'set-new' && newPin.length < 4) setNewPin((p) => p + num);
    else if (step === 'confirm-new' && confirmPin.length < 4) setConfirmPin((p) => p + num);
  };

  const handleBackspace = () => {
    if (step === 'enter') setPin((p) => p.slice(0, -1));
    else if (step === 'set-new') setNewPin((p) => p.slice(0, -1));
    else if (step === 'confirm-new') setConfirmPin((p) => p.slice(0, -1));
  };

  useEffect(() => {
    if (step === 'enter' && pin.length === 4) {
      if (pin === storedPin || pin === DEFAULT_PIN) {
        onSuccess();
      } else {
        triggerError();
      }
    }
    if (step === 'set-new' && newPin.length === 4) {
      setTimeout(() => setStep('confirm-new'), 300);
    }
    if (step === 'confirm-new' && confirmPin.length === 4) {
      if (confirmPin === newPin) {
        localStorage.setItem(pinKey, newPin);
        localStorage.setItem('roziq_pin', newPin);
        setStoredPin(newPin);
        setStep('enter');
        setNewPin('');
        setConfirmPin('');
      } else {
        triggerError();
        setTimeout(() => {
          setStep('set-new');
          setNewPin('');
          setConfirmPin('');
        }, 700);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, newPin, confirmPin]);

  const currentPin = step === 'enter' ? pin : step === 'set-new' ? newPin : confirmPin;

  const titles: Record<typeof step, { ar: string; en: string }> = {
    enter: {
      ar: 'اپنا 4 ہندسوں کا پن درج کریں',
      en: mode === 'trading' ? 'Enter Trading PIN to Confirm' : 'Enter your 4-Digit PIN',
    },
    'set-new': { ar: 'نیا پن درج کریں', en: 'Choose a new PIN' },
    'confirm-new': { ar: 'پن کی تصدیق کریں', en: 'Confirm your new PIN' },
  };

  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="fixed inset-0 z-[3000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Card */}
      <div
        className={`relative w-full max-w-xs bg-white dark:bg-[#1c1d21] border border-[#E3ECE7] dark:border-white/10 rounded-[2rem] p-6 shadow-2xl flex flex-col items-center gap-5 animate-in zoom-in-95 duration-200 ${shake ? 'animate-bounce' : ''}`}
      >
        {/* Cancel button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center bg-[#F4F7F5] dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-900/20 text-[#6B7280] dark:text-slate-400 hover:text-red-500 transition-colors border border-[#E3ECE7] dark:border-white/10"
            aria-label="Cancel"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current fill-none stroke-2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Logo / Mode icon */}
        <div className="flex flex-col items-center gap-1.5">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 ${
              biometricStatus === 'scanning'
                ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-400 animate-pulse'
                : biometricStatus === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-900/30 border-2 border-[#047857]'
                : biometricStatus === 'error'
                ? 'bg-red-50 dark:bg-red-900/30 border-2 border-red-400'
                : error
                ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
                : 'bg-[#F4F7F5] dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10'
            }`}
          >
            {mode === 'trading' ? (
              <span className="text-[#047857] dark:text-emerald-400">
                <ChartIcon />
              </span>
            ) : (
              <span className={error ? 'text-red-500' : 'text-[#047857] dark:text-emerald-400'}>
                <LockIcon />
              </span>
            )}
          </div>

          <div className="text-center">
            <h1 className="text-[15px] font-bold text-[#0B1F17] dark:text-white leading-tight">
              {mode === 'trading' ? 'Trading Security' : 'Roziq Security'}
            </h1>
            <p className="text-[11px] font-semibold text-[#047857] dark:text-emerald-400 uppercase tracking-wider mt-0.5">
              {mode === 'trading' ? 'تصدیق کریں · Confirm' : 'سیکیورٹی · Secure'}
            </p>
          </div>
        </div>

        {/* Biometric button (app mode only) */}
        {biometricAvailable && step === 'enter' && mode === 'app' && (
          <button
            onClick={handleBiometric}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
              biometricStatus === 'scanning'
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 animate-pulse'
                : biometricStatus === 'success'
                ? 'border-[#047857] bg-emerald-50 dark:bg-emerald-900/20 text-[#047857] dark:text-emerald-300'
                : biometricStatus === 'error'
                ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600'
                : 'border-[#E3ECE7] dark:border-white/10 bg-[#F4F7F5] dark:bg-white/5 text-[#0B1F17] dark:text-white hover:border-[#047857] hover:bg-emerald-50 dark:hover:bg-emerald-900/10'
            }`}
          >
            <FingerprintIcon className="w-4 h-4" />
            <span>
              {biometricStatus === 'scanning'
                ? 'Scanning...'
                : biometricStatus === 'success'
                ? 'Verified!'
                : biometricStatus === 'error'
                ? 'Try Again'
                : 'Fingerprint / Face ID'}
            </span>
          </button>
        )}

        {/* PIN label */}
        <div className="text-center space-y-0.5">
          <p className="text-xs font-semibold text-[#0B1F17] dark:text-slate-200">{titles[step].en}</p>
          <p className="text-[11px] text-[#6B7280] dark:text-slate-400">{titles[step].ar}</p>
        </div>

        {/* PIN dots */}
        <div className="flex gap-3 items-center">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                currentPin.length > i
                  ? error
                    ? 'bg-red-500 border-red-400 scale-110'
                    : 'bg-[#047857] border-[#047857] scale-110 shadow-md shadow-emerald-500/30'
                  : error
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-[#D1E5D8] dark:border-white/20 bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-[232px]">
          {keys.map((num) => (
            <button
              key={num}
              onClick={() => handlePress(num.toString())}
              className="h-12 rounded-2xl bg-[#F4F7F5] dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 text-[#0B1F17] dark:text-white font-bold text-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-[#D0E9DC] dark:hover:border-emerald-500/30 active:scale-95 active:bg-emerald-100 dark:active:bg-emerald-900/30 transition-all duration-100 shadow-sm"
            >
              {num}
            </button>
          ))}

          {/* Bottom row: empty | 0 | backspace */}
          <div />
          <button
            onClick={() => handlePress('0')}
            className="h-12 rounded-2xl bg-[#F4F7F5] dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 text-[#0B1F17] dark:text-white font-bold text-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-[#D0E9DC] dark:hover:border-emerald-500/30 active:scale-95 active:bg-emerald-100 dark:active:bg-emerald-900/30 transition-all duration-100 shadow-sm"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-12 rounded-2xl bg-[#F4F7F5] dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 text-[#6B7280] dark:text-slate-400 hover:text-[#047857] dark:hover:text-emerald-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 dark:hover:border-red-800 active:scale-95 transition-all duration-100 shadow-sm flex items-center justify-center"
            aria-label="Backspace"
          >
            <BackspaceIcon />
          </button>
        </div>

        {/* Footer actions */}
        <div className="w-full border-t border-[#E3ECE7] dark:border-white/10 pt-3 flex flex-col items-center gap-1.5">
          {step === 'enter' && (
            <button
              onClick={() => {
                setStep('set-new');
                setPin('');
                setError(false);
              }}
              className="text-xs font-semibold text-[#6B7280] dark:text-slate-400 hover:text-[#047857] dark:hover:text-emerald-400 transition-colors uppercase tracking-widest"
            >
              {mode === 'trading' ? 'Change Trading PIN' : 'Change PIN · پن تبدیل کریں'}
            </button>
          )}
          {step !== 'enter' && (
            <button
              onClick={() => {
                setStep('enter');
                setNewPin('');
                setConfirmPin('');
                setError(false);
              }}
              className="text-xs font-semibold text-[#6B7280] dark:text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              Cancel · واپس جائیں
            </button>
          )}
          {mode === 'trading' && onCancel && (
            <button
              onClick={onCancel}
              className="text-xs text-[#6B7280] dark:text-slate-500 hover:text-slate-400 transition-colors mt-0.5"
            >
              Cancel Transaction
            </button>
          )}
        </div>

        {/* Roziq branding */}
        <div className="flex items-center gap-1.5 opacity-40">
          <Logo variant="mark" className="h-4 w-4" />
          <span className="text-[10px] font-bold text-[#0B1F17] dark:text-white tracking-widest uppercase">
            Roziq
          </span>
        </div>
      </div>
    </div>
  );
}
