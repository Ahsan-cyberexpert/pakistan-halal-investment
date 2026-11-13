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
  Logo,
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

// Shariah-screened PSX Stocks Data

// Desktop-specific data from extracted templates
const DESKTOP_STOCKS = [
  { ini: 'MB', name: 'Meezan Bank', symbol: 'MEBL', score: 9.8, price: 412.50, chg: 5.20, vol: '1.2M', y: [22, 20, 23, 17, 15, 16, 9, 6] },
  { ini: 'SL', name: 'Systems Limited', symbol: 'SYS', score: 9.5, price: 438.90, chg: -3.10, vol: '842K', y: [8, 10, 7, 13, 15, 14, 21, 24] },
  { ini: 'HB', name: 'Habib Bank', symbol: 'HBL', score: 2.1, price: 215.30, chg: 1.10, vol: '2.1M', y: [20, 21, 18, 19, 15, 14, 12, 11] },
  { ini: 'LC', name: 'Lucky Cement', symbol: 'LUCK', score: 8.7, price: 1185.00, chg: 14.75, vol: '310K', y: [24, 21, 22, 16, 17, 11, 8, 5] },
  { ini: 'EC', name: 'Engro Corp', symbol: 'ENGRO', score: 7.4, price: 332.40, chg: -2.60, vol: '654K', y: [7, 9, 8, 12, 14, 13, 19, 22] },
  { ini: 'MC', name: 'MCB Bank', symbol: 'MCB', score: 2.8, price: 289.70, chg: -0.90, vol: '498K', y: [10, 9, 13, 12, 15, 14, 17, 18] },
];

const DESKTOP_SUKUK = [
  { name: 'Government Ijarah Sukuk 1Y', type: 'Government', ret: 11.80, tenor: '1 year', payout: 'Semi-annual', min: 5000, score: 9.9, isGov: true },
  { name: 'Government Ijarah Sukuk 3Y', type: 'Government', ret: 12.20, tenor: '3 years', payout: 'Semi-annual', min: 5000, score: 9.9, isGov: true },
  { name: 'Government Ijarah Sukuk 5Y', type: 'Government', ret: 12.60, tenor: '5 years', payout: 'Semi-annual', min: 5000, score: 9.8, isGov: true },
  { name: 'Energy Corporate Sukuk', type: 'Corporate', ret: 13.40, tenor: '3 years', payout: 'Quarterly', min: 100000, score: 9.2, isGov: false },
  { name: 'Telecom Corporate Sukuk', type: 'Corporate', ret: 13.10, tenor: '5 years', payout: 'Semi-annual', min: 100000, score: 9.0, isGov: false },
  { name: 'Banking Corporate Sukuk', type: 'Corporate', ret: 12.90, tenor: '2 years', payout: 'Quarterly', min: 50000, score: 8.8, isGov: false },
];

