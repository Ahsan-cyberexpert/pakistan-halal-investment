'use client';
import { useState, useEffect } from 'react';
import {
  DepositFlow,
  WithdrawFlow,
  HalalStockScanner,
  PortfolioDashboard,
  WirasatCalculator,
  SovereignScan,
  AuthGate,
  ToastContainer,
  DemoReceipt,
  SellStockFlow,
  PinSecurity,
  LanguageSelect,
  Onboarding,
} from '@/components';
import { UserProfile, Holding, ZakatRecord, Transaction, DashboardTab, SupportedLanguage } from '@/types';
import { getStockBySymbol } from '@/lib/halal-stock-data';
import { ZAKAT_NISAB_PKR } from '@/lib/constants';
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
    sub: 'Asset-Backed Sukuk',
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
    sub: 'Kameti & Inheritance',
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
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 5v8M6.5 7.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'mufti',
    labelEn: 'AI Mufti',
    labelUr: 'مفتی اے آئی',
    sub: 'Urdu & English Q&A',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
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

// ─── Screened Stocks Data matching Reference Image 7 ─────────────────────────
const DEMO_STOCKS = [
  { name: 'Meezan Bank', symbol: 'MEBL', code: 'MB', score: '9.8', compliant: true, price: 145.0, change: '+1.47%', debt: '0.0%', impure: '0.0%' },
  { name: 'Systems Limited', symbol: 'SYS', code: 'SL', score: '9.5', compliant: true, price: 415.0, change: '+1.10%', debt: '4.5%', impure: '0.8%' },
  { name: 'Habib Bank', symbol: 'HBL', code: 'HB', score: '2.1', compliant: false, price: 92.1, change: '-1.60%', debt: '45.0%', impure: '28.5%' },
  { name: 'Lucky Cement', symbol: 'LUCK', code: 'LC', score: '8.7', compliant: true, price: 411.5, change: '-1.50%', debt: '18.5%', impure: '2.1%' },
  { name: 'Engro Corp', symbol: 'ENGRO', code: 'EC', score: '7.4', compliant: true, price: 312.8, change: '+1.00%', debt: '22.4%', impure: '4.2%' },
  { name: 'MCB Bank', symbol: 'MCB', code: 'MC', score: '2.8', compliant: false, price: 182.4, change: '-2.10%', debt: '52.0%', impure: '34.2%' },
];

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [balance, setBalance] = useState(62500);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: 'deposit',
      amount: 100000,
      name: 'Deposit via Raast',
      symbol: 'Cash',
      status: 'SUCCESS',
      date: new Date().toISOString(),
      reference: 'RST-882194',
      isDemo: true,
      receiptVersion: 1,
    },
    {
      id: 2,
      type: 'buy_stock',
      amount: 50000,
      name: 'Bought Meezan Bank',
      symbol: 'MEBL',
      status: 'SUCCESS',
      date: new Date().toISOString(),
      reference: 'STK-442109',
      isDemo: true,
      receiptVersion: 1,
    },
    {
      id: 3,
      type: 'buy_stock',
      amount: 200000,
      name: 'Bought Systems Limited',
      symbol: 'SYS',
      status: 'SUCCESS',
      date: new Date().toISOString(),
      reference: 'STK-442110',
      isDemo: true,
      receiptVersion: 1,
    },
  ]);
  const [modal, setModal] = useState<'deposit' | 'withdraw' | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([
    {
      symbol: 'MEBL',
      name: 'Meezan Bank',
      invested: 50000,
      currentPrice: 145.0,
      units: 345,
      pnl: 2460,
    },
    {
      symbol: 'SYS',
      name: 'Systems Limited',
      invested: 200000,
      currentPrice: 415.0,
      units: 482,
      pnl: 9840,
    },
  ]);
  const [zakatHistory, setZakatHistory] = useState<ZakatRecord[]>([]);
  const [activeTab, setActiveTab] = useState<DashboardTab>('home');
  const [lang, setLangState] = useState<SupportedLanguage>('en');
  const [showLangSelect, setShowLangSelect] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [showTradingPin, setShowTradingPin] = useState(false);
  const [pendingTrade, setPendingTrade] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [pendingTx, setPendingTx] = useState<any>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);
  const [selectedSellHolding, setSelectedSellHolding] = useState<Holding | null>(null);

  // Filter & subtab states for new panels
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');
  const [stockFilter, setStockFilter] = useState<'all' | 'halal' | 'excluded'>('all');
  const [sukukFilter, setSukukFilter] = useState<'all' | 'govt' | 'corp'>('all');
  const [familySubTab, setFamilySubTab] = useState<'kameti' | 'inheritance'>('kameti');

  // AI Mufti Interactive Chat State matching Image 2
  const [muftiMessages, setMuftiMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'user', text: 'Is Systems Limited halal to invest in?' },
    { role: 'assistant', text: 'Systems Limited scores 9.5 in the Roziq Shariah screener and is marked Compliant.' },
    { role: 'user', text: 'How does dividend purification work?' },
    { role: 'assistant', text: 'Impure income is limited to 5%, and that share of your dividends is purified through charity.' },
  ]);
  const [muftiInput, setMuftiInput] = useState('');

  // Zakat Calculator Inputs matching Image 5
  const [zakatSavings, setZakatSavings] = useState(62500);
  const [zakatInvestments, setZakatInvestments] = useState(250000);
  const [zakatGoldTola, setZakatGoldTola] = useState(0);
  const [zakatSilverTola, setZakatSilverTola] = useState(0);
  const [zakatLiabilities, setZakatLiabilities] = useState(0);

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
    const initialTheme = savedTheme || 'light';
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
          name: 'Ahsan Khan',
          cnic: '4210100000001',
          mobile: '03000000000',
          location: 'Karachi, Sindh (Verified)',
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
      setBalance(62500);
      localStorage.setItem(`roziq_balance_${cnicKey}`, '62500');
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
  const totalWealth = balance + totalPortfolioValue;
  const isZakatEligible = totalWealth >= ZAKAT_NISAB_PKR;
  const zakatDue = isZakatEligible ? Math.round(totalWealth * 0.025) : 7812;

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
      note: data.note || 'Verified transaction. Assets settled.',
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
  const handleKametiContribute = (amount: number) => initiateSecureTransaction({ type: 'buy_sukuk', amount, symbol: 'KAMETI' });

  const executeReset = () => {
    demoStorage.clear();
    setCurrentUser(null);
    setIsAuthorized(false);
    setBalance(62500);
    setHoldings([]);
    setTransactions([]);
    setZakatHistory([]);
    setShowResetModal(false);
    window.location.href = '/dashboard';
  };

  const handleSendMuftiMessage = (query?: string) => {
    const textToSend = query || muftiInput;
    if (!textToSend.trim()) return;
    const newMsgs = [...muftiMessages, { role: 'user' as const, text: textToSend }];
    setMuftiMessages(newMsgs);
    setMuftiInput('');
    // Contextual Shariah response
    setTimeout(() => {
      let reply = 'All assets are screened under AAOIFI Shariah Standard No. 21 guidelines.';
      const lower = textToSend.toLowerCase();
      if (lower.includes('meezan')) {
        reply = 'Meezan Bank scores 9.8 in our Shariah screener with 0.0% non-compliant debt and is marked Compliant.';
      } else if (lower.includes('gold')) {
        reply = 'Zakat on gold is 2.5% once your holdings reach or exceed the Nisab threshold of 7.5 tolas (87.48 grams).';
      } else if (lower.includes('sukuk')) {
        reply = 'Sukuk represent undivided shares in tangible assets and usufruct, yielding profit rather than debt interest.';
      }
      setMuftiMessages([...newMsgs, { role: 'assistant' as const, text: reply }]);
    }, 400);
  };

  const filteredStocks = DEMO_STOCKS.filter((s) => {
    const matchFilter = stockFilter === 'all' ? true : stockFilter === 'halal' ? s.compliant : !s.compliant;
    return matchFilter;
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

      {/* Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[20px] border border-[#E3ECE7] dark:border-white/10 p-6 text-center space-y-4 bg-white dark:bg-[#16171b] shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#0B1F17] dark:text-white">
              {t('Reset Account Data?', 'کیا آپ تمام ڈیٹا ری سیٹ کرنا چاہتے ہیں؟')}
            </h3>
            <p className="text-xs text-[#55695F] dark:text-slate-400 leading-relaxed">
              {t(
                'This will permanently reset your cash balance, holdings, and transaction history.',
                'یہ آپ کا بیلنس اور ٹرانزیکشن ہسٹری ڈیلیٹ کر دے گا۔'
              )}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 rounded-[14px] border border-[#E3ECE7] dark:border-white/10 py-2.5 text-xs font-semibold text-[#0B1F17] dark:text-slate-300 hover:bg-slate-50 transition-colors"
              >
                {t('Cancel', 'کینسل')}
              </button>
              <button
                onClick={executeReset}
                className="flex-1 rounded-[14px] bg-[#B42318] py-2.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors shadow-sm"
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

      {/* ── Main Shell with Roziq Canvas Background (#F4F7F5) ── */}
      <div
        className="min-h-screen flex bg-[#F4F7F5] dark:bg-[#0a0a0c] text-[#0B1F17] dark:text-white transition-colors duration-200"
        dir={lang === 'ur' ? 'rtl' : 'ltr'}
      >
        {/* ── Sidebar (Desktop - Exact Match to Image 1) ── */}
        <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r border-[#E3ECE7] dark:border-white/10 sticky top-0 h-screen overflow-y-auto bg-white dark:bg-[#111215]">
          {/* Logo row */}
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#047857] text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#0B1F17] dark:text-white">Roziq</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FEF3C7] dark:bg-amber-500/10 text-[#92400E] dark:text-amber-400 border border-[#FDE68A] dark:border-amber-500/20">
              Demo
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 space-y-1">
            {NAV_ITEMS.filter((item) => item.id !== 'settings').map((item) => {
              const isActive = activeTab === (item.id as DashboardTab);
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as DashboardTab)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[14px] text-left transition-all duration-150 ${
                    isActive
                      ? 'bg-[#D1FAE5] dark:bg-emerald-500/20 text-[#047857] dark:text-emerald-400 font-bold'
                      : 'text-[#55695F] dark:text-slate-400 hover:text-[#0B1F17] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5 font-medium'
                  }`}
                >
                  <span className={isActive ? 'text-[#047857] dark:text-emerald-400' : 'text-[#55695F] dark:text-slate-400'}>
                    {item.icon}
                  </span>
                  <span className="text-sm">
                    {lang === 'ur' ? item.labelUr : item.labelEn}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Settings & Reset */}
          <div className="px-3 pb-6 pt-3 space-y-2 border-t border-[#E3ECE7] dark:border-white/5">
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-[14px] text-left transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#D1FAE5] dark:bg-emerald-500/20 text-[#047857] dark:text-emerald-400 font-bold'
                  : 'text-[#55695F] dark:text-slate-400 hover:text-[#0B1F17] dark:hover:text-white hover:bg-slate-100/70 font-medium'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M3.7 14.3l1.4-1.4M12.9 5.1l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-sm">{lang === 'ur' ? 'سیٹنگز' : 'Settings'}</span>
            </button>

            <button
              onClick={() => setShowResetModal(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 py-2.5 text-xs font-semibold text-[#0B1F17] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-xs"
            >
              {t('Reset Account Data', 'ڈیٹا ری سیٹ کریں')}
            </button>
          </div>
        </aside>

        {/* ── Main Content Area ── */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Top Bar for Desktop/Mobile controls */}
          <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#E3ECE7] dark:border-white/10 bg-[#F4F7F5]/90 dark:bg-[#0a0a0c]/90 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <span className="lg:hidden flex h-7 w-7 items-center justify-center rounded-full bg-[#047857] text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              </span>
              <span className="text-base font-extrabold text-[#0B1F17] dark:text-white capitalize lg:hidden">
                {activeTab === 'home'
                  ? 'Dashboard'
                  : activeTab === 'portfolio'
                  ? 'Stocks'
                  : activeTab === 'assets'
                  ? 'Sukuk'
                  : activeTab === 'kameti'
                  ? 'Family'
                  : activeTab === 'zakat'
                  ? 'Zakat'
                  : activeTab === 'mufti'
                  ? 'AI Mufti'
                  : 'Settings'}
              </span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Theme Toggle Button (Sun / Moon SVG) */}
              <button
                onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className="flex items-center justify-center h-8 w-8 rounded-full border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-[#55695F] dark:text-slate-300 hover:text-[#0B1F17] dark:hover:text-white transition-colors"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
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
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>

              {/* Language pill toggle */}
              <button
                onClick={() => handleLangChange(lang === 'en' ? 'ur' : 'en')}
                className="px-3 py-1 text-xs font-semibold rounded-full border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-[#0B1F17] dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-xs"
              >
                {lang === 'en' ? 'اردو' : 'EN'}
              </button>
            </div>
          </header>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 1: DASHBOARD (Exact Match to Image 1 Desktop & Image 6 Mobile) */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'home' && (
            <main className="flex-1 px-4 sm:px-6 py-6 pb-28 lg:pb-10 max-w-7xl w-full mx-auto space-y-6">
              {/* Header Row */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl lg:text-[28px] font-extrabold tracking-tight text-[#0B1F17] dark:text-white">
                    Dashboard
                  </h1>
                  <p className="text-xs text-[#55695F] dark:text-slate-400 mt-0.5">
                    Overview of wealth and portfolio performance
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setModal('deposit')}
                    className="hidden sm:inline-flex rounded-[14px] bg-[#047857] hover:bg-[#064E3B] px-4 py-2 text-xs font-bold text-white transition-all shadow-xs"
                  >
                    Add funds
                  </button>
                </div>
              </div>

              {/* ── MOBILE SPECIFIC LAYOUT (Image 6) ── */}
              <div className="block lg:hidden space-y-4">
                {/* Total Wealth Display */}
                <div>
                  <p className="text-xs font-bold text-[#55695F] dark:text-slate-400 uppercase tracking-wider">
                    TOTAL WEALTH
                  </p>
                  <p className="text-3xl font-extrabold text-[#0B1F17] dark:text-white tracking-tight mt-1 tabular-nums">
                    PKR 312,500
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1 bg-[#D1FAE5] dark:bg-emerald-500/20 text-[#047857] dark:text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    <span>▲</span>
                    <span>PKR 12,300 (+4.10%)</span>
                  </div>
                </div>

                {/* Mobile Wave Chart */}
                <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 p-4 shadow-xs">
                  <div className="w-full h-36">
                    <svg viewBox="0 0 500 140" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="mobileGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#047857" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#047857" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0,110 C 60,105 100,75 160,80 C 220,85 260,50 320,45 C 380,40 420,55 460,35 C 480,25 490,20 500,10 L 500,140 L 0,140 Z"
                        fill="url(#mobileGrad)"
                      />
                      <path
                        d="M 0,110 C 60,105 100,75 160,80 C 220,85 260,50 320,45 C 380,40 420,55 460,35 C 480,25 490,20 500,10"
                        fill="none"
                        stroke="#047857"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Timeframe selector */}
                  <div className="flex justify-center items-center gap-2 mt-2 pt-2 border-t border-[#E3ECE7]/50 dark:border-white/5">
                    {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                          timeframe === tf
                            ? 'bg-[#064E3B] text-white shadow-xs'
                            : 'text-[#55695F] dark:text-slate-400 hover:text-[#0B1F17]'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3-Column Stats Card (Image 6) */}
                <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 p-4 grid grid-cols-3 divide-x divide-[#E3ECE7] dark:divide-white/10 text-center shadow-xs">
                  <div>
                    <p className="text-[11px] font-bold text-[#55695F] dark:text-slate-400 uppercase">CASH</p>
                    <p className="text-base font-extrabold text-[#0B1F17] dark:text-white mt-0.5 tabular-nums">62,500</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#55695F] dark:text-slate-400 uppercase">INVESTED</p>
                    <p className="text-base font-extrabold text-[#0B1F17] dark:text-white mt-0.5 tabular-nums">250,000</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#55695F] dark:text-slate-400 uppercase">P&amp;L</p>
                    <p className="text-base font-extrabold text-[#047857] dark:text-emerald-400 mt-0.5 tabular-nums">+12,300</p>
                  </div>
                </div>

                {/* Action Buttons: Deposit & Withdraw */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setModal('deposit')}
                    className="py-3 bg-[#047857] hover:bg-[#064E3B] text-white font-bold rounded-[14px] text-center text-sm shadow-sm active:scale-98 transition-all"
                  >
                    Deposit
                  </button>
                  <button
                    onClick={() => setModal('withdraw')}
                    className="py-3 bg-white dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 hover:bg-slate-50 text-[#0B1F17] dark:text-white font-semibold rounded-[14px] text-center text-sm shadow-xs active:scale-98 transition-all"
                  >
                    Withdraw
                  </button>
                </div>

                {/* Zakat Due Card with Chevron */}
                <div
                  onClick={() => setActiveTab('zakat')}
                  className="rounded-[20px] bg-[#FEF3C7] dark:bg-amber-950/40 border border-[#FDE68A] dark:border-amber-800/40 p-4 flex items-center justify-between shadow-xs cursor-pointer active:scale-98 transition-all"
                >
                  <div>
                    <p className="text-[11px] font-bold text-[#92400E] dark:text-amber-400 uppercase tracking-wider">
                      ZAKAT DUE
                    </p>
                    <p className="text-2xl font-extrabold text-[#92400E] dark:text-amber-400 mt-0.5 tabular-nums">
                      PKR {zakatDue.toLocaleString()}
                    </p>
                    <p className="text-xs text-[#92400E]/80 dark:text-amber-400/80 mt-0.5">
                      2.5% of eligible wealth
                    </p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>

                {/* Recent Activity Card */}
                <div className="space-y-2 pt-1">
                  <h3 className="text-sm font-bold text-[#0B1F17] dark:text-white">Recent activity</h3>
                  <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 divide-y divide-[#E3ECE7] dark:divide-white/10 shadow-xs overflow-hidden">
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-[#0B1F17] dark:text-white">Deposit via Raast</p>
                        <p className="text-xs text-[#55695F] dark:text-slate-400">Cash</p>
                      </div>
                      <span className="text-sm font-bold text-[#047857] dark:text-emerald-400 tabular-nums">
                        +100,000
                      </span>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-[#0B1F17] dark:text-white">Bought Meezan Bank</p>
                        <p className="text-xs text-[#55695F] dark:text-slate-400">Compliant</p>
                      </div>
                      <span className="text-sm font-bold text-[#0B1F17] dark:text-white tabular-nums">
                        -50,000
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── DESKTOP SPECIFIC LAYOUT (Exact Match to Image 1) ── */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-5">
                {/* Left Column (col-span-7) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Total Wealth & Smooth Chart Card */}
                  <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 p-6 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#55695F] dark:text-slate-400 uppercase tracking-wider">
                          TOTAL WEALTH
                        </p>
                        <p className="text-[36px] leading-tight font-extrabold text-[#0B1F17] dark:text-white tracking-tight mt-1 tabular-nums">
                          PKR 312,500
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1 bg-[#D1FAE5] dark:bg-emerald-500/20 text-[#047857] dark:text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          <span>▲</span>
                          <span>PKR 12,300 (+4.10%)</span>
                        </div>
                      </div>

                      {/* Timeframe pill selector */}
                      <div className="flex items-center gap-1">
                        {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
                          <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                              timeframe === tf
                                ? 'bg-[#064E3B] text-white shadow-xs'
                                : 'text-[#55695F] dark:text-slate-400 hover:text-[#0B1F17]'
                            }`}
                          >
                            {tf}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Smooth Wave Area Chart */}
                    <div className="w-full h-44 mt-6">
                      <svg viewBox="0 0 600 160" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="desktopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#047857" stopOpacity="0.22" />
                            <stop offset="100%" stopColor="#047857" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0,130 C 80,125 130,85 200,90 C 270,95 310,55 380,50 C 450,45 500,60 550,40 C 570,30 585,25 600,15 L 600,160 L 0,160 Z"
                          fill="url(#desktopGrad)"
                        />
                        <path
                          d="M 0,130 C 80,125 130,85 200,90 C 270,95 310,55 380,50 C 450,45 500,60 550,40 C 570,30 585,25 600,15"
                          fill="none"
                          stroke="#047857"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Financial summary Card */}
                  <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 p-6 shadow-xs">
                    <h3 className="text-lg font-bold text-[#0B1F17] dark:text-white">Financial summary</h3>
                    <p className="text-xs text-[#55695F] dark:text-slate-400 mt-0.5 mb-4">
                      Asset allocation and liquidity overview
                    </p>

                    {/* Allocation progress bar */}
                    <div className="h-2.5 rounded-full overflow-hidden flex bg-[#E3ECE7] dark:bg-white/10 mb-5">
                      <div className="bg-[#047857] h-full" style={{ width: '80%' }} />
                      <div className="bg-[#34D399] h-full" style={{ width: '20%' }} />
                    </div>

                    {/* Breakdown items */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-[#34D399]" />
                          <span className="text-[#0B1F17] dark:text-slate-200 font-medium">Available cash</span>
                        </div>
                        <span className="font-bold text-[#0B1F17] dark:text-white tabular-nums">PKR 62,500</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-[#047857]" />
                          <span className="text-[#0B1F17] dark:text-slate-200 font-medium">Invested value</span>
                        </div>
                        <span className="font-bold text-[#0B1F17] dark:text-white tabular-nums">PKR 250,000</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-[#94A3B8]" />
                          <span className="text-[#55695F] dark:text-slate-400 font-medium">Pending settlement</span>
                        </div>
                        <span className="font-bold text-[#55695F] dark:text-slate-400 tabular-nums">PKR 0</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column (col-span-5) */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Zakat Due Card */}
                  <div className="rounded-[20px] bg-[#FEF3C7] dark:bg-amber-950/40 border border-[#FDE68A] dark:border-amber-800/40 p-6 shadow-xs">
                    <p className="text-xs font-bold text-[#92400E] dark:text-amber-400 uppercase tracking-wider">
                      ZAKAT DUE
                    </p>
                    <p className="text-[28px] leading-tight font-extrabold text-[#92400E] dark:text-amber-400 mt-1 tabular-nums">
                      PKR {zakatDue.toLocaleString()}
                    </p>
                    <p className="text-xs text-[#92400E]/90 dark:text-amber-400/90 mt-1">
                      2.5% of eligible wealth · Above Nisab
                    </p>
                  </div>

                  {/* Available Cash Card with Deposit/Withdraw buttons */}
                  <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 p-6 shadow-xs">
                    <p className="text-xs font-bold text-[#55695F] dark:text-slate-400 uppercase tracking-wider">
                      AVAILABLE CASH
                    </p>
                    <p className="text-[28px] leading-tight font-extrabold text-[#0B1F17] dark:text-white mt-1 tabular-nums">
                      PKR 62,500
                    </p>
                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={() => setModal('deposit')}
                        className="flex-1 py-2.5 bg-[#047857] hover:bg-[#064E3B] text-white font-bold rounded-[14px] text-center text-sm shadow-xs transition-all"
                      >
                        Deposit
                      </button>
                      <button
                        onClick={() => setModal('withdraw')}
                        className="flex-1 py-2.5 bg-white dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 hover:bg-slate-50 text-[#0B1F17] dark:text-white font-semibold rounded-[14px] text-center text-sm shadow-xs transition-all"
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity Card */}
                  <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 p-6 shadow-xs">
                    <h3 className="text-lg font-bold text-[#0B1F17] dark:text-white mb-4">Recent activity</h3>
                    <div className="divide-y divide-[#E3ECE7] dark:divide-white/10">
                      <div className="py-3 first:pt-0 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-[#0B1F17] dark:text-white">Deposit via Raast</p>
                          <p className="text-xs text-[#55695F] dark:text-slate-400">Cash</p>
                        </div>
                        <span className="text-sm font-bold text-[#047857] dark:text-emerald-400 tabular-nums">
                          +100,000
                        </span>
                      </div>

                      <div className="py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-[#0B1F17] dark:text-white">Bought Meezan Bank</p>
                          <p className="text-xs text-[#55695F] dark:text-slate-400">Compliant</p>
                        </div>
                        <span className="text-sm font-bold text-[#0B1F17] dark:text-white tabular-nums">
                          -50,000
                        </span>
                      </div>

                      <div className="py-3 last:pb-0 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-[#0B1F17] dark:text-white">Bought Systems Limited</p>
                          <p className="text-xs text-[#55695F] dark:text-slate-400">Compliant</p>
                        </div>
                        <span className="text-sm font-bold text-[#0B1F17] dark:text-white tabular-nums">
                          -200,000
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 2: STOCKS (Exact Match to Image 7 Mobile & Extended Web)  */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'portfolio' && (
            <main className="flex-1 px-4 sm:px-6 py-6 pb-28 lg:pb-10 max-w-4xl w-full mx-auto space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl lg:text-[28px] font-extrabold tracking-tight text-[#0B1F17] dark:text-white">
                    Stocks
                  </h1>
                  <p className="text-xs text-[#55695F] dark:text-slate-400 mt-0.5">
                    Screened Pakistan Stock Exchange equities
                  </p>
                </div>
                <button
                  onClick={() => handleLangChange(lang === 'en' ? 'ur' : 'en')}
                  className="px-3.5 py-1 text-xs font-semibold rounded-full border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-[#0B1F17] dark:text-white"
                >
                  اردو
                </button>
              </div>

              {/* 3 Metric Cards in a Row (Image 7) */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 p-4 text-center shadow-xs">
                  <p className="text-2xl font-extrabold text-[#047857] dark:text-emerald-400">33%</p>
                  <p className="text-xs text-[#55695F] dark:text-slate-400 mt-0.5 font-medium">Debt limit</p>
                </div>
                <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 p-4 text-center shadow-xs">
                  <p className="text-2xl font-extrabold text-[#047857] dark:text-emerald-400">5%</p>
                  <p className="text-xs text-[#55695F] dark:text-slate-400 mt-0.5 font-medium">Impure income</p>
                </div>
                <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 p-4 text-center shadow-xs">
                  <p className="text-2xl font-extrabold text-[#047857] dark:text-emerald-400">10%</p>
                  <p className="text-xs text-[#55695F] dark:text-slate-400 mt-0.5 font-medium">Real assets</p>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex gap-2">
                <button
                  onClick={() => setStockFilter('all')}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                    stockFilter === 'all'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-white dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 text-[#0B1F17] dark:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStockFilter('halal')}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                    stockFilter === 'halal'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-white dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 text-[#0B1F17] dark:text-white'
                  }`}
                >
                  Halal
                </button>
                <button
                  onClick={() => setStockFilter('excluded')}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                    stockFilter === 'excluded'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-white dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 text-[#0B1F17] dark:text-white'
                  }`}
                >
                  Excluded
                </button>
              </div>

              {/* Stock List Card (Image 7) */}
              <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 divide-y divide-[#E3ECE7] dark:divide-white/10 shadow-xs overflow-hidden">
                {filteredStocks.map((s) => (
                  <div key={s.name} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      {/* Avatar Badge */}
                      <div
                        className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-sm ${
                          s.compliant
                            ? 'bg-[#D1FAE5] text-[#047857]'
                            : 'bg-[#FEE4E2] text-[#B42318]'
                        }`}
                      >
                        {s.code}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0B1F17] dark:text-white">{s.name}</p>
                        <p className="text-xs text-[#55695F] dark:text-slate-400">Score {s.score}</p>
                      </div>
                    </div>

                    {/* Status Pill Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        s.compliant
                          ? 'bg-[#D1FAE5] text-[#047857]'
                          : 'bg-[#FEE4E2] text-[#B42318]'
                      }`}
                    >
                      {s.compliant ? 'Compliant' : 'Excluded'}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-[#55695F] dark:text-slate-400 text-center pt-1 font-medium">
                Every PSX stock checked for debt and impure income.
              </p>

              {/* Instant Trade Simulator below */}
              <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 p-5 shadow-xs">
                <h3 className="text-sm font-bold text-[#0B1F17] dark:text-white mb-3">Instant Trade Execution</h3>
                <HalalStockScanner balance={balance} onBuy={initiateBuyStock} />
              </div>

              {holdings.length > 0 && (
                <PortfolioDashboard
                  holdings={holdings}
                  totalValue={totalPortfolioValue}
                  dailyPnl={dailyPnl}
                  onSell={setSelectedSellHolding}
                />
              )}
            </main>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 3: SUKUK (Exact Match to Image 4)                         */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'assets' && (
            <main className="flex-1 px-4 sm:px-6 py-6 pb-28 lg:pb-10 max-w-4xl w-full mx-auto space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl lg:text-[28px] font-extrabold tracking-tight text-[#0B1F17] dark:text-white">
                    Sukuk
                  </h1>
                  <p className="text-xs text-[#55695F] dark:text-slate-400 mt-0.5">
                    Asset-backed sovereign and corporate certificates
                  </p>
                </div>
                <button
                  onClick={() => handleLangChange(lang === 'en' ? 'ur' : 'en')}
                  className="px-3.5 py-1 text-xs font-semibold rounded-full border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-[#0B1F17] dark:text-white"
                >
                  اردو
                </button>
              </div>

              {/* Deep Green Banner (Image 4) */}
              <div className="rounded-[20px] bg-[#064E3B] p-6 text-white shadow-md">
                <p className="text-[11px] font-bold tracking-wider text-emerald-300 uppercase">
                  RIBA-FREE GROWTH
                </p>
                <h2 className="text-xl sm:text-2xl font-extrabold mt-1 tracking-tight leading-snug">
                  Asset-backed Sukuk, screened for Shariah compliance
                </h2>
              </div>

              {/* Filter Pills */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSukukFilter('all')}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                    sukukFilter === 'all'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-white dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 text-[#0B1F17] dark:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSukukFilter('govt')}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                    sukukFilter === 'govt'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-white dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 text-[#0B1F17] dark:text-white'
                  }`}
                >
                  Government
                </button>
                <button
                  onClick={() => setSukukFilter('corp')}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                    sukukFilter === 'corp'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-white dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 text-[#0B1F17] dark:text-white'
                  }`}
                >
                  Corporate
                </button>
              </div>

              {/* Sukuk Cards List */}
              <div className="space-y-4">
                {[
                  {
                    name: 'GOP Ijarah Sukuk VRR-XXVII',
                    type: 'govt',
                    returnPct: '14.2%',
                    tenor: '3 Years',
                    minPkr: 'PKR 5,000',
                  },
                  {
                    name: 'Meezan Energy Sukuk II',
                    type: 'corp',
                    returnPct: '15.8%',
                    tenor: '5 Years',
                    minPkr: 'PKR 25,000',
                  },
                  {
                    name: 'K-Electric Islamic Sukuk',
                    type: 'corp',
                    returnPct: '16.4%',
                    tenor: '7 Years',
                    minPkr: 'PKR 10,000',
                  },
                ]
                  .filter((s) => (sukukFilter === 'all' ? true : sukukFilter === s.type))
                  .map((sukuk) => (
                    <div
                      key={sukuk.name}
                      className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 p-5 space-y-4 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-[#0B1F17] dark:text-white">{sukuk.name}</h3>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D1FAE5] text-[#047857]">
                          Compliant
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-1 text-left">
                        <div>
                          <p className="text-[11px] font-bold text-[#55695F] dark:text-slate-400 uppercase">RETURN</p>
                          <p className="text-sm font-extrabold text-[#0B1F17] dark:text-white mt-0.5">{sukuk.returnPct}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-[#55695F] dark:text-slate-400 uppercase">TENOR</p>
                          <p className="text-sm font-extrabold text-[#0B1F17] dark:text-white mt-0.5">{sukuk.tenor}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-[#55695F] dark:text-slate-400 uppercase">MINIMUM</p>
                          <p className="text-sm font-extrabold text-[#0B1F17] dark:text-white mt-0.5">{sukuk.minPkr}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBuySukuk({ type: 'buy_sukuk', amount: 5000, name: sukuk.name })}
                        className="w-full py-3 bg-[#047857] hover:bg-[#064E3B] text-white font-bold rounded-[14px] text-center text-sm shadow-xs transition-all active:scale-98"
                      >
                        Invest
                      </button>
                    </div>
                  ))}
              </div>
            </main>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 4: FAMILY (Exact Match to Image 3)                        */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'kameti' && (
            <main className="flex-1 px-4 sm:px-6 py-6 pb-28 lg:pb-10 max-w-4xl w-full mx-auto space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl lg:text-[28px] font-extrabold tracking-tight text-[#0B1F17] dark:text-white">
                    Family
                  </h1>
                  <p className="text-xs text-[#55695F] dark:text-slate-400 mt-0.5">
                    Rotating committee savings &amp; Shariah inheritance planning
                  </p>
                </div>
                <button
                  onClick={() => handleLangChange(lang === 'en' ? 'ur' : 'en')}
                  className="px-3.5 py-1 text-xs font-semibold rounded-full border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-[#0B1F17] dark:text-white"
                >
                  اردو
                </button>
              </div>

              {/* Segmented Control Toggle (Image 3) */}
              <div className="bg-[#E3ECE7]/60 dark:bg-white/10 rounded-2xl p-1 grid grid-cols-2">
                <button
                  onClick={() => setFamilySubTab('kameti')}
                  className={`py-2 text-sm font-bold rounded-xl transition-all ${
                    familySubTab === 'kameti'
                      ? 'bg-white dark:bg-[#16171b] text-[#047857] dark:text-emerald-400 shadow-xs'
                      : 'text-[#55695F] dark:text-slate-400'
                  }`}
                >
                  Kameti
                </button>
                <button
                  onClick={() => setFamilySubTab('inheritance')}
                  className={`py-2 text-sm font-bold rounded-xl transition-all ${
                    familySubTab === 'inheritance'
                      ? 'bg-white dark:bg-[#16171b] text-[#047857] dark:text-emerald-400 shadow-xs'
                      : 'text-[#55695F] dark:text-slate-400'
                  }`}
                >
                  Inheritance
                </button>
              </div>

              {familySubTab === 'kameti' ? (
                <div className="space-y-4">
                  {/* Kameti Card (Image 3) */}
                  <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 p-5 space-y-4 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-[#0B1F17] dark:text-white">Kameti</h3>
                        <p className="text-xs text-[#55695F] dark:text-slate-400 mt-0.5">
                          Save together in a rotating committee
                        </p>
                      </div>
                      {/* Avatar Stack */}
                      <div className="flex -space-x-2">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#D1FAE5] text-xs font-bold text-[#047857] border-2 border-white dark:border-[#16171b]">
                          A
                        </span>
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FEF3C7] text-xs font-bold text-[#92400E] border-2 border-white dark:border-[#16171b]">
                          B
                        </span>
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#E3ECE7] text-xs font-bold text-[#55695F] border-2 border-white dark:border-[#16171b]">
                          C
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#55695F] dark:text-slate-400 uppercase">MEMBERS</span>
                        <span className="font-extrabold text-[#0B1F17] dark:text-white">10 Members</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#55695F] dark:text-slate-400 uppercase">MONTHLY CONTRIBUTION</span>
                        <span className="font-extrabold text-[#0B1F17] dark:text-white">PKR 25,000</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#55695F] dark:text-slate-400 uppercase">YOUR TURN</span>
                        <span className="font-extrabold text-[#0B1F17] dark:text-white">Month 4 (Oct 2026)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleKametiContribute(25000)}
                      className="w-full py-3 bg-[#047857] hover:bg-[#064E3B] text-white font-bold rounded-[14px] text-center text-sm shadow-xs transition-all active:scale-98"
                    >
                      Start a Kameti
                    </button>
                  </div>

                  {/* Inheritance Card (Image 3) */}
                  <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 p-5 space-y-4 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#D1FAE5] flex items-center justify-center text-[#047857]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="3" x2="12" y2="21"/>
                          <polyline points="3 8 12 3 21 8"/>
                          <polyline points="4 16 8 11 12 16"/>
                          <polyline points="12 16 16 11 20 16"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#0B1F17] dark:text-white">Inheritance</h3>
                        <p className="text-xs text-[#55695F] dark:text-slate-400">
                          Preserve wealth for your family, in line with Shariah
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setFamilySubTab('inheritance')}
                      className="w-full py-3 bg-white dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 hover:bg-slate-50 text-[#0B1F17] dark:text-white font-semibold rounded-[14px] text-center text-sm shadow-xs transition-all"
                    >
                      Plan inheritance
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <WirasatCalculator />
                </div>
              )}
            </main>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 5: ZAKAT (Exact Match to Image 5)                         */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'zakat' && (
            <main className="flex-1 px-4 sm:px-6 py-6 pb-28 lg:pb-10 max-w-4xl w-full mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl lg:text-[28px] font-extrabold tracking-tight text-[#0B1F17] dark:text-white">
                    Zakat
                  </h1>
                  <p className="text-xs text-[#55695F] dark:text-slate-400 mt-0.5">
                    Automated 2.5% calculation on net eligible wealth
                  </p>
                </div>
                <button
                  onClick={() => handleLangChange(lang === 'en' ? 'ur' : 'en')}
                  className="px-3.5 py-1 text-xs font-semibold rounded-full border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-[#0B1F17] dark:text-white"
                >
                  اردو
                </button>
              </div>

              {/* Gold Top Card (Image 5) */}
              <div className="rounded-[20px] bg-[#FEF3C7] dark:bg-amber-950/40 border border-[#FDE68A] dark:border-amber-800/40 p-6 shadow-xs">
                <p className="text-xs font-bold text-[#92400E] dark:text-amber-400 uppercase tracking-wider">
                  ZAKAT DUE
                </p>
                <p className="text-[36px] font-extrabold text-[#92400E] dark:text-amber-400 mt-1 tabular-nums">
                  PKR {zakatDue.toLocaleString()}
                </p>
                <p className="text-xs text-[#92400E]/90 dark:text-amber-400/90 mt-1">
                  2.5% of eligible wealth · Above Nisab
                </p>
              </div>

              {/* Live Metal Rates Cards (Image 5) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 p-4 shadow-xs">
                  <p className="text-[11px] font-bold text-[#55695F] dark:text-slate-400 uppercase">GOLD, LIVE</p>
                  <p className="text-base font-extrabold text-[#0B1F17] dark:text-white mt-1 tabular-nums">PKR 242,500/tola</p>
                </div>
                <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 p-4 shadow-xs">
                  <p className="text-[11px] font-bold text-[#55695F] dark:text-slate-400 uppercase">SILVER, LIVE</p>
                  <p className="text-base font-extrabold text-[#0B1F17] dark:text-white mt-1 tabular-nums">PKR 2,850/tola</p>
                </div>
              </div>

              {/* Form Card (Image 5) */}
              <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 p-5 space-y-4 shadow-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#0B1F17] dark:text-white block mb-1">Cash and savings</label>
                    <input
                      type="number"
                      value={zakatSavings}
                      onChange={(e) => setZakatSavings(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-[#F4F7F5] dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 rounded-[14px] text-sm font-semibold text-[#0B1F17] dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#0B1F17] dark:text-white block mb-1">Investments</label>
                    <input
                      type="number"
                      value={zakatInvestments}
                      onChange={(e) => setZakatInvestments(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-[#F4F7F5] dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 rounded-[14px] text-sm font-semibold text-[#0B1F17] dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#0B1F17] dark:text-white block mb-1">Gold (tola)</label>
                    <input
                      type="number"
                      value={zakatGoldTola}
                      onChange={(e) => setZakatGoldTola(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-[#F4F7F5] dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 rounded-[14px] text-sm font-semibold text-[#0B1F17] dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#0B1F17] dark:text-white block mb-1">Silver (tola)</label>
                    <input
                      type="number"
                      value={zakatSilverTola}
                      onChange={(e) => setZakatSilverTola(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-[#F4F7F5] dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 rounded-[14px] text-sm font-semibold text-[#0B1F17] dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B1F17] dark:text-white block mb-1">Liabilities due</label>
                  <input
                    type="number"
                    value={zakatLiabilities}
                    onChange={(e) => setZakatLiabilities(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-[#F4F7F5] dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 rounded-[14px] text-sm font-semibold text-[#0B1F17] dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* Summary Box (Image 5) */}
              <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#55695F] dark:text-slate-400 font-medium">Eligible wealth</span>
                  <span className="font-extrabold text-[#0B1F17] dark:text-white tabular-nums">PKR 312,500</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#55695F] dark:text-slate-400 font-medium">Nisab threshold</span>
                  <span className="font-extrabold text-[#0B1F17] dark:text-white tabular-nums">PKR 185,250</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#55695F] dark:text-slate-400 font-medium">Rate</span>
                  <span className="font-extrabold text-[#047857] dark:text-emerald-400 tabular-nums">2.5%</span>
                </div>
              </div>

              {/* Primary Pay Zakat Button */}
              <button
                onClick={() => handleZakatDonation(zakatDue, 'Verified Shariah Zakat Fund')}
                className="w-full py-3.5 bg-[#047857] hover:bg-[#064E3B] text-white font-bold rounded-[14px] text-center text-base shadow-sm transition-all active:scale-98"
              >
                Pay Zakat
              </button>
            </main>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 6: AI MUFTI (Exact Match to Image 2 Mobile & Web View)    */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'mufti' && (
            <main className="flex-1 px-4 sm:px-6 py-6 pb-28 lg:pb-10 max-w-3xl w-full mx-auto flex flex-col h-[calc(100vh-80px)]">
              {/* Header (Image 2) */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E3ECE7] dark:border-white/10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="p-1 rounded-full text-[#55695F] hover:text-[#0B1F17] dark:hover:text-white"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </button>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#047857] text-white">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0B1F17] dark:text-white">AI Mufti</h2>
                    <p className="text-xs text-[#55695F] dark:text-slate-400">Urdu or English, text or voice</p>
                  </div>
                </div>

                <button
                  onClick={() => handleLangChange(lang === 'en' ? 'ur' : 'en')}
                  className="px-3.5 py-1 text-xs font-semibold rounded-full border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-[#0B1F17] dark:text-white"
                >
                  اردو
                </button>
              </div>

              {/* Chat Message List */}
              <div className="flex-1 overflow-y-auto py-5 space-y-4">
                {muftiMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] p-4 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#064E3B] text-white rounded-2xl rounded-br-sm shadow-xs font-medium'
                          : 'bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 text-[#0B1F17] dark:text-white rounded-2xl rounded-bl-sm shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Prompt Chips (Image 2) */}
              <div className="flex items-center gap-2 pb-3 overflow-x-auto">
                <button
                  onClick={() => handleSendMuftiMessage('Is Meezan Bank compliant?')}
                  className="px-4 py-2 rounded-full border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-xs font-bold text-[#0B1F17] dark:text-white hover:bg-slate-50 transition-colors whitespace-nowrap shadow-xs"
                >
                  Is Meezan Bank compliant?
                </button>
                <button
                  onClick={() => handleSendMuftiMessage('Zakat on gold')}
                  className="px-4 py-2 rounded-full border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-xs font-bold text-[#0B1F17] dark:text-white hover:bg-slate-50 transition-colors whitespace-nowrap shadow-xs"
                >
                  Zakat on gold
                </button>
              </div>

              {/* Input Bar (Image 2) */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={muftiInput}
                    onChange={(e) => setMuftiInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMuftiMessage()}
                    placeholder="Ask a question"
                    className="w-full px-5 py-3.5 bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-full text-sm text-[#0B1F17] dark:text-white placeholder-[#55695F]/60 outline-none focus:border-[#047857] shadow-xs"
                  />
                </div>
                <button
                  onClick={() => handleSendMuftiMessage()}
                  className="h-12 w-12 rounded-full bg-[#047857] hover:bg-[#064E3B] text-white flex items-center justify-center flex-shrink-0 shadow-sm active:scale-95 transition-all"
                  aria-label="Voice input or send"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </button>
              </div>
            </main>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 7: SETTINGS                                              */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'settings' && (
            <main className="flex-1 px-4 sm:px-6 py-6 pb-28 lg:pb-10 max-w-4xl w-full mx-auto space-y-5">
              <div>
                <h1 className="text-2xl lg:text-[28px] font-extrabold tracking-tight text-[#0B1F17] dark:text-white">
                  Settings
                </h1>
                <p className="text-xs text-[#55695F] dark:text-slate-400 mt-0.5">
                  Platform preferences, appearance, and credentials
                </p>
              </div>

              {/* Clean porcelain settings card */}
              <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 shadow-xs overflow-hidden divide-y divide-[#E3ECE7] dark:divide-white/10">
                {/* Account Type */}
                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm font-bold text-[#0B1F17] dark:text-white">Account type</p>
                    <p className="text-xs text-[#55695F] dark:text-slate-400 mt-0.5">Switch between demo and real</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-[#E3ECE7] dark:border-white/10 bg-[#F4F7F5] dark:bg-white/5 p-1">
                    <button className="rounded-full bg-white dark:bg-white/10 px-4 py-1.5 text-xs font-bold text-[#0B1F17] dark:text-white shadow-xs">
                      Demo
                    </button>
                    <button
                      className="rounded-full px-4 py-1.5 text-xs font-semibold text-[#55695F] dark:text-slate-400 hover:text-[#0B1F17]"
                      onClick={() => alert('Real accounts opening under SECP guidelines.')}
                    >
                      Real
                    </button>
                  </div>
                </div>

                {/* Appearance */}
                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm font-bold text-[#0B1F17] dark:text-white">Appearance</p>
                    <p className="text-xs text-[#55695F] dark:text-slate-400 mt-0.5">Switch between white porcelain and dark obsidian</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-[#E3ECE7] dark:border-white/10 bg-[#F4F7F5] dark:bg-white/5 p-1">
                    <button
                      onClick={() => toggleTheme('light')}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                        theme === 'light'
                          ? 'bg-white text-[#0B1F17] shadow-xs'
                          : 'text-[#55695F] hover:text-[#0B1F17]'
                      }`}
                    >
                      White
                    </button>
                    <button
                      onClick={() => toggleTheme('dark')}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                        theme === 'dark'
                          ? 'bg-white/20 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>

                {/* Language */}
                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm font-bold text-[#0B1F17] dark:text-white">Language</p>
                    <p className="text-xs text-[#55695F] dark:text-slate-400 mt-0.5">Platform interface language</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-[#E3ECE7] dark:border-white/10 bg-[#F4F7F5] dark:bg-white/5 p-1">
                    <button
                      onClick={() => handleLangChange('en')}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                        lang === 'en'
                          ? 'bg-white dark:bg-white/10 text-[#0B1F17] dark:text-white shadow-xs'
                          : 'text-[#55695F] dark:text-slate-400'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleLangChange('ur')}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                        lang === 'ur'
                          ? 'bg-white dark:bg-white/10 text-[#0B1F17] dark:text-white shadow-xs'
                          : 'text-[#55695F] dark:text-slate-400'
                      }`}
                    >
                      اردو
                    </button>
                  </div>
                </div>

                {/* Security PIN */}
                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm font-bold text-[#0B1F17] dark:text-white">Security PIN</p>
                    <p className="text-xs text-[#55695F] dark:text-slate-400 mt-0.5">Protect orders and withdrawals</p>
                  </div>
                  <button
                    onClick={() => setIsAuthorized(false)}
                    className="text-xs font-bold text-[#047857] dark:text-emerald-400 hover:underline"
                  >
                    Change PIN
                  </button>
                </div>

                {/* Delete account */}
                <button
                  onClick={() => setShowResetModal(true)}
                  className="flex w-full items-center justify-between p-5 hover:bg-red-50/50 dark:hover:bg-red-500/5 transition-colors text-left"
                >
                  <div>
                    <span className="text-sm font-bold text-[#B42318] dark:text-red-400">
                      Delete account and data
                    </span>
                    <p className="text-xs text-[#55695F] dark:text-slate-500 mt-0.5">
                      Reset wallet balance and account preferences
                    </p>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B42318" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            </main>
          )}
        </div>
      </div>

      {/* ── Modals: Deposit / Withdraw ── */}
      {modal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-t-[20px] sm:rounded-[20px] border border-[#E3ECE7] dark:border-white/10 p-5 shadow-2xl bg-white dark:bg-[#16171b]">
            <button
              onClick={() => setModal(null)}
              className="absolute right-4 top-4 text-[#55695F] hover:text-[#0B1F17] dark:text-slate-400 dark:hover:text-white transition-colors"
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
        <div className="fixed inset-0 z-[65] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-t-[20px] sm:rounded-[20px] border border-[#E3ECE7] dark:border-white/10 p-5 bg-white dark:bg-[#16171b] shadow-2xl">
            <SellStockFlow
              holding={selectedSellHolding}
              onSuccess={handleSellRequest}
              onCancel={() => setSelectedSellHolding(null)}
            />
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Navigation (72px Height, Exact Match to Image 9) ── */}
      <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-white dark:bg-[#111215] border-t border-[#E3ECE7] dark:border-white/10 z-50 flex items-center justify-around px-2 lg:hidden shadow-lg">
        {NAV_ITEMS.filter((n) => ['home', 'portfolio', 'assets', 'kameti', 'zakat'].includes(n.id)).map((item) => {
          const isActive = activeTab === (item.id as DashboardTab);
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as DashboardTab)}
              className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-1 py-1 transition-all ${
                isActive
                  ? 'text-[#047857] dark:text-emerald-400 font-bold'
                  : 'text-[#55695F] dark:text-slate-400 hover:text-[#0B1F17]'
              }`}
            >
              <span>{item.icon}</span>
              <span className="text-[11px] leading-tight font-medium">
                {lang === 'ur' ? item.labelUr : item.labelEn}
              </span>
            </button>
          );
        })}
      </div>

      <SovereignScan isOpen={isScanning} onComplete={onScanComplete} />
    </>
  );
}
