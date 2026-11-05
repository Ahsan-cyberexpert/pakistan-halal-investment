'use client';

import { demoStatusText } from '@/lib/app-mode';

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
      aria-label={isUrdu ? 'ڈیمو اکاؤنٹ کی معلومات' : 'Demo account information'}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="demo-mode-banner-icon" aria-hidden="true">◉</div>
      <div className="min-w-0">
        <p className="demo-mode-banner-title">
          {isUrdu ? 'ڈیمو اکاؤنٹ' : 'DEMO ACCOUNT'}
        </p>
        <p className="demo-mode-banner-copy">
          {demoStatusText[lang]}. {isUrdu ? 'تمام بیلنس اور کارروائیاں صرف نمونہ ہیں۔' : 'Balances, prices, payments, and orders are simulated.'}
        </p>
      </div>
    </aside>
  );
}