const DESKTOP_ZAKAT_CAUSES = [
  { label: 'Hospitals', d: 'M12 8v8 M8 12h8 M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z' },
  { label: 'Education', d: 'M2 8l10-5 10 5-10 5z M6 10.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-5.5' },
  { label: 'Orphan care', d: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z' },
  { label: 'Relief and food', d: 'M21 8l-9-5-9 5v8l9 5 9-5z M3 8l9 5 9-5 M12 13v8' },
];

const DESKTOP_KAMETI_MEMBERS = [
  { name: 'Ahmed Raza', letter: 'A', status: 'Paid', payout: 'Month 1', avatar: 'bg-[#D1FAE5] text-[#064E3B]', badge: 'bg-[#D1FAE5] text-[#064E3B]' },
  { name: 'Bilal Tariq', letter: 'B', status: 'Paid', payout: 'Month 2', avatar: 'bg-[#FEF3C7] text-[#92400E]', badge: 'bg-[#D1FAE5] text-[#064E3B]' },
  { name: 'You', letter: 'C', status: 'Pending', payout: 'Month 3', avatar: 'bg-[#E3ECE7] text-[#55695F]', badge: 'bg-[#FEF3C7] text-[#92400E]' },
];

const DESKTOP_INHERITANCE_HEIRS = [
  { name: 'Fatima Bibi', relation: 'Wife', share: '12.50%', amount: '39,062', letter: '1', avatar: 'bg-[#D1FAE5] text-[#064E3B]' },
  { name: 'Zain Khan', relation: 'Son', share: '58.33%', amount: '182,291', letter: '2', avatar: 'bg-[#FEF3C7] text-[#92400E]' },
  { name: 'Maryam Khan', relation: 'Daughter', share: '29.17%', amount: '91,145', letter: '3', avatar: 'bg-[#E3ECE7] text-[#55695F]' },
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

  // Desktop specific states from templates
  const [desktopStockSearch, setDesktopStockSearch] = useState('');
  const [desktopSukukSearch, setDesktopSukukSearch] = useState('');
  const [selectedZakatCause, setSelectedZakatCause] = useState('Hospitals');

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

    const savedLang = (localStorage.getItem('roziq_lang') as 'en' | 'ur') || 'en';
    setLangState(savedLang);

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

  return (
    <>
      <ToastContainer />
      {!isAuthorized && <AuthGate onSuccess={handleAuthSuccess} />}
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
          <div className="w-full max-w-sm rounded-[24px] border border-[#E3ECE7] dark:border-[#262B35] p-6 text-center space-y-4 bg-white dark:bg-[#15181F] shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400">
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
                className="flex-1 rounded-[14px] border border-[#E3ECE7] dark:border-white/10 py-2.5 text-xs font-semibold text-[#0B1F17] dark:text-slate-300 hover:bg-[#F4F7F5] dark:bg-[#1C2029] transition-colors"
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
        className="min-h-screen w-full flex bg-[#F2F5F3] dark:bg-[#0B0D11] text-[#0B1F17] dark:text-white transition-colors duration-200"
        dir={lang === 'ur' ? 'rtl' : 'ltr'}
      >
        {/* ── Sidebar (Desktop - Exact Match to Image 1) ── */}
        <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r border-[#E3ECE7] dark:border-white/10 sticky top-0 h-screen overflow-y-auto bg-white dark:bg-[#111215]">
          {/* Logo row */}
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-2.5">
              <Logo variant="full" className="h-8 w-auto" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FEF3C7] dark:bg-amber-950/50 text-[#92400E] dark:text-amber-300 border border-[#FDE68A] dark:border-amber-800/60">
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
                      ? 'bg-[#D1FAE5] dark:bg-emerald-950/60 text-[#047857] dark:text-emerald-300 font-bold'
                      : 'text-[#55695F] dark:text-slate-400 hover:text-[#0B1F17] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#232936]/70 dark:hover:bg-white/5 font-medium'
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
                  ? 'bg-[#D1FAE5] dark:bg-emerald-950/60 text-[#047857] dark:text-emerald-300 font-bold'
                  : 'text-[#55695F] dark:text-slate-400 hover:text-[#0B1F17] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#232936]/70 font-medium'
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
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 py-2.5 text-xs font-semibold text-[#0B1F17] dark:text-slate-300 hover:bg-[#F4F7F5] dark:bg-[#1C2029] dark:hover:bg-white/10 transition-colors shadow-xs"
            >
              {t('Reset Account Data', 'ڈیٹا ری سیٹ کریں')}
            </button>
          </div>
        </aside>

        {/* ── Main Content Area ── */}
        <div className="flex flex-1 flex-col min-w-0 w-full">
          {/* Header hidden on mobile/desktop as tabs render their own exact headers */}
          <header className="hidden">
            <div className="flex items-center gap-2 ml-auto">
              {/* Language pill toggle */}
              <button
                onClick={() => handleLangChange(lang === 'en' ? 'ur' : 'en')}
                className="px-3 py-1 text-xs font-semibold rounded-full border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-[#0B1F17] dark:text-white hover:bg-[#F4F7F5] dark:bg-[#1C2029] dark:hover:bg-white/10 transition-colors shadow-xs"
              >
                {lang === 'en' ? 'اردو' : 'EN'}
              </button>
            </div>
          </header>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 1: DASHBOARD (Unified Responsive Layout)                   */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'home' && (
            <main className="flex-1 px-4 sm:px-6 py-6 pb-28 lg:pb-10 max-w-7xl w-full mx-auto space-y-6">
              {/* Header Row */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-[#0B1F17] dark:text-white">
                    {t('Dashboard', 'ڈیش بورڈ')}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#55695F] dark:text-slate-400 mt-0.5">
                    {t('Overview of wealth and portfolio performance', 'دولت اور پورٹ فولیو کارکردگی کا جائزہ')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLangChange(lang === 'en' ? 'ur' : 'en')}
                    className="px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-[#0B1F17] dark:text-white shadow-xs hover:bg-[#F4F7F5] dark:hover:bg-[#1C2029] transition-colors"
                  >
                    {lang === 'en' ? 'اردو' : 'EN'}
                  </button>
                  <button
                    onClick={() => setModal('deposit')}
                    className="inline-flex rounded-[14px] bg-[#047857] hover:bg-[#064E3B] px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition-all shadow-xs"
                  >
                    {t('Add funds', 'رقم جمع کروائیں')}
                  </button>
                </div>
              </div>

              {/* ── RESPONSIVE UNIFIED LAYOUT ── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left Column (col-span-7) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Total Wealth & Smooth Chart Card */}
                  <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 p-5 sm:p-6 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-[#55695F] dark:text-slate-400 uppercase tracking-wider">
                          TOTAL WEALTH
                        </p>
                        <p className="text-[32px] sm:text-[36px] leading-tight font-extrabold text-[#0B1F17] dark:text-white tracking-tight mt-1 tabular-nums">
                          PKR 312,500
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1 bg-[#D1FAE5] dark:bg-emerald-950/60 text-[#047857] dark:text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
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
                    <div className="w-full h-36 sm:h-44 mt-4 sm:mt-6">
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
                        className="flex-1 py-2.5 bg-white dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 hover:bg-[#F4F7F5] dark:bg-[#1C2029] text-[#0B1F17] dark:text-white font-semibold rounded-[14px] text-center text-sm shadow-xs transition-all"
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
          {/* TAB 2: STOCKS (Unified Responsive Layout)                      */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'portfolio' && (
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-10 max-w-6xl w-full mx-auto space-y-6">
              <div className="flex flex-col gap-6">
                <header className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#0B1F17] dark:text-white leading-tight">
                      {t('Stocks', 'اسٹاکس')}
                    </h1>
                    <p className="text-xs sm:text-[15px] font-medium text-[#55695F] dark:text-slate-400 mt-1">
                      {t('Shariah-screened PSX stocks', 'شریعہ کے اصولوں کے مطابق اسکرین شدہ پی ایس ایکس اسٹاکس')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <button
                      onClick={() => handleLangChange(lang === 'en' ? 'ur' : 'en')}
                      className="h-10 sm:h-11 px-4 sm:px-5 rounded-full border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-[#0B1F17] dark:text-white font-bold text-xs sm:text-[15px] shadow-xs hover:bg-[#F4F7F5] dark:bg-[#1C2029] transition-colors"
                    >
                      {lang === 'en' ? 'اردو' : 'EN'}
                    </button>
                    <button
                      onClick={() => setModal('deposit')}
                      className="h-10 sm:h-12 px-4 sm:px-6 rounded-[14px] bg-[#047857] hover:bg-[#064E3B] text-white font-bold text-xs sm:text-[15px] shadow-xs transition-colors"
                    >
                      {t('Add funds', 'رقم جمع کروائیں')}
                    </button>
                  </div>
                </header>

                {/* Screening standards (3 stat cards) */}
                <section aria-label="Screening standards" className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                  <div className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] p-5 sm:p-6 flex flex-col gap-1 shadow-xs">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#047857] dark:text-emerald-400 leading-tight">33%</span>
                    <span className="text-sm sm:text-[15px] font-bold text-[#0B1F17] dark:text-white">Debt limit</span>
                    <span className="text-xs sm:text-[14px] font-medium text-[#55695F] dark:text-slate-400 leading-snug">Interest-bearing debt under 33% of market cap.</span>
                  </div>
                  <div className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] p-5 sm:p-6 flex flex-col gap-1 shadow-xs">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#047857] dark:text-emerald-400 leading-tight">5%</span>
                    <span className="text-sm sm:text-[15px] font-bold text-[#0B1F17] dark:text-white">Impure income</span>
                    <span className="text-xs sm:text-[14px] font-medium text-[#55695F] dark:text-slate-400 leading-snug">Fully purified through charity.</span>
                  </div>
                  <div className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] p-5 sm:p-6 flex flex-col gap-1 shadow-xs">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#047857] dark:text-emerald-400 leading-tight">10%</span>
                    <span className="text-sm sm:text-[15px] font-bold text-[#0B1F17] dark:text-white">Real assets</span>
                    <span className="text-xs sm:text-[14px] font-medium text-[#55695F] dark:text-slate-400 leading-snug">At least 10% of total assets are tangible.</span>
                  </div>
                </section>

                {/* Filter chips & Search bar */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                  <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-0">
                    {(['all', 'halal', 'excluded'] as const).map((filterKey) => (
                      <button
                        key={filterKey}
                        onClick={() => setStockFilter(filterKey)}
                        className={`h-10 sm:h-11 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-[15px] capitalize transition-all shrink-0 ${
                          stockFilter === filterKey
                            ? 'bg-[#064E3B] text-white shadow-xs'
                            : 'bg-white dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 text-[#0B1F17] dark:text-white hover:bg-[#F4F7F5] dark:bg-[#1C2029]'
                        }`}
                      >
                        {filterKey === 'all' ? 'All' : filterKey === 'halal' ? 'Halal' : 'Excluded'}
                      </button>
                    ))}
                  </div>

                  <label className="flex items-center gap-2.5 w-full sm:w-80 h-10 sm:h-11 px-4 rounded-[14px] border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-[#16171b] text-[#55695F] dark:text-slate-400 shadow-xs">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="7" />
                      <line x1="20" y1="20" x2="16" y2="16" />
                    </svg>
                    <input
                      type="text"
                      value={desktopStockSearch}
                      onChange={(e) => setDesktopStockSearch(e.target.value)}
                      placeholder="Search PSX stocks"
                      className="flex-1 border-0 outline-none bg-transparent font-medium text-xs sm:text-[15px] text-[#0B1F17] dark:text-white placeholder-[#55695F]/60"
                    />
                  </label>
                </div>

                {/* Stock List Desktop Table with overflow scroll for small screens */}
                <section aria-label="Stock list" className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] overflow-x-auto shadow-xs">
                  <div className="min-w-[720px]">
                    <div className="grid grid-cols-[minmax(0,1fr)_120px_150px_110px_110px_110px_110px] items-center h-12 px-6 text-xs font-bold tracking-wider uppercase text-[#55695F] dark:text-slate-400 bg-slate-50/50 dark:bg-white/[0.02]">
                      <span>Company</span>
                      <span className="text-right">Price (PKR)</span>
                      <span className="text-right">Change</span>
                      <span className="pl-4">Today</span>
                      <span className="text-right">Volume</span>
                      <span className="pl-6">Shariah score</span>
                      <span className="text-right">Action</span>
                    </div>

                    {DESKTOP_STOCKS
                      .filter((s) => {
                        if (stockFilter === 'halal') return s.score >= 5;
                        if (stockFilter === 'excluded') return s.score < 5;
                        return true;
                      })
                      .filter((s) =>
                        desktopStockSearch
                          ? s.name.toLowerCase().includes(desktopStockSearch.toLowerCase()) ||
                            s.symbol.toLowerCase().includes(desktopStockSearch.toLowerCase())
                          : true
                      )
                      .map((s) => {
                        const ok = s.score >= 5;
                        const up = s.chg >= 0;
                        const pct = ((Math.abs(s.chg) / (s.price - s.chg)) * 100).toFixed(2);
                        const tone = up ? '#047857' : '#B42318';
                        const sparkPoints = s.y.map((v, i) => `${i * 12},${v + 1}`).join(' ');

                        return (
                          <div
                            key={s.symbol}
                            className="grid grid-cols-[minmax(0,1fr)_120px_150px_110px_110px_110px_110px] items-center h-16 px-6 border-t border-[#E3ECE7] dark:border-white/10 hover:bg-slate-50 dark:hover:bg-[#232936]/40 dark:hover:bg-white/[0.02] transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-10 h-10 rounded-[12px] flex items-center justify-center text-sm font-extrabold ${
                                  ok
                                    ? 'bg-[#D1FAE5] text-[#064E3B]'
                                    : 'bg-[#FEE4E2] text-[#B42318]'
                                }`}
                              >
                                {s.ini}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-base font-bold text-[#0B1F17] dark:text-white">{s.name}</span>
                                <span className="text-[13px] font-semibold text-[#55695F] dark:text-slate-400">{s.symbol}</span>
                              </div>
                            </div>

                            <span className="text-right text-base font-bold text-[#0B1F17] dark:text-white tabular-nums">
                              {s.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>

                            <div className="flex flex-col items-end tabular-nums">
                              <span className="text-[15px] font-bold" style={{ color: tone }}>
                                {(up ? '+' : '−') + Math.abs(s.chg).toFixed(2)}
                              </span>
                              <span className="text-[13px] font-semibold" style={{ color: tone }}>
                                {(up ? '▲ ' : '▼ ') + pct + '%'}
                              </span>
                            </div>

                            <div className="pl-4">
                              <svg width="84" height="32" viewBox="0 0 84 32" fill="none" aria-hidden="true">
                                <polyline
                                  points={sparkPoints}
                                  stroke={tone}
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>

                            <span className="text-right text-[15px] font-semibold text-[#55695F] dark:text-slate-400 tabular-nums">
                              {s.vol}
                            </span>

                            <div className="flex items-baseline gap-0.5 pl-6">
                              <span className="text-base font-extrabold" style={{ color: ok ? '#047857' : '#B42318' }}>
                                {s.score.toFixed(1)}
                              </span>
                              <span className="text-xs font-semibold text-[#55695F] dark:text-slate-400">/10</span>
                            </div>

                            <div className="text-right">
                              {ok ? (
                                <button
                                  onClick={() => initiateBuyStock(s.symbol, 10000)}
                                  className="h-10 px-5 rounded-[14px] border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-[#047857] dark:text-emerald-400 font-bold text-sm hover:bg-[#D1FAE5]/40 transition-colors shadow-xs"
                                >
                                  Invest
                                </button>
                              ) : (
                                <span className="text-sm font-semibold text-[#55695F] dark:text-slate-400">
                                  Not available
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </section>

                <p className="text-xs sm:text-sm font-medium text-[#55695F] dark:text-slate-400 leading-5">
                  Sample prices for demo. The Shariah score (out of 10) is calculated from each stock&apos;s debt, impure income and real assets. Every PSX stock is checked.
                </p>

                {/* Instant Trade Simulator below */}
                <div className="rounded-[20px] bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 p-5 sm:p-6 shadow-xs">
                  <h3 className="text-sm sm:text-base font-bold text-[#0B1F17] dark:text-white mb-3">Instant Trade Execution</h3>
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
              </div>
            </main>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 3: SUKUK (Unified Responsive Layout)                       */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'assets' && (
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-10 max-w-6xl w-full mx-auto space-y-6">
              <div className="flex flex-col gap-6">
                <header className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#0B1F17] dark:text-white leading-tight">
                      {t('Sukuk', 'سکوک')}
                    </h1>
                    <p className="text-xs sm:text-[15px] font-medium text-[#55695F] dark:text-slate-400 mt-1">
                      {t('Riba-free, asset-backed investments', 'سود سے پاک، اثاثوں سے وابستہ سرمایہ کاری')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <button
                      onClick={() => handleLangChange(lang === 'en' ? 'ur' : 'en')}
                      className="h-10 sm:h-11 px-4 sm:px-5 rounded-full border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-[#0B1F17] dark:text-white font-bold text-xs sm:text-[15px] shadow-xs hover:bg-[#F4F7F5] dark:bg-[#1C2029] transition-colors"
                    >
                      {lang === 'en' ? 'اردو' : 'EN'}
                    </button>
                    <button
                      onClick={() => setModal('deposit')}
                      className="h-10 sm:h-12 px-4 sm:px-6 rounded-[14px] bg-[#047857] hover:bg-[#064E3B] text-white font-bold text-xs sm:text-[15px] shadow-xs transition-colors"
                    >
                      {t('Add funds', 'رقم جمع کروائیں')}
                    </button>
                  </div>
                </header>

                {/* Sukuk Principles (3 Stat cards) */}
                <section aria-label="Sukuk principles" className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                  <div className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] p-5 sm:p-6 flex flex-col gap-1 shadow-xs">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#047857] dark:text-emerald-400 leading-tight">100%</span>
                    <span className="text-sm sm:text-[15px] font-bold text-[#0B1F17] dark:text-white">Asset-backed</span>
                    <span className="text-xs sm:text-[14px] font-medium text-[#55695F] dark:text-slate-400 leading-snug">Every Sukuk is backed by real, tangible assets.</span>
                  </div>
                  <div className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] p-5 sm:p-6 flex flex-col gap-1 shadow-xs">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#047857] dark:text-emerald-400 leading-tight">0%</span>
                    <span className="text-sm sm:text-[15px] font-bold text-[#0B1F17] dark:text-white">Riba</span>
                    <span className="text-xs sm:text-[14px] font-medium text-[#55695F] dark:text-slate-400 leading-snug">Returns come from asset profit, never interest.</span>
                  </div>
                  <div className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] p-5 sm:p-6 flex flex-col gap-1 shadow-xs">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#047857] dark:text-emerald-400 leading-tight">AAOIFI</span>
                    <span className="text-sm sm:text-[15px] font-bold text-[#0B1F17] dark:text-white">Standard</span>
                    <span className="text-xs sm:text-[14px] font-medium text-[#55695F] dark:text-slate-400 leading-snug">Screened to global Islamic finance standards.</span>
                  </div>
                </section>

                {/* Filter chips & Search bar */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                  <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-0">
                    {(['all', 'govt', 'corp'] as const).map((filterKey) => (
                      <button
                        key={filterKey}
                        onClick={() => setSukukFilter(filterKey)}
                        className={`h-10 sm:h-11 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-[15px] capitalize transition-all shrink-0 ${
                          sukukFilter === filterKey
                            ? 'bg-[#064E3B] text-white shadow-xs'
                            : 'bg-white dark:bg-white/5 border border-[#E3ECE7] dark:border-white/10 text-[#0B1F17] dark:text-white hover:bg-[#F4F7F5] dark:bg-[#1C2029]'
                        }`}
                      >
                        {filterKey === 'all' ? 'All' : filterKey === 'govt' ? 'Government' : 'Corporate'}
                      </button>
                    ))}
                  </div>

                  <label className="flex items-center gap-2.5 w-full sm:w-80 h-10 sm:h-11 px-4 rounded-[14px] border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-[#16171b] text-[#55695F] dark:text-slate-400 shadow-xs">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="7" />
                      <line x1="20" y1="20" x2="16" y2="16" />
                    </svg>
                    <input
                      type="text"
                      value={desktopSukukSearch}
                      onChange={(e) => setDesktopSukukSearch(e.target.value)}
                      placeholder="Search Sukuk"
                      className="flex-1 border-0 outline-none bg-transparent font-medium text-xs sm:text-[15px] text-[#0B1F17] dark:text-white placeholder-[#55695F]/60"
                    />
                  </label>
                </div>

                {/* Sukuk List Table with horizontal scroll on small devices */}
                <section aria-label="Sukuk list" className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] overflow-x-auto shadow-xs">
                  <div className="min-w-[720px]">
                    <div className="grid grid-cols-[minmax(0,1fr)_110px_120px_130px_130px_120px_110px] items-center h-12 px-6 text-xs font-bold tracking-wider uppercase text-[#55695F] dark:text-slate-400 bg-slate-50/50 dark:bg-white/[0.02]">
                      <span>Sukuk</span>
                      <span className="text-right">Return p.a.</span>
                      <span className="pl-6">Tenor</span>
                      <span>Profit payout</span>
                      <span className="text-right">Minimum (PKR)</span>
                      <span className="pl-6">Shariah score</span>
                      <span className="text-right">Action</span>
                    </div>

                    {DESKTOP_SUKUK
                      .filter((s) => {
                        if (sukukFilter === 'govt') return s.isGov;
                        if (sukukFilter === 'corp') return !s.isGov;
                        return true;
                      })
                      .filter((s) =>
                        desktopSukukSearch
                          ? s.name.toLowerCase().includes(desktopSukukSearch.toLowerCase()) ||
                            s.type.toLowerCase().includes(desktopSukukSearch.toLowerCase())
                          : true
                      )
                      .map((s) => (
                        <div
                          key={s.name}
                          className="grid grid-cols-[minmax(0,1fr)_110px_120px_130px_130px_120px_110px] items-center h-16 px-6 border-t border-[#E3ECE7] dark:border-white/10 hover:bg-slate-50 dark:hover:bg-[#232936]/40 dark:hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-[12px] bg-[#D1FAE5] text-[#064E3B] flex items-center justify-center flex-shrink-0">
                              {s.isGov ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M3 21h18 M5 21V10 M9 21V10 M15 21V10 M19 21V10 M3 10l9-6 9 6z" />
                                </svg>
                              ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4 8h16v12H4z M9 8V5h6v3 M4 13h16" />
                                </svg>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-base font-bold text-[#0B1F17] dark:text-white">{s.name}</span>
                              <span className="text-[13px] font-semibold text-[#55695F] dark:text-slate-400">{s.type}</span>
                            </div>
                          </div>

                          <span className="text-right text-base font-extrabold text-[#047857] dark:text-emerald-400 tabular-nums">
                            {s.ret.toFixed(2)}%
                          </span>

                          <span className="pl-6 text-[15px] font-semibold text-[#0B1F17] dark:text-white">
                            {s.tenor}
                          </span>

                          <span className="text-[15px] font-semibold text-[#55695F] dark:text-slate-400">
                            {s.payout}
                          </span>

                          <span className="text-right text-[15px] font-bold text-[#0B1F17] dark:text-white tabular-nums">
                            {s.min.toLocaleString('en-US')}
                          </span>

                          <div className="flex items-baseline gap-0.5 pl-6">
                            <span className="text-base font-extrabold text-[#047857] dark:text-emerald-400">
                              {s.score.toFixed(1)}
                            </span>
                            <span className="text-xs font-semibold text-[#55695F] dark:text-slate-400">/10</span>
                          </div>

                          <div className="text-right">
                            <button
                              onClick={() => handleBuySukuk({ type: 'buy_sukuk', amount: s.min, name: s.name })}
                              className="h-10 px-5 rounded-[14px] border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-[#047857] dark:text-emerald-400 font-bold text-sm hover:bg-[#D1FAE5]/40 transition-colors shadow-xs"
                            >
                              Invest
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </section>

                <p className="text-xs sm:text-sm font-medium text-[#55695F] dark:text-slate-400 leading-5">
                  Sample figures for demo. The Shariah score (out of 10) reflects each Sukuk&apos;s asset backing and structure review.
                </p>
              </div>
            </main>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 4: FAMILY (Unified Responsive Layout)                      */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'kameti' && (
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-10 max-w-6xl w-full mx-auto space-y-6">
              <div className="flex flex-col gap-6">
                <header className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#0B1F17] dark:text-white leading-tight">
                      {t('Family', 'خاندان')}
                    </h1>
                    <p className="text-xs sm:text-[15px] font-medium text-[#55695F] dark:text-slate-400 mt-1">
                      {familySubTab === 'kameti'
                        ? t('Save together in a rotating committee', 'گھومتی ہوئی کمیٹی میں مل کر بچت کریں')
                        : t('Preserve wealth for your family, in line with Shariah', 'شریعت کے مطابق اپنے خاندان کے لیے دولت کا تحفظ کریں')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <button
                      onClick={() => handleLangChange(lang === 'en' ? 'ur' : 'en')}
                      className="h-10 sm:h-11 px-4 sm:px-5 rounded-full border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-[#0B1F17] dark:text-white font-bold text-xs sm:text-[15px] shadow-xs hover:bg-[#F4F7F5] dark:bg-[#1C2029] transition-colors"
                    >
                      {lang === 'en' ? 'اردو' : 'EN'}
                    </button>
                    <button
                      onClick={() => setModal('deposit')}
                      className="h-10 sm:h-12 px-4 sm:px-6 rounded-[14px] bg-[#047857] hover:bg-[#064E3B] text-white font-bold text-xs sm:text-[15px] shadow-xs transition-colors"
                    >
                      {t('Add funds', 'رقم جمع کروائیں')}
                    </button>
                  </div>
                </header>

                {/* Subnav Pill Selector */}
                <nav aria-label="Family sections" className="flex gap-1 w-full sm:w-[360px] p-1 rounded-[14px] bg-[#E3ECE7] dark:bg-white/10">
                  <button
                    onClick={() => setFamilySubTab('kameti')}
                    className={`flex-1 h-10 sm:h-11 rounded-[12px] font-bold text-xs sm:text-[15px] flex items-center justify-center transition-all ${
                      familySubTab === 'kameti'
                        ? 'bg-white dark:bg-[#16171b] text-[#047857] dark:text-emerald-400 shadow-xs'
                        : 'text-[#55695F] dark:text-slate-400 hover:text-[#0B1F17]'
                    }`}
                  >
                    Kameti
                  </button>
                  <button
                    onClick={() => setFamilySubTab('inheritance')}
                    className={`flex-1 h-10 sm:h-11 rounded-[12px] font-bold text-xs sm:text-[15px] flex items-center justify-center transition-all ${
                      familySubTab === 'inheritance'
                        ? 'bg-white dark:bg-[#16171b] text-[#047857] dark:text-emerald-400 shadow-xs'
                        : 'text-[#55695F] dark:text-slate-400 hover:text-[#0B1F17]'
                    }`}
                  >
                    Inheritance
                  </button>
                </nav>

                {familySubTab === 'kameti' ? (
                  /* ── KAMETI RESPONSIVE VIEW ── */
                  <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-6 items-start">
                    <div className="flex flex-col gap-6">
                      {/* Monthly savings card */}
                      <section aria-label="Monthly savings" className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] p-5 sm:p-7 flex flex-col gap-5 shadow-xs">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="flex flex-col gap-0.5">
                            <h2 className="text-base sm:text-lg font-bold text-[#0B1F17] dark:text-white">Monthly savings</h2>
                            <p className="text-xs sm:text-sm font-medium text-[#55695F] dark:text-slate-400">This month&apos;s Kameti contribution</p>
                          </div>
                          <button
                            onClick={() => handleKametiContribute(25000)}
                            className="h-10 sm:h-12 px-5 sm:px-6 rounded-[14px] bg-[#047857] hover:bg-[#064E3B] text-white font-bold text-xs sm:text-[15px] shadow-xs transition-colors w-full sm:w-auto"
                          >
                            Pay contribution
                          </button>
                        </div>

                        <div className="flex items-baseline gap-2.5">
                          <span className="text-3xl sm:text-4xl font-extrabold text-[#0B1F17] dark:text-white leading-tight tabular-nums">
                            PKR 25,000
                          </span>
                          <span className="text-xs sm:text-[15px] font-semibold text-[#55695F] dark:text-slate-400">due this month</span>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="h-2 rounded-full bg-[#E3ECE7] dark:bg-white/10 overflow-hidden">
                            <div className="w-[66%] h-2 rounded-full bg-[#047857] dark:bg-emerald-400" />
                          </div>
                          <div className="flex justify-between text-xs sm:text-[13px] font-semibold text-[#55695F] dark:text-slate-400">
                            <span>2 of 3 members paid</span>
                            <span>Cycle 2 of 3</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:gap-4 border-t border-[#E3ECE7] dark:border-white/10 pt-5 text-center sm:text-left">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-[#55695F] dark:text-slate-400">Total pool</span>
                            <span className="text-sm sm:text-base font-extrabold text-[#0B1F17] dark:text-white">PKR 75,000</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-[#55695F] dark:text-slate-400">Your payout</span>
                            <span className="text-sm sm:text-base font-extrabold text-[#0B1F17] dark:text-white">Month 3</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-[#55695F] dark:text-slate-400">Next due</span>
                            <span className="text-sm sm:text-base font-extrabold text-[#0B1F17] dark:text-white">5th of month</span>
                          </div>
                        </div>
                      </section>

                      {/* Members and payouts table with overflow scroll */}
                      <section aria-label="Members and payouts" className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] overflow-x-auto shadow-xs">
                        <div className="min-w-[480px]">
                          <h2 className="px-5 sm:px-7 pt-5 sm:pt-6 pb-3 text-base sm:text-lg font-bold text-[#0B1F17] dark:text-white">Members and payouts</h2>
                          <div className="grid grid-cols-[minmax(0,1fr)_130px_100px_120px] items-center h-10 px-5 sm:px-7 text-xs font-bold tracking-wider uppercase text-[#55695F] dark:text-slate-400 bg-slate-50/50 dark:bg-white/[0.02]">
                            <span>Member</span>
                            <span>Contribution</span>
                            <span>Status</span>
                            <span className="text-right">Payout month</span>
                          </div>
                          {DESKTOP_KAMETI_MEMBERS.map((r) => (
                            <div
                              key={r.name}
                              className="grid grid-cols-[minmax(0,1fr)_130px_100px_120px] items-center h-14 px-5 sm:px-7 border-t border-[#E3ECE7] dark:border-white/10"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold ${r.avatar}`}>
                                  {r.letter}
                                </div>
                                <span className="text-sm sm:text-[15px] font-bold text-[#0B1F17] dark:text-white">{r.name}</span>
                              </div>
                              <span className="text-xs sm:text-[15px] font-bold text-[#0B1F17] dark:text-white">PKR 25,000</span>
                              <div>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${r.badge}`}>
                                  {r.status}
                                </span>
                              </div>
                              <span className="text-right text-xs sm:text-[15px] font-semibold text-[#55695F] dark:text-slate-400">
                                {r.payout}
                              </span>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>

                    {/* Right: Kameti details card */}
                    <section aria-label="Kameti details" className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] p-5 sm:p-7 flex flex-col gap-5 shadow-xs">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col gap-0.5">
                          <h2 className="text-base sm:text-lg font-bold text-[#0B1F17] dark:text-white">Kameti details</h2>
                          <p className="text-xs sm:text-sm font-medium text-[#55695F] dark:text-slate-400">Rotating committee</p>
                        </div>
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full bg-[#D1FAE5] text-[#064E3B] font-extrabold text-xs flex items-center justify-center border-2 border-white dark:border-[#16171b]">A</div>
                          <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#92400E] font-extrabold text-xs flex items-center justify-center border-2 border-white dark:border-[#16171b]">B</div>
                          <div className="w-8 h-8 rounded-full bg-[#E3ECE7] text-[#55695F] font-extrabold text-xs flex items-center justify-center border-2 border-white dark:border-[#16171b]">C</div>
                        </div>
                      </div>

                      <div className="divide-y divide-[#E3ECE7] dark:divide-white/10">
                        <div className="flex justify-between items-center py-3">
                          <span className="text-xs font-bold tracking-wider uppercase text-[#55695F] dark:text-slate-400">Monthly contribution</span>
                          <span className="text-sm sm:text-base font-bold text-[#0B1F17] dark:text-white">PKR 25,000</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-xs font-bold tracking-wider uppercase text-[#55695F] dark:text-slate-400">Total pool</span>
                          <span className="text-sm sm:text-base font-bold text-[#0B1F17] dark:text-white">PKR 75,000</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-xs font-bold tracking-wider uppercase text-[#55695F] dark:text-slate-400">Your payout month</span>
                          <span className="text-sm sm:text-base font-bold text-[#0B1F17] dark:text-white">Month 3</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-xs font-bold tracking-wider uppercase text-[#55695F] dark:text-slate-400">Shariah compliance</span>
                          <span className="text-sm sm:text-base font-bold text-[#047857] dark:text-emerald-400">100% Qard Hasan</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 pt-2">
                        <button
                          onClick={() => handleKametiContribute(25000)}
                          className="h-11 sm:h-[52px] rounded-[14px] bg-[#047857] hover:bg-[#064E3B] text-white font-bold text-sm sm:text-base shadow-xs transition-colors"
                        >
                          Start a Kameti
                        </button>
                        <button
                          onClick={() => {}}
                          className="h-11 sm:h-[52px] rounded-[14px] border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-[#0B1F17] dark:text-white font-bold text-sm sm:text-base hover:bg-[#F4F7F5] dark:bg-[#1C2029] transition-colors"
                        >
                          Invite members
                        </button>
                      </div>
                    </section>
                  </div>
                ) : (
                  /* ── INHERITANCE RESPONSIVE VIEW ── */
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-6 items-start">
                      <div className="flex flex-col gap-6">
                        <section aria-label="Inheritance plan" className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] p-5 sm:p-7 flex items-center gap-4 sm:gap-5 shadow-xs">
                          <div className="w-12 sm:w-14 h-12 sm:h-14 flex-none rounded-[16px] bg-[#D1FAE5] text-[#047857] flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M12 3v18 M7 21h10 M5 7h14 M5 7l-3 7a3.5 3.5 0 0 0 6 0z M19 7l-3 7a3.5 3.5 0 0 0 6 0z" />
                            </svg>
                          </div>
                          <div className="flex flex-col gap-1">
                            <h2 className="text-lg sm:text-[22px] font-extrabold text-[#0B1F17] dark:text-white">Inheritance</h2>
                            <p className="text-xs sm:text-[15px] font-medium text-[#55695F] dark:text-slate-400 leading-snug">
                              Add your heirs and see each share calculated by Shariah inheritance rules.
                            </p>
                          </div>
                        </section>

                        {/* Shariah shares table with horizontal scroll */}
                        <section aria-label="Shariah shares" className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] overflow-x-auto shadow-xs">
                          <div className="min-w-[480px]">
                            <h2 className="px-5 sm:px-7 pt-5 sm:pt-6 pb-3 text-base sm:text-lg font-bold text-[#0B1F17] dark:text-white">Shariah shares</h2>
                            <div className="grid grid-cols-[minmax(0,1fr)_140px_90px_130px] items-center h-10 px-5 sm:px-7 text-xs font-bold tracking-wider uppercase text-[#55695F] dark:text-slate-400 bg-slate-50/50 dark:bg-white/[0.02]">
                              <span>Heir</span>
                              <span>Relation</span>
                              <span className="text-right">Share</span>
                              <span className="text-right">Amount (PKR)</span>
                            </div>

                            {DESKTOP_INHERITANCE_HEIRS.map((r) => (
                              <div
                                key={r.name}
                                className="grid grid-cols-[minmax(0,1fr)_140px_90px_130px] items-center h-14 px-5 sm:px-7 border-t border-[#E3ECE7] dark:border-white/10"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold ${r.avatar}`}>
                                    {r.letter}
                                  </div>
                                  <span className="text-sm sm:text-[15px] font-bold text-[#0B1F17] dark:text-white">{r.name}</span>
                                </div>
                                <span className="text-xs sm:text-[15px] font-semibold text-[#55695F] dark:text-slate-400">{r.relation}</span>
                                <span className="text-right text-xs sm:text-[15px] font-extrabold text-[#047857] dark:text-emerald-400">{r.share}</span>
                                <span className="text-right text-xs sm:text-[15px] font-bold text-[#0B1F17] dark:text-white tabular-nums">{r.amount}</span>
                              </div>
                            ))}

                            <p className="px-5 sm:px-7 py-4 border-t border-[#E3ECE7] dark:border-white/10 text-xs sm:text-[13px] font-medium text-[#55695F] dark:text-slate-400 leading-snug">
                              Shares follow Shariah inheritance rules. Confirm your final plan with a qualified scholar.
                            </p>
                          </div>
                        </section>
                      </div>

                      {/* Right: Estate summary */}
                      <div className="flex flex-col gap-6">
                        <section aria-label="Estate summary" className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] p-5 sm:p-7 flex flex-col shadow-xs">
                          <h2 className="text-base sm:text-lg font-bold text-[#0B1F17] dark:text-white mb-3">Estate summary</h2>
                          <div className="divide-y divide-[#E3ECE7] dark:divide-white/10">
                            <div className="flex justify-between items-center py-3">
                              <span className="text-xs sm:text-[15px] font-semibold text-[#55695F] dark:text-slate-400">Cash and savings</span>
                              <span className="text-sm sm:text-base font-bold text-[#0B1F17] dark:text-white">PKR 62,500</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                              <span className="text-xs sm:text-[15px] font-semibold text-[#55695F] dark:text-slate-400">Investments</span>
                              <span className="text-sm sm:text-base font-bold text-[#0B1F17] dark:text-white">PKR 250,000</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                              <span className="text-xs sm:text-[15px] font-semibold text-[#55695F] dark:text-slate-400">Liabilities due</span>
                              <span className="text-sm sm:text-base font-bold text-[#0B1F17] dark:text-white">PKR 0</span>
                            </div>
                            <div className="flex justify-between items-center py-3 pt-4">
                              <span className="text-xs sm:text-[15px] font-extrabold text-[#0B1F17] dark:text-white">Estate to distribute</span>
                              <span className="text-base sm:text-lg font-extrabold text-[#047857] dark:text-emerald-400">PKR 312,500</span>
                            </div>
                          </div>
                        </section>

                        <div className="flex flex-col gap-3">
                          <button
                            onClick={() => setActiveTab('mufti')}
                            className="h-11 sm:h-[52px] rounded-[14px] bg-[#047857] hover:bg-[#064E3B] text-white font-bold text-sm sm:text-base shadow-xs transition-colors flex items-center justify-center"
                          >
                            Ask AI Mufti
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2">
                      <WirasatCalculator portfolioValue={312500} />
                    </div>
                  </div>
                )}
              </div>
            </main>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 5: ZAKAT (Unified Responsive Layout)                       */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'zakat' && (
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-10 max-w-6xl w-full mx-auto space-y-6">
              <div className="flex flex-col gap-6">
                <header className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#0B1F17] dark:text-white leading-tight">
                      {t('Zakat', 'زکوٰۃ')}
                    </h1>
                    <p className="text-xs sm:text-[15px] font-medium text-[#55695F] dark:text-slate-400 mt-1">
                      {t('Nisab and 2.5% calculated from live gold and silver prices', 'سونے اور چاندی کی لائیو قیمتوں پر مبنی نصاب اور 2.5 فیصد حساب')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <button
                      onClick={() => handleLangChange(lang === 'en' ? 'ur' : 'en')}
                      className="h-10 sm:h-11 px-4 sm:px-5 rounded-full border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-[#0B1F17] dark:text-white font-bold text-xs sm:text-[15px] shadow-xs hover:bg-[#F4F7F5] dark:bg-[#1C2029] transition-colors"
                    >
                      {lang === 'en' ? 'اردو' : 'EN'}
                    </button>
                    <button
                      onClick={() => setModal('deposit')}
                      className="h-10 sm:h-12 px-4 sm:px-6 rounded-[14px] bg-[#047857] hover:bg-[#064E3B] text-white font-bold text-xs sm:text-[15px] shadow-xs transition-colors"
                    >
                      {t('Add funds', 'رقم جمع کروائیں')}
                    </button>
                  </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-6 items-start">
                  {/* Left Column: Rates & Calculator */}
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-3 sm:gap-6">
                      <div className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] p-4 sm:p-6 flex flex-col gap-1 shadow-xs">
                        <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#55695F] dark:text-slate-400">Gold, live</span>
                        <span className="text-lg sm:text-[22px] font-extrabold text-[#0B1F17] dark:text-white tabular-nums">PKR 248,500/tola</span>
                      </div>
                      <div className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] p-4 sm:p-6 flex flex-col gap-1 shadow-xs">
                        <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#55695F] dark:text-slate-400">Silver, live</span>
                        <span className="text-lg sm:text-[22px] font-extrabold text-[#0B1F17] dark:text-white tabular-nums">PKR 2,950/tola</span>
                      </div>
                    </div>

                    <section aria-label="Zakat calculator" className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] p-5 sm:p-8 flex flex-col gap-6 shadow-xs">
                      <h2 className="text-base sm:text-lg font-bold text-[#0B1F17] dark:text-white">Eligible wealth</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <label className="flex flex-col gap-2 text-xs sm:text-sm font-bold text-[#0B1F17] dark:text-white">
                          <span>Cash and savings</span>
                          <input
                            type="number"
                            value={zakatSavings}
                            onChange={(e) => setZakatSavings(Number(e.target.value))}
                            className="h-12 sm:h-14 px-4 sm:px-5 rounded-[14px] border border-[#E3ECE7] dark:border-white/10 bg-[#F4F7F5] dark:bg-white/5 font-semibold text-base sm:text-[17px] text-[#0B1F17] dark:text-white outline-none"
                          />
                        </label>
                        <label className="flex flex-col gap-2 text-xs sm:text-sm font-bold text-[#0B1F17] dark:text-white">
                          <span>Investments</span>
                          <input
                            type="number"
                            value={zakatInvestments}
                            onChange={(e) => setZakatInvestments(Number(e.target.value))}
                            className="h-12 sm:h-14 px-4 sm:px-5 rounded-[14px] border border-[#E3ECE7] dark:border-white/10 bg-[#F4F7F5] dark:bg-white/5 font-semibold text-base sm:text-[17px] text-[#0B1F17] dark:text-white outline-none"
                          />
                        </label>
                        <label className="flex flex-col gap-2 text-xs sm:text-sm font-bold text-[#0B1F17] dark:text-white">
                          <span>Gold (tola)</span>
                          <input
                            type="number"
                            value={zakatGoldTola || ''}
                            placeholder="0"
                            onChange={(e) => setZakatGoldTola(Number(e.target.value))}
                            className="h-12 sm:h-14 px-4 sm:px-5 rounded-[14px] border border-[#E3ECE7] dark:border-white/10 bg-[#F4F7F5] dark:bg-white/5 font-semibold text-base sm:text-[17px] text-[#0B1F17] dark:text-white outline-none"
                          />
                        </label>
                        <label className="flex flex-col gap-2 text-xs sm:text-sm font-bold text-[#0B1F17] dark:text-white">
                          <span>Silver (tola)</span>
                          <input
                            type="number"
                            value={zakatSilverTola || ''}
                            placeholder="0"
                            onChange={(e) => setZakatSilverTola(Number(e.target.value))}
                            className="h-12 sm:h-14 px-4 sm:px-5 rounded-[14px] border border-[#E3ECE7] dark:border-white/10 bg-[#F4F7F5] dark:bg-white/5 font-semibold text-base sm:text-[17px] text-[#0B1F17] dark:text-white outline-none"
                          />
                        </label>
                      </div>

                      <label className="flex flex-col gap-2 text-xs sm:text-sm font-bold text-[#0B1F17] dark:text-white">
                        <span>Liabilities due</span>
                        <input
                          type="number"
                          value={zakatLiabilities || ''}
                          placeholder="PKR 0"
                          onChange={(e) => setZakatLiabilities(Number(e.target.value))}
                          className="h-12 sm:h-14 px-4 sm:px-5 rounded-[14px] border border-[#E3ECE7] dark:border-white/10 bg-[#F4F7F5] dark:bg-white/5 font-semibold text-base sm:text-[17px] text-[#0B1F17] dark:text-white outline-none"
                        />
                      </label>
                    </section>
                  </div>

                  {/* Right Column: Zakat Due, Summary, Causes & Pay Button */}
                  <div className="flex flex-col gap-6">
                    <section aria-label="Zakat due" className="bg-[#FEF3C7] dark:bg-amber-950/40 border border-[#FDE68A] dark:border-amber-800/40 rounded-[20px] p-5 sm:p-7 flex flex-col gap-1 shadow-xs">
                      <span className="text-xs font-bold tracking-wider uppercase text-[#92400E] dark:text-amber-400">Zakat due</span>
                      <span className="text-3xl sm:text-[40px] font-extrabold text-[#92400E] dark:text-amber-400 leading-tight sm:leading-12 tabular-nums">
                        PKR {zakatDue.toLocaleString()}
                      </span>
                      <span className="text-xs sm:text-[15px] font-semibold text-[#92400E] dark:text-amber-400/90 mt-1">
                        2.5% of eligible wealth · Above Nisab
                      </span>
                    </section>

                    <section aria-label="Summary" className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] p-5 sm:p-7 flex flex-col divide-y divide-[#E3ECE7] dark:divide-white/10 shadow-xs">
                      <div className="flex justify-between items-center py-3">
                        <span className="text-xs sm:text-[15px] font-semibold text-[#55695F] dark:text-slate-400">Eligible wealth</span>
                        <span className="text-sm sm:text-base font-extrabold text-[#0B1F17] dark:text-white tabular-nums">
                          PKR {(zakatSavings + zakatInvestments + (zakatGoldTola * 248500) + (zakatSilverTola * 2950) - zakatLiabilities).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-xs sm:text-[15px] font-semibold text-[#55695F] dark:text-slate-400">Nisab threshold</span>
                        <span className="text-sm sm:text-base font-extrabold text-[#0B1F17] dark:text-white tabular-nums">PKR 154,875</span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-xs sm:text-[15px] font-semibold text-[#55695F] dark:text-slate-400">Rate</span>
                        <span className="text-sm sm:text-base font-extrabold text-[#047857] dark:text-emerald-400">2.5%</span>
                      </div>
                    </section>

                    <section aria-label="Pay Zakat to" className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] p-5 sm:p-7 flex flex-col gap-4 shadow-xs">
                      <h2 className="text-base sm:text-lg font-bold text-[#0B1F17] dark:text-white">Pay Zakat to</h2>
                      <div className="grid grid-cols-2 gap-3">
                        {DESKTOP_ZAKAT_CAUSES.map((c) => {
                          const isSel = selectedZakatCause === c.label;
                          return (
                            <button
                              key={c.label}
                              type="button"
                              onClick={() => setSelectedZakatCause(c.label)}
                              className={`h-14 sm:h-16 px-3 sm:px-4 rounded-[14px] flex items-center gap-2 sm:gap-3 font-bold text-xs sm:text-[15px] text-left transition-all ${
                                isSel
                                  ? 'border-2 border-[#047857] bg-[#D1FAE5] dark:bg-emerald-950/60 text-[#064E3B] dark:text-emerald-300 shadow-xs'
                                  : 'border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-[#0B1F17] dark:text-white hover:bg-[#F4F7F5] dark:bg-[#1C2029]'
                              }`}
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                                <path d={c.d} />
                              </svg>
                              <span className="truncate">{c.label}</span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-xs sm:text-[13px] font-medium text-[#55695F] dark:text-slate-400 leading-snug">
                        Next, choose a verified organization and confirm the amount.
                      </p>
                    </section>

                    <button
                      onClick={() => handleZakatDonation(zakatDue, selectedZakatCause)}
                      className="h-12 sm:h-14 rounded-[14px] bg-[#047857] hover:bg-[#064E3B] text-white font-bold text-sm sm:text-base shadow-xs transition-colors"
                    >
                      Pay Zakat
                    </button>
                  </div>
                </div>
              </div>
            </main>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 6: AI MUFTI (Unified Responsive Layout)                   */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'mufti' && (
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-10 max-w-6xl w-full mx-auto space-y-6">
              <div className="flex flex-col gap-6 min-h-[calc(100vh-140px)]">
                <header className="flex flex-wrap justify-between items-start gap-4 flex-none">
                  <div>
                    <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#0B1F17] dark:text-white leading-tight">
                      {t('AI Mufti', 'مفتی اے آئی')}
                    </h1>
                    <p className="text-xs sm:text-[15px] font-medium text-[#55695F] dark:text-slate-400 mt-1">
                      {t('Ask questions in Urdu or English, by text or voice', 'اردو یا انگریزی میں، لکھ کر یا آواز کے ذریعے سوال پوچھیں')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <button
                      onClick={() => handleLangChange(lang === 'en' ? 'ur' : 'en')}
                      className="h-10 sm:h-11 px-4 sm:px-5 rounded-full border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-[#0B1F17] dark:text-white font-bold text-xs sm:text-[15px] shadow-xs hover:bg-[#F4F7F5] dark:bg-[#1C2029] transition-colors"
                    >
                      {lang === 'en' ? 'اردو' : 'EN'}
                    </button>
                    <button
                      onClick={() => setModal('deposit')}
                      className="h-10 sm:h-12 px-4 sm:px-6 rounded-[14px] bg-[#047857] hover:bg-[#064E3B] text-white font-bold text-xs sm:text-[15px] shadow-xs transition-colors"
                    >
                      {t('Add funds', 'رقم جمع کروائیں')}
                    </button>
                  </div>
                </header>

                <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-stretch">
                  {/* Left: Chat Conversation Window */}
                  <section aria-label="Conversation" className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] flex flex-col min-h-[500px] overflow-hidden shadow-xs">
                    <div className="flex items-center gap-3.5 px-5 sm:px-7 py-4 sm:py-5 border-b border-[#E3ECE7] dark:border-white/10 flex-none">
                      <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-full bg-[#047857] flex items-center justify-center text-white shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base sm:text-lg font-extrabold text-[#0B1F17] dark:text-white">AI Mufti</span>
                        <span className="text-xs sm:text-[13px] font-medium text-[#55695F] dark:text-slate-400">Urdu or English, text or voice</span>
                      </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 min-h-[300px] max-h-[55vh] p-4 sm:p-7 flex flex-col gap-4 overflow-y-auto bg-[#F4F7F5] dark:bg-black/20">
                      {muftiMessages.map((m, i) => (
                        <div
                          key={i}
                          className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-[520px] px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base leading-6 shadow-xs ${
                              m.role === 'user'
                                ? 'bg-[#064E3B] text-white rounded-[20px_20px_6px_20px] font-semibold'
                                : 'bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 text-[#0B1F17] dark:text-white rounded-[20px_20px_20px_6px] font-medium'
                            }`}
                          >
                            {m.text}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer Controls */}
                    <div className="p-4 sm:p-6 border-t border-[#E3ECE7] dark:border-white/10 flex flex-col gap-3 sm:gap-4 flex-none bg-white dark:bg-[#16171b]">
                      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
                        {['Is Meezan Bank compliant?', 'Zakat on gold', 'How does dividend purification work?'].map((sug) => (
                          <button
                            key={sug}
                            type="button"
                            onClick={() => handleSendMuftiMessage(sug)}
                            className="h-9 sm:h-11 px-3 sm:px-5 rounded-full border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 font-semibold text-xs sm:text-sm text-[#0B1F17] dark:text-white hover:bg-[#F4F7F5] dark:bg-[#1C2029] transition-colors shadow-xs whitespace-nowrap shrink-0"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3">
                        <input
                          type="text"
                          value={muftiInput}
                          onChange={(e) => setMuftiInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMuftiMessage()}
                          placeholder="Ask a question"
                          className="flex-1 h-12 sm:h-14 px-4 sm:px-6 rounded-full border border-[#E3ECE7] dark:border-white/10 bg-[#F4F7F5] dark:bg-white/5 font-medium text-sm sm:text-base text-[#0B1F17] dark:text-white outline-none focus:border-[#047857]"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendMuftiMessage()}
                          aria-label="Ask by voice or send"
                          className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-[#047857] hover:bg-[#064E3B] text-white flex items-center justify-center flex-shrink-0 shadow-sm transition-colors active:scale-95"
                        >
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z M6 11a6 6 0 0 0 12 0 M12 17v4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Right: Screening standards & AAOIFI cards */}
                  <aside className="flex flex-col gap-6">
                    <section aria-label="Screening standards" className="bg-white dark:bg-[#16171b] border border-[#E3ECE7] dark:border-white/10 rounded-[20px] p-5 sm:p-7 flex flex-col gap-2 shadow-xs">
                      <h2 className="text-base sm:text-lg font-bold text-[#0B1F17] dark:text-white mb-2">Screening standards</h2>
                      {[
                        { value: '33%', label: 'Debt limit', desc: 'Interest-bearing debt under 33% of market cap.' },
                        { value: '5%', label: 'Impure income', desc: 'Fully purified through charity.' },
                        { value: '10%', label: 'Real assets', desc: 'At least 10% of total assets are tangible.' },
                      ].map((std) => (
                        <div key={std.label} className="flex items-center gap-4 py-3 sm:py-3.5 border-t border-[#E3ECE7] dark:border-white/10">
                          <span className="w-14 sm:w-16 text-xl sm:text-2xl font-extrabold text-[#047857] dark:text-emerald-400">{std.value}</span>
                          <div className="flex flex-col">
                            <span className="text-sm sm:text-[15px] font-bold text-[#0B1F17] dark:text-white">{std.label}</span>
                            <span className="text-xs sm:text-[13px] font-medium text-[#55695F] dark:text-slate-400 leading-snug">{std.desc}</span>
                          </div>
                        </div>
                      ))}
                    </section>

                    <section aria-label="Shariah board" className="bg-[#D1FAE5] dark:bg-emerald-950/60 rounded-[20px] p-5 sm:p-6 flex flex-col gap-1.5 shadow-xs">
                      <span className="text-xs font-bold tracking-wider uppercase text-[#064E3B] dark:text-emerald-300">
                        AAOIFI standards
                      </span>
                      <span className="text-xs sm:text-[15px] font-semibold text-[#064E3B] dark:text-emerald-200 leading-snug">
                        Answers follow Shariah-screened data and independent scholar review.
                      </span>
                    </section>
                  </aside>
                </div>
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
                          ? 'bg-white dark:bg-[#15181F] text-[#0B1F17] shadow-xs'
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
                  className="flex w-full items-center justify-between p-5 hover:bg-red-50/50 dark:hover:bg-red-50 dark:bg-red-950/600/5 transition-colors text-left"
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
          <div className="relative w-full max-w-md max-h-[90dvh] sm:max-h-[85vh] overflow-y-auto rounded-t-[24px] sm:rounded-[24px] border border-[#E3ECE7] dark:border-[#262B35] p-5 sm:p-6 shadow-2xl bg-white dark:bg-[#15181F]">
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
          <div className="relative w-full max-w-md max-h-[90dvh] sm:max-h-[85vh] overflow-y-auto rounded-t-[24px] sm:rounded-[24px] border border-[#E3ECE7] dark:border-[#262B35] p-5 sm:p-6 bg-white dark:bg-[#15181F] shadow-2xl">
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
        {NAV_ITEMS.filter((n) => ['home', 'portfolio', 'assets', 'kameti', 'zakat', 'mufti'].includes(n.id)).map((item) => {
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
