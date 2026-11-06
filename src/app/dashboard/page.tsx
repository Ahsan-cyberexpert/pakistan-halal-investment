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

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    id: 'home',
    labelEn: 'Dashboard',
    labelUr: 'ڈیش بورڈ',
    sub: 'Overview & Activity',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="11" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="1" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
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
        <polyline points="1,13 5,8 8,11 12,5 17,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
        <rect x="1" y="8" width="16" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M1 8l8-6 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 8v9M9 8v9M12 8v9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
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
        <path d="M1 17c0-3.314 2.239-6 5-6M12 11c2.761 0 5 2.686 5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
        <path d="M9 1l2.09 5.26L17 7.27l-4 3.9.94 5.5L9 14l-4.94 2.67L5 11.17 1 7.27l5.91-1.01L9 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
        <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.22 3.22l1.42 1.42M13.36 13.36l1.42 1.42M3.22 14.78l1.42-1.42M13.36 4.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
  const [showTradingPin, setShowTradingPin] = useState(false);
  const [pendingTrade, setPendingTrade] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [pendingTx, setPendingTx] = useState<any>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);
  const [selectedSellHolding, setSelectedSellHolding] = useState<Holding | null>(null);
  const [stockFilter, setStockFilter] = useState<'all' | 'halal' | 'excluded'>('all');
  const [stockSearch, setStockSearch] = useState('');

  const t = (en: string, ur: string) => lang === 'ur' ? ur : en;

  useEffect(() => {
    document.documentElement.classList.add('dark');
    const savedLang = localStorage.getItem('roziq_lang') as 'en' | 'ur';
    const hasOnboarded = localStorage.getItem('roziq_onboarded');
    if (!savedLang) setShowLangSelect(true);
    else { setLangState(savedLang); if (!hasOnboarded) setShowOnboarding(true); }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'demo' || params.get('demo') === '1') {
        const demoUser: UserProfile = {
          name: 'Demo Investor',
          cnic: '4210100000001',
          mobile: '03000000000',
          location: 'Karachi, PK (Virtual Demo 📍)',
          isOverseas: false,
          tradingPin: '1234'
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
        setModal(null); setShowResetModal(false);
        setSelectedReceipt(null); setSelectedSellHolding(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [modal, showResetModal, selectedReceipt, selectedSellHolding]);

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user); setIsAuthorized(true);
    const cnicKey = user.cnic || 'default';
    const b = localStorage.getItem(`roziq_balance_${cnicKey}`);
    const h = localStorage.getItem(`roziq_holdings_${cnicKey}`);
    const txs = localStorage.getItem(`roziq_tx_${cnicKey}`);
    const zk = localStorage.getItem(`roziq_zakat_${cnicKey}`);
    if (b) setBalance(parseFloat(b));
    else { setBalance(5000000); localStorage.setItem(`roziq_balance_${cnicKey}`, '5000000'); }
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
    setLangState(l); localStorage.setItem('roziq_lang', l);
    setShowLangSelect(false);
    if (!localStorage.getItem('roziq_onboarded')) setShowOnboarding(true);
  };
  const handleLangChange = (l: 'en' | 'ur') => { localStorage.setItem('roziq_lang', l); setLangState(l); };

  const totalPortfolioValue = holdings.reduce((sum, h) => sum + h.invested + h.pnl, 0);
  const dailyPnl = holdings.reduce((sum, h) => sum + h.pnl, 0);
  const isZakatEligible = (balance + totalPortfolioValue) >= ZAKAT_NISAB_PKR;
  const totalWealth = balance + totalPortfolioValue;
  const zakatDue = isZakatEligible ? Math.round(totalWealth * 0.025) : 0;
  const totalInvestedHistory = holdings.reduce((sum, h) => sum + h.invested, 0);
  const totalRealizedProfit = transactions.reduce((sum, tx) => sum + (tx.profit || 0), 0);
  const isPremium = totalInvestedHistory >= WALI_INVESTED_THRESHOLD && totalRealizedProfit >= WALI_PROFIT_THRESHOLD;
  const pendingDemoAmount = transactions.filter(tx => tx.status === 'PENDING').reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const handleTransactionSuccess = async (data: any) => {
    if (['buy_stock', 'sell_stock', 'buy_sukuk', 'zakat', 'withdraw', 'health_save', 'overseas_invest'].includes(data.type)) {
      setPendingTx(data); setIsScanning(true); return;
    }
    await processTransaction(data);
  };

  const processTransaction = async (data: any) => {
    let newBal = balance; let newHoldings = [...holdings]; let newTxs = [...transactions]; let newZk = [...zakatHistory];
    const txRecord: Transaction = {
      id: Date.now(), type: data.type, amount: data.amount,
      symbol: data.symbol || data.name || data.type, name: data.name,
      status: 'SUCCESS', date: new Date().toISOString(),
      reference: data.txRef || createDemoReference(data.type),
      note: data.note || 'Simulated demo transaction. No real funds moved.',
      method: data.method, units: data.units, recipient: data.recipient,
      isDemo: true, receiptVersion: 1, balanceBefore: balance,
    };
    if (data.type === 'deposit') { newBal += data.amount; newTxs.unshift(txRecord); }
    else if (data.type === 'withdraw') { newBal -= data.amount; newTxs.unshift(txRecord); }
    else if (data.type === 'buy_stock') {
      newBal -= data.amount;
      const existing = newHoldings.find(h => h.symbol === data.symbol);
      if (existing) { existing.invested += data.amount; existing.units += data.units; }
      else { newHoldings.push({ symbol: data.symbol, name: data.name, invested: data.amount, currentPrice: data.amount / data.units, units: data.units, pnl: 0 }); }
      newTxs.unshift(txRecord);
    }
    else if (data.type === 'sell_stock') {
      const existing = newHoldings.find(h => h.symbol === data.symbol);
      if (existing) {
        const remainingUnits = Math.max(0, existing.units - data.units);
        existing.invested = Math.max(0, existing.invested - data.costBasis);
        existing.pnl = existing.pnl - data.realizedPnl;
        existing.units = remainingUnits;
        if (remainingUnits === 0) newHoldings = newHoldings.filter(h => h.symbol !== data.symbol);
      }
      newBal += data.amount; txRecord.profit = data.realizedPnl; newTxs.unshift(txRecord);
    }
    else if (['buy_sukuk', 'health_save', 'overseas_invest'].includes(data.type)) { newBal -= data.amount; newTxs.unshift(txRecord); }
    else if (data.type === 'zakat') { newBal -= data.amount; newZk.unshift({ date: new Date().toISOString(), amount: data.amount, recipient: data.recipient }); newTxs.unshift(txRecord); }
    txRecord.balanceAfter = newBal;
    setBalance(newBal); setHoldings(newHoldings); setTransactions(newTxs); setZakatHistory(newZk);
    persistUserData(newBal, newHoldings, newTxs, newZk);
    setModal(null); setIsScanning(false); setPendingTx(null);
  };

  const onScanComplete = () => { if (pendingTx) processTransaction(pendingTx); };
  const handleSellRequest = (data: any) => { setSelectedSellHolding(null); setPendingTrade(data); setShowTradingPin(true); };
  const initiateBuyStock = (symbol: string, amount: number) => {
    const stock = getStockBySymbol(symbol); if (!stock) return;
    setPendingTrade({ type: 'buy_stock', amount, symbol: stock.symbol, name: stock.name, units: amount / stock.price });
    setShowTradingPin(true);
  };
  const initiateSecureTransaction = (data: any) => { setPendingTrade(data); setShowTradingPin(true); };
  const handleTradingPinSuccess = () => {
    setShowTradingPin(false);
    if (pendingTrade) { handleTransactionSuccess(pendingTrade); setPendingTrade(null); }
  };
  const handleBuySukuk = (purchase: any) => initiateSecureTransaction(purchase);
  const handleZakatDonation = (amount: number, recipient: string) => initiateSecureTransaction({ type: 'zakat', amount, recipient, symbol: 'ZAKAT' });
  const handleHealthSave = (amount: number) => initiateSecureTransaction({ type: 'health_save', amount, symbol: 'HEALTH' });
  const handleOverseasInvest = (amount: number, asset: string) => initiateSecureTransaction({ type: 'overseas_invest', amount, name: asset, symbol: asset });
  const handleHajjDeposit = (amount: number) => initiateSecureTransaction({ type: 'buy_sukuk', amount, symbol: 'HAJJ' });
  const handleETFInvest = (amount: number, etf: string) => initiateSecureTransaction({ type: 'buy_sukuk', amount, symbol: etf });
  const handleKametiContribute = (amount: number) => initiateSecureTransaction({ type: 'buy_sukuk', amount, symbol: 'KAMETI' });
  const executeReset = () => {
    demoStorage.clear(); setCurrentUser(null); setIsAuthorized(false);
    setBalance(5000000); setHoldings([]); setTransactions([]); setZakatHistory([]);
    setShowResetModal(false); window.location.href = '/dashboard';
  };

  const filteredStocks = DEMO_STOCKS.filter(s => {
    const matchFilter = stockFilter === 'all' ? true : stockFilter === 'halal' ? s.compliant : !s.compliant;
    const matchSearch = s.name.toLowerCase().includes(stockSearch.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <>
      <ToastContainer />
      {showLangSelect && <LanguageSelect onSelect={handleLangSelect} />}
      {showOnboarding && !showLangSelect && <Onboarding lang={lang} onComplete={() => { setShowOnboarding(false); localStorage.setItem('roziq_onboarded', '1'); }} />}
      {!isAuthorized && !showLangSelect && !showOnboarding && <AuthGate onSuccess={handleAuthSuccess} />}
      {showTradingPin && <PinSecurity mode="trading" onSuccess={handleTradingPinSuccess} onCancel={() => { setShowTradingPin(false); setPendingTrade(null); }} />}

      {/* Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-sm rounded-2xl border border-white/10 p-6 text-center space-y-4" style={{ background: '#1a1a1a' }}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-2xl">🗑️</div>
            <h3 className="text-base font-bold text-white">{t('Reset All Demo Data?', 'کیا آپ تمام فرضی ڈیٹا ری سیٹ کرنا چاہتے ہیں؟')}</h3>
            <p className="text-sm text-slate-400">{t('This will delete your virtual balance and transaction history.', 'یہ آپ کا ورچوئل بیلنس اور ٹرانزیکشن ہسٹری ڈیلیٹ کر دے گا۔')}</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowResetModal(false)} className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-semibold text-white hover:bg-white/5 transition-colors">{t('Cancel', 'کینسل')}</button>
              <button onClick={executeReset} className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-500 transition-colors">{t('Delete All', 'ڈیلیٹ کریں')}</button>
            </div>
          </div>
        </div>
      )}

      {selectedReceipt && <DemoReceipt transaction={selectedReceipt} onClose={() => setSelectedReceipt(null)} lang={lang} />}
      <RoziqAI balance={balance} holdings={holdings} transactions={transactions} lang={lang} />

      {/* ── Main Shell ── */}
      <div
        className="min-h-screen flex"
        style={{ background: '#0d0d0d', color: '#fff' }}
        dir={lang === 'ur' ? 'rtl' : 'ltr'}
      >
        {/* ── Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-white/8 sticky top-0 h-screen overflow-y-auto" style={{ background: '#111' }}>
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5C4 1.5 1.5 4 1.5 7S4 12.5 7 12.5 12.5 10 12.5 7 10 1.5 7 1.5z" stroke="#000" strokeWidth="1.4"/>
                <circle cx="7" cy="7" r="2" fill="#000"/>
              </svg>
            </div>
            <span className="font-bold text-sm text-white">Roziq</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {NAV_ITEMS.map(item => {
              const isActive = activeTab === (item.id as DashboardTab);
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as DashboardTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-400' : ''}>{item.icon}</span>
                  <div className="min-w-0">
                    <div className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>
                      {lang === 'ur' ? item.labelUr : item.labelEn}
                    </div>
                    {isActive && <div className="text-xs text-slate-500 truncate">{item.sub}</div>}
                  </div>
                  {isActive && <div className="ml-auto w-1 h-5 rounded-full bg-emerald-500" />}
                </button>
              );
            })}
          </nav>

          {/* Zakat badge */}
          {isZakatEligible && (
            <div className="mx-3 mb-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
              <p className="text-xs font-semibold text-amber-400">{t('Zakat Due', 'زکوٰۃ واجب')}</p>
              <p className="text-xs text-amber-500/70 mt-0.5">{t('You are Nisab eligible', 'آپ نصاب کی شرط پوری کرتے ہیں')}</p>
            </div>
          )}

          {/* Reset */}
          <div className="px-3 pb-4">
            <button
              onClick={() => setShowResetModal(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              🗑️ {t('Delete Account & Demo Data', 'اکاؤنٹ ڈیلیٹ کریں')}
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex flex-1 flex-col min-w-0">

          {/* Demo banner */}
          <div className="px-4 pt-3 lg:px-6">
            <DemoModeBanner lang={lang} />
          </div>

          {/* ── Tab 1: Dashboard ── */}
          {activeTab === 'home' && (
            <main className="flex-1 px-4 py-5 lg:px-6 pb-32 lg:pb-8 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Dashboard</h1>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-400">Demo account</span>
                  <button onClick={() => setModal('deposit')} className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-emerald-400 transition-colors">
                    Add funds
                  </button>
                </div>
              </div>

              {/* Top cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Total wealth */}
                <div className="rounded-xl border border-white/8 p-5" style={{ background: '#1a1a1a' }}>
                  <p className="text-xs text-slate-500 mb-2">Total wealth</p>
                  <p className="text-2xl font-bold text-white mb-3">PKR {totalWealth.toLocaleString()}</p>
                  <div className="flex gap-1 mb-4">
                    <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${Math.min(100, (balance / totalWealth) * 100)}%` }} />
                    <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${Math.min(100, (totalPortfolioValue / totalWealth) * 70)}%` }} />
                    <div className="h-1.5 rounded-full bg-amber-500 flex-1" />
                    <div className="h-1.5 w-8 rounded-full bg-white/10" />
                  </div>
                  <div className="border-t border-white/5 pt-3">
                    <p className="text-xs font-semibold text-slate-400 mb-2">Recent activity</p>
                    {transactions.length === 0 ? (
                      <p className="text-xs text-slate-600">No activity yet.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {transactions.slice(0, 3).map(tx => (
                          <div key={tx.id} className="flex justify-between text-xs">
                            <span className="text-slate-300 font-medium">
                              {tx.type === 'buy_stock' ? `Bought ${tx.symbol}` : tx.type === 'deposit' ? 'Deposit' : tx.type === 'zakat' ? 'Zakat paid' : tx.type === 'sell_stock' ? `Sold ${tx.symbol}` : tx.type}
                            </span>
                            <span className={tx.type === 'deposit' ? 'text-emerald-400' : tx.type === 'buy_stock' ? 'text-slate-400' : 'text-slate-400'}>
                              {tx.type === 'deposit' ? '+' : '- '}{tx.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                        {holdings.length > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-300 font-medium">Dividend purified</span>
                            <span className="text-emerald-400">4.2%</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  {/* Zakat due */}
                  <div className="rounded-xl border border-white/8 p-5" style={{ background: '#1a1a1a' }}>
                    <p className="text-xs text-slate-500 mb-1">Zakat due</p>
                    <p className="text-2xl font-bold text-white">PKR {zakatDue.toLocaleString()}</p>
                    <p className="mt-1 text-xs font-semibold text-emerald-400">{isZakatEligible ? 'Above Nisab' : 'Below Nisab'}</p>
                  </div>

                  {/* Available cash */}
                  <div className="rounded-xl border border-white/5 p-5" style={{ background: '#f9f9f9' }}>
                    <p className="text-xs text-slate-500 mb-1">Available cash</p>
                    <p className="text-2xl font-bold text-slate-900">PKR {balance.toLocaleString()}</p>
                    <div className="mt-3 flex gap-4">
                      <button onClick={() => setModal('deposit')} className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline">Deposit</button>
                      <button onClick={() => setModal('withdraw')} className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline">Withdraw</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full portfolio chart + wealth summary */}
              {isPremium && <WaliAutopilot lang={lang} />}
              <PortfolioChart balance={balance} holdings={holdings} totalValue={totalPortfolioValue} />
              <DemoWealthSummary cash={balance} invested={totalPortfolioValue} pending={pendingDemoAmount} zakatDue={isZakatEligible} lang={lang} />
            </main>
          )}

          {/* ── Tab 2: Stocks ── */}
          {activeTab === 'portfolio' && (
            <main className="flex-1 px-4 py-5 lg:px-6 pb-32 lg:pb-8 space-y-5">
              <h1 className="text-xl font-bold text-white">Halal stocks</h1>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 flex-1 min-w-[180px]">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-slate-500 flex-shrink-0">
                    <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input
                    value={stockSearch}
                    onChange={e => setStockSearch(e.target.value)}
                    placeholder="Search"
                    className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
                  />
                </div>
                <div className="flex gap-1 rounded-full bg-white/8 p-1">
                  {(['all', 'halal', 'excluded'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setStockFilter(f)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                        stockFilter === f ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {f === 'all' ? 'All' : f === 'halal' ? 'Halal' : 'Excluded'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: '#1a1a1a' }}>
                <div className="grid grid-cols-6 gap-2 px-4 py-3 border-b border-white/5 text-xs font-medium text-slate-500 uppercase tracking-wide">
                  <span className="col-span-2">Company</span>
                  <span className="text-right">Price</span>
                  <span className="text-right">Change</span>
                  <span className="text-right">Debt</span>
                  <span className="text-right">Impure</span>
                </div>
                <div>
                  {filteredStocks.map(s => (
                    <div key={s.name} className="grid grid-cols-6 gap-2 items-center px-4 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                      <div className="col-span-2 flex items-center justify-between pr-2">
                        <span className="text-sm font-medium text-white">{s.name}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.compliant ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                          {s.compliant ? 'Compliant' : 'Excluded'}
                        </span>
                      </div>
                      <span className="text-sm text-slate-300 text-right">{s.price.toFixed(2)}</span>
                      <span className={`text-sm text-right font-medium ${s.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{s.change}</span>
                      <span className="text-sm text-slate-400 text-right">{s.debt}</span>
                      <span className="text-sm text-slate-400 text-right">{s.impure}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full scanner below */}
              <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: '#1a1a1a' }}>
                <div className="px-4 py-3 border-b border-white/5">
                  <h3 className="text-sm font-semibold text-white">Trade stocks</h3>
                </div>
                <div className="p-4">
                  <HalalStockScanner balance={balance} onBuy={initiateBuyStock} />
                </div>
              </div>
              <PortfolioDashboard holdings={holdings} totalValue={totalPortfolioValue} dailyPnl={dailyPnl} onSell={setSelectedSellHolding} />
            </main>
          )}

          {/* ── Tab 3: Sukuk and assets ── */}
          {activeTab === 'assets' && (
            <main className="flex-1 px-4 py-5 lg:px-6 pb-32 lg:pb-8 space-y-5">
              <h1 className="text-xl font-bold text-white">Sukuk and assets</h1>

              {/* 3-col overview cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: '🏛️', title: 'Sovereign Sukuk', desc: 'Asset-backed infrastructure', progress: 62, color: 'bg-emerald-500', cta: 'Invest' },
                  { icon: '🕌', title: 'Hajj savings', desc: 'Save toward your goal', progress: 28, color: 'bg-blue-500', cta: 'Start saving' },
                  { icon: '🌾', title: 'Agri finance', desc: "Bay' Al-Salam contracts", progress: 45, color: 'bg-amber-500', cta: 'View contracts' },
                ].map(({ icon, title, desc, progress, color, cta }) => (
                  <div key={title} className="flex flex-col rounded-xl border border-white/8 p-5" style={{ background: '#1a1a1a' }}>
                    <span className="mb-3 text-2xl">{icon}</span>
                    <h3 className="mb-1 text-sm font-semibold text-white">{title}</h3>
                    <p className="mb-3 text-xs text-slate-500 flex-1">{desc}</p>
                    <div className="mb-3 h-1 rounded-full bg-white/10">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${progress}%` }} />
                    </div>
                    <button className="w-full rounded-lg border border-white/15 py-2 text-xs font-semibold text-white hover:bg-white/8 transition-colors">{cta}</button>
                  </div>
                ))}
              </div>

              {/* Full components */}
              {currentUser?.isOverseas && (
                <OverseasInvest balance={balance} onInvest={handleOverseasInvest} lang={lang} cnic={currentUser.cnic} country={currentUser.country} />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                <HajjVault onDeposit={handleHajjDeposit} />
                <AgriFinancing balance={balance} onInvest={amount => initiateSecureTransaction({ type: 'buy_sukuk', amount, symbol: 'AGRI' })} />
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
              <h1 className="text-xl font-bold text-white">Family and Takaful</h1>

              {/* Overview row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kameti circle */}
                <div className="rounded-xl border border-white/8 p-5" style={{ background: '#1a1a1a' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white">Kameti circle</h3>
                    <span className="text-xs text-slate-500">Monthly</span>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { initial: 'A', name: 'Ahmed', status: 'Paid', color: 'bg-emerald-600' },
                      { initial: 'S', name: 'Sana', status: 'Paid', color: 'bg-blue-600' },
                      { initial: 'B', name: 'Bilal', status: 'Due soon', color: 'bg-amber-600' },
                    ].map(({ initial, name, status, color }) => (
                      <div key={name} className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${color} text-xs font-bold text-white`}>{initial}</div>
                        <span className="flex-1 text-sm text-white">{name}</span>
                        <span className={`text-xs font-semibold ${status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>{status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  {/* Next payout */}
                  <div className="rounded-xl border border-white/5 p-5" style={{ background: '#f9f9f9' }}>
                    <p className="text-xs text-slate-500 mb-1">Next payout</p>
                    <p className="text-2xl font-bold text-slate-900">PKR 250,000</p>
                    <p className="text-xs text-slate-500 mt-1">Sana, in 12 days</p>
                  </div>
                  {/* Takaful pool */}
                  <div className="rounded-xl border border-white/8 p-5" style={{ background: '#1a1a1a' }}>
                    <p className="text-sm font-semibold text-white">Takaful pool</p>
                    <p className="text-xs text-slate-500 mt-1">Family health cover active</p>
                  </div>
                </div>
              </div>

              {/* Full components */}
              <FamilyHealthSaving balance={balance} onSave={handleHealthSave} lang={lang} cnic={currentUser?.cnic} />
              <DigitalCommittee onContribute={handleKametiContribute} />
              <WirasatCalculator />
            </main>
          )}

          {/* ── Tab 5: Zakat ── */}
          {activeTab === 'zakat' && (
            <main className="flex-1 px-4 py-5 lg:px-6 pb-32 lg:pb-8 space-y-5">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Zakat and impact</h1>
                <button
                  onClick={() => handleZakatDonation(zakatDue, 'Zakat Fund')}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors"
                >
                  Pay Zakat
                </button>
              </div>

              {/* Overview cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Zakat due */}
                <div className="rounded-xl border border-white/8 p-5" style={{ background: '#1a1a1a' }}>
                  <p className="text-xs text-slate-500 mb-1">Zakat due</p>
                  <p className="text-2xl font-bold text-white">PKR {zakatDue.toLocaleString()}</p>
                  <p className="mt-1 text-xs font-semibold text-emerald-400">{isZakatEligible ? 'Above Nisab' : 'Below Nisab'}</p>
                </div>

                {/* Nisab threshold */}
                <div className="rounded-xl border border-white/8 p-5" style={{ background: '#1a1a1a' }}>
                  <p className="text-xs text-slate-500 mb-3">Nisab threshold</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-white">Gold</span>
                      <span className="text-xs text-emerald-400">Live price</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-white">Silver</span>
                      <span className="text-xs text-emerald-400">Live price</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charity receipts */}
              <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: '#1a1a1a' }}>
                <div className="px-5 py-3 border-b border-white/5">
                  <h3 className="text-sm font-semibold text-white">Charity receipts</h3>
                </div>
                <div className="divide-y divide-white/5">
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-sm text-white">Dividend purification</span>
                    <span className="text-sm text-slate-300">PKR 1,240</span>
                  </div>
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-sm text-white">Zakat payment</span>
                    <span className="text-xs text-emerald-400 font-medium">Receipt ready</span>
                  </div>
                </div>
              </div>

              {/* Full components */}
              <ZakatDistribution balance={balance} portfolioValue={totalPortfolioValue} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                <PurificationTracker onPurify={amount => handleZakatDonation(amount, 'Dividend Purification')} />
                <FinancialHealthScore balance={balance} portfolioValue={totalPortfolioValue} holdings={holdings} transactions={transactions} zakatHistory={zakatHistory} isZakatEligible={isZakatEligible} />
              </div>
            </main>
          )}

          {/* ── Tab 6: Settings ── */}
          {activeTab === 'settings' && (
            <main className="flex-1 px-4 py-5 lg:px-6 pb-32 lg:pb-8 space-y-5">
              <h1 className="text-xl font-bold text-white">Settings</h1>

              {/* Settings card */}
              <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: '#1a1a1a' }}>

                {/* Account type */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                  <div>
                    <p className="text-sm font-semibold text-white">Account type</p>
                    <p className="text-xs text-slate-500 mt-0.5">Switch between demo and real</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                    <button className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition-colors">
                      Demo
                    </button>
                    <button
                      className="rounded-full px-4 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                      onClick={() => alert('Real accounts opening soon. Join the waitlist from the landing page.')}
                    >
                      Real
                    </button>
                  </div>
                </div>

                {/* Language */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                  <p className="text-sm font-semibold text-white">Language</p>
                  <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                    <button
                      onClick={() => handleLangChange('en')}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                        lang === 'en' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleLangChange('ur')}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                        lang === 'ur' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      اردو
                    </button>
                  </div>
                </div>

                {/* Security PIN */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                  <p className="text-sm font-semibold text-white">Security PIN</p>
                  <button
                    onClick={() => setIsAuthorized(false)}
                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    Change
                  </button>
                </div>

                {/* Delete account */}
                <button
                  onClick={() => setShowResetModal(true)}
                  className="flex w-full items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors group"
                >
                  <span className="text-sm font-semibold text-red-400 group-hover:text-red-300 transition-colors">
                    Delete account and data
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-red-400 group-hover:text-red-300 transition-colors">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Premium eligibility info (hidden detail) */}
              {isPremium && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
                  <p className="text-sm font-semibold text-emerald-400">Elite account active</p>
                  <p className="text-xs text-slate-500 mt-0.5">Wali Autopilot and advanced features unlocked.</p>
                </div>
              )}
            </main>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {modal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-white/10 p-5 shadow-2xl" style={{ background: '#1a1a1a' }}>
            <button onClick={() => setModal(null)} className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors">✕</button>
            {modal === 'deposit' ? <DepositFlow onSuccess={handleTransactionSuccess} /> : <WithdrawFlow onSuccess={handleTransactionSuccess} />}
          </div>
        </div>
      )}

      {selectedSellHolding && (
        <div className="fixed inset-0 z-[65] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-white/10 p-5" style={{ background: '#1a1a1a' }}>
            <SellStockFlow holding={selectedSellHolding} onSuccess={handleSellRequest} onCancel={() => setSelectedSellHolding(null)} />
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Nav ── */}
      <div className="mobile-bottom-nav fixed left-1/2 -translate-x-1/2 w-[95%] max-w-md z-50 block lg:hidden">
        <nav className="rounded-2xl border border-white/10 p-1.5 flex justify-between items-center shadow-2xl" style={{ background: 'rgba(17,17,17,0.97)', backdropFilter: 'blur(20px)' }}>
          {NAV_ITEMS.filter(n => n.id !== 'settings').map(item => {
            const isActive = activeTab === (item.id as DashboardTab);
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as DashboardTab)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all ${
                  isActive ? 'bg-emerald-500/15 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className={isActive ? 'text-emerald-400' : ''}>{item.icon}</span>
                <span className="text-xs font-medium">{lang === 'ur' ? item.labelUr : item.labelEn}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <SovereignScan isOpen={isScanning} onComplete={onScanComplete} />
    </>
  );
}
