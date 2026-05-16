'use client';
import { useState, useEffect } from 'react';

interface WaliAutopilotProps {
  lang: 'en' | 'ur';
}

export default function WaliAutopilot({ lang }: WaliAutopilotProps) {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'proposing' | 'locked'>('locked');
  const [eligibility, setEligibility] = useState({ 
    isPremium: false, 
    totalInvested: 0, 
    totalProfit: 0, 
    reqInvest: 25000000, 
    reqProfit: 2500000 
  });
  const [logs, setLogs] = useState<{ msg: string; urdu: string; time: string }[]>([]);
  const [vaultBalance, setVaultBalance] = useState(0);
  const [showManageVault, setShowManageVault] = useState(false);
  const [allocAmount, setAllocAmount] = useState('');
  const [proposal, setProposal] = useState<any>(null);
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pin, setPin] = useState('');

  const t = (en: string, ur: string) => (lang === 'ur' ? ur : en);

  useEffect(() => {
    fetch('/api/agent/autopilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'scan' })
    }).then(r => r.json()).then(d => {
      if (d.waliBalance !== undefined) setVaultBalance(d.waliBalance);
      setEligibility({
        isPremium: d.isPremium || false,
        totalInvested: d.totalInvested || 0,
        totalProfit: d.totalProfit || 0,
        reqInvest: 25000000,
        reqProfit: 2500000
      });
      if (d.isPremium) setStatus('idle');
    });
  }, []);

  const handleAllocate = async (action: 'allocate' | 'deallocate') => {
    const res = await fetch('/api/agent/autopilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, amount: parseFloat(allocAmount) })
    });
    const data = await res.json();
    if (data.success) {
      setVaultBalance(data.waliBalance);
      setAllocAmount('');
      addLog(`Vault updated: ${data.waliBalance} PKR`, `والٹ اپ ڈیٹ ہو گیا: ${data.waliBalance} روپے`);
      window.dispatchEvent(new CustomEvent('balanceUpdate'));
    }
  };

  const startScanning = async () => {
    if (vaultBalance <= 0) {
      alert(t('Please add funds to Wali Vault first.', 'براہ کرم پہلے ولی والٹ میں فنڈز شامل کریں۔'));
      return;
    }
    setStatus('scanning');
    addLog('Scanning PSX for secure opportunities...', 'محفوظ مواقع کے لیے پی ایس ایکس کو اسکین کیا جا رہا ہے...');
    
    await new Promise(r => setTimeout(r, 2500));
    
    const res = await fetch('/api/agent/autopilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'scan' })
    });
    const data = await res.json();
    
    if (data.recommendations && data.recommendations.length > 0) {
      setProposal(data.recommendations[0]);
      setStatus('proposing');
      addLog('Investment proposal ready for review.', 'سرمایہ کاری کی تجویز جائزے کے لیے تیار ہے۔');
    } else {
      setStatus('idle');
      addLog('No stable opportunities found. Try again later.', 'کوئی مستحکم مواقع نہیں ملے۔ بعد میں دوبارہ کوشش کریں۔');
    }
  };

  const addLog = (msg: string, urdu: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [{ msg, urdu, time }, ...prev]);
  };

  const confirmInvestment = async () => {
    const storedPin = localStorage.getItem('roziq_pin') || '1234';
    if (pin !== storedPin) {
      alert(t('Incorrect PIN', 'غلط پن'));
      return;
    }
    setShowPinEntry(false);
    setPin('');
    try {
      const res = await fetch('/api/agent/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'invest', symbol: proposal.symbol })
      });
      const data = await res.json();
      if (data.success) {
        addLog(data.message, data.urduMessage);
        setVaultBalance(data.waliBalance);
        setProposal(null);
        setStatus('idle');
        window.dispatchEvent(new CustomEvent('balanceUpdate'));
        if ('vibrate' in navigator) navigator.vibrate(200);
      } else {
        addLog(data.error || 'Trade failed', 'تجارت ناکام ہو گئی');
      }
    } catch (err) {
      addLog('Network error during trade.', 'تجارت کے دوران نیٹ ورک کی خرابی۔');
    }
  };

  return (
    <div className="p-8 rounded-[3rem] bg-slate-950 border border-emerald-500/10 shadow-3xl overflow-hidden relative transition-all duration-700">
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[80px]" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className={`w-14 h-14 rounded-[2rem] flex items-center justify-center text-3xl transition-all duration-700 ${status === 'scanning' ? 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)] rotate-12' : 'bg-slate-900 border border-white/5'}`}>
            🤖
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter italic">WALI<span className="text-emerald-500 text-sm align-top ml-1">AI</span></h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{t('Sovereign Guardian', 'خود مختار محافظ')}</p>
          </div>
        </div>

        {eligibility.isPremium ? (
          status === 'idle' && (
            <button
              onClick={startScanning}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-900/40 transition-all active:scale-95"
            >
              {t('Start Scanning', 'اسکیننگ شروع کریں')}
            </button>
          )
        ) : (
          <div className="text-right">
            <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest mb-1">{t('Elite Access Pending', 'ایلیٹ رسائی باقی ہے')}</p>
            <div className="flex gap-1">
              <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (eligibility.totalInvested / 250000000) * 100)}%` }}></div>
              </div>
              <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (eligibility.totalProfit / 500000000) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!eligibility.isPremium && (
        <div className="mb-8 p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('Progress to Wali AI', 'ولی اے آئی کی طرف پیشرفت')}</p>
            <p className="text-xs font-bold text-emerald-400 mt-1">
              {Math.floor((eligibility.totalInvested / 250000000) * 100)}% {t('Invested', 'سرمایہ کاری')} • {Math.floor((eligibility.totalProfit / 500000000) * 100)}% {t('Profit', 'منافع')}
            </p>
          </div>
          <button className="text-[9px] font-black text-white bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all uppercase tracking-widest">
             {t('Elite Access Only', 'صرف ایلیٹ رسائی')}
          </button>
        </div>
      )}
      
      {/* Vault Stats */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        <div className="col-span-3 bg-white/5 border border-white/5 rounded-[2rem] p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">🏦</div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{t('Wali Vault', 'ولی والٹ')}</p>
          <p className="text-3xl font-black text-white tabular-nums tracking-tighter">
            <span className="text-xs font-medium text-emerald-500 mr-1.5">PKR</span>
            {vaultBalance.toLocaleString()}
          </p>
          <button 
            onClick={() => setShowManageVault(!showManageVault)}
            className="mt-3 text-[10px] font-black text-emerald-500 uppercase flex items-center gap-1 hover:gap-2 transition-all"
          >
            {t('Manage Capital', 'سرمایہ کا انتظام')} <span>→</span>
          </button>
        </div>
        <div className="col-span-2 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] p-6 flex flex-col justify-center items-center text-center">
          <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-1">{t('Security', 'سیکیورٹی')}</p>
          <p className="text-xl font-black text-emerald-500">{t('Verified', 'تصدیق شدہ')}</p>
          <div className="flex gap-1 mt-2">
            {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-emerald-500 rounded-full" />)}
          </div>
        </div>
      </div>

      {/* Manage Vault Overlay */}
      {showManageVault && (
        <div className="mb-8 p-6 bg-slate-900 border border-white/5 rounded-[2.5rem] animate-in slide-in-from-top-4 duration-500">
          <div className="flex gap-3">
            <input 
              type="number" 
              value={allocAmount}
              onChange={(e) => setAllocAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-black border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-emerald-500 outline-none transition-all"
            />
            <div className="flex flex-col gap-2">
              <button onClick={() => handleAllocate('allocate')} className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 transition-colors">Deposit</button>
              <button onClick={() => handleAllocate('deallocate')} className="bg-slate-800 text-white px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors">Refund</button>
            </div>
          </div>
        </div>
      )}

      {/* Proposal Logic */}
      {status === 'proposing' && proposal && !showPinEntry && (
        <div className="mb-8 p-8 bg-emerald-600 rounded-[3rem] text-white shadow-3xl shadow-emerald-900/40 animate-in zoom-in-95 duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 opacity-80">{t('Wali Proposal', 'ولی کی تجویز')}</h3>
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-4xl font-black tracking-tighter">{proposal.symbol}</p>
              <p className="font-bold opacity-70">{proposal.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase opacity-60 mb-1">{t('Halal Score', 'حلال اسکور')}</p>
              <div className="bg-white/20 px-4 py-1 rounded-full text-xl font-black">{proposal.halalScore}</div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/10">
              <span className="text-2xl">⚖️</span>
              <p className="text-xs leading-relaxed font-medium">
                {t('Shariah compliance verified. Debt-to-Equity is ', 'شریعت کی تعمیل کی تصدیق ہو گئی۔ قرض اور ایکویٹی کا تناسب ')}
                <span className="font-bold underline">{proposal.debtToEquity}%</span>
              </p>
            </div>
            <div className="flex items-center gap-3 bg-emerald-400/20 p-4 rounded-2xl border border-white/20">
              <span className="text-2xl">🇵🇰</span>
              <div>
                <p className="text-xs font-black uppercase tracking-widest">{t('Sovereign GDP Impact', 'قومی جی ڈی پی پر اثر')}</p>
                <p className="text-[10px] opacity-80 leading-relaxed">
                  {t(`This investment supports approximately ${proposal.jobsCreated || 50} jobs in Pakistan's economy.`, `یہ سرمایہ کاری پاکستان کی معیشت میں تقریباً ${proposal.jobsCreated || 50} ملازمتوں کا باعث بنتی ہے۔`)}
                </p>
                <div className="mt-2 w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-white h-full" style={{ width: `${(proposal.gdpImpact || 7) * 10}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setShowPinEntry(true)}
              className="flex-1 bg-white text-emerald-700 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all active:scale-95 shadow-xl shadow-emerald-900/20"
            >
              {t('Confirm & Invest', 'تصدیق کریں اور سرمایہ کاری کریں')}
            </button>
            <button 
              onClick={() => { setProposal(null); setStatus('idle'); }}
              className="px-8 bg-black/20 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase hover:bg-black/40 transition-all"
            >
              {t('Reject', 'مسترد کریں')}
            </button>
          </div>
        </div>
      )}

      {/* PIN Entry */}
      {showPinEntry && (
        <div className="mb-8 p-10 bg-white rounded-[3.5rem] text-slate-900 shadow-4xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">{t('Authorize Transaction', 'لین دین کی تصدیق کریں')}</p>
          <input 
            type="password" 
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="****"
            className="w-full text-center text-6xl font-black tracking-[1.5rem] py-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all mb-8"
          />
          <button 
            onClick={confirmInvestment}
            className="w-full bg-emerald-600 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:bg-emerald-500 transition-all active:scale-95"
          >
            {t('Verify Security PIN', 'سیکیورٹی پن کی تصدیق کریں')}
          </button>
        </div>
      )}

      {/* Logs */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{t('Guardian Log', 'محافظ لاگ')}</h3>
          <div className="flex gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'scanning' ? 'bg-emerald-500 animate-ping' : 'bg-slate-800'}`} />
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'proposing' ? 'bg-amber-500 animate-pulse' : 'bg-slate-800'}`} />
          </div>
        </div>
        <div className="space-y-3 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
          {logs.length === 0 ? (
            <p className="text-slate-700 text-[10px] italic font-medium p-6 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
              {t('Awaiting sovereign instructions...', 'خود مختار ہدایات کا انتظار ہے...')}
            </p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="text-[11px] bg-white/5 p-5 rounded-[1.8rem] border border-white/5 flex gap-4 items-start group hover:bg-white/10 transition-colors">
                <span className="text-slate-500 font-mono text-[9px] mt-1">{log.time}</span>
                <p className="text-white/90 font-bold leading-relaxed tracking-tight">
                  {lang === 'ur' ? log.urdu : log.msg}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
