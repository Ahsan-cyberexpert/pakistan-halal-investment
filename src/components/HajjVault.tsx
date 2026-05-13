'use client';

export default function HajjVault() {
  const goal = 1200000;
  const current = 350000;
  const percentage = (current / goal) * 100;

  return (
    <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
      <div className="absolute opacity-10 top-0 right-0 text-9xl -mt-10 -mr-10">🕋</div>
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Hajj & Umrah Vault</h2>
            <p className="text-emerald-200 text-sm mt-1">Locked savings invested in Sovereign Sukuk.</p>
          </div>
          <span className="text-4xl">🕋</span>
        </div>

        <div className="bg-black/20 p-5 rounded-2xl backdrop-blur-sm border border-emerald-500/30 mb-4">
          <div className="flex justify-between items-end mb-2">
            <div>
              <div className="text-emerald-200 text-xs mb-1">Current Saved</div>
              <div className="text-2xl font-bold">PKR {current.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-emerald-200 text-xs mb-1">Goal</div>
              <div className="text-sm font-semibold">PKR {goal.toLocaleString()}</div>
            </div>
          </div>
          <div className="w-full bg-black/40 rounded-full h-2.5 mt-3">
            <div className="bg-emerald-400 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
          </div>
          <div className="text-xs text-emerald-300 mt-2 text-right">{percentage.toFixed(1)}% Completed</div>
        </div>

        <div className="flex space-x-3">
          <button className="flex-1 bg-white text-emerald-900 font-bold py-3 rounded-xl hover:bg-emerald-50 transition-colors">
            Auto-Deposit
          </button>
          <button className="flex-1 bg-emerald-800 text-white border border-emerald-600 font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
