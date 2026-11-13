'use client';
import { useState, useEffect, useRef } from 'react';
import Logo from './Logo';

interface MuftiAIProps {
  lang?: 'en' | 'ur';
  balance?: number;
  holdings?: Array<{ symbol: string; shares?: number; name?: string; value?: number }>;
  transactions?: Array<{ type: string; amount: number; description?: string }>;
  className?: string;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export default function MuftiAI({
  lang = 'en',
  balance = 0,
  holdings = [],
  className = '',
}: MuftiAIProps) {
  const [currentLang, setCurrentLang] = useState<'en' | 'ur'>(lang);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef<any>(null);
  const askMuftiRef = useRef<(message: string) => Promise<void>>(async () => {});

  const isUrdu = currentLang === 'ur';
  const t = (en: string, ur: string) => (isUrdu ? ur : en);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = isUrdu ? 'ur-PK' : 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const text = event.results[0][0]?.transcript;
          if (text) askMuftiRef.current(text);
        };

        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onerror = () => setIsListening(false);
      }
    }
  }, [isUrdu]);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: isUrdu
        ? 'السلام علیکم! میں روزق مفتی اے آئی ہوں — آپ کا مصدقہ اسلامی مالیاتی مشیر۔ آپ مجھ سے زکوٰۃ، حلال حصص، تطہیرِ منافع یا اپنے پورٹ فولیو کی شرعی حیثیت کے بارے میں پوچھ سکتے ہیں۔'
        : 'Assalam-o-Alaikum! I am Roziq Mufti AI, your certified Shariah wealth guardian. Ask me about AAOIFI compliance, Zakat calculation, dividend purification, or your portfolio holdings.',
    },
  ]);

  const toggleListening = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if ('vibrate' in navigator) navigator.vibrate(40);
      if (recognitionRef.current) {
        recognitionRef.current.lang = isUrdu ? 'ur-PK' : 'en-US';
      }
      setIsListening(true);
      try {
        recognitionRef.current?.start();
      } catch {
        setIsListening(false);
        alert(
          isUrdu
            ? 'مائیکروفون کی اجازت نہیں ملی، برائے مہربانی لکھ کر سوال پوچھیں۔'
            : 'Microphone permission not granted. Please type your query.'
        );
      }
    }
  };

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isUrdu ? 'ur-PK' : 'en-US';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
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
    setMessages((prev) => [...prev, { role: 'user', text: message }]);

    // Contextual enrichment if portfolio-specific questions are asked
    const lower = message.toLowerCase();
    let enrichedMessage = message;
    if (
      (lower.includes('my balance') ||
        lower.includes('portfolio') ||
        lower.includes('holdings') ||
        lower.includes('میرا بیلنس') ||
        lower.includes('میرا پورٹ فولیو')) &&
      (balance > 0 || holdings.length > 0)
    ) {
      const holdingsSummary = holdings.map((h) => h.symbol || h.name).join(', ') || 'None';
      enrichedMessage += ` [Context: Portfolio Balance PKR ${balance.toLocaleString()}, Holdings: ${holdingsSummary}]`;
    }

    try {
      const res = await fetch('/api/agent/mufti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: enrichedMessage, lang: currentLang }),
      });
      const data = await res.json();
      const reply = data.text || data.reply;
      setMessages((prev) => [...prev, { role: 'ai', text: reply }]);
      speak(data.audioText || reply);
    } catch {
      const fallbackMsg = isUrdu
        ? 'AAOIFI شریعہ معیارات کے مطابق، آپ کی سرمایہ کاری اس وقت تک جائز ہے جب تک کمپنی کا مجموعی قرض 33 فیصد سے کم اور غیر شرعی آمدنی 5 فیصد سے کم ہو۔ سودی آمدنی کی باقاعدہ تطہیر یقینی بنائیں۔'
        : "Based on AAOIFI Shariah standards, your investment is permitted as long as total interest-bearing debt is under 33% of market cap and impure income is under 5%. Ensure regular dividend purification.";
      setMessages((prev) => [...prev, { role: 'ai', text: fallbackMsg }]);
      speak(fallbackMsg);
    } finally {
      setLoading(false);
    }
  };
  askMuftiRef.current = askMufti;

  const quickPrompts = isUrdu
    ? [
        'کیا میزان بینک حلال ہے؟',
        'زکوٰۃ کا نصاب کیا ہے؟',
        'منافع کی تطہیر کیسے کریں؟',
        'نیا پاکستان سکوک کی شرعی حیثیت؟',
      ]
    : [
        'Is Meezan Bank (MEBL) Halal?',
        'What is the Zakat Nisab?',
        'How does Dividend Purification work?',
        'Are Sukuks fully asset-backed?',
      ];

  return (
    <div
      className={`rounded-3xl bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 shadow-xl overflow-hidden flex flex-col transition-all duration-300 ${className}`}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="px-5 py-4 bg-[#F4F7F5] dark:bg-white/[0.03] border-b border-[#E3ECE7] dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-sm">
            <Logo variant="mark" className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#0B1F17] dark:text-white">
                {t('Mufti AI Advisor', 'مفتی اے آئی مشیر')}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-[#047857] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                AAOIFI
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
              {t('Roziq Shariah Wealth Intelligence', 'روزق شرعی ویلتھ انٹیلیجنس')}
            </p>
          </div>
        </div>

        {/* Language switch & speech controls */}
        <div className="flex items-center gap-1.5">
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="px-2 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border border-amber-300 dark:border-amber-700/50 flex items-center gap-1 animate-pulse"
              title="Stop voice playback"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              <span>{t('Stop', 'روکیں')}</span>
            </button>
          )}

          <button
            onClick={() => setCurrentLang(isUrdu ? 'en' : 'ur')}
            className="px-2.5 py-1 text-xs font-bold rounded-xl bg-white dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 text-[#0B1F17] dark:text-white hover:border-[#047857] transition-colors"
          >
            {isUrdu ? 'English' : 'اردو'}
          </button>
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 p-5 overflow-y-auto space-y-3 min-h-[240px] max-h-[340px] bg-white dark:bg-[#16171b]">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                m.role === 'user'
                  ? 'bg-[#047857] text-white rounded-br-xs font-medium'
                  : 'bg-[#F4F7F5] dark:bg-white/5 text-[#0B1F17] dark:text-slate-100 border border-[#E3ECE7] dark:border-white/10 rounded-bl-xs'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#F4F7F5] dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 p-3 rounded-2xl rounded-bl-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#047857] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#047857] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#047857] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-5 py-2 bg-[#F4F7F5]/60 dark:bg-white/[0.02] border-t border-[#E3ECE7] dark:border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {quickPrompts.map((q) => (
          <button
            key={q}
            onClick={() => askMufti(q)}
            disabled={loading}
            className="whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-semibold bg-white dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 text-[#0B1F17] dark:text-slate-300 hover:border-[#047857] hover:text-[#047857] dark:hover:text-emerald-400 transition-all shrink-0 active:scale-95 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-3 bg-white dark:bg-[#16171b] border-t border-[#E3ECE7] dark:border-white/10 flex items-center gap-2">
        <button
          onClick={toggleListening}
          title={isListening ? t('Stop Recording', 'ریکارڈنگ روکیں') : t('Speak', 'بولیں')}
          className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-all shrink-0 active:scale-95 ${
            isListening
              ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
              : 'bg-[#F4F7F5] dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 text-[#047857] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-white/10'
          }`}
        >
          {isListening ? (
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15a3 3 0 003-3V6a3 3 0 00-6 0v6a3 3 0 003 3z" />
            </svg>
          )}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
          placeholder={t(
            'Ask Shariah question or query portfolio...',
            'شرعی سوال پوچھیں یا پورٹ فولیو سے متعلق استفسار کریں...'
          )}
          className="flex-1 h-11 px-4 text-xs rounded-2xl bg-[#F4F7F5] dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 text-[#0B1F17] dark:text-white placeholder-[#6B7280] dark:placeholder-slate-400 focus:outline-none focus:border-[#047857] dark:focus:border-emerald-500 transition-colors"
        />

        <button
          onClick={handleSendText}
          disabled={loading || !inputText.trim()}
          className="h-11 w-11 rounded-2xl bg-[#047857] hover:bg-[#036046] active:scale-95 disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 shadow-sm"
          title={t('Send', 'بھیجیں')}
        >
          <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
