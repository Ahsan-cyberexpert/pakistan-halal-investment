'use client';
import { useState, useEffect } from 'react';

interface SovereignScanProps {
  onComplete: () => void;
  isOpen: boolean;
}

export default function SovereignScan({ onComplete, isOpen }: SovereignScanProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing Sovereign Bio-Link...');

  useEffect(() => {
    if (!isOpen) return;

    setProgress(0);
    setStatus('Initializing Sovereign Bio-Link...');
    
    const timer1 = setTimeout(() => setStatus('Scanning Biometrics...'), 1000);
    const timer2 = setTimeout(() => setStatus('Verifying Shariah Identity...'), 2500);
    const timer3 = setTimeout(() => setStatus('Authorized.'), 4000);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(interval);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl flex items-center justify-center z-[100] animate-in fade-in duration-500">
      <div className="text-center max-w-xs w-full p-8">
        {/* Biometric Icon Animation */}
        <div className="relative w-32 h-32 mx-auto mb-12">
          <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
          <div 
            className="absolute inset-0 border-4 border-emerald-500 rounded-full animate-spin transition-all duration-300"
            style={{ clipPath: `inset(0 0 ${100 - progress}% 0)` }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center text-5xl">
            {progress < 40 ? '🔐' : progress < 80 ? '👤' : '✅'}
          </div>
          
          {/* Scanning Line */}
          {progress < 100 && (
            <div 
              className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] z-10 animate-pulse"
              style={{ top: `${progress}%` }}
            ></div>
          )}
        </div>

        <h2 className="text-white font-black text-xl tracking-tight mb-2">{status}</h2>
        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mb-8">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          Sovereign ID Protection Active
        </p>
      </div>
    </div>
  );
}
