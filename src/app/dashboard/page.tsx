'use client';
import { useState, useEffect } from 'react';
import DepositFlow from '@/components/DepositFlow';
import WithdrawFlow from '@/components/WithdrawFlow';
import BalanceCard from '@/components/BalanceCard';
import HalalStockScanner from '@/components/HalalStockScanner';
import PortfolioDashboard from '@/components/PortfolioDashboard';
import FinancialHealthScore from '@/components/FinancialHealthScore';
import PurificationTracker from '@/components/PurificationTracker';
import FractionalSukuk from '@/components/FractionalSukuk';
import DigitalCommittee from '@/components/DigitalCommittee';
import AgriFinancing from '@/components/AgriFinancing';
import HajjVault from '@/components/HajjVault';
import GlobalHalalETFs from '@/components/GlobalHalalETFs';
import WirasatCalculator from '@/components/WirasatCalculator';
import SovereignScan from '@/components/SovereignScan';
import PortfolioChart from '@/components/PortfolioChart';
import ZakatDistribution from '@/components/ZakatDistribution';
import RoziqAI from '@/components/RoziqAI';
import PinSecurity from '@/components/PinSecurity';
import LanguageSelect from '@/components/LanguageSelect';
import Onboarding from '@/components/Onboarding';
import SettingsTab from '@/components/SettingsTab';
import WaliAutopilot from '@/components/WaliAutopilot';
import AuthGate, { UserProfile } from '@/components/AuthGate';
import FamilyHealthSaving from '@/components/FamilyHealthSaving';
import OverseasInvest from '@/components/OverseasInvest';
import { getStockBySymbol } from '@/lib/halal-stock-data';

