'use client';
import { useState, useEffect } from 'react';

interface OverseasInvestProps {
  balance: number;
  onInvest: (amount: number, asset: string) => void;
  lang?: 'en' | 'ur';
  cnic?: string;
  country?: string;
}

interface OverseasHolding {
  id: string;
  assetName: string;
  category: string;
  amountInvested: number;
  expectedReturn: string;
  currency: string;
}

export default function OverseasInvest({ balance, onInvest, lang = 'en', cnic = 'default', country = 'Overseas' }: OverseasInvestProps) {
  const isUrdu = lang === 'ur';
  const t = (en: string, ur: string) => isUrdu ? ur : en;

  const storageKey = `roziq_overseas_holdings_${cnic}`;

  const [holdings, setHoldings] = useState<OverseasHolding[]>([
    { id: '1', assetName: 'Naya Pakistan Shariah Sukuk (3-Yr)', category: 'Sovereign Bond', amountInvested: 500000, expectedReturn: '12.5% p.a.', currency: 'PKR' },
    { id: '2', assetName: 'Roshan Equity Halal Index ETF', category: 'PSX Equity', amountInvested: 250000, expectedReturn: '18.2% p.a.', currency: 'PKR' }
  ]);

  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [investAmount, setInvestAmount] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const assets = [
    { id: 's1', name: 'Naya Pakistan Shariah Sukuk (5-Yr)', cat: 'Sovereign Bond', min: 50000, ret: '14.0% p.a.', descEn: 'Government backed Riba-free infrastructure bonds.', descUr: 'حکومت کی حمایت یافتہ سود سے پاک انفراسٹرکچر بانڈز۔' },
    { id: 's2', name: 'Roshan Digital Halal Equity Fund', cat: 'PSX Equity', min: 25000, ret: '21.4% p.a.', descEn: 'Curated Shariah-compliant top 30 PSX companies.', descUr: 'شریعہ کے مطابق ٹاپ 30 پی ایس ایکس کمپنیوں کا انتخاب۔' },
    { id: 's3', name: 'Overseas Agri-Tech Financing', cat: 'Asset Backed', min: 100000, ret: '16.5% p.a.', descEn: 'Direct investment in halal export-grade agriculture.', descUr: 'حلال برآمدی معیار کی زراعت میں براہ راست سرمایہ کاری۔' }
  ];

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setHoldings(JSON.parse(saved));
  }, [storageKey]);

  const handleInvestConfirm = () => {
    setError(''); setSuccessMsg('');
    const amt = parseFloat(investAmount);
    if (isNaN(amt) || amt < selectedAsset.min) {
      setError(`${t('Minimum investment is Rs', 'کم از کم سرمایہ کاری ہے روپے')} ${selectedAsset.min.toLocaleString()}`);
      return;
    }
    if (amt > balance) {
      setError(t('Insufficient wallet balance. Please deposit funds.', 'والٹ میں ناکافی بیلنس۔ براہ کرم فنڈز جمع کریں۔'));
      return;
    }

    const newH: OverseasHolding = {
      id: Date.now().toString(),
      assetName: selectedAsset.name,
      category: selectedAsset.cat,
      amountInvested: amt,
      expectedReturn: selectedAsset.ret,
      currency: 'PKR'
    };

    const updated = [...holdings, newH];
    setHoldings(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    onInvest(amt, selectedAsset.name);
    setSuccessMsg(t('Investment confirmed successfully!', 'سرمایہ کاری کامیابی سے مکمل ہو گئی!'));
    setInvestAmount('');
    setTimeout(() => { setSelectedAsset(null); setSuccessMsg(''); }, 2000);
  };

  const totalOverseas = holdings.reduce((s, h) => s + h.amountInvested, 0);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500" dir={isUrdu ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold mb-1.5 sm:mb-2">
          <span>🌍</span> {t('Roshan Digital Gateway', 'روشن ڈیجیٹل گیٹ وے')}
        </div>
        <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">
          {t('Overseas Pakistanis Investment', 'اوورسیز پاکستانیز انویسٹمنٹ')}
        </h2>
        <p className="text-slate-500 text-xs mt-0.5 sm:mt-1 leading-relaxed">
          {t('Specialized Shariah-compliant investment channels for non-resident Pakistanis. Repatriable profits, zero Riba, and sovereign guarantees.', 'غیر مقیم پاکستانیوں کے لیے شریعہ کے مطابق سرمایہ کاری کے خصوصی ذرائع۔ قابل واپسی منافع، زیرو سود، اور حکومتی ضمانتیں۔')}
        </p>
      </div>

      {/* Roshan Digital Stats Card */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none" />
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-0.5 sm:mb-1">
              {t('Total Overseas Portfolio', 'کل اوورسیز پورٹ فولیو')}
            </p>
            <h3 className="text-xl sm:text-3xl font-black tracking-tight">Rs {totalOverseas.toLocaleString()}</h3>
          </div>
          <span className="px-2.5 py-1 bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-emerald-300">
            {country}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-white/10 text-xs">
          <div>
            <p className="text-slate-400 font-medium">{t('Active Investments', 'فعال سرمایہ کاریاں')}</p>
            <p className="font-bold text-sm sm:text-base mt-0.5 text-white">{holdings.length} {t('Assets', 'اثاثے')}</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">{t('Profit Repatriation', 'منافع کی واپسی')}</p>
            <p className="font-bold text-sm sm:text-base mt-0.5 text-emerald-400">100% {t('Tax Free', 'ٹیکس فری')}</p>
          </div>
        </div>
      </div>

      {/* Available Sovereign Assets */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight px-1">
          {t('Roshan Digital Investment Opportunities', 'روشن ڈیجیٹل سرمایہ کاری کے مواقع')}
        </h3>

        <div className="space-y-2.5 sm:space-y-3">
          {assets.map(a => (
            <div key={a.id} className="p-4 sm:p-5 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-all space-y-2.5 sm:space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                    {a.cat}
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800 mt-1 sm:mt-2">{a.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{isUrdu ? a.descUr : a.descEn}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs sm:text-sm font-black text-emerald-600">{a.ret}</p>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">{t('Expected', 'متوقع')}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2.5 sm:pt-3 border-t border-slate-50">
                <div>
                  <p className="text-xs text-slate-400 font-medium">{t('Min Investment', 'کم از کم سرمایہ کاری')}</p>
                  <p className="text-xs font-bold text-slate-700">Rs {a.min.toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedAsset(a)}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl sm:rounded-2xl font-bold text-xs shadow-md hover:shadow-slate-900/20 transition-all active:scale-95">
                  {t('Invest Now', 'سرمایہ کاری کریں')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-[3rem] p-5 sm:p-6 max-w-sm w-full shadow-2xl space-y-3 sm:space-y-4 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex justify-between items-center">
              <h4 className="font-black text-sm sm:text-base text-slate-800">{selectedAsset.name}</h4>
              <button onClick={() => setSelectedAsset(null)} className="text-slate-400 hover:text-slate-600 text-xs sm:text-sm">✕</button>
            </div>
            <p className="text-xs text-slate-500">{isUrdu ? selectedAsset.descUr : selectedAsset.descEn}</p>

            {error && <p className="text-xs font-bold text-red-500 bg-red-50 p-2 sm:p-2.5 rounded-xl">{error}</p>}
            {successMsg && <p className="text-xs font-bold text-emerald-600 bg-emerald-50 p-2 sm:p-2.5 rounded-xl">{successMsg}</p>}

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                {t('Investment Amount (PKR)', 'سرمایہ کاری کی رقم (روپے)')}
              </label>
              <input type="number" value={investAmount} onChange={e => setInvestAmount(e.target.value)}
                placeholder={selectedAsset.min.toString()}
                className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-slate-800 font-bold focus:outline-none focus:border-emerald-500 text-xs sm:text-sm" />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>{t('Min: Rs', 'کم از کم: روپے')} {selectedAsset.min.toLocaleString()}</span>
                <span>{t('Wallet: Rs', 'والٹ: روپے')} {balance.toLocaleString()}</span>
              </div>
            </div>

            <button onClick={handleInvestConfirm}
              className="w-full py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl sm:rounded-2xl transition-all shadow-md shadow-emerald-900/20 active:scale-95 text-xs">
              {t('Confirm Sovereign Investment', 'سرمایہ کاری کی تصدیق کریں')}
            </button>
          </div>
        </div>
      )}

      {/* Current Holdings */}
      {holdings.length > 0 && (
        <div className="space-y-2.5 sm:space-y-3 pt-2 sm:pt-4">
          <h3 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight px-1">
            {t('My Roshan Holdings', 'میرے روشن اثاثے')}
          </h3>
          {holdings.map(h => (
            <div key={h.id} className="p-3 sm:p-4 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 flex justify-between items-center shadow-sm">
              <div>
                <h4 className="font-bold text-xs text-slate-800">{h.assetName}</h4>
                <p className="text-xs text-slate-400 font-medium">{h.category} · {h.expectedReturn}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-xs text-slate-800">Rs {h.amountInvested.toLocaleString()}</p>
                <p className="text-xs font-bold text-emerald-600 mt-0.5">{t('Active', 'فعال')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
