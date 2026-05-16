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

export default function SettingsTab({ lang, darkMode, onLangChange, onDarkToggle, onLock, isPremium, eligibility }: SettingsTabProps) {
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

  const sections = [
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
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{t('Settings', 'ترتیبات')}</h2>
        <p className="text-slate-500 font-medium">{t('Customize your Roziq experience.', 'اپنا روزق تجربہ اپنی مرضی کے مطابق بنائیں۔')}</p>
      </div>

      {/* Profile Card */}
      <div className="premium-card p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl shadow-lg shadow-emerald-200 flex-shrink-0">
          🇵🇰
        </div>
        <div>
          <p className="font-black text-slate-800 text-lg">{t('Halal Investor', 'حلال سرمایہ کار')}</p>
          <p className="text-sm text-emerald-600 font-bold">{t('Sovereign Account', 'خودمختار اکاؤنٹ')}</p>
          <p className="text-xs text-slate-400 mt-1">{t('Data saved on this device', 'ڈیٹا اس ڈیوائس پر محفوظ ہے')}</p>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.titleEn}>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">
            {t(section.titleEn, section.titleUr)}
          </p>
          <div className="space-y-2">
            {section.items.map((item) => (
              <div key={item.labelEn}>
                <button
                  onClick={item.action || item.toggle?.onToggle || undefined}
                  disabled={!item.action && !item.toggle}
                  className={`w-full flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-100 transition-all duration-200 text-left ${
                    item.action || item.toggle ? 'hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 active:scale-[0.98] cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center text-xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-800 text-sm">{t(item.labelEn, item.labelUr)}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{t(item.descEn, item.descUr)}</p>
                  </div>
                  {item.badge && (
                    <span className="text-xs font-black bg-emerald-50 text-emerald-700 px-3 py-1 rounded-xl border border-emerald-100 flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                  {item.toggle && (
                    <div className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 flex-shrink-0 ${
                      item.toggle.value ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        item.toggle.value ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </div>
                  )}
                  {item.action && !item.badge && !item.toggle && (
                    <span className="text-slate-300 text-lg flex-shrink-0">{isRtl ? '←' : '→'}</span>
                  )}
                </button>

                {/* Wali Subscription UI */}
                {item.labelEn === 'Wali AI Autopilot' && showWaliSubs && !isPremium && (
                  <div className="mt-2 p-8 bg-slate-900 rounded-3xl border border-emerald-500/20 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="text-center">
                      <p className="text-xl font-black text-white italic">UNLOCK <span className="text-emerald-500">WALI AI</span></p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{t('Elite Guardian Access', 'ایلیٹ گارڈین تک رسائی')}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                          <span>{t('Total Invested', 'کل سرمایہ کاری')}</span>
                          <span className="text-emerald-500">15 Cr / 25 Cr</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                          <span>{t('Realized Profit', 'حاصل شدہ منافع')}</span>
                          <span className="text-emerald-500">20 Cr / 50 Cr</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: '40%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-center">
                      <p className="text-[9px] text-emerald-400/80 font-bold leading-relaxed italic">
                        {t('Reach 25 Crore Invested and 50 Crore Profit to Unlock Elite Subscription.', 'ایلیٹ سبسکرپشن کھولنے کے لیے 25 کروڑ کی سرمایہ کاری اور 50 کروڑ کا منافع حاصل کریں۔')}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button disabled className="w-full py-4 bg-white/5 text-slate-500 font-black text-[10px] uppercase rounded-2xl border border-white/5 cursor-not-allowed">
                        {t('Elite Monthly (Locked)', 'ایلیٹ ماہانہ (مقفل)')}
                      </button>
                      <button disabled className="w-full py-4 bg-white/5 text-slate-500 font-black text-[10px] uppercase rounded-2xl border border-white/5 cursor-not-allowed">
                        {t('Sovereign Yearly (Locked)', 'سالانہ (مقفل)')}
                      </button>
                    </div>
                  </div>
                )}
                {/* PIN Change Form */}
                {item.labelEn === 'Change PIN' && showPinChange && (
                  <div className="mt-2 p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {[
                      { label: t('Current PIN', 'موجودہ پن'), val: oldPin, set: setOldPin },
                      { label: t('New PIN', 'نیا پن'), val: newPin, set: setNewPin },
                      { label: t('Confirm PIN', 'پن کی تصدیق'), val: confirmPin, set: setConfirmPin },
                    ].map(({ label, val, set }) => (
                      <div key={label}>
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">{label}</label>
                        <input
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          value={val}
                          onChange={e => set(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl font-black text-slate-800 text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-emerald-400 transition-colors"
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
                      className="w-full py-3 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-colors active:scale-95"
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
      <div className="premium-card p-6 text-center border border-emerald-100">
        <p className="text-emerald-800 text-sm font-bold leading-relaxed">
          {t(
            '"And Allah has permitted trade and forbidden interest." — Quran 2:275',
            '«اللہ نے تجارت کو حلال اور سود کو حرام قرار دیا ہے» — القرآن 2:275'
          )}
        </p>
      </div>
    </div>
  );
}
