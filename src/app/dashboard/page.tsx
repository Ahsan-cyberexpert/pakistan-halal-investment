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
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [modal, setModal] = useState<'deposit' | 'withdraw' | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [zakatHistory, setZakatHistory] = useState<ZakatRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'invest' | 'impact' | 'learn'>('home');

  const totalPortfolioValue = holdings.reduce((sum, h) => sum + h.invested + h.pnl, 0);
  const dailyPnl = holdings.reduce((sum, h) => sum + h.pnl, 0);
  const isZakatEligible = (balance + totalPortfolioValue) >= 300000;

  useEffect(() => {
    fetch('/api/transaction').then(r => r.json()).then(d => {
      setBalance(d.balance);
      setTransactions(d.transactions);
    });
  }, []);

  const handleVoice = (cmd: string) => {
    if (cmd.includes('deposit') || cmd.includes('ڈیپوزٹ')) setModal('deposit');
    else if (cmd.includes('withdraw') || cmd.includes('وِڈڈرا')) setModal('withdraw');
    else if (cmd.includes('health') || cmd.includes('صحت')) setActiveTab('impact');
    else if (cmd.includes('challenge') || cmd.includes('چیلنج')) setActiveTab('learn');
    else if (cmd.includes('map') || cmd.includes('نقشہ')) setActiveTab('impact');
    else if (cmd.includes('zakat') || cmd.includes('زکوٰ')) setActiveTab('impact');
    else if (cmd.includes('buy') || cmd.includes('خریدیں')) setActiveTab('invest');
    else if (cmd.includes('balance') || cmd.includes('بیلنس')) {
      const msg = new SpeechSynthesisUtterance(`آپ کا بیلنس ${balance} روپے ہے`);
      msg.lang = 'ur-PK';
      window.speechSynthesis.speak(msg);
    }
  };

  const handleTransactionSuccess = async (data: any) => {
    const res = await fetch('/api/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) {
      setBalance(result.newBalance);
      const txRes = await fetch('/api/transaction');
      setTransactions((await txRes.json()).transactions);
      setModal(null);
    }
  };

  const handleBuyStock = (symbol: string, amount: number) => {
    const stock = getStockBySymbol(symbol);
    if (!stock) return;

    setBalance(prev => prev - amount);
    setHoldings(prev => {
      const existing = prev.find(h => h.symbol === symbol);
      if (existing) {
        const newUnits = existing.units + (amount / stock.price);
        const newInvested = existing.invested + amount;
        return prev.map(h => h.symbol === symbol ? { ...h, invested: newInvested, units: newUnits, pnl: h.pnl } : h);
      } else {
        return [...prev, {
          symbol: stock.symbol, name: stock.name, invested: amount, currentPrice: stock.price, units: amount / stock.price, pnl: 0
        }];
      }
    });
    setTransactions(prev => [{ id: Date.now(), type: 'buy_stock', symbol, amount, status: 'success', date: new Date().toISOString() }, ...prev]);
  };

  const handleBuySukuk = (amount: number) => {
    setBalance(prev => prev - amount);
    setTransactions(prev => [{ id: Date.now(), type: 'buy_sukuk', amount, status: 'success', date: new Date().toISOString() }, ...prev]);
  };

  const handleZakatDonation = (amount: number, recipient: string) => {
    setBalance(prev => prev - amount);
    setZakatHistory(prev => [{ date: new Date().toISOString(), amount, recipient }, ...prev]);
    setTransactions(prev => [{ id: Date.now(), type: 'zakat', amount, recipient, status: 'success', date: new Date().toISOString() }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold text-green-700">🇵🇰 Roziq</h1>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-green-100 text-green-800 px-3 py-1.5 rounded-full font-bold">Halal Wealth OS</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 max-w-md mx-auto space-y-6 transition-all duration-300">
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <BalanceCard balance={balance} onDeposit={() => setModal('deposit')} onWithdraw={() => setModal('withdraw')} />
            <PortfolioDashboard holdings={holdings} totalValue={totalPortfolioValue} dailyPnl={dailyPnl} />
            <HajjVault />
            <div className="mt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Recent Activity</h2>
              <div className="space-y-2">
                {transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 bg-white rounded-2xl border border-gray-100">No activity yet</p>
                ) : (
                  transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                      <div>
                        <div className="font-bold text-sm text-gray-800">
                          {tx.type === 'deposit' ? '➕ Deposit' : tx.type === 'withdraw' ? '➖ Withdraw' : tx.type === 'zakat' ? '🤲 Zakat' : `📈 Buy ${tx.symbol || 'Asset'}`}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{tx.recipient && `To: ${tx.recipient}`} {new Date(tx.date).toLocaleString('ur-PK')}</div>
                      </div>
                      <div className={`font-black ${tx.type === 'deposit' ? 'text-green-600' : 'text-gray-800'}`}>
                        {tx.type === 'deposit' ? '+' : '-'}PKR {tx.amount.toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* INVEST TAB */}
        {activeTab === 'invest' && (
          <div className="space-y-6">
            <HalalStockScanner balance={balance} onBuy={handleBuyStock} />
            <FractionalSukuk balance={balance} onBuy={handleBuySukuk} />
            <GlobalHalalETFs />
            <AgriFinancing />
            <FreelancerAutoInvest />
          </div>
        )}

        {/* IMPACT TAB */}
        {activeTab === 'impact' && (
          <div className="space-y-6">
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
            {zakatHistory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-3">🤲 Zakat History</h2>
                <div className="space-y-2">
                  {zakatHistory.map((z, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                      <div>
                        <div className="font-bold text-green-800 text-sm">{z.recipient}</div>
                        <div className="text-xs text-green-600">{new Date(z.date).toLocaleDateString('ur-PK')}</div>
                      </div>
                      <div className="font-black text-green-700">PKR {z.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LEARN TAB */}
        {activeTab === 'learn' && (
          <div className="space-y-6">
            <LearnToEarn />
            <DigitalCommittee />
            <CommunityChallenges />
          </div>
        )}
      </main>

      {/* Modals */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-sm">
            <button onClick={() => setModal(null)} className="absolute -top-12 right-0 bg-white/20 hover:bg-white/40 rounded-full w-10 h-10 flex items-center justify-center text-white text-xl backdrop-blur-md">✕</button>
            {modal === 'deposit' ? <DepositFlow onSuccess={handleTransactionSuccess} /> : <WithdrawFlow onSuccess={handleTransactionSuccess} />}
          </div>
        </div>
      )}

      {/* Floating Utilities */}
      <VoiceAgent onCommand={handleVoice} />
      <AiMuftiChatbot />

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 px-6 py-2 pb-6 flex justify-between items-center z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] max-w-md mx-auto rounded-t-3xl">
        {[
          { id: 'home', icon: '🏠', label: 'Home' },
          { id: 'invest', icon: '📈', label: 'Invest' },
          { id: 'impact', icon: '🌱', label: 'Impact' },
          { id: 'learn', icon: '📚', label: 'Learn' },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${activeTab === tab.id ? 'text-green-700 scale-110' : 'text-gray-400 hover:text-gray-500 hover:scale-105'}`}
          >
            <span className="text-2xl mb-1">{tab.icon}</span>
            <span className={`text-[10px] font-bold transition-all duration-300 ${activeTab === tab.id ? 'opacity-100 max-h-4' : 'opacity-0 max-h-0 overflow-hidden'}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
