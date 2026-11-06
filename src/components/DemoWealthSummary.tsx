'use client';

type DemoWealthSummaryProps = {
  cash: number;
  invested: number;
  pending: number;
  zakatDue: boolean;
  lang?: 'en' | 'ur';
};

const formatPKR = (value: number) => `₨${Math.round(value).toLocaleString('en-PK')}`;

export default function DemoWealthSummary({ cash, invested, pending, zakatDue, lang = 'en' }: DemoWealthSummaryProps) {
  const urdu = lang === 'ur';
  const total = cash + invested;
  const items = [
    { label: urdu ? 'دستیاب کیش' : 'Available cash', value: cash, tone: 'text-emerald-600 dark:text-emerald-400' },
    { label: urdu ? 'سرمایہ کاری' : 'Invested value', value: invested, tone: 'text-blue-600 dark:text-blue-400' },
    { label: urdu ? 'زیر التوا' : 'Pending settlement', value: pending, tone: 'text-amber-600 dark:text-amber-400' },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 dark:border-white/10 p-5 bg-white dark:bg-[#16171b] shadow-xs" aria-labelledby="wealth-summary-title" dir={urdu ? 'rtl' : 'ltr'}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {urdu ? 'مالی خلاصہ' : 'Financial summary'}
          </p>
          <h2 id="wealth-summary-title" className="mt-1 text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {urdu ? 'کل دولت' : 'Total wealth'}
          </h2>
          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            {urdu ? 'اثاثوں کی تقسیم اور لیکویڈیٹی کا جائزہ' : 'Asset allocation & liquidity overview'}
          </p>
        </div>
      </div>

      <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">{formatPKR(total)}</p>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {items.map((item) => (
          <div key={item.label} className="min-w-0 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 p-3">
            <p className="text-xs leading-tight font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className={`mt-1 truncate text-xs sm:text-sm font-bold ${item.tone}`}>{formatPKR(item.value)}</p>
          </div>
        ))}
      </div>

      <div className={`mt-4 flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 ${zakatDue ? 'border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300' : 'border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'}`}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          {zakatDue ? (
            <circle cx="12" cy="12" r="10"/>
          ) : (
            <polyline points="20 6 9 17 4 12"/>
          )}
        </svg>
        <p className="text-xs font-medium">
          {zakatDue
            ? (urdu ? 'نصاب کے مطابق زکوٰۃ کا جائزہ دستیاب ہے۔' : 'Portfolio exceeds Nisab threshold. Zakat is due.')
            : (urdu ? 'سرمایہ نصاب کی حد سے کم ہے۔' : 'Portfolio is below Nisab threshold.')}
        </p>
      </div>
    </section>
  );
}
