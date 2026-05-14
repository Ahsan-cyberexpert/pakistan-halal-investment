'use client';
import { useState, useEffect } from 'react';
import VoiceAgent from '@/components/VoiceAgent';
import DepositFlow from '@/components/DepositFlow';
import WithdrawFlow from '@/components/WithdrawFlow';
import BalanceCard from '@/components/BalanceCard';
import HalalStockScanner from '@/components/HalalStockScanner';
import PortfolioDashboard from '@/components/PortfolioDashboard';
import ZakatCalculator from '@/components/ZakatCalculator';
import FinancialHealthScore from '@/components/FinancialHealthScore';
import CommunityChallenges from '@/components/CommunityChallenges';
import LocalImpactMap from '@/components/LocalImpactMap';
import AiMuftiChatbot from '@/components/AiMuftiChatbot';
import PurificationTracker from '@/components/PurificationTracker';
import FractionalSukuk from '@/components/FractionalSukuk';
import DigitalCommittee from '@/components/DigitalCommittee';
import AgriFinancing from '@/components/AgriFinancing';
import LearnToEarn from '@/components/LearnToEarn';
import HajjVault from '@/components/HajjVault';
import GlobalHalalETFs from '@/components/GlobalHalalETFs';
import FreelancerAutoInvest from '@/components/FreelancerAutoInvest';
import WirasatCalculator from '@/components/WirasatCalculator';
import MicroTakaful from '@/components/MicroTakaful';
import SovereignScan from '@/components/SovereignScan';
import PortfolioChart from '@/components/PortfolioChart';
import ShariahScreener from '@/components/ShariahScreener';
import ZakatDistribution from '@/components/ZakatDistribution';
import RoziqAI from '@/components/RoziqAI';
import PinSecurity from '@/components/PinSecurity';
import LanguageSelect from '@/components/LanguageSelect';
import Onboarding from '@/components/Onboarding';
import SettingsTab from '@/components/SettingsTab';
import MarketAlerts from '@/components/MarketAlerts';
import { getStockBySymbol } from '@/lib/halal-stock-data';

interface Holding {
  symbol: string;
  name: string;
  invested: number;
  currentPrice: number;
  units: number;
  pnl: number;
}

interface ZakatRecord {
  date: string;
  amount: number;
  recipient: string;
}

