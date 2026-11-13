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
    <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-950 border border-emerald-500/10 shadow-lg overflow-hidden relative transition-all duration-300 mb-4 sm:mb-6">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-950/600/5 rounded-full blur-2xl" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl transition-all duration-500 flex-shrink-0 ${status === 'scanning' ? 'bg-emerald-50 dark:bg-emerald-950/600 shadow-md shadow-emerald-900/40 rotate-12' : 'bg-slate-900 border border-white/5'}`}>
            
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight italic">WALI<span className="text-emerald-500 text-xs align-top ml-1">AI</span></h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('Sovereign Guardian', 'خود مختار محافظ')}</p>
          </div>
        </div>

        {eligibility.isPremium ? (
          status === 'idle' && (
            <button
              onClick={startScanning}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-50 dark:bg-emerald-950/600 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
            >
              {t('Start Scanning', 'اسکیننگ شروع کریں')}
            </button>
          )
        ) : (
          <div className="text-right flex-shrink-0">
            <p className="text-xs font-black text-amber-500 uppercase tracking-widest mb-0.5">{t('Elite Access Pending', 'ایلیٹ رسائی باقی ہے')}</p>
            <div className="flex gap-1 justify-end">
              <div className="w-8 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-50 dark:bg-emerald-950/600" style={{ width: `${Math.min(100, (eligibility.totalInvested / 250000000) * 100)}%` }}></div>
              </div>
              <div className="w-8 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-50 dark:bg-emerald-950/600" style={{ width: `${Math.min(100, (eligibility.totalProfit / 500000000) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!eligibility.isPremium && (
        <div className="mb-3 sm:mb-4 p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('Progress to Wali AI', 'ولی اے آئی کی طرف پیشرفت')}</p>
            <p className="text-xs font-bold text-emerald-400 mt-0.5">
              {Math.floor((eligibility.totalInvested / 250000000) * 100)}% {t('Invested', 'سرمایہ کاری')} • {Math.floor((eligibility.totalProfit / 500000000) * 100)}% {t('Profit', 'منافع')}
            </p>
          </div>
          <button className="text-xs font-black text-white bg-white/10 px-2.5 py-1 rounded-lg hover:bg-white/20 transition-all uppercase tracking-widest flex-shrink-0">
             {t('Elite Access Only', 'صرف ایلیٹ رسائی')}
          </button>
        </div>
      )}
      
      {/* Vault Stats */}
      <div className="grid grid-cols-5 gap-2 mb-3 sm:mb-4">
        <div className="col-span-3 bg-white/5 border border-white/5 rounded-xl p-3 sm:p-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2.5 opacity-10 group-hover:opacity-20 transition-opacity text-xl pointer-events-none"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('Wali Vault', 'ولی والٹ')}</p>
          <p className="text-base sm:text-xl font-black text-white tabular-nums tracking-tight">
            <span className="text-xs font-medium text-emerald-400 mr-1">PKR</span>
            {vaultBalance.toLocaleString()}
          </p>
          <button 
            onClick={() => setShowManageVault(!showManageVault)}
            className="mt-1.5 text-xs font-black text-emerald-400 uppercase flex items-center gap-1 hover:gap-1.5 transition-all"
          >
            {t('Manage Capital', 'سرمایہ کا انتظام')} <span>→</span>
          </button>
        </div>
        <div className="col-span-2 bg-emerald-50 dark:bg-emerald-950/600/5 border border-emerald-500/10 rounded-xl p-3 flex flex-col justify-center items-center text-center">
          <p className="text-xs font-bold text-emerald-400/80 uppercase tracking-widest mb-0.5">{t('Security', 'سیکیورٹی')}</p>
          <p className="text-xs sm:text-sm font-black text-emerald-400">{t('Verified', 'تصدیق شدہ')}</p>
          <div className="flex gap-1 mt-1">
            {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-emerald-50 dark:bg-emerald-950/600 rounded-full" />)}
          </div>
        </div>
      </div>

      {/* Manage Vault Overlay */}
      {showManageVault && (
        <div className="mb-3 sm:mb-4 p-3.5 bg-slate-900 border border-white/5 rounded-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex gap-2">
            <input 
              type="number" 
              value={allocAmount}
              onChange={(e) => setAllocAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-black border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 outline-none transition-all text-xs"
            />
            <div className="flex flex-col gap-1">
              <button onClick={() => handleAllocate('allocate')} className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-50 dark:bg-emerald-950/600 transition-colors">Deposit</button>
              <button onClick={() => handleAllocate('deallocate')} className="bg-slate-800 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-700 transition-colors">Refund</button>
            </div>
          </div>
        </div>
      )}

      {/* Proposal Logic */}
      {status === 'proposing' && proposal && !showPinEntry && (
        <div className="mb-4 sm:mb-6 p-5 sm:p-8 bg-emerald-600 rounded-2xl sm:rounded-[3rem] text-white shadow-lg shadow-emerald-900/40 animate-in zoom-in-95 duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-28 h-28 sm:w-40 sm:h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] mb-4 sm:mb-6 opacity-80">{t('Wali Proposal', 'ولی کی تجویز')}</h3>
          
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <div>
              <p className="text-2xl sm:text-4xl font-black tracking-tighter">{proposal.symbol}</p>
              <p className="text-xs sm:text-sm font-bold opacity-70">{proposal.name}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-bold uppercase opacity-60 mb-0.5 sm:mb-1">{t('Halal Score', 'حلال اسکور')}</p>
              <div className="bg-white/20 px-3 py-1 sm:px-4 sm:py-1 rounded-full text-base sm:text-xl font-black">{proposal.halalScore}</div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2.5 sm:gap-3 bg-white/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10">
              <span className="text-xl sm:text-2xl flex-shrink-0"></span>
              <p className="text-xs leading-relaxed font-medium">
                {t('Shariah compliance verified. Debt-to-Equity is ', 'شریعت کی تعمیل کی تصدیق ہو گئی۔ قرض اور ایکویٹی کا تناسب ')}
                <span className="font-bold underline">{proposal.debtToEquity}%</span>
              </p>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3 bg-emerald-400/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/20">
              <span className="text-xl sm:text-2xl flex-shrink-0">PK</span>
              <div>
                <p className="text-xs font-black uppercase tracking-widest">{t('Sovereign GDP Impact', 'قومی جی ڈی پی پر اثر')}</p>
                <p className="text-xs opacity-80 leading-relaxed mt-0.5">
                  {t(`This investment supports approximately ${proposal.jobsCreated || 50} jobs in Pakistan's economy.`, `یہ سرمایہ کاری پاکستان کی معیشت میں تقریباً ${proposal.jobsCreated || 50} ملازمتوں کا باعث بنتی ہے۔`)}
                </p>
                <div className="mt-2 w-full bg-white/20 h-1 sm:h-1.5 rounded-full overflow-hidden">
                  <div className="bg-white dark:bg-[#15181F] h-full" style={{ width: `${(proposal.gdpImpact || 7) * 10}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 sm:gap-4">
            <button 
              onClick={() => setShowPinEntry(true)}
              className="flex-1 bg-white dark:bg-[#15181F] text-emerald-700 py-3 sm:py-5 rounded-xl sm:rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
            >
              {t('Confirm & Invest', 'تصدیق کریں اور سرمایہ کاری کریں')}
            </button>
            <button 
              onClick={() => { setProposal(null); setStatus('idle'); }}
              className="px-5 sm:px-8 bg-black/20 text-white py-3 sm:py-5 rounded-xl sm:rounded-[1.5rem] font-black text-xs uppercase hover:bg-black/40 transition-all active:scale-95"
            >
              {t('Reject', 'مسترد کریں')}
            </button>
          </div>
        </div>
      )}

      {/* PIN Entry */}
      {showPinEntry && (
        <div className="mb-4 sm:mb-6 p-6 sm:p-10 bg-white dark:bg-[#15181F] rounded-2xl sm:rounded-[3.5rem] text-[#0B1F17] dark:text-white shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300">
          <p className="text-center text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400 mb-4 sm:mb-8">{t('Authorize Transaction', 'لین دین کی تصدیق کریں')}</p>
          <input 
            type="password" 
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="****"
            className="w-full text-center text-4xl sm:text-6xl font-black tracking-[1rem] sm:tracking-[1.5rem] py-4 sm:py-6 bg-[#F4F7F5] dark:bg-[#1C2029] rounded-xl sm:rounded-[2rem] border-2 border-[#E3ECE7] dark:border-[#262B35] focus:border-emerald-500 outline-none transition-all mb-4 sm:mb-8"
          />
          <button 
            onClick={confirmInvestment}
            className="w-full bg-emerald-600 text-white py-3 sm:py-6 rounded-xl sm:rounded-[2rem] font-black text-xs sm:text-sm uppercase tracking-widest shadow-lg shadow-emerald-900/40 hover:bg-emerald-50 dark:bg-emerald-950/600 transition-all active:scale-95"
          >
            {t('Verify Security PIN', 'سیکیورٹی پن کی تصدیق کریں')}
          </button>
        </div>
      )}

      {/* Logs */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex justify-between items-center px-1 sm:px-2">
          <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest">{t('Guardian Log', 'محافظ لاگ')}</h3>
          <div className="flex gap-1 sm:gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'scanning' ? 'bg-emerald-50 dark:bg-emerald-950/600 animate-ping' : 'bg-slate-800'}`} />
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'proposing' ? 'bg-amber-50 dark:bg-amber-950/600 animate-pulse' : 'bg-slate-800'}`} />
          </div>
        </div>
        <div className="space-y-2 sm:space-y-3 max-h-32 sm:max-h-40 overflow-y-auto pr-1 sm:pr-2 scrollbar-hide">
          {logs.length === 0 ? (
            <p className="text-[#374151] dark:text-[#CBD5E1] text-xs italic font-medium p-4 sm:p-6 text-center border-2 border-dashed border-white/5 rounded-xl sm:rounded-[2rem]">
              {t('Awaiting sovereign instructions...', 'خود مختار ہدایات کا انتظار ہے...')}
            </p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="text-xs bg-white/5 p-3.5 sm:p-5 rounded-xl sm:rounded-[1.8rem] border border-white/5 flex gap-3 sm:gap-4 items-start group hover:bg-white/10 transition-colors">
                <span className="text-slate-500 font-mono text-xs mt-0.5 sm:mt-1">{log.time}</span>
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
