'use client';
import { useState, useEffect } from 'react';

interface HealthScoreProps {
  balance: number;
  portfolioValue: number;
  holdings: any[];
  transactions: any[];
  zakatHistory: any[];
  isZakatEligible: boolean;
}

interface Badge {
  id: string;
  icon: string;
  title: string;
  desc: string;
  unlocked: boolean;
}

export default function FinancialHealthScore({
  balance,
  portfolioValue,
  holdings,
  transactions,
  zakatHistory,
  isZakatEligible
}: HealthScoreProps) {
  const [score, setScore] = useState(0);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [streak, setStreak] = useState(0);
  const [tips, setTips] = useState<string[]>([]);

  useEffect(() => {
    // 1. Calculate Score (0-100)
    let s = 0;
    
    // Emergency Fund (30 pts)
    const emergencyTarget = Math.max(portfolioValue * 0.2, 5000);
    s += Math.min(30, (balance / emergencyTarget) * 30);

    // Diversification (25 pts)
    s += Math.min(25, (holdings.length / 4) * 25);

    // Consistency (20 pts)
    s += Math.min(20, (transactions.length / 5) * 20);

    // Zakat Compliance (15 pts)
    if (!isZakatEligible || (isZakatEligible && zakatHistory.length > 0)) s += 15;

    // Activity (10 pts)
    const lastTx = transactions[0]?.date ? new Date(transactions[0].date) : new Date(0);
    const daysSince = (Date.now() - lastTx.getTime()) / (1000 * 60 * 60 * 24);
    s += daysSince <= 7 ? 10 : 5;

    setScore(Math.min(100, Math.round(s)));

    // 2. Generate Tips based on weak areas
    const t: string[] = [];
    if (balance < emergencyTarget) t.push('💡 Add PKR 500 to your emergency fund for +5 points');
    if (holdings.length < 3) t.push('📊 Buy 1 more sector (e.g., Tech or Energy) to diversify');
    if (isZakatEligible && zakatHistory.length === 0) t.push('🤲 Pay Zakat to unlock the "Zakat Champion" badge');
    if (daysSince > 3) t.push('🔥 Make a small investment or deposit to keep your streak alive');
    setTips(t);

    // 3. Determine Badges
    const b: Badge[] = [
      { id: 'first', icon: '🌱', title: 'First Seed', desc: 'Made your first investment', unlocked: transactions.some(t => t.type.includes('buy')) },
      { id: 'safety', icon: '🛡️', title: 'Safety Net', desc: 'Emergency fund > 20% of portfolio', unlocked: balance >= emergencyTarget },
      { id: 'diverse', icon: '📊', title: 'Diversifier', desc: 'Hold 3+ different assets', unlocked: holdings.length >= 3 },
      { id: 'zakat', icon: '🤲', title: 'Zakat Champion', desc: 'Paid Zakat when eligible', unlocked: isZakatEligible && zakatHistory.length > 0 },
      { id: 'streak', icon: '🔥', title: '7-Day Streak', desc: 'Active for 7 days', unlocked: daysSince <= 1 && transactions.length >= 7 },
    ];
    setBadges(b);
    setStreak(Math.min(7, Math.floor(transactions.length / 2))); // Mock streak for demo
  }, [balance, portfolioValue, holdings, transactions, zakatHistory, isZakatEligible]);

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600 stroke-green-600';
    if (score >= 60) return 'text-yellow-600 stroke-yellow-600';
    return 'text-red-600 stroke-red-600';
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-800 tracking-tight">📈 Financial Health</h2>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          score >= 80 ? 'bg-green-100 text-green-800' : score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
        }`}>
          {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
        </span>
      </div>

      {/* Score Circle + Streak */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
            <circle 
              cx="50" cy="50" r="40" 
              stroke="currentColor" 
              strokeWidth="8" 
              fill="none" 
              strokeDasharray={circumference} 
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-out ${getScoreColor()}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl sm:text-2xl font-black tracking-tight ${getScoreColor()}`}>{score}</span>
            <span className="text-xs text-gray-500 font-bold">/ 100</span>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1 justify-end">
            <span className="text-lg sm:text-xl">🔥</span>
            <span className="text-sm sm:text-base font-black text-orange-600 tracking-tight">{streak} Day Streak</span>
          </div>
          <p className="text-xs text-gray-500">Keep investing daily to grow your streak</p>
        </div>
      </div>

      {/* Metric Breakdown */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2.5 sm:p-3 bg-gray-50 rounded-xl">
          <div className="text-xs text-gray-500">Emergency Fund</div>
          <div className="font-semibold text-xs sm:text-sm text-gray-800 mt-0.5">{Math.min(100, Math.round((balance / Math.max(portfolioValue * 0.2, 5000)) * 100))}%</div>
        </div>
        <div className="p-2.5 sm:p-3 bg-gray-50 rounded-xl">
          <div className="text-xs text-gray-500">Diversification</div>
          <div className="font-semibold text-xs sm:text-sm text-gray-800 mt-0.5">{Math.min(100, Math.round((holdings.length / 4) * 100))}%</div>
        </div>
        <div className="p-2.5 sm:p-3 bg-gray-50 rounded-xl">
          <div className="text-xs text-gray-500">Consistency</div>
          <div className="font-semibold text-xs sm:text-sm text-gray-800 mt-0.5">{Math.min(100, Math.round((transactions.length / 5) * 100))}%</div>
        </div>
        <div className="p-2.5 sm:p-3 bg-gray-50 rounded-xl">
          <div className="text-xs text-gray-500">Zakat Status</div>
          <div className="font-semibold text-xs sm:text-sm text-gray-800 mt-0.5">{(!isZakatEligible || zakatHistory.length > 0) ? '✅ Compliant' : '⏳ Pending'}</div>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-bold text-gray-700 mb-2 px-0.5">🏆 Badges</h3>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {badges.map(b => (
            <div key={b.id} className={`flex-shrink-0 w-16 sm:w-20 p-2 rounded-xl text-center border transition-all ${
              b.unlocked ? 'border-green-300 bg-green-50 shadow-sm' : 'border-gray-200 bg-gray-50 opacity-40'
            }`}>
              <div className="text-lg sm:text-xl mb-1">{b.icon}</div>
              <div className="text-xs font-bold text-gray-700 leading-tight truncate">{b.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Tips */}
      {tips.length > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl shadow-inner">
          <h4 className="text-xs font-bold text-blue-800 mb-1">💡 How to Improve</h4>
          <ul className="space-y-1">
            {tips.map((tip, i) => (
              <li key={i} className="text-xs text-blue-700 flex items-start gap-1 font-medium">
                <span>•</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
