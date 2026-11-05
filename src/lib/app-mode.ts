export type AppMode = 'demo' | 'real';

// Keep the current presentation experience as the safe default. A future real
// account must be enabled only after server-side auth and financial services exist.
export const APP_MODE: AppMode = 'demo';
export const isDemoMode = APP_MODE === 'demo';

export const demoStatusText = {
  en: 'Demo account · virtual money · no real transactions',
  ur: 'ڈیمو اکاؤنٹ · فرضی رقم · کوئی حقیقی لین دین نہیں',
} as const;

export const demoStatusShortText = {
  en: 'Demo Mode',
  ur: 'ڈیمو موڈ',
} as const;
