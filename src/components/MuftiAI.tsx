'use client';
import { useState, useEffect, useRef } from 'react';

interface MuftiAIProps {
  lang: 'en' | 'ur';
}

export default function MuftiAI({ lang }: MuftiAIProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const t = (en: string, ur: string) => (lang === 'ur' ? ur : en);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = lang === 'ur' ? 'ur-PK' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        askMufti(text);
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, [lang]);

  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if ('vibrate' in navigator) navigator.vibrate(50);
      setTranscript('');
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ur' ? 'ur-PK' : 'en-US';
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const askMufti = async (message: string) => {
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: message }]);
    try {
      const res = await fetch('/api/agent/mufti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, lang })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
      speak(data.audioText || data.text);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "I am unable to consult the texts right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-[3rem] bg-slate-950 border border-amber-500/20 shadow-4xl relative overflow-hidden transition-all duration-700 min-h-[500px] flex flex-col">
      {/* Spiritual Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/10 rounded-full blur-[80px]" />
      
      <div className="relative z-10 flex flex-col items-center text-center flex-1">
        {/* Mufti Avatar/Icon */}
        <div className="relative mb-8">
          {(isListening || isSpeaking) && (
            <div className="absolute inset-0 -m-4">
              <div className="w-full h-full rounded-full border-2 border-amber-500/30 animate-ping" />
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-pulse scale-125" />
            </div>
          )}
          <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-2xl transition-all duration-700 ${isListening ? 'bg-amber-500 rotate-12 scale-110' : isSpeaking ? 'bg-amber-600 animate-bounce' : 'bg-slate-900 border border-white/5'}`}>
            👳‍♂️
          </div>
        </div>

        <h2 className="text-3xl font-black text-amber-500 tracking-tighter mb-2 italic uppercase">MUFTI <span className="text-white">AI</span></h2>
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8">{t('Certified Shariah Advisor', 'تصدیق شدہ شرعی مشیر')}</p>

        {/* Interaction Area - Chat Thread */}
        <div className="w-full flex-1 min-h-[200px] max-h-[300px] overflow-y-auto space-y-4 mb-8 pr-2 scrollbar-hide flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6 border-2 border-dashed border-white/5 rounded-[2.5rem]">
               <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{t('Tap microphone to begin consultation', 'مشاورت شروع کرنے کے لیے مائیکروفون پر ٹیپ کریں')}</p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                <div className={`max-w-[85%] p-5 rounded-[2rem] text-xs font-bold leading-relaxed tracking-tight ${m.role === 'user' ? 'bg-amber-500 text-white rounded-tr-none' : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 p-5 rounded-[2rem] rounded-tl-none border border-white/5 flex gap-1.5">
                {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />)}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="w-full flex items-center justify-between bg-black/40 p-6 rounded-[2.5rem] border border-white/5 shadow-inner">
          <div className="text-left">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('Voice Interaction', 'وائس انٹرایکشن')}</p>
            <p className="text-xs font-black text-white">{isListening ? t('Listening...', 'سن رہا ہوں...') : isSpeaking ? t('Speaking...', 'بول رہا ہوں...') : t('Ready', 'تیار')}</p>
          </div>
          
          <button 
            onClick={toggleListening}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all active:scale-75 ${isListening ? 'bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'bg-amber-500 text-white shadow-2xl shadow-amber-900/40 hover:bg-amber-400'}`}
          >
            {isListening ? '⏹️' : '🎤'}
          </button>
        </div>
      </div>

      {/* Compliance */}
      <div className="mt-8 flex justify-center gap-3">
        <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
          <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">AAOIFI Certified</span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">v1.0 Sovereign</span>
        </div>
      </div>
    </div>
  );
}
