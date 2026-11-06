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
    deposit: ['Deposit', 'ڈیپازٹ'],
    withdraw: ['Withdrawal', 'وِڈڈرا'],
    buy_stock: ['Stock purchase', 'اسٹاک خریداری'],
    sell_stock: ['Stock sale', 'اسٹاک فروخت'],
    buy_sukuk: ['Asset purchase', 'اثاثہ خریداری'],
    zakat: ['Zakat distribution', 'زکوٰۃ تقسیم'],
    health_save: ['Health saving', 'ہیلتھ سیونگ'],
    overseas_invest: ['Overseas investment', 'اوورسیز سرمایہ کاری'],
  };
  return labels[transaction.type]?.[urdu ? 1 : 0] || (urdu ? 'کارروائی' : 'Transaction');
}

export default function DemoReceipt({ transaction, onClose, lang = 'en' }: DemoReceiptProps) {
  const urdu = lang === 'ur';
  const status = String(transaction.status).toUpperCase();
  const statusLabel = status === 'PENDING' ? (urdu ? 'زیر التوا' : 'Pending') : status === 'FAILED' ? (urdu ? 'ناکام' : 'Failed') : (urdu ? 'مکمل' : 'Completed');

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="presentation">
      <section className="mobile-modal-safe w-full max-w-md rounded-t-3xl bg-white dark:bg-[#16171b] border border-slate-200 dark:border-white/10 p-6 shadow-2xl sm:rounded-3xl" role="dialog" aria-modal="true" aria-labelledby="receipt-title" dir={urdu ? 'rtl' : 'ltr'}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">{urdu ? 'رسید' : 'Transaction Receipt'}</p>
            <h2 id="receipt-title" className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{actionLabel(transaction, urdu)}</h2>
          </div>
          <button onClick={onClose} aria-label={urdu ? 'رسید بند کریں' : 'Close receipt'} className="h-8 w-8 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors">✕</button>
        </div>

        <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-sm text-emerald-700 dark:text-emerald-300">
          <p className="font-bold">{urdu ? 'تصدیق شدہ کارروائی' : 'Verified Record'}</p>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{urdu ? 'ڈیجیٹل ٹرانزیکشن کامیابی سے ریکارڈ کر لی گئی۔' : 'Transaction executed and ledger balance updated.'}</p>
        </div>

        <dl className="space-y-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-4 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-slate-500 dark:text-slate-400">{urdu ? 'حیثیت' : 'Status'}</dt><dd className="font-bold text-emerald-600 dark:text-emerald-400">{statusLabel}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-slate-500 dark:text-slate-400">{urdu ? 'رقم' : 'Amount'}</dt><dd className="font-bold text-slate-900 dark:text-white">{formatPKR(transaction.amount)}</dd></div>
          {(transaction.name || transaction.symbol) && <div className="flex justify-between gap-4"><dt className="text-slate-500 dark:text-slate-400">{urdu ? 'اثاثہ / ایکشن' : 'Asset / action'}</dt><dd className="max-w-[60%] text-right font-bold text-slate-900 dark:text-white">{transaction.name || transaction.symbol}</dd></div>}
          {transaction.method && <div className="flex justify-between gap-4"><dt className="text-slate-500 dark:text-slate-400">{urdu ? 'طریقہ' : 'Method'}</dt><dd className="font-bold text-slate-900 dark:text-white">{transaction.method}</dd></div>}
          {transaction.units !== undefined && <div className="flex justify-between gap-4"><dt className="text-slate-500 dark:text-slate-400">{urdu ? 'یونٹس' : 'Units'}</dt><dd className="font-bold text-slate-900 dark:text-white">{transaction.units.toFixed(4)}</dd></div>}
          <div className="border-t border-slate-200 dark:border-white/10 pt-3 flex justify-between gap-4"><dt className="text-slate-500 dark:text-slate-400">{urdu ? 'سابقہ بیلنس' : 'Balance before'}</dt><dd className="font-bold text-slate-900 dark:text-white">{formatPKR(transaction.balanceBefore ?? 0)}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-slate-500 dark:text-slate-400">{urdu ? 'موجودہ بیلنس' : 'Balance after'}</dt><dd className="font-bold text-emerald-600 dark:text-emerald-400">{formatPKR(transaction.balanceAfter ?? 0)}</dd></div>
        </dl>

        <div className="mt-4 space-y-1 text-xs text-slate-500 dark:text-slate-400">
          <p><span className="font-bold text-slate-700 dark:text-slate-300">{urdu ? 'حوالہ:' : 'Reference:'}</span> {transaction.reference || 'RZQ-TX-LEAD'}</p>
          <p><span className="font-bold text-slate-700 dark:text-slate-300">{urdu ? 'وقت:' : 'Timestamp:'}</span> {new Date(transaction.date).toLocaleString(urdu ? 'ur-PK' : 'en-PK')}</p>
          {transaction.note && <p>{transaction.note}</p>}
        </div>
      </section>
    </div>
  );
}
