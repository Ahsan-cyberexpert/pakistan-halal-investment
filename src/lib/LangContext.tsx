'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Lang = 'en' | 'ur';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Navigation
  'nav.home': { en: 'Home', ur: 'ہوم' },
  'nav.invest': { en: 'Invest', ur: 'سرمایہ' },
  'nav.impact': { en: 'Impact', ur: 'اثر' },
  'nav.learn': { en: 'Learn', ur: 'سیکھیں' },
  'nav.settings': { en: 'Settings', ur: 'ترتیبات' },

  // Dashboard
  'dash.greeting': { en: 'Assalamu Alaikum', ur: 'السلام علیکم' },
  'dash.balance': { en: 'Total Balance', ur: 'کل بیلنس' },
  'dash.deposit': { en: 'Deposit', ur: 'جمع کریں' },
  'dash.withdraw': { en: 'Withdraw', ur: 'نکالیں' },
  'dash.portfolio': { en: 'Portfolio', ur: 'پورٹ فولیو' },
  'dash.performance': { en: 'Wealth Performance', ur: 'دولت کی کارکردگی' },

  // Invest Tab
  'invest.title': { en: 'Marketplace', ur: 'بازار' },
  'invest.subtitle': { en: 'Strictly Shariah-compliant opportunities.', ur: 'صرف شریعت کے مطابق مواقع' },
  'invest.screener': { en: 'Shariah Screener', ur: 'شریعت اسکرینر' },
  'invest.search': { en: 'Search Symbol (e.g. LUCK, SYS)...', ur: 'علامت تلاش کریں (مثلاً LUCK، SYS)...' },

  // Impact Tab
  'impact.title': { en: 'Social Impact', ur: 'سماجی اثر' },
  'impact.subtitle': { en: 'Purify wealth and empower the Ummah.', ur: 'دولت کو پاک کریں اور امت کو مضبوط بنائیں' },
  'impact.zakat': { en: 'Zakat Al-Mal', ur: 'زکوٰۃ المال' },
  'impact.calculated': { en: 'Calculated Zakat', ur: 'زکوٰۃ کا حساب' },
  'impact.nisab': { en: 'Nisab Threshold', ur: 'نصاب کی حد' },

  // Settings
  'settings.title': { en: 'Settings', ur: 'ترتیبات' },
  'settings.language': { en: 'Language', ur: 'زبان' },
  'settings.pin': { en: 'Change PIN', ur: 'پن تبدیل کریں' },
  'settings.theme': { en: 'Dark Mode', ur: 'ڈارک موڈ' },
  'settings.about': { en: 'About Roziq', ur: 'روزق کے بارے میں' },
  'settings.version': { en: 'Version 1.0.0 — Sovereign Edition', ur: 'ورژن 1.0.0 — خودمختار ایڈیشن' },
  'settings.shariah': { en: 'Shariah Board', ur: 'شریعت بورڈ' },
  'settings.shariah_desc': { en: 'Certified by AAOIFI Standards', ur: 'AAOIFI معیارات کے مطابق تصدیق شدہ' },
  'settings.logout': { en: 'Lock App', ur: 'ایپ بند کریں' },

  // PIN Security
  'pin.title': { en: 'Security Gate', ur: 'حفاظتی دروازہ' },
  'pin.enter': { en: 'Enter your 4-digit PIN', ur: 'اپنا 4 ہندسوں کا پن درج کریں' },
  'pin.change': { en: 'Change PIN', ur: 'پن تبدیل کریں' },
  'pin.new': { en: 'Enter new PIN', ur: 'نیا پن درج کریں' },
  'pin.confirm': { en: 'Confirm new PIN', ur: 'پن کی تصدیق کریں' },
  'pin.cancel': { en: 'Cancel', ur: 'واپس جائیں' },

  // General
  'general.loading': { en: 'Loading...', ur: 'لوڈ ہو رہا ہے...' },
  'general.save': { en: 'Save', ur: 'محفوظ کریں' },
  'general.cancel': { en: 'Cancel', ur: 'منسوخ کریں' },
  'general.confirm': { en: 'Confirm', ur: 'تصدیق کریں' },
  'general.back': { en: 'Back', ur: 'واپس' },
};

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('roziq_lang') as Lang;
    if (saved) setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    localStorage.setItem('roziq_lang', l);
    setLangState(l);
  };

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      <div dir={lang === 'ur' ? 'rtl' : 'ltr'} className={lang === 'ur' ? 'font-[system-ui]' : ''}>
        {children}
      </div>
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
