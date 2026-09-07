'use client';
import { useState, useEffect, useRef } from 'react';

interface MuftiAIProps {
  lang: 'en' | 'ur';
}

export default function MuftiAI({ lang }: MuftiAIProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
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
        const text = event.results[0][0]?.transcript;
        if (text) askMufti(text);
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, [lang]);

  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: lang === 'ur' ? 'السلام علیکم! میں مفتی اے آئی ہوں۔ آپ مجھ سے زکوٰۃ، حلال اسٹاکس، یا سود (ربا) کے بارے میں شرعی رہنمائی لے سکتے ہیں۔' : 'Assalam-o-Alaikum! I am Mufti AI. You can ask me for Shariah guidance regarding Zakat, Halal stocks, or Riba (interest).' }
  ]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if ('vibrate' in navigator) navigator.vibrate(50);
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

  const handleSendText = () => {
    if (!inputText.trim()) return;
    const query = inputText;
    setInputText('');
    askMufti(query);
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
      const fallbackMsg = lang === 'ur' 
        ? "AAOIFI شریعہ معیارات کے مطابق، آپ کی سرمایہ کاری اس وقت تک جائز ہے جب تک کمپنی کا قرض 33 فیصد سے کم اور غیر شرعی آمدنی 5 فیصد سے کم ہو۔ منافع کی باقاعدہ تطہیر یقینی بنائیں۔" 
        : "Based on AAOIFI Shariah standards, your investment is permitted as long as the company's debt-to-equity ratio is under 33% and illicit income is under 5%. Ensure regular dividend purification.";
      setMessages(prev => [...prev, { role: 'ai', text: fallbackMsg }]);
      speak(fallbackMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-[2.5rem] bg-slate-950 border border-amber-500/20 shadow-2xl relative overflow-hidden transition-all duration-500 min-h-[380px] max-h-[500px] flex flex-col" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
      {/* Spiritual Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-500/10 rounded-full blur-[60px]" />
      
      <div className="relative z-10 flex flex-col flex-1 h-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-all duration-500 ${isListening ? 'bg-amber-500 rotate-12 scale-110' : isSpeaking ? 'bg-amber-600 animate-bounce' : 'bg-slate-900 border border-white/5'}`}>
            👳‍♂️
          </div>
          <div>
            <h2 className="text-lg font-black text-amber-500 tracking-tight uppercase flex items-center gap-1.5">
              MUFTI <span className="text-white">AI</span>
              <span className="text-[9px] px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">AAOIFI</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400">{t('Certified Shariah Advisor', 'تصدیق شدہ شرعی مشیر')}</p>
          </div>
        </div>

        {/* Interaction Area - Chat Thread */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 max-h-[220px] scrollbar-hide flex flex-col">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
              <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-bold leading-relaxed tracking-tight shadow-sm ${
                m.role === 'user' 
                  ? 'bg-amber-500 text-white rounded-tr-none' 
                  : 'bg-slate-900 text-slate-200 border border-white/10 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-900 p-3.5 rounded-2xl rounded-tl-none border border-white/10 flex gap-1.5">
                {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />)}
              </div>
            </div>
          )}
        </div>

        {/* Direct Text Input & Controls */}
        <div className="mt-auto pt-2 border-t border-white/10 flex items-center gap-2">
          <button 
            onClick={toggleListening}
            title={t('Voice Input', 'وائس ان پٹ')}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg transition-all active:scale-90 flex-shrink-0 ${
              isListening ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40' : 'bg-slate-900 text-amber-500 border border-white/10 hover:bg-slate-800'
            }`}
          >
            {isListening ? '⏹️' : '🎤'}
          </button>
          
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendText()}
            placeholder={t('Ask about Zakat, Riba, Stocks...', 'زکوٰۃ، حلال اسٹاکس، یا سود کے بارے میں پوچھیں...')}
            className="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-3.5 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors"
          />

          <button 
            onClick={handleSendText}
            disabled={loading || !inputText.trim()}
            className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-base font-black hover:bg-amber-400 active:scale-95 transition-all disabled:opacity-50 flex-shrink-0"
          >
            ↑
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-white/5 justify-center">
          {(lang === 'ur' 
            ? ['کیا میزان بینک حلال ہے؟', 'زکوٰۃ کا نصاب کیا ہے؟', 'سکوک کیا ہیں؟', 'تطہیر کیسے کریں؟']
            : ['Is Meezan Bank halal?', 'What is Zakat Nisab?', 'What are Sukuks?', 'How to purify dividends?']
          ).map(q => (
            <button 
              key={q} 
              onClick={() => { setInputText(q); }}
              className="px-2.5 py-1 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-400 rounded-xl text-[10px] font-bold border border-white/5 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
