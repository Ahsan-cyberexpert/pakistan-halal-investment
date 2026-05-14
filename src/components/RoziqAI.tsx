'use client';
import { useState, useEffect } from 'react';

export default function RoziqAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('اسلام وعلیکم! میں آپ کی کیسے مدد کر سکتا ہوں؟');

  const startListening = () => {
    setIsListening(true);
    setTranscript('Listening... / سن رہا ہوں...');
    
    // Simulate Voice AI Response
    setTimeout(() => {
      setIsListening(false);
      setTranscript('میری زکوٰۃ کتنی ہے؟');
      setResponse('آپ کے موجودہ بیلنس کے مطابق آپ کی زکوٰۃ 6,417 روپے بنتی ہے۔ کیا آپ اسے ادا کرنا چاہتے ہیں؟');
    }, 3000);
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
                <div 
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl cursor-pointer transition-all ${
                    isListening ? 'bg-red-50 text-red-500 scale-110' : 'bg-emerald-50 text-emerald-600'
                  }`}
                  onClick={startListening}
                >
                  {isListening ? (
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                      🛑
                    </div>
                  ) : '🎤'}
                </div>
                
                <p className="text-sm font-bold text-slate-400 text-center">
                  {isListening ? 'AI is listening to your Urdu request...' : 'Tap to speak / بولنے کے لیے دبائیں'}
                </p>

                <div className="w-full flex flex-wrap gap-2 justify-center">
                  {['کتنی زکوٰۃ ہے؟', 'سرمایہ کاری کہاں کروں؟', 'میرا بیلنس کیا ہے؟'].map(t => (
                    <button key={t} className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
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
