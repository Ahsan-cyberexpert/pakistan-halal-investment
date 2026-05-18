'use client';
import { useState, useEffect, useRef } from 'react';

interface VoiceAgentProps {
  onCommand: (cmd: string) => void;
  lang?: 'en' | 'ur';
}

export default function VoiceAgent({ onCommand, lang = 'en' }: VoiceAgentProps) {
  const [isListening, setIsListening] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [hasSupport, setHasSupport] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = lang === 'ur' ? 'ur-PK' : 'en-US';
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event: any) => {
          const text = event.results[0][0].transcript.toLowerCase();
          setStatusText(text);
          onCommand(text);
          setIsListening(false);
          setTimeout(() => setStatusText(''), 3000);
        };

        recognitionRef.current.onerror = (err: any) => {
          console.error('Speech recognition error', err);
          setStatusText(lang === 'ur' ? 'آواز سمجھ نہیں آئی، مینوئل بٹن استعمال کریں' : 'Could not understand, please use manual buttons');
          setIsListening(false);
          setTimeout(() => setStatusText(''), 3000);
        };

        recognitionRef.current.onend = () => setIsListening(false);
      } else {
        setHasSupport(false);
      }
    }
  }, [onCommand, lang]);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ur' ? 'ur-PK' : 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!hasSupport) {
      setShowHelp(true);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const promptText = lang === 'ur' ? 'بولیں۔ ڈیپوزٹ، وِڈڈرا، یا بیلنس؟' : 'Speak now: Deposit, Withdraw, or Balance?';
      setStatusText(promptText);
      speak(promptText);
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
        setStatusText(lang === 'ur' ? 'مائیکروفون کی اجازت نہیں ہے، مینوئل بٹن استعمال کریں' : 'Microphone permission denied, use manual buttons');
        setShowHelp(true); // Auto-open manual menu if mic fails
      }
    }
  };

  const sampleCommands = [
    { labelEn: 'Deposit 5000', labelUr: 'ڈیپوزٹ 5000', cmd: 'deposit' },
    { labelEn: 'Withdraw 2000', labelUr: 'وِڈڈرا 2000', cmd: 'withdraw' },
    { labelEn: 'Check Balance', labelUr: 'بیلنس بتائیں', cmd: 'balance' },
    { labelEn: 'Pay Zakat', labelUr: 'زکوٰۃ ادا کریں', cmd: 'zakat' },
    { labelEn: 'Buy Stock', labelUr: 'اسٹاک خریدیں', cmd: 'buy' },
    { labelEn: 'Family Health', labelUr: 'فیملی ہیلتھ', cmd: 'health' },
    { labelEn: 'Overseas Invest', labelUr: 'اوورسیز انویسٹ', cmd: 'overseas' }
  ];

  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end gap-3" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
      {/* Status / Command Feedback */}
      {statusText && (
        <div className="bg-slate-900/90 backdrop-blur-md text-white border border-emerald-500/30 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-xs text-right">
          <p className="text-[8px] text-emerald-400 uppercase tracking-widest mb-0.5">Voice AI Status</p>
          {statusText}
        </div>
      )}

      {/* Manual Command Helper / Fallback Menu */}
      {showHelp && (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-4.5 shadow-2xl max-w-xs w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2.5">
            <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <span>⌨️</span> {lang === 'ur' ? 'آواز کے احکامات (مینوئل)' : 'Voice Commands (Manual)'}
            </h4>
            <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1">✕</button>
          </div>
          
          {!hasSupport && (
            <p className="text-amber-700 text-[10px] font-bold mb-3 bg-amber-50 p-2.5 rounded-xl border border-amber-200/60 leading-relaxed">
              ⚠️ {lang === 'ur' ? 'آپ کا براؤزر وائس فیچر کو سپورٹ نہیں کرتا۔ نیچے دیے گئے بٹن استعمال کریں:' : 'Your browser does not support speech recognition. Use quick commands below:'}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            {sampleCommands.map((sc, i) => (
              <button key={i} onClick={() => { onCommand(sc.cmd); setShowHelp(false); }}
                className="p-2.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-xl text-xs font-bold border border-slate-200/60 hover:border-emerald-200 transition-all text-center active:scale-95 shadow-sm">
                {lang === 'ur' ? sc.labelUr : sc.labelEn}
              </button>
            ))}
          </div>
          <p className="text-[9px] text-slate-400 text-center mt-3 font-bold">✓ Shariah Voice Navigation</p>
        </div>
      )}

      {/* Main Mic Button & Manual Toggle */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setShowHelp(v => !v)}
          className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95 text-lg"
          title="Manual Command Menu"
        >
          💬
        </button>

        <button
          onClick={toggleListening}
          className={`px-4.5 py-3 rounded-2xl shadow-xl transition-all duration-300 font-black text-xs flex items-center gap-2 ${
            isListening ? 'bg-red-500 text-white scale-105 animate-pulse ring-4 ring-red-500/30' : 
            hasSupport ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white hover:shadow-emerald-900/20' : 
            'bg-slate-800 text-white hover:bg-slate-700'
          }`}
        >
          <span className="text-base">{isListening ? '🔴' : hasSupport ? '🎤' : '⌨️'}</span>
          <span>{isListening ? (lang === 'ur' ? 'سن رہا ہے...' : 'Listening...') : hasSupport ? (lang === 'ur' ? 'وائس کمانڈ' : 'Voice AI') : (lang === 'ur' ? 'کمانڈز مینو' : 'Commands')}</span>
        </button>
      </div>
    </div>
  );
}
