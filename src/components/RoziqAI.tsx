'use client';
import { useState, useEffect, useRef } from 'react';

interface RoziqAIProps {
  balance?: number;
  holdings?: any[];
  transactions?: any[];
  lang?: 'en' | 'ur';
}

export default function RoziqAI({ balance = 0, holdings = [], transactions = [], lang = 'en' }: RoziqAIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState(lang === 'ur' ? 'السلام علیکم! میں روزق اے آئی ہوں، آپ کا اسلامی مالیاتی مشیر۔ میں آپ کے اکاؤنٹس اور پورٹ فولیو دیکھ سکتا ہوں۔ بتائیں کیا رہنمائی چاہیے؟' : 'Assalam-o-Alaikum! I am Roziq AI, your Islamic Wealth Guardian. I have real-time access to your accounts and portfolio. How can I assist you today?');
  const [audioTextToPlay, setAudioTextToPlay] = useState('');
  
  const [isListening, setIsListening] = useState<'ur' | 'en' | false>(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          const detectedSpeechLang = recognitionRef.current.lang.includes('ur') ? 'ur' : 'en';
          setTranscript(text);
          sendPrompt(text, detectedSpeechLang);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, [lang, balance, holdings]);

  const toggleListening = (speechLang: 'ur' | 'en') => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume(); // Resume audio context on direct user click
    }
    if (isListening === speechLang) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if ('vibrate' in navigator) navigator.vibrate(50);
      if (recognitionRef.current) {
        recognitionRef.current.lang = speechLang === 'ur' ? 'ur-PK' : 'en-US';
      }
      setTranscript('');
      setIsListening(speechLang);
      try {
        recognitionRef.current?.start();
      } catch {
        setIsListening(false);
        alert(lang === 'ur' ? 'مائیکروفون کی اجازت نہیں ہے، براہ کرم لکھ کر سوال پوچھیں۔' : 'Microphone permission denied. Please type your question.');
      }
    }
  };

  const speak = (text: string, speechLang?: 'ur' | 'en') => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechLang === 'ur' ? 'ur-PK' : 'en-US';
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleManualPlayVoice = () => {
    const textToSpeak = audioTextToPlay || response;
    if (textToSpeak) {
      speak(textToSpeak, lang === 'ur' ? 'ur' : 'en');
    }
  };

  const sendPrompt = async (text: string, explicitLang?: 'ur' | 'en') => {
    if (!text.trim()) return;
    setIsProcessing(true);
    setTranscript(text);
    setPrompt('');
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) { window.speechSynthesis.resume(); }
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: text, 
          lang: explicitLang || lang,
          explicitLang,
          context: { balance, holdings, transactions } 
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setResponse(data.reply);
        setAudioTextToPlay(data.audioText || data.reply);
        speak(data.audioText || data.reply, explicitLang || lang);
      } else {
        setResponse(lang === 'ur' ? 'معذرت، ایک خرابی پیش آ گئی۔' : 'Sorry, an error occurred.');
      }
    } catch {
      setResponse(lang === 'ur' ? 'نیٹ ورک کا مسئلہ ہے۔' : 'Network error.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) sendPrompt(prompt);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        aria-label={lang === 'ur' ? 'روزق اے آئی کھولیں' : 'Open Roziq AI help'}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="touch-target fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-4 lg:bottom-6 lg:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl shadow-2xl shadow-emerald-900/40 flex items-center justify-center text-xl sm:text-2xl z-[100] hover:scale-105 active:scale-95 transition-transform border border-emerald-400/30 group"
        title="Roziq AI Master Guardian"
      >
        <div className="absolute inset-0 bg-emerald-400 rounded-2xl animate-ping opacity-25 group-hover:opacity-40"></div>
        
      </button>

      {/* Unified AI Master Modal (Voice + Write + Account Context) */}
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-3 sm:p-4" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-200 flex flex-col max-h-[85vh] border border-slate-100">
            {/* Top Brand Header */}
            <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-4 sm:p-5 text-white flex-shrink-0 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              
              <div className="flex justify-between items-center mb-2.5 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-inner border border-white/20 transition-transform duration-300 ${isListening ? 'rotate-12 scale-110 bg-amber-500' : isSpeaking ? 'animate-bounce bg-emerald-50' : ''}`}>
                    
                  </div>
                  <div>
                    <h3 className="font-black text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                      ROZIQ <span className="text-emerald-200">AI</span>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full border border-white/30 uppercase tracking-wider font-bold">Master Agent</span>
                    </h3>
                    <p className="text-xs font-bold text-emerald-100/90">{lang === 'ur' ? 'شرعی و مالیاتی مشیر' : 'Sovereign Wealth Guardian'}</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} aria-label={lang === 'ur' ? 'بند کریں' : 'Close AI help'} className="touch-target text-white/80 hover:text-white text-sm bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">✕</button>
              </div>
              
              {/* AI Response Display Area */}
              <div className="min-h-[80px] max-h-[150px] overflow-y-auto flex flex-col justify-center pr-1 relative z-10 mb-2">
                <p className="text-xs sm:text-sm font-black leading-relaxed mb-1 text-white shadow-sm">&quot;{response}&quot;</p>
                {transcript && <p className="text-emerald-200 text-xs font-bold opacity-90 italic">&quot;{transcript}&quot;</p>}
              </div>

              {/* Prominent Manual Play Voice Button */}
              <div className="relative z-10 flex justify-end mb-1">
                <button 
                  onClick={handleManualPlayVoice}
                  className="px-3 py-1.5 bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-all active:scale-95 border border-emerald-100 flex-shrink-0"
                >
                  <span className={`${isSpeaking ? 'animate-spin' : ''}`}>🔊</span> 
                  <span>{lang === 'ur' ? 'آواز سنیں (Play Voice)' : 'Play Voice'}</span>
                </button>
              </div>

              {/* Live Context Badge */}
              <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center text-xs font-bold text-emerald-100/90 relative z-10">
                <span>🏦 {lang === 'ur' ? 'ورچوئل کیش بیلنس:' : 'Demo Cash Balance:'} PKR {balance.toLocaleString()}</span>
                <span> {holdings.length} {lang === 'ur' ? 'اسٹاکس' : 'Stocks'}</span>
              </div>
            </div>

            {/* Input & Controls Area (Voice + Write) */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col justify-between space-y-4 bg-slate-50">
              <div className="flex flex-col gap-2 w-full">
                {/* Dual Mic Row */}
                <div className="flex gap-2 w-full justify-center">
                  <button 
                    onClick={() => toggleListening('ur')}
                    className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-black transition-all active:scale-95 shadow-sm border ${
                      isListening === 'ur' ? 'bg-red-500 text-white animate-pulse border-red-600' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                    }`}
                  >
                    <span>{isListening === 'ur' ? '■' : 'REC'}</span> Speak Urdu (اردو)
                  </button>

                  <button 
                    onClick={() => toggleListening('en')}
                    className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-black transition-all active:scale-95 shadow-sm border ${
                      isListening === 'en' ? 'bg-red-500 text-white animate-pulse border-red-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{isListening === 'en' ? '■' : 'REC'}</span> Speak English
                  </button>
                </div>

                {/* Text Input Row */}
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={lang === 'ur' ? 'لکھ کر سوال پوچھیں (زکوٰۃ، حلال اسٹاکس، بیلنس)...' : 'Write a question (Zakat, Halal stocks, Balance)...'}
                    className="flex-1 bg-white text-slate-800 placeholder-slate-400 rounded-xl px-4 py-3 text-sm sm:text-xs font-bold outline-none border border-slate-200 focus:border-emerald-500 shadow-inner transition-colors"
                  />

                  <button 
                    onClick={() => sendPrompt(prompt)}
                    disabled={isProcessing || !prompt.trim()}
                    className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-lg font-black hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50 flex-shrink-0 shadow-md"
                  >
                    {isProcessing ? '⏳' : '↑'}
                  </button>
                </div>
              </div>
              
              {/* Quick Prompt Chips */}
              <div>
                <p className="text-xs font-bold text-slate-400 text-center mb-2">
                  {lang === 'ur' ? 'یا ذیل میں سے فوری احکامات منتخب کریں:' : 'Or choose quick commands below:'}
                </p>
                <div className="w-full flex flex-wrap gap-1.5 justify-center">
                  {(lang === 'ur' 
                    ? ['میرا بیلنس کیا ہے؟', 'زکوٰۃ کا حساب لگائیں', 'میرے اسٹاکس دکھائیں', 'کیا میزان بینک حلال ہے؟', 'فیملی ہیلتھ کیا ہے؟', 'سکوک کیا ہیں؟']
                    : ['What is my balance?', 'Calculate my Zakat', 'Review my stocks', 'Is Meezan Bank halal?', 'What is Family Health?', 'What are Sukuks?']
                  ).map(t => (
                    <button 
                      key={t} 
                      onClick={() => sendPrompt(t, lang === 'ur' ? 'ur' : 'en')}
                      className="px-3 py-1.5 bg-white border border-slate-200/80 rounded-xl text-xs font-black text-slate-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all active:scale-95 shadow-sm"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center pt-2 border-t border-slate-200/60">
                <p className="text-xs font-bold text-slate-400">✓ Hackathon Master Agent (Voice + Write + Demo Simulation)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
