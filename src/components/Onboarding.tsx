'use client';
import { useState } from 'react';

const steps = [
  {
    icon: '🕌',
    color: 'from-emerald-500 to-teal-600',
    titleEn: 'Welcome to Roziq',
    titleUr: 'روزق میں خوش آمدید',
    descEn: 'Pakistan\'s first Sovereign Halal Wealth OS. Built for the modern Muslim investor — Shariah-compliant, intelligent, and yours.',
    descUr: 'پاکستان کا پہلا خودمختار حلال ویلتھ OS۔ جدید مسلمان سرمایہ کار کے لیے بنایا گیا — شریعت کے مطابق، ذہین اور آپ کا۔',
    badge: 'Powered by Shariah',
  },
  {
    icon: '📈',
    color: 'from-blue-500 to-indigo-600',
    titleEn: 'Invest with Confidence',
    titleUr: 'اعتماد سے سرمایہ کاری کریں',
    descEn: 'Every stock, sukuk, and fund is screened by AAOIFI Shariah standards. No riba. No haram. Pure halal returns.',
    descUr: 'ہر اسٹاک، سکوک اور فنڈ AAOIFI شریعت معیارات کے مطابق جانچا جاتا ہے۔ کوئی سود نہیں۔ کوئی حرام نہیں۔ خالص حلال منافع۔',
    badge: 'AAOIFI Certified',
  },
  {
    icon: '🤲',
    color: 'from-amber-500 to-orange-600',
    titleEn: 'Purify & Give Back',
    titleUr: 'پاک کریں اور واپس دیں',
    descEn: 'Automatically calculate your Zakat Al-Mal. Distribute to verified charities with one tap. Grow wealth. Purify the Ummah.',
    descUr: 'خود بخود اپنی زکوٰۃ المال کا حساب لگائیں۔ ایک ٹچ سے تصدیق شدہ خیراتی اداروں کو دیں۔ دولت بڑھائیں۔ امت کو پاک کریں۔',
    badge: 'Zakat Engine',
  },
];

interface OnboardingProps {
  onComplete: () => void;
  lang: 'en' | 'ur';
}

export default function Onboarding({ onComplete, lang }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);
  const current = steps[step];
  const isLast = step === steps.length - 1;
  const isRtl = lang === 'ur';

  const next = () => {
    if (isLast) {
      setExiting(true);
      setTimeout(() => {
        localStorage.setItem('roziq_onboarded', 'true');
        onComplete();
      }, 400);
    } else {
      setStep(s => s + 1);
    }
  };

  const skip = () => {
    localStorage.setItem('roziq_onboarded', 'true');
    onComplete();
  };

  return (
    <div
      className={`fixed inset-0 z-[9998] bg-slate-950 flex flex-col transition-opacity duration-400 ${exiting ? 'opacity-0' : 'opacity-100'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br ${current.color} opacity-10 rounded-full blur-[150px] -translate-y-1/3 translate-x-1/3`} />
        <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr ${current.color} opacity-5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3`} />
      </div>

      {/* Skip button */}
      <div className="relative z-10 flex justify-end p-6">
        <button onClick={skip} className="text-white/30 text-sm font-bold hover:text-white/60 transition-colors px-4 py-2">
          {isRtl ? 'چھوڑیں' : 'Skip'}
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pb-8">
        {/* Icon */}
        <div className={`w-28 h-28 bg-gradient-to-br ${current.color} rounded-[2.5rem] flex items-center justify-center text-6xl mb-8 shadow-2xl transition-all duration-500`}>
          {current.icon}
        </div>

        {/* Badge */}
        <div className="mb-6 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
          <span className="text-white/50 text-[10px] font-black uppercase tracking-[0.25em]">{current.badge}</span>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black text-white text-center tracking-tight mb-4 leading-tight">
          {isRtl ? current.titleUr : current.titleEn}
        </h2>

        {/* Description */}
        <p className="text-white/50 text-center text-sm font-medium leading-relaxed max-w-xs">
          {isRtl ? current.descUr : current.descEn}
        </p>
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 px-8 pb-12">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`rounded-full transition-all duration-300 ${
                i === step ? 'w-6 h-2 bg-emerald-500' : 'w-2 h-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={next}
          className={`w-full py-5 rounded-3xl font-black text-base tracking-wide transition-all duration-300 active:scale-95 bg-gradient-to-r ${current.color} text-white shadow-2xl hover:shadow-emerald-900/40 hover:scale-[1.02]`}
        >
          {isLast
            ? (isRtl ? 'شروع کریں 🚀' : 'Get Started 🚀')
            : (isRtl ? 'آگے →' : 'Next →')}
        </button>
      </div>
    </div>
  );
}
