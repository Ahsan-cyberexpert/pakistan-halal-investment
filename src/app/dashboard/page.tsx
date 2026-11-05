'use client';
import { useState, useEffect } from 'react';
import {
  DepositFlow,
  WithdrawFlow,
  BalanceCard,
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
  SettingsTab,
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
  const [darkMode, setDarkMode] = useState(false);

  const [showTradingPin, setShowTradingPin] = useState(false);
  const [pendingTrade, setPendingTrade] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [pendingTx, setPendingTx] = useState<any>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);
  const [selectedSellHolding, setSelectedSellHolding] = useState<Holding | null>(null);

  const t = (en: string, ur: string) => lang === 'ur' ? ur : en;

  const toggleDark = (val: boolean) => {
    setDarkMode(val); localStorage.setItem('roziq_dark', val ? '1' : '0');
    if (val) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('roziq_lang') as 'en' | 'ur';
    const hasOnboarded = localStorage.getItem('roziq_onboarded');
    const savedDark = localStorage.getItem('roziq_dark');
    if (!savedLang) setShowLangSelect(true);
    else { setLangState(savedLang); if (!hasOnboarded) setShowOnboarding(true); }
    if (savedDark === '1') { setDarkMode(true); document.documentElement.classList.add('dark'); }
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

  const totalInvestedHistory = holdings.reduce((sum, h) => sum + h.invested, 0);
  const totalRealizedProfit = transactions.reduce((sum, t) => sum + (t.profit || 0), 0);
  const isPremium = totalInvestedHistory >= WALI_INVESTED_THRESHOLD && totalRealizedProfit >= WALI_PROFIT_THRESHOLD;
  const pendingDemoAmount = transactions.filter((tx) => tx.status === 'PENDING').reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const handleTransactionSuccess = async (data: any) => {
    if (['buy_stock', 'sell_stock', 'buy_sukuk', 'zakat', 'withdraw', 'health_save', 'overseas_invest'].includes(data.type)) {
      setPendingTx(data); setIsScanning(true); return;
    }
    await processTransaction(data);
  };

  const processTransaction = async (data: any) => {
    let newBal = balance; let newHoldings = [...holdings]; let newTxs = [...transactions]; let newZk = [...zakatHistory];
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
      newBal += data.amount;
      txRecord.profit = data.realizedPnl;
      newTxs.unshift(txRecord);
    }
    else if (['buy_sukuk', 'health_save', 'overseas_invest'].includes(data.type)) { newBal -= data.amount; newTxs.unshift(txRecord); }
    else if (data.type === 'zakat') { newBal -= data.amount; newZk.unshift({ date: new Date().toISOString(), amount: data.amount, recipient: data.recipient }); newTxs.unshift(txRecord); }

    txRecord.balanceAfter = newBal;

    setBalance(newBal); setHoldings(newHoldings); setTransactions(newTxs); setZakatHistory(newZk);
    persistUserData(newBal, newHoldings, newTxs, newZk);
    setModal(null); setIsScanning(false); setPendingTx(null);
  };

  const onScanComplete = () => { if (pendingTx) processTransaction(pendingTx); };

  const handleSellRequest = (data: any) => {
    setSelectedSellHolding(null);
    setPendingTrade(data);
    setShowTradingPin(true);
  };

  const initiateBuyStock = (symbol: string, amount: number) => {
    const stock = getStockBySymbol(symbol); if (!stock) return;
    setPendingTrade({ type: 'buy_stock', amount, symbol: stock.symbol, name: stock.name, units: amount / stock.price });
    setShowTradingPin(true);
  };

  const initiateSecureTransaction = (data: any) => {
    setPendingTrade(data);
    setShowTradingPin(true);
  };

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

  return (
    <>
      <ToastContainer />
      {showLangSelect && <LanguageSelect onSelect={handleLangSelect} />}
      {showOnboarding && !showLangSelect && <Onboarding lang={lang} onComplete={() => { setShowOnboarding(false); localStorage.setItem('roziq_onboarded', '1'); }} />}
      {!isAuthorized && !showLangSelect && !showOnboarding && <AuthGate onSuccess={handleAuthSuccess} />}
      {showTradingPin && <PinSecurity mode="trading" onSuccess={handleTradingPinSuccess} onCancel={() => { setShowTradingPin(false); setPendingTrade(null); }} />}
      
      {/* Custom Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-[5000] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-inner border border-red-200">🗑️</div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">{t('Reset All Demo Data?', 'کیا آپ واقعی تمام فرضی ڈیٹا ری سیٹ کرنا چاہتے ہیں؟')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {t('This will permanently delete your CNIC account, virtual cash balance, and mock transaction history. You will be redirected to the onboarding screen.', 'اس سے آپ کا CNIC اکاؤنٹ، ورچوئل کیش بیلنس اور فرضی ٹرانزیکشن ہسٹری مکمل طور پر ڈیلیٹ ہو جائے گی۔ آپ کو دوبارہ لاگ ان کرنا ہوگا۔')}
            </p>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setShowResetModal(false)} 
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all active:scale-95 shadow-sm"
              >
                {t('Cancel', 'کینسل')}
              </button>
              <button 
                onClick={executeReset} 
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs shadow-md transition-all active:scale-95"
              >
                {t('Yes, Delete All', 'ہاں، ڈیلیٹ کریں')}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedReceipt && <DemoReceipt transaction={selectedReceipt} onClose={() => setSelectedReceipt(null)} lang={lang} />}

      {/* Master AI Agent (Voice + Write + Linked Accounts) */}
      <RoziqAI balance={balance} holdings={holdings} transactions={transactions} lang={lang} />

      <div className="min-h-screen mobile-content-safe text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden" style={{ background: 'var(--bg-primary)' }} dir={lang === 'ur' ? 'rtl' : 'ltr'}>
        {/* Top Header */}
        <header className="app-header-safe sticky top-0 z-50 backdrop-blur-xl border-b px-3 sm:px-6 py-2.5 sm:py-3 flex justify-between items-center shadow-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-base sm:text-lg shadow-md shadow-emerald-900/20 flex-shrink-0">🇵🇰</div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>ROZIQ</h1>
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-1.5 sm:px-2 py-0.5" role="status">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider">Demo</span>
                </div>
              </div>
              <p className="text-[8px] sm:text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] truncate max-w-[120px] sm:max-w-none">
                {currentUser ? currentUser.name : t('Wealth OS', 'ویلتھ او ایس')}
              </p>
            </div>
            {/* Desktop tab name breadcrumb */}
            <div className="hidden lg:flex items-center gap-1.5 ml-2" style={{ color: 'var(--text-muted)' }}>
              <span className="text-xs">/</span>
              <span className="text-xs font-black uppercase tracking-widest capitalize" style={{ color: 'var(--text-secondary)' }}>
                {activeTab === 'home' ? 'Dashboard' : activeTab === 'portfolio' ? 'Halal Stocks' : activeTab === 'assets' ? 'Sovereign Assets' : activeTab === 'kameti' ? 'Family & Takaful' : activeTab === 'zakat' ? 'Zakat & Impact' : 'Settings'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {currentUser?.isOverseas && (
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1">
                <span>🌍</span> <span className="hidden sm:inline">{currentUser.country || 'Overseas'}</span>
              </span>
            )}

            {isPremium && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 rounded-xl text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider shadow-sm">
                <span>⭐</span> <span className="hidden sm:inline">Elite</span>
              </span>
            )}

            {/* Reset Demo Data */}
            <button
              onClick={() => setShowResetModal(true)}
              title={t('Delete Account & Reset Demo Data', 'اکاؤنٹ ڈیلیٹ کریں اور ڈیٹا ری سیٹ کریں')}
              aria-label={t('Reset demo account', 'ڈیمو اکاؤنٹ ری سیٹ کریں')}
              className="touch-target px-2.5 py-1.5 sm:px-3 sm:py-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 hover:border-red-500 rounded-xl text-[10px] sm:text-xs font-black transition-all active:scale-95 flex items-center gap-1 shadow-sm"
            >
              <span>🗑️</span> <span className="hidden sm:inline">{t('Reset Demo', 'ری سیٹ')}</span>
            </button>

            <button aria-label={t('Notifications', 'اطلاعات')} className="touch-target rounded-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-90 text-xs sm:text-sm shadow-sm" style={{ background: 'var(--bg-card)' }}>
              🔔
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              title={t('Settings', 'سیٹنگز')}
              aria-label={t('Open settings', 'سیٹنگز کھولیں')}
              className={`touch-target rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 border-2 shadow-md transition-all active:scale-90 ${activeTab === 'settings' ? 'border-emerald-400 scale-105 shadow-emerald-500/30' : 'border-white'}`}
            >
              <div className="w-full h-full rounded-xl border border-black/10 flex items-center justify-center text-white text-xs font-black">
                {currentUser ? currentUser.name.charAt(0).toUpperCase() : '⚙'}
              </div>
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4">
          <DemoModeBanner lang={lang} />
        </div>
        {/* Widescreen Responsive Layout Grid (max-w-7xl) */}
        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Wallet Overview & Navigation */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-6 lg:sticky lg:top-20 z-10">
              <BalanceCard balance={balance} portfolioValue={totalPortfolioValue} onDeposit={() => setModal('deposit')} onWithdraw={() => setModal('withdraw')} />
              
              {isPremium && (
                <div className="hidden lg:block">
                  <WaliAutopilot lang={lang} />
                </div>
              )}

              {/* Desktop Sidebar Navigation */}
              <div className="hidden lg:block rounded-3xl p-4 border shadow-sm space-y-1" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <p className="text-[9px] font-black uppercase tracking-widest px-3 mb-3" style={{ color: 'var(--text-muted)' }}>
                  {t('Navigation', 'نیویگیشن')}
                </p>
                {[
                  { id: 'home', icon: '🏠', labelEn: 'Dashboard', labelUr: 'ڈیش بورڈ', sub: t('Overview & Activity', 'جائزہ') },
                  { id: 'portfolio', icon: '📈', labelEn: 'Halal Stocks', labelUr: 'حلال اسٹاکس', sub: t('PSX Screened', 'PSX اسکریند') },
                  { id: 'assets', icon: '🏛️', labelEn: 'Sovereign Assets', labelUr: 'خود مختار اثاثے', sub: t('Sukuk, Hajj, Agri', 'سکوک، حج') },
                  { id: 'kameti', icon: '🤝', labelEn: 'Family & Takaful', labelUr: 'فیملی ہیلتھ تکافل', sub: t('Health & Kameti', 'صحت') },
                  { id: 'zakat', icon: '🕋', labelEn: 'Zakat & Impact', labelUr: 'زکوٰۃ اور اثر', sub: t('Social Finance', 'سماجی مالیات') },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition-all duration-200 group/nav ${
                      activeTab === tab.id
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                        : 'hover:bg-emerald-50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 transition-all ${
                      activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 group-hover/nav:bg-emerald-100'
                    }`}>
                      {tab.icon}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-xs font-black tracking-tight ${activeTab === tab.id ? 'text-white' : ''}`} style={activeTab !== tab.id ? { color: 'var(--text-primary)' } : {}}>
                        {lang === 'ur' ? tab.labelUr : tab.labelEn}
                      </div>
                      <div className={`text-[9px] font-medium truncate ${activeTab === tab.id ? 'text-emerald-100' : ''}`} style={activeTab !== tab.id ? { color: 'var(--text-muted)' } : {}}>
                        {tab.sub}
                      </div>
                    </div>
                    {activeTab === tab.id && <span className="ml-auto text-white/60 text-xs">→</span>}
                  </button>
                ))}

                {/* Zakat Eligibility Indicator */}
                {isZakatEligible && (
                  <div className="mx-1 mt-2 p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🕋</span>
                      <div>
                        <div className="text-[10px] font-black text-amber-800">{t('Zakat Due', 'زکوٰۃ واجب')}</div>
                        <div className="text-[9px] text-amber-600 font-medium">{t('You are Nisab eligible', 'آپ نصاب کی شرط پوری کرتے ہیں')}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-3 mt-2 border-t px-1" style={{ borderColor: 'var(--border-color)' }}>
                  <button 
                    onClick={() => setShowResetModal(true)}
                    className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 hover:border-red-500 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>🗑️</span> {t('Delete Account & Demo Data', 'اکاؤنٹ اور فرضی ڈیٹا ڈیلیٹ کریں')}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Tab Panels */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-6">
              {/* HOME TAB */}
              {activeTab === 'home' && (
                <div className="space-y-4 sm:space-y-6 pb-20">
                  <div className="block lg:hidden">
                    {isPremium && <WaliAutopilot lang={lang} />}
                  </div>

                  <DemoWealthSummary cash={balance} invested={totalPortfolioValue} pending={pendingDemoAmount} zakatDue={isZakatEligible} lang={lang} />

                  <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5" aria-labelledby="next-demo-action-title" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white" aria-hidden="true">→</div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">{t('Next demo action', 'اگلا ڈیمو ایکشن')}</p>
                        <h2 id="next-demo-action-title" className="mt-1 text-base font-black text-emerald-950">
                          {holdings.length === 0 ? t('Explore a halal stock before reviewing your portfolio.', 'پورٹ فولیو دیکھنے سے پہلے حلال اسٹاک دیکھیں۔') : t('Review your simulated portfolio and recent activity.', 'اپنا فرضی پورٹ فولیو اور حالیہ سرگرمی دیکھیں۔')}
                        </h2>
                        <p className="mt-1 text-xs font-medium leading-relaxed text-emerald-800">{t('Every action is reversible demo data and does not move real money.', 'ہر ایکشن فرضی ہے اور حقیقی رقم منتقل نہیں کرتا۔')}</p>
                      </div>
                    </div>
                  </section>

                  <PortfolioChart balance={balance} holdings={holdings} totalValue={totalPortfolioValue} />

                  <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <h2 className="text-sm sm:text-base font-black text-slate-800 tracking-tight">{t('Recent Activity', 'حالیہ سرگرمی')}</h2>
                      <button className="text-[11px] sm:text-xs font-bold text-emerald-600 hover:underline">{t('View All', 'سب دیکھیں')}</button>
                    </div>
                    <div className="space-y-2">
                      {transactions.length === 0 ? (
                        <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-slate-400 text-xs font-medium">{t('No activity recorded yet.', 'ابھی تک کوئی سرگرمی ریکارڈ نہیں ہوئی۔')}</p>
                        </div>
                      ) : (
                        transactions.slice(0, 5).map((tx) => (
                          <div key={tx.id} className="group flex justify-between items-center gap-3 p-3 sm:p-3.5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-emerald-100 hover:bg-white hover:shadow-md transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-sm sm:text-base shadow-sm ${tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-600' : tx.type === 'withdraw' ? 'bg-slate-50 text-slate-600' : tx.type === 'zakat_vault' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                                {tx.type === 'deposit' ? '➕' : tx.type === 'withdraw' ? '➖' : tx.type === 'zakat_vault' ? '🏛️' : '📈'}
                              </div>
                              <div>
                                <div className="font-black text-slate-800 text-xs tracking-tight">
                                  {tx.type === 'deposit' ? t('Deposit', 'ڈیپازٹ') : tx.type === 'withdraw' ? t('نکالنا', 'نکالنا') : tx.type === 'zakat_vault' ? t('National Vault', 'قومی والٹ') : tx.symbol}
                                </div>
                                <div className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                                  {new Date(tx.date).toLocaleDateString(lang === 'ur' ? 'ur-PK' : 'en-US', { day: 'numeric', month: 'short' })}
                                </div>
                                <div className="text-[8px] font-bold text-amber-600 mt-0.5">
                                  {tx.status === 'PENDING' ? t('Pending demo', 'زیر التوا ڈیمو') : t('Simulated demo', 'فرضی ڈیمو')} {tx.reference ? `· ${tx.reference}` : ''}
                                </div>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className={`font-black text-xs ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-slate-800'}`}>
                                {tx.type === 'deposit' ? '+' : '-'} {tx.amount.toLocaleString()}
                              </div>
                              <button onClick={() => setSelectedReceipt(tx)} className="touch-target mt-1 min-h-0 h-7 px-2 rounded-lg text-[9px] font-black text-emerald-700 hover:bg-emerald-50" aria-label={t('View demo receipt', 'ڈیمو رسید دیکھیں')}>
                                {t('Receipt', 'رسید')} ↗
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </section>
                </div>
              )}

              {/* ASSETS TAB */}
              {activeTab === 'assets' && (
                <div className="space-y-4 sm:space-y-6 pb-20 animate-in fade-in duration-300">
                  <div className="mb-1">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{t('Sovereign Assets', 'خود مختار اثاثے')}</h2>
                    <p className="text-slate-500 text-xs mt-0.5">{t('Invest in land, Hajj, Sukuks, and Overseas funds.', 'زمین، حج، سکوک، اور اوورسیز فنڈز میں سرمایہ کاری کریں۔')}</p>
                  </div>
                  {currentUser?.isOverseas && (
                    <OverseasInvest balance={balance} onInvest={handleOverseasInvest} lang={lang} cnic={currentUser.cnic} country={currentUser.country} />
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
                    <HajjVault onDeposit={handleHajjDeposit} />
                    <AgriFinancing balance={balance} onInvest={(amount) => initiateSecureTransaction({ type: 'buy_sukuk', amount, symbol: 'AGRI' })} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
                    <FractionalSukuk balance={balance} onBuy={handleBuySukuk} />
                    <GlobalHalalETFs onInvest={handleETFInvest} />
                  </div>
                </div>
              )}

              {/* PORTFOLIO TAB */}
              {activeTab === 'portfolio' && (
                <div className="space-y-4 sm:space-y-6 pb-20 animate-in fade-in duration-300">
                  <div className="mb-1">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{t('My Portfolio', 'میرا پورٹ فولیو')}</h2>
                    <p className="text-slate-500 text-xs mt-0.5">{t('Real-time tracking of your Halal wealth.', 'آپ کی حلال دولت کی اصل وقت میں ٹریکنگ۔')}</p>
                  </div>
                  <PortfolioDashboard holdings={holdings} totalValue={totalPortfolioValue} dailyPnl={dailyPnl} onSell={setSelectedSellHolding} />
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-start">
                    <div className="md:col-span-7">
                      <PortfolioChart balance={balance} holdings={holdings} totalValue={totalPortfolioValue} />
                    </div>
                    <div className="md:col-span-5 space-y-2.5 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('Halal Marketplace', 'حلال مارکیٹ پلیس')}</h3>
                      <HalalStockScanner balance={balance} onBuy={initiateBuyStock} />
                    </div>
                  </div>
                </div>
              )}

              {/* KAMETI & HEALTH TAB */}
              {activeTab === 'kameti' && (
                <div className="space-y-4 sm:space-y-6 pb-20 animate-in fade-in duration-300">
                  <FamilyHealthSaving balance={balance} onSave={handleHealthSave} lang={lang} cnic={currentUser?.cnic} />
                  <DigitalCommittee onContribute={handleKametiContribute} />
                  <WirasatCalculator />
                </div>
              )}

              {/* ZAKAT TAB */}
              {activeTab === 'zakat' && (
                <div className="space-y-4 sm:space-y-6 pb-20 animate-in fade-in duration-300">
                  <div className="mb-1">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{t('Social Impact', 'سماجی اثر')}</h2>
                    <p className="text-slate-500 text-xs mt-0.5">{t('Purify wealth and empower the Ummah.', 'دولت کو پاک کریں اور امت کو بااختیار بنائیں۔')}</p>
                  </div>
                  <ZakatDistribution balance={balance} portfolioValue={totalPortfolioValue} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
                    <PurificationTracker onPurify={(amount) => handleZakatDonation(amount, 'Dividend Purification')} />
                    <FinancialHealthScore balance={balance} portfolioValue={totalPortfolioValue} holdings={holdings} transactions={transactions} zakatHistory={zakatHistory} isZakatEligible={isZakatEligible} />
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="space-y-4 sm:space-y-6 pb-20 animate-in fade-in duration-300">
                  <SettingsTab lang={lang} darkMode={darkMode} onLangChange={handleLangChange} onDarkToggle={toggleDark} onLock={() => setIsAuthorized(false)} isPremium={isPremium} eligibility={{ totalInvested: totalInvestedHistory, totalProfit: totalRealizedProfit, reqInvest: 250000000, reqProfit: 500000000 }} />
                </div>
              )}
            </div>
          </div>
        </main>

        {modal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-[60] animate-in fade-in" role="presentation">
            <div className="mobile-modal-safe relative w-full max-w-sm sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl animate-in slide-in-from-bottom-full duration-200" role="dialog" aria-modal="true" aria-label={modal === 'deposit' ? t('Demo deposit', 'ڈیمو ڈیپازٹ') : t('Demo withdrawal', 'ڈیمو وِڈڈرا') }>
              <button onClick={() => setModal(null)} aria-label={t('Close dialog', 'ڈائیلاگ بند کریں')} className="touch-target absolute top-2 right-3 text-slate-400 hover:text-slate-600 transition-colors p-1 text-sm">✕</button>
              <div className="mt-1">
                {modal === 'deposit' ? <DepositFlow onSuccess={handleTransactionSuccess} /> : <WithdrawFlow onSuccess={handleTransactionSuccess} />}
              </div>
            </div>
          </div>
        )}

        {selectedSellHolding && (
          <div className="fixed inset-0 z-[65] flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="presentation">
            <div className="mobile-modal-safe relative w-full max-w-md rounded-t-3xl bg-white p-4 shadow-2xl sm:rounded-3xl sm:p-5" role="dialog" aria-modal="true" aria-label={t('Sell demo holding', 'ڈیمو ہولڈنگ فروخت کریں')}>
              <SellStockFlow holding={selectedSellHolding} onSuccess={handleSellRequest} onCancel={() => setSelectedSellHolding(null)} />
            </div>
          </div>
        )}

        {/* Bottom Navigation Bar (Visible only on mobile/tablet) */}
        <div className="mobile-bottom-nav fixed left-1/2 -translate-x-1/2 w-[95%] max-w-md z-50 block lg:hidden">
          <nav className="glass-dark rounded-2xl sm:rounded-[2rem] p-1 sm:p-1.5 flex justify-between items-center shadow-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl text-white" aria-label={t('Primary navigation', 'بنیادی نیویگیشن')}>
            {[
              { id: 'home', icon: '🏠', labelEn: 'Home', labelUr: 'ڈیش بورڈ' },
              { id: 'portfolio', icon: '📈', labelEn: 'Stocks', labelUr: 'اسٹاکس' },
              { id: 'assets', icon: '🏛️', labelEn: 'Assets', labelUr: 'اثاثے' },
              { id: 'kameti', icon: '🤝', labelEn: 'Family', labelUr: 'خاندان' },
              { id: 'zakat', icon: '🕋', labelEn: 'Zakat', labelUr: 'زکوٰۃ' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={lang === 'ur' ? tab.labelUr : tab.labelEn}
                  className={`touch-target flex-1 py-1.5 px-1 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={`text-base sm:text-lg leading-none transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                    {tab.icon}
                  </span>
                  <span className={`text-xs font-black uppercase tracking-wide mt-1 truncate max-w-[56px] leading-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {lang === 'ur' ? tab.labelUr : tab.labelEn}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <SovereignScan isOpen={isScanning} onComplete={onScanComplete} />
      </div>
    </>
  );
}
