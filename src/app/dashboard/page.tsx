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
    else if (cmd.includes('health') || cmd.includes('صحت')) {
      document.getElementById('health-section')?.scrollIntoView({ behavior: 'smooth' });
    }
    else if (cmd.includes('challenge') || cmd.includes('چیلنج')) {
      document.getElementById('challenge-section')?.scrollIntoView({ behavior: 'smooth' });
    }
    else if (cmd.includes('map') || cmd.includes('نقشہ')) {
      document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' });
    }
    else if (cmd.includes('zakat') || cmd.includes('زکوٰ')) {
      document.getElementById('zakat-section')?.scrollIntoView({ behavior: 'smooth' });
    }
    else if (cmd.includes('buy') || cmd.includes('خریدیں')) {
      document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' });
    }
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
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-700">🇵🇰 Roziq</h1>
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Halal Wealth OS</span>
      </header>

      <BalanceCard balance={balance} onDeposit={() => setModal('deposit')} onWithdraw={() => setModal('withdraw')} />

      <div id="health-section" className="space-y-4">
        <FinancialHealthScore 
          balance={balance} 
          portfolioValue={totalPortfolioValue} 
          holdings={holdings} 
          transactions={transactions} 
          zakatHistory={zakatHistory} 
          isZakatEligible={isZakatEligible} 
        />
        <MicroTakaful />
      </div>

      <div id="challenge-section" className="space-y-4 mt-6">
        <LearnToEarn />
        <DigitalCommittee />
        <CommunityChallenges />
      </div>

      <div id="map-section">
        <LocalImpactMap />
      </div>

      <div id="zakat-section" className="space-y-4">
        <ZakatCalculator balance={balance} portfolioValue={totalPortfolioValue} onDonate={handleZakatDonation} />
        <PurificationTracker onPurify={(amount) => handleZakatDonation(amount, 'Dividend Purification')} />
        <WirasatCalculator />
      </div>

      <div id="scanner" className="space-y-4 mt-6">
        <HalalStockScanner balance={balance} onBuy={handleBuyStock} />
        <FractionalSukuk balance={balance} onBuy={handleBuySukuk} />
        <GlobalHalalETFs />
        <AgriFinancing />
        <FreelancerAutoInvest />
      </div>

      <PortfolioDashboard holdings={holdings} totalValue={totalPortfolioValue} dailyPnl={dailyPnl} />
      <div className="mt-6">
        <HajjVault />
      </div>

      {/* Zakat History */}
      {zakatHistory.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">🤲 Zakat History</h2>
          <div className="space-y-2">
            {zakatHistory.map((z, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                <div>
                  <div className="font-medium text-green-800">{z.recipient}</div>
                  <div className="text-xs text-green-600">{new Date(z.date).toLocaleDateString('ur-PK')}</div>
                </div>
                <div className="font-bold text-green-700">PKR {z.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
        <div className="space-y-2">
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No activity yet</p>
          ) : (
            transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                <div>
                  <div className="font-medium">
                    {tx.type === 'deposit' ? '➕ Deposit' : tx.type === 'withdraw' ? '➖ Withdraw' : tx.type === 'zakat' ? '🤲 Zakat' : `📈 Buy ${tx.symbol}`}
                  </div>
                  <div className="text-xs text-gray-500">{tx.recipient && `To: ${tx.recipient}`} {new Date(tx.date).toLocaleString('ur-PK')}</div>
                </div>
                <div className={`font-bold ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'deposit' ? '+' : '-'}PKR {tx.amount}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-sm">
            <button onClick={() => setModal(null)} className="absolute -top-10 right-0 text-white text-lg">✕</button>
            {modal === 'deposit' ? <DepositFlow onSuccess={handleTransactionSuccess} /> : <WithdrawFlow onSuccess={handleTransactionSuccess} />}
          </div>
        </div>
      )}

      <VoiceAgent onCommand={handleVoice} />
      <AiMuftiChatbot />
    </div>
  );
}
