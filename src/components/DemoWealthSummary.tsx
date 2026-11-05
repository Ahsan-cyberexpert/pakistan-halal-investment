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
    { label: urdu ? 'دستیاب ڈیمو کیش' : 'Available demo cash', value: cash, tone: 'text-emerald-700' },
    { label: urdu ? 'سرمایہ کاری' : 'Invested value', value: invested, tone: 'text-blue-700' },
    { label: urdu ? 'زیر التوا ڈیمو' : 'Pending demo', value: pending, tone: 'text-amber-700' },
  ];

  return (
    <section className="card p-4 sm:p-5" aria-labelledby="wealth-summary-title" dir={urdu ? 'rtl' : 'ltr'}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {urdu ? 'مالی خلاصہ' : 'Financial summary'}
          </p>
          <h2 id="wealth-summary-title" className="mt-1 text-xl sm:text-2xl font-black text-slate-900">
            {urdu ? 'کل ڈیمو دولت' : 'Total demo wealth'}
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {urdu ? 'یہ رقم صرف پریزنٹیشن کے لیے فرضی ہے۔' : 'Virtual money for presentation only.'}
          </p>
        </div>
        <span className="rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">
          {urdu ? 'ڈیمو' : 'Demo'}
        </span>
      </div>

      <p className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-4">{formatPKR(total)}</p>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {items.map((item) => (
          <div key={item.label} className="min-w-0 rounded-xl bg-slate-50 border border-slate-100 p-2.5 sm:p-3">
            <p className="text-[10px] leading-tight font-bold text-slate-500">{item.label}</p>
            <p className={`mt-1 truncate text-xs sm:text-sm font-black ${item.tone}`}>{formatPKR(item.value)}</p>
          </div>
        ))}
      </div>

      <div className={`mt-4 flex items-center gap-2 rounded-xl border px-3 py-2.5 ${zakatDue ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
        <span aria-hidden="true">{zakatDue ? '🕋' : '✓'}</span>
        <p className="text-xs font-bold">
          {zakatDue
            ? (urdu ? 'ڈیمو حساب کے مطابق زکوٰۃ کا جائزہ دستیاب ہے۔' : 'Zakat review is available for this demo balance.')
            : (urdu ? 'ڈیمو حساب نصاب سے کم ہے۔' : 'Demo calculation is below the Nisab example.')}
        </p>
      </div>
    </section>
  );
}
