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
  code: string;
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
    if (balance < emergencyTarget) t.push('Add PKR 500 to your emergency fund for +5 points');
    if (holdings.length < 3) t.push('Buy 1 more sector (e.g., Tech or Energy) to diversify');
    if (isZakatEligible && zakatHistory.length === 0) t.push('Pay Zakat to unlock the "Zakat Champion" badge');
    if (daysSince > 3) t.push('Make a small investment or deposit to keep your streak active');
    setTips(t);

    // 3. Determine Badges
    const b: Badge[] = [
      { id: 'first', code: 'SEED', title: 'First Seed', desc: 'Made your first investment', unlocked: transactions.some(tx => tx.type.includes('buy')) },
      { id: 'safety', code: 'SAFE', title: 'Safety Net', desc: 'Emergency fund > 20% of portfolio', unlocked: balance >= emergencyTarget },
      { id: 'diverse', code: 'DIV', title: 'Diversifier', desc: 'Hold 3+ different assets', unlocked: holdings.length >= 3 },
      { id: 'zakat', code: 'ZKT', title: 'Zakat Champion', desc: 'Paid Zakat when eligible', unlocked: isZakatEligible && zakatHistory.length > 0 },
      { id: 'streak', code: 'STRK', title: '7-Day Streak', desc: 'Active for 7 days', unlocked: daysSince <= 1 && transactions.length >= 7 },
    ];
    setBadges(b);
    setStreak(Math.min(7, Math.floor(transactions.length / 2)));
  }, [balance, portfolioValue, holdings, transactions, zakatHistory, isZakatEligible]);

  const getScoreColor = () => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400 stroke-emerald-600 dark:stroke-emerald-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400 stroke-amber-600 dark:stroke-amber-400';
    return 'text-rose-600 dark:text-rose-400 stroke-rose-600 dark:stroke-rose-400';
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#16171b] p-5 shadow-xs h-full flex flex-col justify-between text-slate-900 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Financial Health</h2>
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
          score >= 80 ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' : score >= 60 ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20'
        }`}>
          {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
        </span>
      </div>

      {/* Score Circle + Streak */}
      <div className="flex items-center justify-between mb-5">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-200 dark:text-white/10" />
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
            <span className={`text-xl sm:text-2xl font-bold tracking-tight ${getScoreColor()}`}>{score}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">/ 100</span>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="flex items-center gap-1.5 mb-1 justify-end">
            <span className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400 tracking-tight">{streak} Day Streak</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Regular activity builds discipline</p>
        </div>
      </div>

      {/* Metric Breakdown */}
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Emergency Fund</div>
          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-0.5">{Math.min(100, Math.round((balance / Math.max(portfolioValue * 0.2, 5000)) * 100))}%</div>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Diversification</div>
          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-0.5">{Math.min(100, Math.round((holdings.length / 4) * 100))}%</div>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Consistency</div>
          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-0.5">{Math.min(100, Math.round((transactions.length / 5) * 100))}%</div>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Zakat Status</div>
          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-0.5">{(!isZakatEligible || zakatHistory.length > 0) ? 'Compliant' : 'Pending'}</div>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-4">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Milestone Badges</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {badges.map(b => (
            <div key={b.id} className={`flex-shrink-0 w-20 p-2.5 rounded-xl text-center border transition-all ${
              b.unlocked ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-400 opacity-50'
            }`}>
              <div className="text-xs font-bold mb-0.5">{b.code}</div>
              <div className="text-xs font-medium truncate">{b.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Tips */}
      {tips.length > 0 && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-1">Recommended Next Step</h4>
          <ul className="space-y-1">
            {tips.slice(0, 2).map((tip, i) => (
              <li key={i} className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-1 font-medium">
                <span>•</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
