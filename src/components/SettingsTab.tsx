'use client';
import { useState } from 'react';

interface SettingsTabProps {
  lang: 'en' | 'ur';
  darkMode: boolean;
  onLangChange: (l: 'en' | 'ur') => void;
  onDarkToggle: (val: boolean) => void;
  onLock: () => void;
  isPremium?: boolean;
  eligibility?: any;
}

interface SettingItem {
  icon: string;
  labelEn: string;
  labelUr: string;
  descEn: string;
  descUr: string;
  action?: (() => void) | null;
  badge?: string | null;
  toggle?: { value: boolean; onToggle: () => void } | null;
}

interface SettingSection {
  titleEn: string;
  titleUr: string;
  items: SettingItem[];
}

export default function SettingsTab({ lang, darkMode, onLangChange, onDarkToggle, onLock, isPremium }: SettingsTabProps) {
  const isRtl = lang === 'ur';
  const t = (en: string, ur: string) => isRtl ? ur : en;

  const [showPinChange, setShowPinChange] = useState(false);
  const [showWaliSubs, setShowWaliSubs] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMsg, setPinMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const handlePinChange = () => {
    const stored = localStorage.getItem('roziq_pin') || '1234';
    if (oldPin !== stored) {
      setPinMsg({ text: t('Wrong current PIN', 'موجودہ پن غلط ہے'), ok: false });
      return;
    }
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setPinMsg({ text: t('PIN must be 4 digits', 'پن 4 ہندسوں کا ہونا چاہیے'), ok: false });
      return;
    }
    if (newPin !== confirmPin) {
      setPinMsg({ text: t('PINs do not match', 'پن مماثل نہیں ہیں'), ok: false });
      return;
    }
    localStorage.setItem('roziq_pin', newPin);
    setPinMsg({ text: t('PIN changed successfully!', 'پن کامیابی سے تبدیل ہو گیا!'), ok: true });
    setOldPin(''); setNewPin(''); setConfirmPin('');
    setTimeout(() => { setShowPinChange(false); setPinMsg(null); }, 1500);
  };

  const sections: SettingSection[] = [
    {
      titleEn: 'Elite Services', titleUr: 'ایلیٹ سروسز',
      items: [
        {
          icon: '🛡️',
          labelEn: 'Wali AI Autopilot', labelUr: 'ولی اے آئی آٹو پائلٹ',
          descEn: isPremium ? 'Active Guardian' : 'Elite Access Restricted',
          descUr: isPremium ? 'فعال محافظ' : 'ایلیٹ رسائی محدود ہے',
          action: () => setShowWaliSubs(v => !v),
          badge: isPremium ? 'PREMIUM' : 'LOCKED',
        },
      ],
    },
    {
      titleEn: 'Preferences', titleUr: 'ترجیحات',
      items: [
        {
          icon: '🌐',
          labelEn: 'Language', labelUr: 'زبان',
          descEn: lang === 'en' ? 'English (Current)' : 'اردو (موجودہ)',
          descUr: lang === 'ur' ? 'اردو (موجودہ)' : 'English (Current)',
          action: () => onLangChange(lang === 'en' ? 'ur' : 'en'),
          badge: lang === 'en' ? '🇬🇧 EN' : '🇵🇰 UR',
          toggle: null,
        },
        {
          icon: darkMode ? '🌙' : '☀️',
          labelEn: 'Dark Mode', labelUr: 'ڈارک موڈ',
          descEn: darkMode ? 'Dark theme active' : 'Light theme active',
          descUr: darkMode ? 'ڈارک تھیم فعال ہے' : 'لائٹ تھیم فعال ہے',
          action: null,
          badge: null,
          toggle: { value: darkMode, onToggle: () => onDarkToggle(!darkMode) },
        },
      ],
    },
    {
      titleEn: 'Security', titleUr: 'سیکیورٹی',
      items: [
        {
          icon: '🔐',
          labelEn: 'Change PIN', labelUr: 'پن تبدیل کریں',
          descEn: 'Update your 4-digit security PIN', descUr: '4 ہندسوں کا سیکیورٹی پن تبدیل کریں',
          action: () => setShowPinChange(v => !v),
          badge: null,
        },
        {
          icon: '🔒',
          labelEn: 'Lock App', labelUr: 'ایپ بند کریں',
          descEn: 'Return to PIN screen', descUr: 'پن اسکرین پر واپس جائیں',
          action: onLock,
          badge: null,
        },
      ],
    },
    {
      titleEn: 'About', titleUr: 'کے بارے میں',
      items: [
        {
          icon: '🕌',
          labelEn: 'Shariah Board', labelUr: 'شریعت بورڈ',
          descEn: 'Certified by AAOIFI Standards', descUr: 'AAOIFI معیارات کے مطابق تصدیق شدہ',
          action: null,
          badge: '✅',
        },
        {
          icon: 'ℹ️',
          labelEn: 'Version', labelUr: 'ورژن',
          descEn: 'Roziq v1.0 — Sovereign Edition', descUr: 'روزق v1.0 — خودمختار ایڈیشن',
          action: null,
          badge: null,
        },
      ],
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-1 sm:mb-2">
        <h2 className="text-xl sm:text-3xl font-black text-[#0B1F17] dark:text-[#F0F4F2] tracking-tighter">{t('Settings', 'ترتیبات')}</h2>
        <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">{t('Customize your Roziq experience.', 'اپنا روزق تجربہ اپنی مرضی کے مطابق بنائیں۔')}</p>
      </div>

      {/* Profile Card */}
      <div className="premium-card p-4 sm:p-6 flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl sm:text-3xl shadow-lg shadow-emerald-200 flex-shrink-0">
          🇵🇰
        </div>
        <div>
          <p className="font-black text-[#0B1F17] dark:text-[#F0F4F2] text-base sm:text-lg tracking-tight">{t('Halal Investor', 'حلال سرمایہ کار')}</p>
          <p className="text-xs sm:text-sm text-emerald-600 font-bold">{t('Sovereign Account', 'خودمختار اکاؤنٹ')}</p>
          <p className="text-xs text-slate-400 mt-0.5">{t('Data saved on this device', 'ڈیٹا اس ڈیوائس پر محفوظ ہے')}</p>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.titleEn} className="space-y-2 sm:space-y-3">
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1 sm:mb-2 px-1">
            {t(section.titleEn, section.titleUr)}
          </p>
          <div className="space-y-2">
            {section.items.map((item) => (
              <div key={item.labelEn}>
                <button
                  onClick={item.action || item.toggle?.onToggle || undefined}
                  disabled={!item.action && !item.toggle}
                  className={`w-full flex items-center gap-3 sm:gap-4 p-3.5 sm:p-5 bg-white dark:bg-[#15181F] rounded-2xl sm:rounded-3xl border border-[#E3ECE7] dark:border-[#262B35] transition-all duration-200 text-left ${
                    item.action || item.toggle ? 'hover:border-emerald-200 hover:shadow-md active:scale-[0.98] cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#F4F7F5] dark:bg-[#1C2029] flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-[#0B1F17] dark:text-[#F0F4F2] text-xs sm:text-sm tracking-tight">{t(item.labelEn, item.labelUr)}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{t(item.descEn, item.descUr)}</p>
                  </div>
                  {item.badge && (
                    <span className="text-xs font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 sm:px-3 sm:py-1 rounded-xl border border-emerald-100 flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                  {item.toggle && (
                    <div className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors flex items-center px-1 flex-shrink-0 ${
                      item.toggle.value ? 'bg-emerald-50 dark:bg-emerald-950/600' : 'bg-slate-200'
                    }`}>
                      <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white dark:bg-[#15181F] transition-transform ${
                        item.toggle.value ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
                      }`} />
                    </div>
                  )}
                  {item.action && !item.badge && !item.toggle && (
                    <span className="text-slate-300 text-base sm:text-lg flex-shrink-0">{isRtl ? '←' : '→'}</span>
                  )}
                </button>

                {/* Wali Subscription UI */}
                {item.labelEn === 'Wali AI Autopilot' && showWaliSubs && !isPremium && (
                  <div className="mt-2 p-4 sm:p-8 bg-slate-900 rounded-2xl sm:rounded-3xl border border-emerald-500/20 space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-top-2 duration-300 shadow-lg">
                    <div className="text-center">
                      <p className="text-lg sm:text-xl font-black text-white italic tracking-tight">UNLOCK <span className="text-emerald-500">WALI AI</span></p>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5 sm:mt-1">{t('Elite Guardian Access', 'ایلیٹ گارڈین تک رسائی')}</p>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                          <span>{t('Total Invested', 'کل سرمایہ کاری')}</span>
                          <span className="text-emerald-500">15 Cr / 25 Cr</span>
                        </div>
                        <div className="w-full h-1 sm:h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-50 dark:bg-emerald-950/600" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                          <span>{t('Realized Profit', 'حاصل شدہ منافع')}</span>
                          <span className="text-emerald-500">20 Cr / 50 Cr</span>
                        </div>
                        <div className="w-full h-1 sm:h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-50 dark:bg-emerald-950/600" style={{ width: '40%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-950/600/5 rounded-xl sm:rounded-2xl border border-emerald-500/10 text-center">
                      <p className="text-xs text-emerald-400/80 font-bold leading-relaxed italic">
                        {t('Reach 25 Crore Invested and 50 Crore Profit to Unlock Elite Subscription.', 'ایلیٹ سبسکرپشن کھولنے کے لیے 25 کروڑ کی سرمایہ کاری اور 50 کروڑ کا منافع حاصل کریں۔')}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:gap-3">
                      <button disabled className="w-full py-3 sm:py-4 bg-white/5 text-slate-500 font-black text-xs uppercase rounded-xl sm:rounded-2xl border border-white/5 cursor-not-allowed tracking-wider">
                        {t('Elite Monthly (Locked)', 'ایلیٹ ماہانہ (مقفل)')}
                      </button>
                      <button disabled className="w-full py-3 sm:py-4 bg-white/5 text-slate-500 font-black text-xs uppercase rounded-xl sm:rounded-2xl border border-white/5 cursor-not-allowed tracking-wider">
                        {t('Sovereign Yearly (Locked)', 'سالانہ (مقفل)')}
                      </button>
                    </div>
                  </div>
                )}
                {/* PIN Change Form */}
                {item.labelEn === 'Change PIN' && showPinChange && (
                  <div className="mt-2 p-4 sm:p-6 bg-[#F4F7F5] dark:bg-[#1C2029] rounded-2xl sm:rounded-3xl border border-[#E3ECE7] dark:border-[#262B35] space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 shadow-md">
                    {[
                      { label: t('Current PIN', 'موجودہ پن'), val: oldPin, set: setOldPin },
                      { label: t('New PIN', 'نیا پن'), val: newPin, set: setNewPin },
                      { label: t('Confirm PIN', 'پن کی تصدیق'), val: confirmPin, set: setConfirmPin },
                    ].map(({ label, val, set }) => (
                      <div key={label}>
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1 sm:mb-1.5">{label}</label>
                        <input
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          value={val}
                          onChange={e => set(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white dark:bg-[#15181F] border border-[#E3ECE7] dark:border-[#262B35] rounded-xl sm:rounded-2xl font-black text-[#0B1F17] dark:text-[#F0F4F2] text-center text-xl sm:text-2xl tracking-[0.5em] focus:outline-none focus:border-emerald-400 transition-colors outline-none"
                          placeholder="••••"
                        />
                      </div>
                    ))}
                    {pinMsg && (
                      <p className={`text-xs font-bold text-center ${pinMsg.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                        {pinMsg.text}
                      </p>
                    )}
                    <button
                      onClick={handlePinChange}
                      className="w-full py-2.5 sm:py-3 bg-emerald-600 text-white font-black rounded-xl sm:rounded-2xl hover:bg-emerald-700 transition-colors active:scale-95 text-xs sm:text-sm shadow-md"
                    >
                      {t('Update PIN', 'پن اپڈیٹ کریں')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Shariah pledge */}
      <div className="premium-card p-4 sm:p-6 text-center border border-emerald-100 mb-4 sm:mb-6">
        <p className="text-emerald-800 text-xs sm:text-sm font-bold leading-relaxed">
          {t(
            '"And Allah has permitted trade and forbidden interest." — Quran 2:275',
            '«اللہ ভাগে تجارت کو حلال اور سود کو حرام قرار دیا ہے» — القرآن 2:275'
          )}
        </p>
      </div>
    </div>
  );
}