export default function Dashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [modal, setModal] = useState<'deposit' | 'withdraw' | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [zakatHistory, setZakatHistory] = useState<ZakatRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'invest' | 'impact' | 'learn' | 'settings'>('home');
  const [lang, setLangState] = useState<'en' | 'ur'>('en');
  const [showLangSelect, setShowLangSelect] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [isScanning, setIsScanning] = useState(false);
  const [pendingTx, setPendingTx] = useState<any>(null);

  const t = (en: string, ur: string) => lang === 'ur' ? ur : en;

  const toggleDark = (val: boolean) => {
    setDarkMode(val);
    localStorage.setItem('roziq_dark', val ? '1' : '0');
    if (val) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  // Sovereign Persistence Engine — Load from server on mount
  useEffect(() => {
    // Check language & onboarding state
    const savedLang = localStorage.getItem('roziq_lang') as 'en' | 'ur';
    const hasOnboarded = localStorage.getItem('roziq_onboarded');
    const savedDark = localStorage.getItem('roziq_dark');
    if (!savedLang) {
      setShowLangSelect(true);
    } else {
      setLangState(savedLang);
      if (!hasOnboarded) setShowOnboarding(true);
    }
    if (savedDark === '1') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Load wallet data
    fetch('/api/transaction')
      .then(r => r.json())
      .then(d => {
        if (d.balance !== undefined) setBalance(d.balance);
        if (d.transactions) setTransactions(d.transactions);
        if (d.holdings) setHoldings(d.holdings);
        if (d.zakatHistory) setZakatHistory(d.zakatHistory);
      })
      .catch(() => {
        const savedBalance = localStorage.getItem('roziq_balance');
        const savedHoldings = localStorage.getItem('roziq_holdings');
        const savedTransactions = localStorage.getItem('roziq_transactions');
        const savedZakat = localStorage.getItem('roziq_zakat');
        if (savedBalance) setBalance(parseFloat(savedBalance));
        if (savedHoldings) setHoldings(JSON.parse(savedHoldings));
        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
        if (savedZakat) setZakatHistory(JSON.parse(savedZakat));
      });
  }, []);

  const handleLangSelect = (l: 'en' | 'ur') => {
    localStorage.setItem('roziq_lang', l);
    setLangState(l);
    setShowLangSelect(false);
    const hasOnboarded = localStorage.getItem('roziq_onboarded');
    if (!hasOnboarded) setShowOnboarding(true);
  };

  const handleLangChange = (l: 'en' | 'ur') => {
    localStorage.setItem('roziq_lang', l);
    setLangState(l);
  };

  const totalPortfolioValue = holdings.reduce((sum, h) => sum + h.invested + h.pnl, 0);
  const dailyPnl = holdings.reduce((sum, h) => sum + h.pnl, 0);
  const isZakatEligible = (balance + totalPortfolioValue) >= 300000;

  const handleVoice = (cmd: string) => {
    const lowerCmd = cmd.toLowerCase();
    if (lowerCmd.includes('deposit') || lowerCmd.includes('ڈیپوزٹ')) setModal('deposit');
    else if (lowerCmd.includes('withdraw') || lowerCmd.includes('وِڈڈرا')) setModal('withdraw');
    else if (lowerCmd.includes('health') || lowerCmd.includes('صحت')) setActiveTab('impact');
    else if (lowerCmd.includes('challenge') || lowerCmd.includes('چیلنج')) setActiveTab('learn');
    else if (lowerCmd.includes('map') || lowerCmd.includes('نقشہ')) setActiveTab('impact');
    else if (lowerCmd.includes('zakat') || lowerCmd.includes('زکوٰ')) setActiveTab('impact');
    else if (lowerCmd.includes('buy') || lowerCmd.includes('خریدیں')) setActiveTab('invest');
    else if (lowerCmd.includes('balance') || lowerCmd.includes('بیلنس')) {
      const msg = new SpeechSynthesisUtterance(`آپ کا بیلنس ${balance} روپے ہے`);
      msg.lang = 'ur-PK';
      window.speechSynthesis.speak(msg);
    }
  };

  const handleTransactionSuccess = async (data: any) => {
    // Trigger biometric scan for outflows
    if (['buy_stock', 'buy_sukuk', 'zakat', 'withdraw'].includes(data.type)) {
      setPendingTx(data);
      setIsScanning(true);
      return;
    }
    
    // Direct processing for deposits
    await processTransaction(data);
  };

  const processTransaction = async (data: any) => {
    const res = await fetch('/api/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) {
      setBalance(result.balance);
      setTransactions(result.transactions);
      setHoldings(result.holdings);
      setZakatHistory(result.zakatHistory);
      setModal(null);
      setIsScanning(false);
      setPendingTx(null);
    }
  };

  const onScanComplete = () => {
    if (pendingTx) {
      processTransaction(pendingTx);
    }
  };

  const handleBuyStock = async (symbol: string, amount: number) => {
    const stock = getStockBySymbol(symbol);
    if (!stock) return;

    await handleTransactionSuccess({
      type: 'buy_stock',
      amount,
      symbol: stock.symbol,
      name: stock.name,
      units: amount / stock.price
    });
  };

  const handleBuySukuk = async (amount: number) => {
    await handleTransactionSuccess({
      type: 'buy_sukuk',
      amount
    });
  };

  const handleZakatDonation = async (amount: number, recipient: string) => {
    await handleTransactionSuccess({
      type: 'zakat',
      amount,
      recipient
    });
  };

  return (
    <>
      {showLangSelect && <LanguageSelect onSelect={handleLangSelect} />}
      {showOnboarding && !showLangSelect && (
        <Onboarding lang={lang} onComplete={() => setShowOnboarding(false)} />
      )}
      {!isAuthorized && !showLangSelect && !showOnboarding && (
        <PinSecurity onSuccess={() => setIsAuthorized(true)} />
      )}
      <RoziqAI />
      <div className="min-h-screen pb-32" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
      {/* Top Header - Glassmorphic */}
      <header className="sticky top-0 z-50 glass border-b border-white/20 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-emerald-200">🇵🇰</div>
          <div>
            <h1 className="text-xl font-black text-slate-800 leading-none">Roziq</h1>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Wealth OS</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
            <span className="text-xl">🔔</span>
          </button>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 border-2 border-white shadow-md"></div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-6 py-8 max-w-lg mx-auto transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            <BalanceCard balance={balance} onDeposit={() => setModal('deposit')} onWithdraw={() => setModal('withdraw')} />
            
            <PortfolioChart balance={balance} holdings={holdings} totalValue={totalPortfolioValue} />

            <section>
              <PortfolioDashboard holdings={holdings} totalValue={totalPortfolioValue} dailyPnl={dailyPnl} />
            </section>

            <section>
              <HajjVault />
            </section>

            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-slate-800 tracking-tight">Recent Activity</h2>
                <button className="text-xs font-bold text-emerald-600 hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="premium-card p-12 text-center">
                    <p className="text-slate-400 text-sm font-medium">No activity recorded yet.</p>
                  </div>
                ) : (
                  transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="group flex justify-between items-center p-4 bg-white rounded-3xl border border-slate-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${
                          tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-600' : 
                          tx.type === 'withdraw' ? 'bg-slate-50 text-slate-600' : 
                          tx.type === 'zakat' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {tx.type === 'deposit' ? '➕' : tx.type === 'withdraw' ? '➖' : tx.type === 'zakat' ? '🤲' : '📈'}
                        </div>
                        <div>
                          <div className="font-black text-slate-800 text-sm tracking-tight">
                            {tx.type === 'deposit' ? 'Deposit' : tx.type === 'withdraw' ? 'Withdraw' : tx.type === 'zakat' ? 'Zakat Al-Mal' : `Invested in ${tx.symbol || 'Asset'}`}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                            {new Date(tx.date).toLocaleDateString('ur-PK', { day: 'numeric', month: 'short' })} • {tx.status}
                          </div>
                        </div>
                      </div>
                      <div className={`font-black text-sm ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-slate-800'}`}>
                        {tx.type === 'deposit' ? '+' : '-'} {tx.amount.toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {/* INVEST TAB */}
        {activeTab === 'invest' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Marketplace</h2>
              <p className="text-slate-500 font-medium">Strictly Shariah-compliant opportunities.</p>
            </div>
            <ShariahScreener />
            <MarketAlerts />
            <HalalStockScanner balance={balance} onBuy={handleBuyStock} />
            <FractionalSukuk balance={balance} onBuy={handleBuySukuk} />
            <GlobalHalalETFs />
            <AgriFinancing />
            <FreelancerAutoInvest />
          </div>
        )}

        {/* IMPACT TAB */}
        {activeTab === 'impact' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
             <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Social Impact</h2>
              <p className="text-slate-500 font-medium">Purify wealth and empower the Ummah.</p>
            </div>
            <ZakatDistribution balance={balance} portfolioValue={totalPortfolioValue} />
            <FinancialHealthScore 
              balance={balance} 
              portfolioValue={totalPortfolioValue} 
              holdings={holdings} 
              transactions={transactions} 
              zakatHistory={zakatHistory} 
              isZakatEligible={isZakatEligible} 
            />
            <ZakatCalculator balance={balance} portfolioValue={totalPortfolioValue} onDonate={handleZakatDonation} />
            <PurificationTracker onPurify={(amount) => handleZakatDonation(amount, 'Dividend Purification')} />
            <WirasatCalculator />
            <MicroTakaful />
            <LocalImpactMap />
          </div>
        )}

        {/* LEARN TAB */}
        {activeTab === 'learn' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{t('Knowledge', 'علم')}</h2>
              <p className="text-slate-500 font-medium">{t('Master the principles of Halal finance.', 'حلال مالیات کے اصول سیکھیں۔')}</p>
            </div>
            <LearnToEarn />
            <DigitalCommittee />
            <CommunityChallenges />
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <SettingsTab
              lang={lang}
              darkMode={darkMode}
              onLangChange={handleLangChange}
              onDarkToggle={toggleDark}
              onLock={() => setIsAuthorized(false)}
            />
          </div>
        )}
      </main>

      {/* Modals - Premium Blur */}
      {modal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 z-[60] animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500">
            <button onClick={() => setModal(null)} className="absolute top-6 right-8 text-slate-400 hover:text-slate-600 transition-colors">
              <span className="text-2xl font-light">✕</span>
            </button>
            <div className="mt-4">
              {modal === 'deposit' ? <DepositFlow onSuccess={handleTransactionSuccess} /> : <WithdrawFlow onSuccess={handleTransactionSuccess} />}
            </div>
          </div>
        </div>
      )}

      {/* Floating Utilities */}
      <VoiceAgent onCommand={handleVoice} />
      <AiMuftiChatbot />

      {/* Bottom Navigation Bar - Floating Island */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[95%] max-w-md z-50">
        <nav className="glass-dark rounded-[2.5rem] p-2 flex justify-between items-center shadow-2xl border-white/10 overflow-hidden">
          {[
            { id: 'home', icon: '🏠', labelEn: 'Home', labelUr: 'ہوم' },
            { id: 'invest', icon: '📈', labelEn: 'Invest', labelUr: 'سرمایہ' },
            { id: 'impact', icon: '🌱', labelEn: 'Impact', labelUr: 'اثر' },
            { id: 'learn', icon: '📚', labelEn: 'Learn', labelUr: 'سیکھیں' },
            { id: 'settings', icon: '⚙️', labelEn: 'Settings', labelUr: 'ترتیبات' },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex flex-col items-center justify-center py-3 px-4 rounded-3xl transition-all duration-500 group ${
                activeTab === tab.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className={`text-xl transition-transform duration-500 ${activeTab === tab.id ? 'scale-110 -translate-y-1' : 'group-hover:scale-110'}`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] font-black uppercase tracking-widest absolute transition-all duration-500 ${
                activeTab === tab.id ? 'opacity-100 translate-y-3' : 'opacity-0 translate-y-6'
              }`}>
                {lang === 'ur' ? tab.labelUr : tab.labelEn}
              </span>
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-md"></div>
              )}
            </button>
          ))}
        </nav>
      </div>
      {/* Sovereign Biometrics */}
      <SovereignScan 
        isOpen={isScanning} 
        onComplete={onScanComplete} 
      />
    </div>
    </>
  );
}
