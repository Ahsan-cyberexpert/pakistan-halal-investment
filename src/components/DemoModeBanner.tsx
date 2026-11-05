'use client';

import { demoStatusShortText, demoStatusText } from '@/lib/app-mode';

type DemoModeBannerProps = {
  lang?: 'en' | 'ur';
  compact?: boolean;
};

export default function DemoModeBanner({ lang = 'en', compact = false }: DemoModeBannerProps) {
  const isUrdu = lang === 'ur';

  return (
    <aside
      className={`demo-mode-banner ${compact ? 'demo-mode-banner-compact' : ''}`}
      role="status"
      aria-label={isUrdu ? 'ڈیمو موڈ: تمام کارروائیاں فرضی ہیں اور حقیقی رقم منتقل نہیں ہوتی' : 'Demo mode: activity is simulated and no real money moves'}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="demo-mode-banner-icon" aria-hidden="true">◉</div>
      <div className="min-w-0">
        <p className="demo-mode-banner-title">
          {isUrdu ? 'ڈیمو موڈ · کوئی حقیقی رقم نہیں' : 'DEMO MODE · NO REAL MONEY'}
        </p>
        <p className="demo-mode-banner-copy">
          {compact ? demoStatusShortText[lang] : demoStatusText[lang]}
        </p>
      </div>
    </aside>
  );
}
