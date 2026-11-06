'use client';
import { useState, useEffect } from 'react';
import {
  DepositFlow,
  WithdrawFlow,
  HalalStockScanner,
  PortfolioDashboard,
  FinancialHealthScore,
  PurificationTracker,
  FractionalSukuk,
  DigitalCommittee,
  AgriFinancing,
  HajjVault,
  GlobalHalalETFs,
  WirasatCalculator,
  SovereignScan,
  PortfolioChart,
  ZakatDistribution,
  RoziqAI,
  PinSecurity,
  LanguageSelect,
  Onboarding,
  WaliAutopilot,
  AuthGate,
  FamilyHealthSaving,
  OverseasInvest,
  ToastContainer,
  DemoReceipt,
  SellStockFlow,
} from '@/components';
import DemoModeBanner from '@/components/DemoModeBanner';
import DemoWealthSummary from '@/components/DemoWealthSummary';
import { UserProfile, Holding, ZakatRecord, Transaction, DashboardTab, SupportedLanguage } from '@/types';
import { getStockBySymbol } from '@/lib/halal-stock-data';
import { ZAKAT_NISAB_PKR, WALI_INVESTED_THRESHOLD, WALI_PROFIT_THRESHOLD } from '@/lib/constants';
import { createDemoReference, demoStorage } from '@/lib/demo-storage';

