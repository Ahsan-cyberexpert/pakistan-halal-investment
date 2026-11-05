export type AppMode = 'demo' | 'real';

// Keep the current presentation experience as the safe default. A future real
// account must be enabled only after server-side auth and financial services exist.
export const APP_MODE: AppMode = 'demo';
export const isDemoMode = APP_MODE === 'demo';

export const demoStatusText = {
  en: 'Balances, prices, payments, orders, Zakat, Wali actions, and AI context are simulated. No real money moves.',
  ur: 'بیلنس، قیمتیں، ادائیگیاں، آرڈرز، زکوٰۃ، والی کے اقدامات اور AI کا سیاق و سباق فرضی ہے۔ کوئی حقیقی رقم منتقل نہیں ہوتی۔',
} as const;

export const demoStatusShortText = {
  en: 'Simulated demo only. No real money moves.',
  ur: 'صرف فرضی ڈیمو۔ کوئی حقیقی رقم منتقل نہیں ہوتی۔',
} as const;
