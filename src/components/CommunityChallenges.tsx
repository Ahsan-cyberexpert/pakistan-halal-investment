'use client';
import { useState } from 'react';

interface Challenge {
  id: number;
  title: string;
  target: number;
  current: number;
  reward: string;
  icon: string;
}

const INITIAL_CHALLENGES: Challenge[] = [
  { id: 1, title: '100,000 Pakistanis Invest PKR 1,000', target: 100000, current: 84231, reward: 'Platform donates PKR 10M to Flood Relief', icon: '🇵🇰' },
  { id: 2, title: 'Collective PKR 1B in Green Sukuk', target: 1000000000, current: 650000000, reward: 'Platform plants 1 Million Trees', icon: '🌱' },
  { id: 3, title: '10,000 Users Complete Financial Course', target: 10000, current: 8940, reward: 'Free Hajj Draw for 10 Participants', icon: '📚' },
];

export default function CommunityChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [joined, setJoined] = useState<Set<number>>(new Set());

  const handleJoin = (id: number) => {
    if (joined.has(id)) return;
    setJoined(prev => new Set([...prev, id]));
    setChallenges(prev =>
      prev.map(c => c.id === id ? { ...c, current: c.current + 1 } : c)
    );
  };

  const formatNumber = (n: number) => {
    if (n >= 1000000000) return `${(n / 1000000000).toFixed(1)}B`;
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    return n.toLocaleString();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">🤝 Community Challenges</h2>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Nation Building</span>
      </div>

      <div className="space-y-4">
        {challenges.map((c) => {
          const progress = Math.min(100, (c.current / c.target) * 100);
          const isJoined = joined.has(c.id);
          return (
            <div key={c.id} className={`p-4 rounded-xl border transition ${isJoined ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:border-blue-300'}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{c.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-sm md:text-base">{c.title}</h3>
                  <p className="text-xs text-gray-500 mt-1"> Reward: {c.reward}</p>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{formatNumber(c.current)} / {formatNumber(c.target)}</span>
                      <span className="font-bold text-blue-600">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isJoined ? 'bg-green-500' : 'bg-blue-500'}`} 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {!isJoined && (
                    <button 
                      onClick={() => handleJoin(c.id)}
                      className="mt-3 w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                      Join This Challenge
                    </button>
                  )}
                  {isJoined && (
                    <div className="mt-2 text-center text-green-700 text-xs font-semibold">
                      ✅ You Joined! Together we grow.
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
