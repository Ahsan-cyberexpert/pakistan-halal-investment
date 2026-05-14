'use client';
import { useState, useEffect } from 'react';

interface PinSecurityProps {
  onSuccess: () => void;
}

export default function PinSecurity({ onSuccess }: PinSecurityProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const correctPin = '1234'; // Default for testing

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === correctPin) {
        onSuccess();
      } else {
        setTimeout(() => {
          setError(true);
          setPin('');
        }, 200);
      }
    }
  }, [pin, onSuccess]);

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900 flex flex-col items-center justify-center px-8">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* Logo & Header */}
        <div className="w-20 h-20 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-4xl mb-8 shadow-2xl shadow-emerald-900/40">
          🇵🇰
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Roziq</h1>
        <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-12">Security Gate</p>

        <h2 className="text-xl font-medium text-slate-300 mb-8 text-center leading-relaxed">
          اپنا 4 ہندسوں کا پن درج کریں <br/>
          <span className="text-sm text-slate-500 font-normal">Enter your 4-digit PIN</span>
        </h2>

        {/* PIN Indicators */}
        <div className="flex gap-6 mb-16">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                pin.length > i 
                  ? 'bg-emerald-500 border-emerald-500 scale-125 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                  : error ? 'border-red-500 animate-shake' : 'border-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Keypad */}
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
          <div /> {/* Placeholder */}
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

        {/* Footer Link */}
        <button className="mt-12 text-slate-500 text-xs font-bold hover:text-emerald-400 transition-colors uppercase tracking-widest">
          Forgot PIN? / پن بھول گئے؟
        </button>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
