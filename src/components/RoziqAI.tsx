'use client';
import { useState, useEffect } from 'react';

export default function RoziqAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('اسلام وعلیکم! میں آپ کی کیسے مدد کر سکتا ہوں؟');

  const lang = typeof window !== 'undefined' ? (localStorage.getItem('roziq_lang') || 'en') : 'en';

  const sendPrompt = async (text: string) => {
    if (!text.trim()) return;
    setIsProcessing(true);
    setTranscript(text);
    setPrompt('');
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, lang }),
      });
      const data = await res.json();
      if (data.reply) setResponse(data.reply);
      else setResponse(lang === 'ur' ? 'معذرت، ایک خرابی پیش آ گئی۔' : 'Sorry, an error occurred.');
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
        className="fixed bottom-32 right-6 w-16 h-16 bg-emerald-600 text-white rounded-full shadow-2xl shadow-emerald-900/40 flex items-center justify-center text-3xl z-[100] hover:scale-110 active:scale-90 transition-all group"
      >
        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
        🎤
      </button>

      {/* AI Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-emerald-600 p-8 text-white">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-xl">🤖</div>
                  <div>
                    <h3 className="font-black tracking-tight">Roziq AI</h3>
                    <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">Sovereign Voice Assistant</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white text-2xl">✕</button>
              </div>
              
              <div className="min-h-[100px] flex flex-col justify-center text-right">
                <p className="text-2xl font-black leading-relaxed mb-2">"{response}"</p>
                {transcript && <p className="text-emerald-200 text-xs font-bold opacity-60 italic">"{transcript}"</p>}
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-col items-center gap-6">
                <div className="flex w-full gap-2 mb-4">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={lang === 'ur' ? 'سوال پوچھیں...' : 'Ask a question...'}
                    className="flex-1 bg-emerald-700/20 text-white placeholder-emerald-200/50 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-white/30"
                    dir={lang === 'ur' ? 'rtl' : 'ltr'}
                  />
                  <button 
                    onClick={() => sendPrompt(prompt)}
                    disabled={isProcessing || !prompt.trim()}
                    className="w-12 h-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center text-xl hover:bg-emerald-50 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isProcessing ? '⏳' : '↑'}
                  </button>
                </div>
                
                <p className="text-sm font-bold text-slate-400 text-center">
                  {lang === 'ur' ? 'یا ذیل میں سے انتخاب کریں:' : 'Or choose from below:'}
                </p>

                <div className="w-full flex flex-wrap gap-2 justify-center" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
                  {(lang === 'ur' 
                    ? ['زکوٰۃ کیسے ادا کروں؟', 'حلال اسٹاکس بتائیں', 'میرا بیلنس کیا ہے؟']
                    : ['How to pay Zakat?', 'Show Halal Stocks', 'What is my balance?']
                  ).map(t => (
                    <button 
                      key={t} 
                      onClick={() => sendPrompt(t)}
                      className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