interface Holding {
  symbol: string; name: string; invested: number; currentPrice: number; units: number; pnl: number;
}
interface ZakatRecord {
  date: string; amount: number; recipient: string;
}

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [modal, setModal] = useState<'deposit' | 'withdraw' | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [zakatHistory, setZakatHistory] = useState<ZakatRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'portfolio' | 'assets' | 'kameti' | 'zakat' | 'settings'>('home');
  const [lang, setLangState] = useState<'en' | 'ur'>('en');
  const [showLangSelect, setShowLangSelect] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [showTradingPin, setShowTradingPin] = useState(false);
  const [pendingTrade, setPendingTrade] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [pendingTx, setPendingTx] = useState<any>(null);
  const [showResetModal, setShowResetModal] = useState(false);

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
    localStorage.setItem('roziq_lang', l); setLangState(l); setShowLangSelect(false);
    if (!localStorage.getItem('roziq_onboarded')) setShowOnboarding(true);
  };
  const handleLangChange = (l: 'en' | 'ur') => { localStorage.setItem('roziq_lang', l); setLangState(l); };

  const totalPortfolioValue = holdings.reduce((sum, h) => sum + h.invested + h.pnl, 0);
  const dailyPnl = holdings.reduce((sum, h) => sum + h.pnl, 0);
  const isZakatEligible = (balance + totalPortfolioValue) >= 300000;

  const totalInvestedHistory = holdings.reduce((sum, h) => sum + h.invested, 0);
  const totalRealizedProfit = transactions.reduce((sum, t) => sum + (t.profit || 0), 0);
  const isPremium = totalInvestedHistory >= 250000000 && totalRealizedProfit >= 500000000;

  const handleTransactionSuccess = async (data: any) => {
    if (['buy_stock', 'buy_sukuk', 'zakat', 'withdraw', 'health_save', 'overseas_invest'].includes(data.type)) {
      setPendingTx(data); setIsScanning(true); return;
    }
    await processTransaction(data);
  };

  const processTransaction = async (data: any) => {
    let newBal = balance; let newHoldings = [...holdings]; let newTxs = [...transactions]; let newZk = [...zakatHistory];
    const txRecord = { id: Date.now(), type: data.type, amount: data.amount, symbol: data.symbol || data.name || data.type, date: new Date().toISOString() };

    if (data.type === 'deposit') { newBal += data.amount; newTxs.unshift(txRecord); }
    else if (data.type === 'withdraw') { newBal -= data.amount; newTxs.unshift(txRecord); }
    else if (data.type === 'buy_stock') {
      newBal -= data.amount;
      const existing = newHoldings.find(h => h.symbol === data.symbol);
      if (existing) { existing.invested += data.amount; existing.units += data.units; }
      else { newHoldings.push({ symbol: data.symbol, name: data.name, invested: data.amount, currentPrice: data.amount / data.units, units: data.units, pnl: 0 }); }
      newTxs.unshift(txRecord);
    }
    else if (['buy_sukuk', 'health_save', 'overseas_invest'].includes(data.type)) { newBal -= data.amount; newTxs.unshift(txRecord); }
    else if (data.type === 'zakat') { newBal -= data.amount; newZk.unshift({ date: new Date().toISOString(), amount: data.amount, recipient: data.recipient }); newTxs.unshift(txRecord); }

    setBalance(newBal); setHoldings(newHoldings); setTransactions(newTxs); setZakatHistory(newZk);
    persistUserData(newBal, newHoldings, newTxs, newZk);
    setModal(null); setIsScanning(false); setPendingTx(null);
  };

  const onScanComplete = () => { if (pendingTx) processTransaction(pendingTx); };

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

  const handleBuySukuk = (amount: number) => initiateSecureTransaction({ type: 'buy_sukuk', amount, symbol: 'SUKUK' });
  const handleZakatDonation = (amount: number, recipient: string) => initiateSecureTransaction({ type: 'zakat', amount, recipient, symbol: 'ZAKAT' });
  const handleHealthSave = (amount: number) => initiateSecureTransaction({ type: 'health_save', amount, symbol: 'HEALTH' });
  const handleOverseasInvest = (amount: number, asset: string) => initiateSecureTransaction({ type: 'overseas_invest', amount, name: asset, symbol: asset });
  const handleHajjDeposit = (amount: number) => initiateSecureTransaction({ type: 'buy_sukuk', amount, symbol: 'HAJJ' });
  const handleETFInvest = (amount: number, etf: string) => initiateSecureTransaction({ type: 'buy_sukuk', amount, symbol: etf });
  const handleKametiContribute = (amount: number) => initiateSecureTransaction({ type: 'buy_sukuk', amount, symbol: 'KAMETI' });

  const executeReset = () => {
    localStorage.clear();
    sessionStorage.clear();
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

      {/* Master AI Agent (Voice + Write + Linked Accounts) */}
      <RoziqAI balance={balance} holdings={holdings} transactions={transactions} lang={lang} />

      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden pb-32" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
        {/* Top Header */}
        <header className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200/50 px-4 sm:px-6 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-base sm:text-lg shadow-md shadow-emerald-900/20">🇵🇰</div>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-tighter text-slate-900">ROZIQ</h1>
              <p className="text-[7px] sm:text-[8px] font-black text-emerald-600 uppercase tracking-[0.2em]">{currentUser ? currentUser.name : t('Wealth OS', 'ویلتھ او ایس')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentUser?.isOverseas && (
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[9px] font-black uppercase tracking-widest hidden sm:inline-block">
                🌍 {currentUser.country || 'Overseas'}
              </span>
            )}
            
            {/* Prominent Reset Demo Data / Delete Account Button */}
            <button 
              onClick={() => setShowResetModal(true)}
              title={t('Delete Account & Reset Demo Data', 'اکاؤنٹ ڈیلیٹ کریں اور ڈیٹا ری سیٹ کریں')}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 hover:border-red-500 rounded-xl text-[10px] sm:text-xs font-black transition-all active:scale-95 flex items-center gap-1 shadow-sm"
            >
              <span>🗑️</span> <span className="hidden sm:inline">{t('Reset Demo', 'ڈیٹا ری سیٹ')}</span>
            </button>

            <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-all active:scale-90 text-xs sm:text-sm shadow-sm">
              🔔
            </button>
            <button onClick={() => setActiveTab('settings')} className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 border-2 shadow-md transition-all active:scale-90 ${activeTab === 'settings' ? 'border-emerald-400 scale-105 shadow-emerald-500/30' : 'border-white'}`}>
              <div className="w-full h-full rounded-xl border border-black/10 flex items-center justify-center text-white text-xs font-black">
                {currentUser ? currentUser.name.charAt(0) : '⚙️'}
              </div>
            </button>
          </div>
        </header>

        {/* Widescreen Responsive Layout Grid (max-w-7xl) */}
        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Wallet Overview & Navigation */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-6 sticky top-20 z-10">
              <BalanceCard balance={balance} onDeposit={() => setModal('deposit')} onWithdraw={() => setModal('withdraw')} />
              
              {isPremium && (
                <div className="hidden lg:block">
                  <WaliAutopilot lang={lang} />
                </div>
              )}

              {/* Quick Tab Selector for Desktop Sidebar */}
              <div className="hidden lg:block bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 mb-2">{t('Navigation Menu', 'نیویگیشن مینو')}</p>
                {[
                  { id: 'home', icon: '🏠', labelEn: 'Home Dashboard', labelUr: 'ہوم ڈیش بورڈ' },
                  { id: 'portfolio', icon: '💼', labelEn: 'Halal Stocks & PSX', labelUr: 'حلال اسٹاکس' },
                  { id: 'assets', icon: '🚜', labelEn: 'Sukuks & Overseas', labelUr: 'سکوک اور اوورسیز' },
                  { id: 'kameti', icon: '🤝', labelEn: 'Family Health Takaful', labelUr: 'فیملی ہیلتھ تکافل' },
                  { id: 'zakat', icon: '🕋', labelEn: 'Zakat & Impact', labelUr: 'زکوٰۃ اور اثر' },
                ].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black transition-all text-left ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20' : 'text-slate-600 hover:bg-slate-50'}`}>
                    <span className="text-base">{tab.icon}</span>
                    <span>{lang === 'ur' ? tab.labelUr : tab.labelEn}</span>
                  </button>
                ))}

                <div className="pt-3 mt-3 border-t border-slate-100 px-2">
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
                          <div key={tx.id} className="group flex justify-between items-center p-3 sm:p-3.5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-emerald-100 hover:bg-white hover:shadow-md transition-all duration-200">
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
                              </div>
                            </div>
                            <div className={`font-black text-xs ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-slate-800'}`}>
                              {tx.type === 'deposit' ? '+' : '-'} {tx.amount.toLocaleString()}
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
                  <PortfolioDashboard holdings={holdings} totalValue={totalPortfolioValue} dailyPnl={dailyPnl} />
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
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 z-[60] animate-in fade-in">
            <div className="relative w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-5 sm:p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
              <button onClick={() => setModal(null)} className="absolute top-5 right-6 text-slate-400 hover:text-slate-600 transition-colors">✕</button>
              <div className="mt-1">
                {modal === 'deposit' ? <DepositFlow onSuccess={handleTransactionSuccess} /> : <WithdrawFlow onSuccess={handleTransactionSuccess} />}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Bar (Visible only on mobile/tablet) */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[96%] max-w-lg z-50 block lg:hidden">
          <nav className="glass-dark rounded-[2rem] p-1.5 flex justify-between items-center shadow-2xl border-white/10 overflow-hidden bg-slate-900/90 backdrop-blur-lg text-white">
            {[
              { id: 'home', icon: '🏠', labelEn: 'Home', labelUr: 'ہوم' },
              { id: 'portfolio', icon: '💼', labelEn: 'Stocks', labelUr: 'اسٹاکس' },
              { id: 'assets', icon: '🚜', labelEn: 'Assets', labelUr: 'اثاثے' },
              { id: 'kameti', icon: '🤝', labelEn: 'Family', labelUr: 'خاندان' },
              { id: 'zakat', icon: '🕋', labelEn: 'Zakat', labelUr: 'زکوٰۃ' },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-300 group ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20' : 'text-slate-400 hover:text-white'}`}>
                <span className={`text-base sm:text-lg transition-transform duration-300 ${activeTab === tab.id ? 'scale-110 -translate-y-0.5' : 'group-hover:scale-110'}`}>{tab.icon}</span>
                <span className={`text-[7px] font-black uppercase tracking-widest absolute transition-all duration-300 ${activeTab === tab.id ? 'opacity-100 translate-y-2.5' : 'opacity-0 translate-y-5'}`}>
                  {lang === 'ur' ? tab.labelUr : tab.labelEn}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <SovereignScan isOpen={isScanning} onComplete={onScanComplete} />
      </div>
    </>
  );
}