// ─── Nav items with SVG icons (no emojis) ──────────────────────────────────────
const NAV_ITEMS = [
  {
    id: 'home',
    labelEn: 'Dashboard',
    labelUr: 'ڈیش بورڈ',
    sub: 'Overview & Activity',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="10.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="1.5" y="10.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="10.5" y="10.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: 'portfolio',
    labelEn: 'Stocks',
    labelUr: 'اسٹاکس',
    sub: 'PSX Screened',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <polyline points="1.5,13.5 5.5,8 8.5,11 12.5,5 16.5,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'assets',
    labelEn: 'Sukuk',
    labelUr: 'سکوک',
    sub: 'Sukuk, Hajj, Agri',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1.5" y="8" width="15" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M1.5 8l7.5-6 7.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 8v8.5M9 8v8.5M12 8v8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'kameti',
    labelEn: 'Family',
    labelUr: 'خاندان',
    sub: 'Health & Kameti',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M1.5 16.5c0-3.3 2.2-6 5-6M11.5 10.5c2.8 0 5 2.7 5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'zakat',
    labelEn: 'Zakat',
    labelUr: 'زکوٰۃ',
    sub: 'Social Finance',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 1.5l2.1 5.3 5.9.8-4 3.9.9 5.5L9 14.3l-4.9 2.7.9-5.5-4-3.9 5.9-.8L9 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'settings',
    labelEn: 'Settings',
    labelUr: 'سیٹنگز',
    sub: 'Preferences & PIN',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M3.7 14.3l1.4-1.4M12.9 5.1l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

// ─── Stocks data ───────────────────────────────────────────────────────────────
const DEMO_STOCKS = [
  { name: 'Meezan Bank', price: 145.0, change: '+1.47%', debt: '0.0%', impure: '0.0%', compliant: true },
  { name: 'Systems Limited', price: 415.0, change: '+1.10%', debt: '4.5%', impure: '0.8%', compliant: true },
  { name: 'Lucky Cement', price: 411.5, change: '-1.50%', debt: '18.5%', impure: '2.1%', compliant: true },
  { name: 'Habib Bank', price: 92.1, change: '-1.60%', debt: '45.0%', impure: '28.5%', compliant: false },
  { name: 'Engro Corp', price: 312.8, change: '+1.00%', debt: '22.4%', impure: '4.2%', compliant: true },
];

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [modal, setModal] = useState<'deposit' | 'withdraw' | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [zakatHistory, setZakatHistory] = useState<ZakatRecord[]>([]);
  const [activeTab, setActiveTab] = useState<DashboardTab>('home');
  const [lang, setLangState] = useState<SupportedLanguage>('en');
  const [showLangSelect, setShowLangSelect] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showTradingPin, setShowTradingPin] = useState(false);
  const [pendingTrade, setPendingTrade] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [pendingTx, setPendingTx] = useState<any>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);
  const [selectedSellHolding, setSelectedSellHolding] = useState<Holding | null>(null);
  const [stockFilter, setStockFilter] = useState<'all' | 'halal' | 'excluded'>('all');
  const [stockSearch, setStockSearch] = useState('');

  const t = (en: string, ur: string) => (lang === 'ur' ? ur : en);

  const toggleTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem('roziq_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('roziq_theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const savedLang = localStorage.getItem('roziq_lang') as 'en' | 'ur';
    const hasOnboarded = localStorage.getItem('roziq_onboarded');
    if (!savedLang) setShowLangSelect(true);
    else {
      setLangState(savedLang);
      if (!hasOnboarded) setShowOnboarding(true);
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'demo' || params.get('demo') === '1') {
        const demoUser: UserProfile = {
          name: 'Demo Investor',
          cnic: '4210100000001',
          mobile: '03000000000',
          location: 'Karachi, PK (Virtual Demo)',
          isOverseas: false,
          tradingPin: '1234',
        };
        handleAuthSuccess(demoUser);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!modal && !showResetModal && !selectedReceipt && !selectedSellHolding) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setModal(null);
        setShowResetModal(false);
        setSelectedReceipt(null);
        setSelectedSellHolding(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [modal, showResetModal, selectedReceipt, selectedSellHolding]);

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthorized(true);
    const cnicKey = user.cnic || 'default';
    const b = localStorage.getItem(`roziq_balance_${cnicKey}`);
    const h = localStorage.getItem(`roziq_holdings_${cnicKey}`);
    const txs = localStorage.getItem(`roziq_tx_${cnicKey}`);
    const zk = localStorage.getItem(`roziq_zakat_${cnicKey}`);
    if (b) setBalance(parseFloat(b));
    else {
      setBalance(5000000);
      localStorage.setItem(`roziq_balance_${cnicKey}`, '5000000');
    }
    if (h) setHoldings(JSON.parse(h));
    if (txs) setTransactions(JSON.parse(txs));
    if (zk) setZakatHistory(JSON.parse(zk));
  };

  const persistUserData = (newBal: number, newHoldings: Holding[], newTxs: any[], newZk: ZakatRecord[]) => {
    if (!currentUser) return;
    const cnicKey = currentUser.cnic || 'default';
    localStorage.setItem(`roziq_balance_${cnicKey}`, newBal.toString());
    localStorage.setItem(`roziq_holdings_${cnicKey}`, JSON.stringify(newHoldings));
    localStorage.setItem(`roziq_tx_${cnicKey}`, JSON.stringify(newTxs));
    localStorage.setItem(`roziq_zakat_${cnicKey}`, JSON.stringify(newZk));
  };

  const handleLangSelect = (l: 'en' | 'ur') => {
    setLangState(l);
    localStorage.setItem('roziq_lang', l);
    setShowLangSelect(false);
    if (!localStorage.getItem('roziq_onboarded')) setShowOnboarding(true);
  };
  const handleLangChange = (l: 'en' | 'ur') => {
    localStorage.setItem('roziq_lang', l);
    setLangState(l);
  };

  const totalPortfolioValue = holdings.reduce((sum, h) => sum + h.invested + h.pnl, 0);
  const dailyPnl = holdings.reduce((sum, h) => sum + h.pnl, 0);
  const isZakatEligible = balance + totalPortfolioValue >= ZAKAT_NISAB_PKR;
  const totalWealth = balance + totalPortfolioValue;
  const zakatDue = isZakatEligible ? Math.round(totalWealth * 0.025) : 0;
  const totalInvestedHistory = holdings.reduce((sum, h) => sum + h.invested, 0);
  const totalRealizedProfit = transactions.reduce((sum, tx) => sum + (tx.profit || 0), 0);
  const isPremium = totalInvestedHistory >= WALI_INVESTED_THRESHOLD && totalRealizedProfit >= WALI_PROFIT_THRESHOLD;
  const pendingDemoAmount = transactions
    .filter((tx) => tx.status === 'PENDING')
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const handleTransactionSuccess = async (data: any) => {
    if (
      ['buy_stock', 'sell_stock', 'buy_sukuk', 'zakat', 'withdraw', 'health_save', 'overseas_invest'].includes(data.type)
    ) {
      setPendingTx(data);
      setIsScanning(true);
      return;
    }
    await processTransaction(data);
  };

  const processTransaction = async (data: any) => {
    let newBal = balance;
    let newHoldings = [...holdings];
    let newTxs = [...transactions];
    let newZk = [...zakatHistory];
    const txRecord: Transaction = {
      id: Date.now(),
      type: data.type,
      amount: data.amount,
      symbol: data.symbol || data.name || data.type,
      name: data.name,
      status: 'SUCCESS',
      date: new Date().toISOString(),
      reference: data.txRef || createDemoReference(data.type),
      note: data.note || 'Simulated demo transaction. No real funds moved.',
      method: data.method,
      units: data.units,
      recipient: data.recipient,
      isDemo: true,
      receiptVersion: 1,
      balanceBefore: balance,
    };
    if (data.type === 'deposit') {
      newBal += data.amount;
      newTxs.unshift(txRecord);
    } else if (data.type === 'withdraw') {
      newBal -= data.amount;
      newTxs.unshift(txRecord);
    } else if (data.type === 'buy_stock') {
      newBal -= data.amount;
      const existing = newHoldings.find((h) => h.symbol === data.symbol);
      if (existing) {
        existing.invested += data.amount;
        existing.units += data.units;
      } else {
        newHoldings.push({
          symbol: data.symbol,
          name: data.name,
          invested: data.amount,
          currentPrice: data.amount / data.units,
          units: data.units,
          pnl: 0,
        });
      }
      newTxs.unshift(txRecord);
    } else if (data.type === 'sell_stock') {
      const existing = newHoldings.find((h) => h.symbol === data.symbol);
      if (existing) {
        const remainingUnits = Math.max(0, existing.units - data.units);
        existing.invested = Math.max(0, existing.invested - data.costBasis);
        existing.pnl = existing.pnl - data.realizedPnl;
        existing.units = remainingUnits;
        if (remainingUnits === 0) newHoldings = newHoldings.filter((h) => h.symbol !== data.symbol);
      }
      newBal += data.amount;
      txRecord.profit = data.realizedPnl;
      newTxs.unshift(txRecord);
    } else if (['buy_sukuk', 'health_save', 'overseas_invest'].includes(data.type)) {
      newBal -= data.amount;
      newTxs.unshift(txRecord);
    } else if (data.type === 'zakat') {
      newBal -= data.amount;
      newZk.unshift({ date: new Date().toISOString(), amount: data.amount, recipient: data.recipient });
      newTxs.unshift(txRecord);
    }
    txRecord.balanceAfter = newBal;
    setBalance(newBal);
    setHoldings(newHoldings);
    setTransactions(newTxs);
    setZakatHistory(newZk);
    persistUserData(newBal, newHoldings, newTxs, newZk);
    setModal(null);
    setIsScanning(false);
    setPendingTx(null);
  };

  const onScanComplete = () => {
    if (pendingTx) processTransaction(pendingTx);
  };
  const handleSellRequest = (data: any) => {
    setSelectedSellHolding(null);
    setPendingTrade(data);
    setShowTradingPin(true);
  };
  const initiateBuyStock = (symbol: string, amount: number) => {
    const stock = getStockBySymbol(symbol);
    if (!stock) return;
    setPendingTrade({ type: 'buy_stock', amount, symbol: stock.symbol, name: stock.name, units: amount / stock.price });
    setShowTradingPin(true);
  };
  const initiateSecureTransaction = (data: any) => {
    setPendingTrade(data);
    setShowTradingPin(true);
  };
  const handleTradingPinSuccess = () => {
    setShowTradingPin(false);
    if (pendingTrade) {
      handleTransactionSuccess(pendingTrade);
      setPendingTrade(null);
    }
  };
  const handleBuySukuk = (purchase: any) => initiateSecureTransaction(purchase);
  const handleZakatDonation = (amount: number, recipient: string) =>
    initiateSecureTransaction({ type: 'zakat', amount, recipient, symbol: 'ZAKAT' });
  const handleHealthSave = (amount: number) => initiateSecureTransaction({ type: 'health_save', amount, symbol: 'HEALTH' });
  const handleOverseasInvest = (amount: number, asset: string) =>
    initiateSecureTransaction({ type: 'overseas_invest', amount, name: asset, symbol: asset });
  const handleHajjDeposit = (amount: number) => initiateSecureTransaction({ type: 'buy_sukuk', amount, symbol: 'HAJJ' });
  const handleETFInvest = (amount: number, etf: string) => initiateSecureTransaction({ type: 'buy_sukuk', amount, symbol: etf });
  const handleKametiContribute = (amount: number) => initiateSecureTransaction({ type: 'buy_sukuk', amount, symbol: 'KAMETI' });
  const executeReset = () => {
    demoStorage.clear();
    setCurrentUser(null);
    setIsAuthorized(false);
    setBalance(5000000);
    setHoldings([]);
    setTransactions([]);
    setZakatHistory([]);
    setShowResetModal(false);
    window.location.href = '/dashboard';
  };

  const filteredStocks = DEMO_STOCKS.filter((s) => {
    const matchFilter = stockFilter === 'all' ? true : stockFilter === 'halal' ? s.compliant : !s.compliant;
    const matchSearch = s.name.toLowerCase().includes(stockSearch.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <>
      <ToastContainer />
      {showLangSelect && <LanguageSelect onSelect={handleLangSelect} />}
      {showOnboarding && !showLangSelect && (
        <Onboarding
          lang={lang}
          onComplete={() => {
            setShowOnboarding(false);
            localStorage.setItem('roziq_onboarded', '1');
          }}
        />
      )}
      {!isAuthorized && !showLangSelect && !showOnboarding && <AuthGate onSuccess={handleAuthSuccess} />}
      {showTradingPin && (
        <PinSecurity
          mode="trading"
          onSuccess={handleTradingPinSuccess}
          onCancel={() => {
            setShowTradingPin(false);
            setPendingTrade(null);
          }}
        />
      )}

      {/* Reset Modal (with clean Trash SVG, zero emojis) */}
      {showResetModal && (
        <div
          className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-white/10 p-6 text-center space-y-4 bg-white dark:bg-[#1a1d24] shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('Reset All Demo Data?', 'کیا آپ تمام فرضی ڈیٹا ری سیٹ کرنا چاہتے ہیں؟')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t(
                'This will permanently reset your demo cash balance and simulated transactions.',
                'یہ آپ کا ورچوئل بیلنس اور ٹرانزیکشن ہسٹری ڈیلیٹ کر دے گا۔'
              )}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                {t('Cancel', 'کینسل')}
              </button>
              <button
                onClick={executeReset}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-semibold text-white hover:bg-red-500 transition-colors shadow-sm"
              >
                {t('Delete All', 'ڈیلیٹ کریں')}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedReceipt && (
        <DemoReceipt transaction={selectedReceipt} onClose={() => setSelectedReceipt(null)} lang={lang} />
      )}
      <RoziqAI balance={balance} holdings={holdings} transactions={transactions} lang={lang} />

      {/* ── Main Shell (Light & Dark mode responsive) ── */}
      <div
        className="min-h-screen flex bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-white transition-colors duration-200"
        dir={lang === 'ur' ? 'rtl' : 'ltr'}
      >
        {/* ── Sidebar (Desktop) ── */}
        <aside
          className="hidden lg:flex flex-col w-60 flex-shrink-0 border-r border-slate-200 dark:border-white/8 sticky top-0 h-screen overflow-y-auto bg-white dark:bg-[#111215]"
        >
          {/* Logo */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-black">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5C4 1.5 1.5 4 1.5 7S4 12.5 7 12.5 12.5 10 12.5 7 10 1.5 7 1.5z" stroke="#000" strokeWidth="1.4"/>
                  <circle cx="7" cy="7" r="2" fill="#000"/>
                </svg>
              </div>
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">Roziq</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Demo
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === (item.id as DashboardTab);
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as DashboardTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                    isActive
                      ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-white/5 font-medium'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>
                    {item.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm">
                      {lang === 'ur' ? item.labelUr : item.labelEn}
                    </div>
                    {isActive && (
                      <div className="text-xs text-slate-400 dark:text-slate-500 truncate">{item.sub}</div>
                    )}
                  </div>
                  {isActive && <div className="ml-auto w-1.5 h-4 rounded-full bg-emerald-500" />}
                </button>
              );
            })}
          </nav>

          {/* Zakat eligibility indicator */}
          {isZakatEligible && (
            <div className="mx-3 mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">{t('Zakat Due', 'زکوٰۃ واجب')}</p>
              </div>
              <p className="text-xs text-amber-600/80 dark:text-amber-500/80 mt-1">
                {t('Above Nisab threshold', 'آپ نصاب کی حد سے اوپر ہیں')}
              </p>
            </div>
          )}

          {/* Delete action at bottom */}
          <div className="px-3 pb-4 border-t border-slate-200 dark:border-white/5 pt-3">
            <button
              onClick={() => setShowResetModal(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              {t('Reset Demo Data', 'ڈیٹا ری سیٹ کریں')}
            </button>
          </div>
        </aside>

        {/* ── Main Content Area ── */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Top Bar (Theme Toggle, Language Switcher, Notifications) */}
          <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/8 bg-white/80 dark:bg-[#0a0a0c]/80 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="lg:hidden flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-black">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5C4 1.5 1.5 4 1.5 7S4 12.5 7 12.5 12.5 10 12.5 7 10 1.5 7 1.5z" stroke="#000" strokeWidth="1.4"/>
                  <circle cx="7" cy="7" r="2" fill="#000"/>
                </svg>
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                {activeTab === 'home'
                  ? 'Dashboard'
                  : activeTab === 'portfolio'
                  ? 'Halal Stocks'
                  : activeTab === 'assets'
                  ? 'Sukuk & Assets'
                  : activeTab === 'kameti'
                  ? 'Family & Takaful'
                  : activeTab === 'zakat'
                  ? 'Zakat & Impact'
                  : 'Settings'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Theme Toggle Button (Sun / Moon SVG) */}
              <button
                onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  // Sun icon
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                ) : (
                  // Moon icon
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>

              {/* Language pill toggle */}
              <button
                onClick={() => handleLangChange(lang === 'en' ? 'ur' : 'en')}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {lang === 'en' ? 'اردو' : 'EN'}
              </button>
            </div>
          </header>

          {/* Demo disclaimer banner */}
          <div className="px-4 pt-3 lg:px-6">
            <DemoModeBanner lang={lang} />
          </div>

          {/* ── Tab 1: Dashboard ── */}
          {activeTab === 'home' && (
            <main className="flex-1 px-4 py-5 lg:px-6 pb-32 lg:pb-8 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Overview of simulated wealth and investments</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline rounded-lg border border-slate-200 dark:border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Demo account
                  </span>
                  <button
                    onClick={() => setModal('deposit')}
                    className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors shadow-xs"
                  >
                    Add funds
                  </button>
                </div>
              </div>

              {/* Top Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Total wealth card */}
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-5 sm:p-6 bg-white dark:bg-[#16171b] shadow-xs">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Total wealth
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                    PKR {totalWealth.toLocaleString()}
                  </p>
                  <div className="flex gap-1.5 mb-4">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${Math.min(100, (balance / totalWealth) * 100)}%` }}
                    />
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${Math.min(100, (totalPortfolioValue / totalWealth) * 70)}%` }}
                    />
                    <div className="h-2 rounded-full bg-amber-500 flex-1" />
                    <div className="h-2 w-8 rounded-full bg-slate-200 dark:bg-white/10" />
                  </div>
                  <div className="border-t border-slate-100 dark:border-white/5 pt-3.5">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Recent activity</p>
                    {transactions.length === 0 ? (
                      <p className="text-xs text-slate-400 dark:text-slate-600">No activity yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {transactions.slice(0, 3).map((tx) => (
                          <div key={tx.id} className="flex justify-between text-xs">
                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                              {tx.type === 'buy_stock'
                                ? `Bought ${tx.symbol}`
                                : tx.type === 'deposit'
                                ? 'Deposit'
                                : tx.type === 'zakat'
                                ? 'Zakat paid'
                                : tx.type === 'sell_stock'
                                ? `Sold ${tx.symbol}`
                                : tx.type}
                            </span>
                            <span
                              className={`font-semibold ${
                                tx.type === 'deposit'
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {tx.type === 'deposit' ? '+' : '- '}
                              {tx.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                        {holdings.length > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-700 dark:text-slate-300 font-medium">Dividend purified</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">4.2%</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side metrics */}
                <div className="space-y-4">
                  {/* Zakat due card */}
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-5 sm:p-6 bg-white dark:bg-[#16171b] shadow-xs">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Zakat due
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                      PKR {zakatDue.toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {isZakatEligible ? 'Above Nisab' : 'Below Nisab'}
                    </p>
                  </div>

                  {/* Available cash card */}
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-5 sm:p-6 bg-slate-100 dark:bg-[#1e2025] shadow-xs">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Available cash
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                      PKR {balance.toLocaleString()}
                    </p>
                    <div className="mt-3 flex gap-4">
                      <button
                        onClick={() => setModal('deposit')}
                        className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                      >
                        Deposit
                      </button>
                      <button
                        onClick={() => setModal('withdraw')}
                        className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:underline"
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart & Wealth Summary */}
              {isPremium && <WaliAutopilot lang={lang} />}
              <PortfolioChart balance={balance} holdings={holdings} totalValue={totalPortfolioValue} />
              <DemoWealthSummary
                cash={balance}
                invested={totalPortfolioValue}
                pending={pendingDemoAmount}
                zakatDue={isZakatEligible}
                lang={lang}
              />
            </main>
          )}

          {/* ── Tab 2: Stocks ── */}
          {activeTab === 'portfolio' && (
            <main className="flex-1 px-4 py-5 lg:px-6 pb-32 lg:pb-8 space-y-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Halal stocks</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">PSX equities screened via AAOIFI guidelines</p>
              </div>

              {/* Controls Row */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3.5 py-2 flex-1 min-w-[200px]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    placeholder="Search by company name or symbol"
                    className="bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none w-full"
                  />
                </div>
                <div className="flex gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-1">
                  {(['all', 'halal', 'excluded'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setStockFilter(f)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors ${
                        stockFilter === f
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {f === 'all' ? 'All' : f === 'halal' ? 'Halal' : 'Excluded'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stocks Table */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#16171b] shadow-xs overflow-hidden">
                <div className="grid grid-cols-6 gap-2 px-4 py-3 border-b border-slate-100 dark:border-white/5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <span className="col-span-2">Company</span>
                  <span className="text-right">Price</span>
                  <span className="text-right">Change</span>
                  <span className="text-right">Debt</span>
                  <span className="text-right">Impure</span>
                </div>
                <div>
                  {filteredStocks.map((s) => (
                    <div
                      key={s.name}
                      className="grid grid-cols-6 gap-2 items-center px-4 py-3.5 border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="col-span-2 flex items-center justify-between pr-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{s.name}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            s.compliant
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                          }`}
                        >
                          {s.compliant ? 'Compliant' : 'Excluded'}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 text-right">
                        {s.price.toFixed(2)}
                      </span>
                      <span
                        className={`text-sm text-right font-semibold ${
                          s.change.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {s.change}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400 text-right">{s.debt}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400 text-right">{s.impure}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trade stocks & scanner */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#16171b] shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Instant Trade Simulator</h3>
                </div>
                <div className="p-5">
                  <HalalStockScanner balance={balance} onBuy={initiateBuyStock} />
                </div>
              </div>
              <PortfolioDashboard
                holdings={holdings}
                totalValue={totalPortfolioValue}
                dailyPnl={dailyPnl}
                onSell={setSelectedSellHolding}
              />
            </main>
          )}

          {/* ── Tab 3: Sukuk & Assets ── */}
          {activeTab === 'assets' && (
            <main className="flex-1 px-4 py-5 lg:px-6 pb-32 lg:pb-8 space-y-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Sukuk and assets</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Asset-backed Islamic debt, Hajj savings & agriculture contracts</p>
              </div>

              {/* 3-column overview cards with clean SVGs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400">
                        <line x1="3" y1="21" x2="21" y2="21"/>
                        <line x1="4" y1="10" x2="20" y2="10"/>
                        <polyline points="12 3 20 10 4 10 12 3"/>
                        <line x1="6" y1="10" x2="6" y2="21"/>
                        <line x1="10" y1="10" x2="10" y2="21"/>
                        <line x1="14" y1="10" x2="14" y2="21"/>
                        <line x1="18" y1="10" x2="18" y2="21"/>
                      </svg>
                    ),
                    title: 'Sovereign Sukuk',
                    desc: 'Asset-backed infrastructure bonds',
                    progress: 62,
                    color: 'bg-emerald-500',
                    cta: 'Invest',
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                      </svg>
                    ),
                    title: 'Hajj savings',
                    desc: 'Yield-bearing goal accumulator',
                    progress: 28,
                    color: 'bg-blue-500',
                    cta: 'Start saving',
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400">
                        <path d="M12 2a10 10 0 0 1 10 10c0 5.5-4.5 10-10 10S2 17.5 2 12A10 10 0 0 1 12 2z"/>
                        <path d="M12 6v12M8 10l4-4 4 4M8 14l4-4 4 4"/>
                      </svg>
                    ),
                    title: 'Agri finance',
                    desc: "Bay' Al-Salam farmer contracts",
                    progress: 45,
                    color: 'bg-amber-500',
                    cta: 'View contracts',
                  },
                ].map(({ icon, title, desc, progress, color, cta }) => (
                  <div
                    key={title}
                    className="flex flex-col rounded-2xl border border-slate-200 dark:border-white/10 p-5 bg-white dark:bg-[#16171b] shadow-xs"
                  >
                    <div className="mb-3">{icon}</div>
                    <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
                    <p className="mb-4 text-xs text-slate-500 dark:text-slate-400 flex-1">{desc}</p>
                    <div className="mb-3 h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${progress}%` }} />
                    </div>
                    <button className="w-full rounded-xl border border-slate-200 dark:border-white/10 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      {cta}
                    </button>
                  </div>
                ))}
              </div>

              {currentUser?.isOverseas && (
                <OverseasInvest
                  balance={balance}
                  onInvest={handleOverseasInvest}
                  lang={lang}
                  cnic={currentUser.cnic}
                  country={currentUser.country}
                />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                <HajjVault onDeposit={handleHajjDeposit} />
                <AgriFinancing
                  balance={balance}
                  onInvest={(amount) => initiateSecureTransaction({ type: 'buy_sukuk', amount, symbol: 'AGRI' })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                <FractionalSukuk balance={balance} onBuy={handleBuySukuk} />
                <GlobalHalalETFs onInvest={handleETFInvest} />
              </div>
            </main>
          )}

          {/* ── Tab 4: Family ── */}
          {activeTab === 'kameti' && (
            <main className="flex-1 px-4 py-5 lg:px-6 pb-32 lg:pb-8 space-y-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Family and Takaful</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Community rotating credit circles and mutual health pool</p>
              </div>

              {/* Overview grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kameti circle */}
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-5 bg-white dark:bg-[#16171b] shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Kameti circle</h3>
                    <span className="text-xs font-semibold text-slate-500">Monthly</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { initial: 'A', name: 'Ahmed', status: 'Paid', color: 'bg-emerald-600' },
                      { initial: 'S', name: 'Sana', status: 'Paid', color: 'bg-blue-600' },
                      { initial: 'B', name: 'Bilal', status: 'Due soon', color: 'bg-amber-600' },
                    ].map(({ initial, name, status, color }) => (
                      <div key={name} className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${color} text-xs font-bold text-white`}>
                          {initial}
                        </div>
                        <span className="flex-1 text-sm font-semibold text-slate-800 dark:text-slate-200">{name}</span>
                        <span
                          className={`text-xs font-semibold ${
                            status === 'Paid' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  {/* Next payout */}
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-5 bg-slate-100 dark:bg-[#1e2025] shadow-xs">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Next payout</p>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">PKR 250,000</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Sana, in 12 days</p>
                  </div>
                  {/* Takaful pool */}
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-5 bg-white dark:bg-[#16171b] shadow-xs">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Takaful pool</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Family health cover active</p>
                  </div>
                </div>
              </div>

              <FamilyHealthSaving balance={balance} onSave={handleHealthSave} lang={lang} cnic={currentUser?.cnic} />
              <DigitalCommittee onContribute={handleKametiContribute} />
              <WirasatCalculator />
            </main>
          )}

          {/* ── Tab 5: Zakat & Impact ── */}
          {activeTab === 'zakat' && (
            <main className="flex-1 px-4 py-5 lg:px-6 pb-32 lg:pb-8 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Zakat and impact</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Automated 2.5% calculation and verified NGO distribution</p>
                </div>
                <button
                  onClick={() => handleZakatDonation(zakatDue, 'Zakat Fund')}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition-colors shadow-xs"
                >
                  Pay Zakat
                </button>
              </div>

              {/* Zakat & Nisab Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-5 bg-white dark:bg-[#16171b] shadow-xs">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Zakat due</p>
                  <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">PKR {zakatDue.toLocaleString()}</p>
                  <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {isZakatEligible ? 'Above Nisab threshold' : 'Below Nisab threshold'}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-5 bg-white dark:bg-[#16171b] shadow-xs">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Nisab threshold benchmarks</p>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Gold (7.5 Tolas)</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Live price</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Silver (52.5 Tolas)</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Live price</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charity Receipts */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#16171b] shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Charity receipts & audit</h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-white/5 text-sm">
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <span className="font-medium text-slate-800 dark:text-slate-200">Dividend purification</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-400">PKR 1,240</span>
                  </div>
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <span className="font-medium text-slate-800 dark:text-slate-200">Zakat payment</span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Receipt ready</span>
                  </div>
                </div>
              </div>

              <ZakatDistribution balance={balance} portfolioValue={totalPortfolioValue} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                <PurificationTracker onPurify={(amount) => handleZakatDonation(amount, 'Dividend Purification')} />
                <FinancialHealthScore
                  balance={balance}
                  portfolioValue={totalPortfolioValue}
                  holdings={holdings}
                  transactions={transactions}
                  zakatHistory={zakatHistory}
                  isZakatEligible={isZakatEligible}
                />
              </div>
            </main>
          )}

          {/* ── Tab 6: Settings (With Dark & White mode toggle) ── */}
          {activeTab === 'settings' && (
            <main className="flex-1 px-4 py-5 lg:px-6 pb-32 lg:pb-8 space-y-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage preferences, appearance, and security</p>
              </div>

              {/* Settings Card */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#16171b] shadow-xs overflow-hidden">
                {/* Account Type */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/5">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Account type</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Switch between demo and real</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 p-1">
                    <button className="rounded-full bg-slate-900 dark:bg-white px-4 py-1.5 text-xs font-semibold text-white dark:text-slate-900 transition-colors shadow-xs">
                      Demo
                    </button>
                    <button
                      className="rounded-full px-4 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                      onClick={() => alert('Real accounts opening soon under SECP guidelines.')}
                    >
                      Real
                    </button>
                  </div>
                </div>

                {/* Appearance: Dark and White (Light) mode */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/5">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Appearance</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Switch between dark obsidian and white porcelain theme</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 p-1">
                    <button
                      onClick={() => toggleTheme('dark')}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                        theme === 'dark'
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Dark
                    </button>
                    <button
                      onClick={() => toggleTheme('light')}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                        theme === 'light'
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      White
                    </button>
                  </div>
                </div>

                {/* Language */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/5">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Language</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Platform interface language</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 p-1">
                    <button
                      onClick={() => handleLangChange('en')}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                        lang === 'en'
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleLangChange('ur')}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                        lang === 'ur'
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      اردو
                    </button>
                  </div>
                </div>

                {/* Security PIN */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/5">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Security PIN</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Protect transactions and withdrawals</p>
                  </div>
                  <button
                    onClick={() => setIsAuthorized(false)}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Change PIN
                  </button>
                </div>

                {/* Delete account */}
                <button
                  onClick={() => setShowResetModal(true)}
                  className="flex w-full items-center justify-between px-5 py-4 hover:bg-red-500/5 transition-colors group"
                >
                  <div>
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                      Delete account and data
                    </span>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 text-left">
                      Clear virtual demo wallet and reset prototype state
                    </p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>

              {isPremium && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Elite account active</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Wali Autopilot and advanced features unlocked.</p>
                </div>
              )}
            </main>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {modal && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm"
        >
          <div
            className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-2xl bg-white dark:bg-[#1a1d24]"
          >
            <button
              onClick={() => setModal(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            {modal === 'deposit' ? (
              <DepositFlow onSuccess={handleTransactionSuccess} />
            ) : (
              <WithdrawFlow onSuccess={handleTransactionSuccess} />
            )}
          </div>
        </div>
      )}

      {selectedSellHolding && (
        <div
          className="fixed inset-0 z-[65] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm"
        >
          <div
            className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-slate-200 dark:border-white/10 p-5 bg-white dark:bg-[#1a1d24]"
          >
            <SellStockFlow
              holding={selectedSellHolding}
              onSuccess={handleSellRequest}
              onCancel={() => setSelectedSellHolding(null)}
            />
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Nav ── */}
      <div className="mobile-bottom-nav fixed left-1/2 -translate-x-1/2 w-[95%] max-w-md z-50 block lg:hidden">
        <nav
          className="rounded-2xl border border-slate-200 dark:border-white/10 p-1.5 flex justify-between items-center shadow-xl bg-white/95 dark:bg-[#111215]/95 backdrop-blur-xl"
        >
          {NAV_ITEMS.filter((n) => n.id !== 'settings').map((item) => {
            const isActive = activeTab === (item.id as DashboardTab);
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as DashboardTab)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-xs">{lang === 'ur' ? item.labelUr : item.labelEn}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <SovereignScan isOpen={isScanning} onComplete={onScanComplete} />
    </>
  );
}
