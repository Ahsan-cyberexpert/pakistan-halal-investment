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
  
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
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
          const text = event.results[0][0].transcript;
          setTranscript(text);
          sendPrompt(text);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, [lang, balance, holdings]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if ('vibrate' in navigator) navigator.vibrate(50);
      setTranscript('');
      setIsListening(true);
      try {
        recognitionRef.current?.start();
      } catch {
        setIsListening(false);
        alert(lang === 'ur' ? 'مائیکروفون کی اجازت نہیں ہے، براہ کرم لکھ کر سوال پوچھیں۔' : 'Microphone permission denied. Please type your question.');
      }
    }
  };

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ur' ? 'ur-PK' : 'en-US';
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const sendPrompt = async (text: string) => {
    if (!text.trim()) return;
    setIsProcessing(true);
    setTranscript(text);
    setPrompt('');
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: text, 
          lang,
          context: { balance, holdings, transactions } 
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setResponse(data.reply);
        speak(data.audioText || data.reply);
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
    if (e.key === 'Enter') sendPrompt(prompt);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl shadow-2xl shadow-emerald-900/40 flex items-center justify-center text-2xl z-[100] hover:scale-110 active:scale-90 transition-all border border-emerald-400/30 group"
        title="Roziq AI Master Guardian"
      >
        <div className="absolute inset-0 bg-emerald-400 rounded-2xl animate-ping opacity-25 group-hover:opacity-40"></div>
        🤖
      </button>

      {/* Unified AI Master Modal (Voice + Write + Account Context) */}
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-3 sm:p-4" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300 flex flex-col max-h-[85vh] border border-slate-100">
            {/* Top Brand Header */}
            <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-5 sm:p-6 text-white flex-shrink-0 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              
              <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/20 transition-transform duration-500 ${isListening ? 'rotate-12 scale-110 bg-amber-500' : isSpeaking ? 'animate-bounce bg-emerald-500' : ''}`}>
                    🤖
                  </div>
                  <div>
                    <h3 className="font-black text-base tracking-tight flex items-center gap-1.5">
                      ROZIQ <span className="text-emerald-200">AI</span>
                      <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full border border-white/30 uppercase tracking-widest">Master Agent</span>
                    </h3>
                    <p className="text-[10px] font-bold text-emerald-100/80">{lang === 'ur' ? 'شرعی و مالیاتی مشیر (اکاؤنٹ سے منسلک)' : 'Sovereign Wealth Guardian (Account Linked)'}</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white text-lg p-1 bg-white/10 rounded-xl w-8 h-8 flex items-center justify-center backdrop-blur-sm border border-white/10">✕</button>
              </div>
              
              {/* AI Response Display Area */}
              <div className="min-h-[90px] max-h-[160px] overflow-y-auto flex flex-col justify-center pr-1 relative z-10">
                <p className="text-xs sm:text-sm font-black leading-relaxed mb-1 text-white shadow-sm">"{response}"</p>
                {transcript && <p className="text-emerald-200 text-[11px] font-bold opacity-80 italic">"{transcript}"</p>}
              </div>

              {/* Live Context Badge */}
              <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center text-[10px] font-bold text-emerald-100/90 relative z-10">
                <span>🏦 {lang === 'ur' ? 'موجودہ کیش بیلنس:' : 'Live Cash Balance:'} PKR {balance.toLocaleString()}</span>
                <span>💼 {holdings.length} {lang === 'ur' ? 'اسٹاکس' : 'Stocks'}</span>
              </div>
            </div>

            {/* Input & Controls Area (Voice + Write) */}
            <div className="p-5 sm:p-6 flex-1 overflow-y-auto flex flex-col justify-between space-y-4 bg-slate-50">
              <div className="flex w-full gap-2 items-center">
                <button 
                  onClick={toggleListening}
                  title={lang === 'ur' ? 'آواز سے بولیں' : 'Speak via Voice'}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all active:scale-95 flex-shrink-0 shadow-md ${
                    isListening ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-500/30' : 'bg-white text-emerald-600 border border-slate-200 hover:bg-emerald-50'
                  }`}
                >
                  {isListening ? '⏹️' : '🎤'}
                </button>

                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={lang === 'ur' ? 'لکھ کر سوال پوچھیں (زکوٰۃ، حلال اسٹاکس، بیلنس)...' : 'Write a question (Zakat, Halal stocks, Balance)...'}
                  className="flex-1 bg-white text-slate-800 placeholder-slate-400 rounded-2xl px-4 py-3.5 text-xs font-bold outline-none border border-slate-200 focus:border-emerald-500 shadow-inner transition-colors"
                />

                <button 
                  onClick={() => sendPrompt(prompt)}
                  disabled={isProcessing || !prompt.trim()}
                  className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-lg font-black hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50 flex-shrink-0 shadow-md"
                >
                  {isProcessing ? '⏳' : '↑'}
                </button>
              </div>
              
              {/* Quick Prompt Chips */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 text-center mb-2.5">
                  {lang === 'ur' ? 'یا ذیل میں سے فوری احکامات منتخب کریں:' : 'Or choose quick commands below:'}
                </p>
                <div className="w-full flex flex-wrap gap-1.5 justify-center">
                  {(lang === 'ur' 
                    ? ['میرا بیلنس کیا ہے؟', 'زکوٰۃ کا حساب لگائیں', 'میرے اسٹاکس دکھائیں', 'کیا میزان بینک حلال ہے؟', 'فیملی ہیلتھ کیا ہے؟', 'سکوک کیا ہیں؟']
                    : ['What is my balance?', 'Calculate my Zakat', 'Review my stocks', 'Is Meezan Bank halal?', 'What is Family Health?', 'What are Sukuks?']
                  ).map(t => (
                    <button 
                      key={t} 
                      onClick={() => sendPrompt(t)}
                      className="px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-[10px] font-black text-slate-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all active:scale-95 shadow-sm"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center pt-2 border-t border-slate-200/60">
                <p className="text-[10px] font-bold text-slate-400">✓ Hackathon Master Agent (Voice + Write + Account Linked)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
