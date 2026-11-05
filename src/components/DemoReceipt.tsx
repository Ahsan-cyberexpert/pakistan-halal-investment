'use client';

import type { Transaction } from '@/types';

type DemoReceiptProps = {
  transaction: Transaction;
  onClose: () => void;
  lang?: 'en' | 'ur';
};

const formatPKR = (value: number) => `₨ ${Math.round(value || 0).toLocaleString('en-PK')}`;

function actionLabel(transaction: Transaction, urdu: boolean) {
  const labels: Record<string, [string, string]> = {
    deposit: ['Demo deposit', 'ڈیمو ڈیپازٹ'],
    withdraw: ['Demo withdrawal', 'ڈیمو وِڈڈرا'],
    buy_stock: ['Simulated stock purchase', 'فرضی اسٹاک خریداری'],
    buy_sukuk: ['Simulated asset purchase', 'فرضی اثاثہ خریداری'],
    zakat: ['Demo Zakat distribution', 'ڈیمو زکوٰۃ تقسیم'],
    health_save: ['Demo health saving', 'ڈیمو ہیلتھ سیونگ'],
    overseas_invest: ['Demo overseas investment', 'ڈیمو اوورسیز سرمایہ کاری'],
  };
  return labels[transaction.type]?.[urdu ? 1 : 0] || (urdu ? 'ڈیمو کارروائی' : 'Demo activity');
}

export default function DemoReceipt({ transaction, onClose, lang = 'en' }: DemoReceiptProps) {
  const urdu = lang === 'ur';
  const status = String(transaction.status).toUpperCase();
  const statusLabel = status === 'PENDING' ? (urdu ? 'زیر التوا ڈیمو' : 'Pending demo') : status === 'FAILED' ? (urdu ? 'ناکام ڈیمو' : 'Failed demo') : (urdu ? 'مکمل ڈیمو' : 'Completed demo');

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="presentation">
      <section className="mobile-modal-safe w-full max-w-md rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl" role="dialog" aria-modal="true" aria-labelledby="demo-receipt-title" dir={urdu ? 'rtl' : 'ltr'}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">{urdu ? 'ڈیمو رسید' : 'Demo receipt'}</p>
            <h2 id="demo-receipt-title" className="mt-1 text-xl font-black text-slate-900">{actionLabel(transaction, urdu)}</h2>
          </div>
          <button onClick={onClose} aria-label={urdu ? 'رسید بند کریں' : 'Close receipt'} className="touch-target rounded-xl border border-slate-200 text-slate-500">✕</button>
        </div>

        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <p className="font-black">{urdu ? 'صرف ورچوئل ڈیمو' : 'Virtual demo only'}</p>
          <p className="mt-1 text-xs font-medium">{urdu ? 'کوئی حقیقی رقم منتقل نہیں ہوئی۔' : 'No real money moved. This receipt is for presentation data.'}</p>
        </div>

        <dl className="space-y-3 rounded-2xl bg-slate-50 p-4 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-slate-500">{urdu ? 'حیثیت' : 'Status'}</dt><dd className="font-black text-emerald-700">{statusLabel}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-slate-500">{urdu ? 'رقم' : 'Amount'}</dt><dd className="font-black text-slate-900">{formatPKR(transaction.amount)}</dd></div>
          {transaction.symbol && <div className="flex justify-between gap-4"><dt className="text-slate-500">{urdu ? 'اثاثہ / ایکشن' : 'Asset / action'}</dt><dd className="max-w-[60%] text-right font-black text-slate-900">{transaction.symbol}</dd></div>}
          {transaction.method && <div className="flex justify-between gap-4"><dt className="text-slate-500">{urdu ? 'طریقہ' : 'Method'}</dt><dd className="font-black text-slate-900">{transaction.method}</dd></div>}
          {transaction.units !== undefined && <div className="flex justify-between gap-4"><dt className="text-slate-500">{urdu ? 'یونٹس' : 'Units'}</dt><dd className="font-black text-slate-900">{transaction.units.toFixed(4)}</dd></div>}
          <div className="border-t border-slate-200 pt-3 flex justify-between gap-4"><dt className="text-slate-500">{urdu ? 'پہلے ڈیمو بیلنس' : 'Balance before'}</dt><dd className="font-black text-slate-900">{formatPKR(transaction.balanceBefore ?? 0)}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-slate-500">{urdu ? 'بعد کا ڈیمو بیلنس' : 'Balance after'}</dt><dd className="font-black text-emerald-700">{formatPKR(transaction.balanceAfter ?? 0)}</dd></div>
        </dl>

        <div className="mt-4 space-y-1 text-xs text-slate-500">
          <p><span className="font-bold">{urdu ? 'حوالہ:' : 'Reference:'}</span> {transaction.reference || 'RZQ-DEMO-LEGACY'}</p>
          <p><span className="font-bold">{urdu ? 'وقت:' : 'Timestamp:'}</span> {new Date(transaction.date).toLocaleString(urdu ? 'ur-PK' : 'en-PK')}</p>
          {transaction.note && <p>{transaction.note}</p>}
        </div>
      </section>
    </div>
  );
}
