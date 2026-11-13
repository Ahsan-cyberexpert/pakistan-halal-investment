'use client';
import { useState, useEffect } from 'react';
import { MOCK_PSX_STOCKS } from '@/lib/halal-stock-data';

interface Alert {
  id: number;
  symbol: string;
  name: string;
  targetPrice: number;
  direction: 'above' | 'below';
  currentPrice: number;
  triggered: boolean;
  createdAt: string;
}

export default function MarketAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('MEBL');
  const [targetPrice, setTargetPrice] = useState('');
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('roziq_alerts');
    if (stored) setAlerts(JSON.parse(stored));
  }, []);

  const saveAlerts = (updated: Alert[]) => {
    setAlerts(updated);
    localStorage.setItem('roziq_alerts', JSON.stringify(updated));
  };

  const addAlert = () => {
    if (!targetPrice || isNaN(parseFloat(targetPrice))) return;
    const stock = MOCK_PSX_STOCKS.find(s => s.symbol === selectedSymbol);
    if (!stock) return;
    const newAlert: Alert = {
      id: Date.now(),
      symbol: selectedSymbol,
      name: stock.name,
      targetPrice: parseFloat(targetPrice),
      direction,
      currentPrice: stock.price,
      triggered: Math.abs(stock.price - parseFloat(targetPrice)) < 1,
      createdAt: new Date().toISOString(),
    };
    saveAlerts([newAlert, ...alerts]);
    setTargetPrice('');
    setShowAdd(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`🕌 Roziq Alert Set`, {
        body: `Alert: ${stock.name} ${direction} ₨${parseFloat(targetPrice).toLocaleString()}`,
        icon: '/icon.png',
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') {
          new Notification(`🕌 Roziq Alert Set`, {
            body: `${stock.name} ${direction} ₨${parseFloat(targetPrice).toLocaleString()}`,
            icon: '/icon.png',
          });
        }
      });
    }
  };

  const removeAlert = (id: number) => saveAlerts(alerts.filter(a => a.id !== id));

  const halalStocks = MOCK_PSX_STOCKS.filter(s => s.halalScore >= 6);

  return (
    <div className="premium-card p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Price Alerts</h3>
          <p className="text-xl font-black text-[#0B1F17] dark:text-[#F0F4F2] tracking-tight">Market Alerts</p>
        </div>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-200"
        >
          {showAdd ? '✕' : '+'}
        </button>
      </div>

      {/* Add Alert Form */}
      {showAdd && (
        <div className="bg-[#F4F7F5] dark:bg-[#1C2029] rounded-3xl p-5 mb-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Stock</label>
            <select
              value={selectedSymbol}
              onChange={e => setSelectedSymbol(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-[#15181F] border border-[#E3ECE7] dark:border-[#262B35] rounded-2xl font-bold text-[#0B1F17] dark:text-[#F0F4F2] focus:outline-none focus:border-emerald-400 text-sm"
            >
              {halalStocks.map(s => (
                <option key={s.symbol} value={s.symbol}>{s.symbol} — {s.name} (₨{s.price})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Direction</label>
              <div className="flex gap-2">
                {(['above', 'below'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setDirection(d)}
                    className={`flex-1 py-2.5 rounded-2xl font-black text-xs transition-all ${
                      direction === d ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-[#15181F] text-slate-600 border border-[#E3ECE7] dark:border-[#262B35]'
                    }`}
                  >
                    {d === 'above' ? '▲ Above' : '▼ Below'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Target (₨)</label>
              <input
                type="number"
                value={targetPrice}
                onChange={e => setTargetPrice(e.target.value)}
                placeholder="e.g. 150"
                className="w-full px-4 py-2.5 bg-white dark:bg-[#15181F] border border-[#E3ECE7] dark:border-[#262B35] rounded-2xl font-bold text-[#0B1F17] dark:text-[#F0F4F2] focus:outline-none focus:border-emerald-400 text-sm"
              />
            </div>
          </div>

          <button
            onClick={addAlert}
            disabled={!targetPrice}
            className="w-full py-3.5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-40"
          >
            🔔 Set Alert
          </button>
        </div>
      )}

      {saved && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 rounded-2xl text-emerald-700 text-xs font-black text-center animate-in fade-in">
          ✅ Alert set! You&apos;ll be notified when the price is reached.
        </div>
      )}

      {/* Alert List */}
      {alerts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-4xl mb-3">🔔</p>
          <p className="text-slate-400 text-sm font-medium">No alerts yet.</p>
          <p className="text-slate-300 text-xs mt-1">Tap + to set a price alert for any halal stock.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => {
            const liveStock = MOCK_PSX_STOCKS.find(s => s.symbol === alert.symbol);
            const current = liveStock?.price ?? alert.currentPrice;
            const isTriggered = alert.direction === 'above' ? current >= alert.targetPrice : current <= alert.targetPrice;
            const diff = ((current - alert.targetPrice) / alert.targetPrice * 100).toFixed(1);

            return (
              <div key={alert.id} className={`flex items-center gap-4 p-4 rounded-3xl border transition-all ${
                isTriggered ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200' : 'bg-white dark:bg-[#15181F] border-[#E3ECE7] dark:border-[#262B35]'
              }`}>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 ${
                  isTriggered ? 'bg-emerald-100' : 'bg-[#F4F7F5] dark:bg-[#1C2029]'
                }`}>
                  {isTriggered ? '🔔' : '⏳'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#0B1F17] dark:text-[#F0F4F2] text-sm">{alert.symbol}</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                      alert.direction === 'above' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {alert.direction === 'above' ? '▲' : '▼'} ₨{alert.targetPrice.toLocaleString()}
                    </span>
                    {isTriggered && <span className="text-xs font-black px-2 py-0.5 bg-emerald-600 text-white rounded-lg">TRIGGERED</span>}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Current: ₨{current.toLocaleString()} &nbsp;·&nbsp;
                    <span className={parseFloat(diff) >= 0 ? 'text-emerald-500' : 'text-red-400'}>
                      {parseFloat(diff) >= 0 ? '+' : ''}{diff}% from target
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="text-slate-300 hover:text-red-400 transition-colors text-lg flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
