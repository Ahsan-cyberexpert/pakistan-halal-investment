'use client';
import { useState, useEffect } from 'react';

interface FamilyHealthSavingProps {
  balance: number;
  onSave: (amount: number) => void;
  lang?: 'en' | 'ur';
  cnic?: string;
}

interface Member {
  id: string;
  name: string;
  relation: string;
  age: number;
  monthlyAllocation: number;
  claimed: number;
}

export default function FamilyHealthSaving({ balance, onSave, lang = 'en', cnic = 'default' }: FamilyHealthSavingProps) {
  const isUrdu = lang === 'ur';
  const t = (en: string, ur: string) => isUrdu ? ur : en;

  const storageKey = `roziq_health_pool_${cnic}`;
  const membersKey = `roziq_health_members_${cnic}`;

  const [poolBalance, setPoolBalance] = useState(150000);
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Ammi Jan', relation: 'Mother', age: 62, monthlyAllocation: 10000, claimed: 25000 },
    { id: '2', name: 'Abbu Jan', relation: 'Father', age: 68, monthlyAllocation: 15000, claimed: 40000 },
    { id: '3', name: 'Ayesha', relation: 'Spouse', age: 31, monthlyAllocation: 8000, claimed: 5000 },
    { id: '4', name: 'Ibrahim', relation: 'Child', age: 6, monthlyAllocation: 5000, claimed: 0 }
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [showClaim, setShowClaim] = useState<string | null>(null);
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [claimReason, setClaimReason] = useState('');

  // Add member form
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newAlloc, setNewAlloc] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedPool = localStorage.getItem(storageKey);
    const savedMembers = localStorage.getItem(membersKey);
    if (savedPool) setPoolBalance(parseFloat(savedPool));
    if (savedMembers) setMembers(JSON.parse(savedMembers));
  }, [storageKey, membersKey]);

  const updateStorage = (pool: number, mems: Member[]) => {
    localStorage.setItem(storageKey, pool.toString());
    localStorage.setItem(membersKey, JSON.stringify(mems));
  };

  const handleAddDeposit = () => {
    setError('');
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) { setError(t('Enter a valid amount', 'درست رقم درج کریں')); return; }
    if (amt > balance) { setError(t('Insufficient main wallet balance', 'مین والٹ میں ناکافی بیلنس')); return; }

    const newPool = poolBalance + amt;
    setPoolBalance(newPool);
    onSave(amt); // Protected by PIN in dashboard
    updateStorage(newPool, members);
    setDepositAmount('');
    setShowDeposit(false);
  };

  const handleAddMember = () => {
    setError('');
    if (!newName || !newRelation || !newAge || !newAlloc) {
      setError(t('Please fill all fields', 'براہ کرم تمام خانے پُر کریں'));
      return;
    }
    const newM: Member = {
      id: Date.now().toString(),
      name: newName,
      relation: newRelation,
      age: parseInt(newAge) || 25,
      monthlyAllocation: parseFloat(newAlloc) || 5000,
      claimed: 0
    };
    const updated = [...members, newM];
    setMembers(updated);
    updateStorage(poolBalance, updated);
    setNewName(''); setNewRelation(''); setNewAge(''); setNewAlloc('');
    setShowAdd(false);
  };

  const handleClaim = (memberId: string) => {
    setError('');
    const amt = parseFloat(claimAmount);
    if (isNaN(amt) || amt <= 0) { setError(t('Enter a valid claim amount', 'درست کلیم کی رقم درج کریں')); return; }
    if (amt > poolBalance) { setError(t('Insufficient funds in Health Pool', 'ہیلتھ پول میں ناکافی فنڈز')); return; }

    const updatedMems = members.map(m => m.id === memberId ? { ...m, claimed: m.claimed + amt } : m);
    const newPool = poolBalance - amt;

    setPoolBalance(newPool);
    setMembers(updatedMems);
    updateStorage(newPool, updatedMems);
    setClaimAmount(''); setClaimReason(''); setShowClaim(null);
  };

  return (
    <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-300" dir={isUrdu ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-full text-xs font-semibold mb-1 border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/600"></span>
          <span>{t('Takaful Mutual Protection', 'تکافل باہمی تحفظ')}</span>
        </div>
        <h2 className="text-base sm:text-lg font-bold text-[#0B1F17] dark:text-white tracking-tight">
          {t('Family Health Savings Pool', 'فیملی ہیلتھ سیونگز پول')}
        </h2>
        <p className="text-slate-500 text-xs mt-0.5 leading-relaxed max-w-xl">
          {t('A Shariah-compliant emergency medical fund for your family. Earn Halal dividends while keeping funds liquid.', 'آپ کے خاندان کے لیے شریعہ کے مطابق ہنگامی طبی فنڈ۔ صحت کی دیکھ بھال کی ضروریات کے لیے فنڈز کو مائع رکھتے ہوئے حلال منافع کمائیں۔')}
        </p>
      </div>

      {/* Overview Card */}
      <div className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 rounded-2xl p-4 sm:p-5 text-white shadow-md border border-emerald-600/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 sm:gap-0 mb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200/90 mb-0.5">
              {t('Available Health Pool', 'دستیاب ہیلتھ پول')}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">Rs {poolBalance.toLocaleString()}</h3>
          </div>
          <button onClick={() => setShowDeposit(true)}
            className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-[#15181F] text-emerald-900 rounded-xl font-semibold text-xs shadow-sm hover:bg-emerald-50 dark:bg-emerald-950/60 transition-all active:scale-95 text-center flex-shrink-0">
            + {t('Add Funds (PIN Locked)', 'فنڈز شامل کریں')}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-600/40 text-xs">
          <div>
            <p className="text-emerald-200/80 font-medium text-xs">{t('Active Covered Members', 'فعال زیر کفالت ارکان')}</p>
            <p className="font-bold text-sm text-white mt-0.5">{members.length} {t('Members', 'ارکان')}</p>
          </div>
          <div>
            <p className="text-emerald-200/80 font-medium text-xs">{t('Total Medical Claims', 'کل طبی کلیمز')}</p>
            <p className="font-bold text-sm text-white mt-0.5">Rs {members.reduce((s,m) => s + m.claimed, 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="p-3 sm:p-5 bg-white dark:bg-[#15181F] rounded-2xl sm:rounded-3xl border border-[#E3ECE7] dark:border-[#262B35] shadow-xl space-y-2.5 sm:space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-xs sm:text-sm text-[#0B1F17] dark:text-[#F0F4F2]">{t('Deposit to Health Pool', 'ہیلتھ پول میں جمع کریں')}</h4>
            <button onClick={() => setShowDeposit(false)} className="text-slate-400 hover:text-slate-600 text-xs sm:text-sm">✕</button>
          </div>
          {error && <p className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/60 p-2 rounded-xl">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 items-end">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                {t('Amount (PKR)', 'رقم (روپے)')}
              </label>
              <input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)}
                placeholder="50000"
                className="w-full px-3 py-1.5 sm:px-4 sm:py-2.5 bg-[#F4F7F5] dark:bg-[#1C2029] border border-[#E3ECE7] dark:border-[#262B35] rounded-xl sm:rounded-2xl text-[#0B1F17] dark:text-[#F0F4F2] font-bold focus:outline-none focus:border-emerald-500 text-xs sm:text-sm outline-none" />
              <p className="text-xs text-slate-400 mt-1">{t('Current Wallet Balance:', 'موجودہ والٹ بیلنس:')} Rs {balance.toLocaleString()}</p>
            </div>
            <button onClick={handleAddDeposit} className="w-full py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-50 dark:bg-emerald-950/600 text-white font-black rounded-xl sm:rounded-2xl transition-all text-xs sm:text-sm shadow-md active:scale-95 flex-shrink-0">
              {t('Confirm Transfer (PIN Locked)', 'ٹرانسفر کی تصدیق کریں')}
            </button>
          </div>
        </div>
      )}

      {/* Member Management Section */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs sm:text-sm font-black text-[#0B1F17] dark:text-[#F0F4F2] tracking-tight">{t('Covered Family Members', 'زیر کفالت خاندانی ارکان')}</h3>
          <button onClick={() => setShowAdd(true)} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            <span>+</span> {t('Add Member', 'رکن شامل کریں')}
          </button>
        </div>

        {/* Add Member Form */}
        {showAdd && (
          <div className="p-3 sm:p-5 bg-[#E8EDEA] dark:bg-[#232936] rounded-2xl sm:rounded-3xl border border-[#E3ECE7] dark:border-[#262B35] space-y-2.5 sm:space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-xs sm:text-sm text-[#0B1F17] dark:text-[#F0F4F2]">{t('Add Family Member', 'خاندانی رکن شامل کریں')}</h4>
              <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600 text-xs sm:text-sm">✕</button>
            </div>
            {error && <p className="text-xs font-bold text-red-50 bg-red-50 dark:bg-red-950/60 p-2 rounded-xl">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 items-end">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">{t('Full Name', 'پورا نام')}</label>
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ammi Jan"
                  className="w-full p-2 sm:p-2.5 bg-white dark:bg-[#15181F] border border-[#E3ECE7] dark:border-[#262B35] rounded-xl sm:rounded-2xl text-xs outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">{t('Relation', 'رشتہ')}</label>
                <input type="text" value={newRelation} onChange={e => setNewRelation(e.target.value)} placeholder="Mother"
                  className="w-full p-2 sm:p-2.5 bg-white dark:bg-[#15181F] border border-[#E3ECE7] dark:border-[#262B35] rounded-xl sm:rounded-2xl text-xs outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">{t('Age', 'عمر')}</label>
                <input type="number" value={newAge} onChange={e => setNewAge(e.target.value)} placeholder="62"
                  className="w-full p-2 sm:p-2.5 bg-white dark:bg-[#15181F] border border-[#E3ECE7] dark:border-[#262B35] rounded-xl sm:rounded-2xl text-xs outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">{t('Monthly Alloc (PKR)', 'ماہانہ مختص')}</label>
                <input type="number" value={newAlloc} onChange={e => setNewAlloc(e.target.value)} placeholder="10000"
                  className="w-full p-2 sm:p-2.5 bg-white dark:bg-[#15181F] border border-[#E3ECE7] dark:border-[#262B35] rounded-xl sm:rounded-2xl text-xs outline-none focus:border-emerald-500" />
              </div>
            </div>
            <button onClick={handleAddMember} className="w-full py-2 sm:py-2.5 bg-emerald-600 text-white font-bold rounded-xl sm:rounded-2xl text-xs hover:bg-emerald-50 dark:bg-emerald-950/600 shadow-md active:scale-95 transition-all">
              {t('Save Member', 'رکن محفوظ کریں')}
            </button>
          </div>
        )}

        {/* Member List - Responsive 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 items-start">
          {members.map(m => (
            <div key={m.id} className="p-3 bg-white dark:bg-[#15181F] rounded-2xl border border-[#E3ECE7] dark:border-[#262B35] shadow-sm hover:border-emerald-200 transition-all space-y-2 flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-xs font-black flex-shrink-0 border border-emerald-100">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#0B1F17] dark:text-[#F0F4F2] tracking-tight">{m.name}</h4>
                      <p className="text-xs text-slate-400 font-medium">{m.relation} · {m.age} {t('years old', 'سال عمر')}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowClaim(m.id)}
                    className="px-2.5 py-1 bg-[#F4F7F5] dark:bg-[#1C2029] hover:bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-lg font-bold text-xs border border-[#E3ECE7] dark:border-[#262B35] hover:border-emerald-200 transition-all flex-shrink-0 active:scale-95 shadow-sm">
                    {t('File Claim', 'کلیم کریں')}
                  </button>
                </div>

                {/* Claim Form */}
                {showClaim === m.id && (
                  <div className="pt-2 border-t border-[#E3ECE7] dark:border-[#262B35] space-y-2 animate-in fade-in duration-200 mb-1.5">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold text-[#374151] dark:text-[#CBD5E1]">{t('File Medical Claim', 'طبی کلیم جمع کریں')}</p>
                      <button onClick={() => setShowClaim(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
                    </div>
                    {error && <p className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/60 p-1.5 rounded-xl">{error}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      <div>
                        <label className="text-xs font-bold text-slate-400 block mb-0.5">{t('Claim Amount', 'کلیم کی رقم')}</label>
                        <input type="number" value={claimAmount} onChange={e => setClaimAmount(e.target.value)} placeholder="15000"
                          className="w-full p-1.5 bg-[#F4F7F5] dark:bg-[#1C2029] border border-[#E3ECE7] dark:border-[#262B35] rounded-xl text-xs font-bold outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 block mb-0.5">{t('Medical Reason', 'طبی وجہ')}</label>
                        <input type="text" value={claimReason} onChange={e => setClaimReason(e.target.value)} placeholder="Doctor Visit / Meds"
                          className="w-full p-1.5 bg-[#F4F7F5] dark:bg-[#1C2029] border border-[#E3ECE7] dark:border-[#262B35] rounded-xl text-xs outline-none focus:border-emerald-500" />
                      </div>
                    </div>
                    <button onClick={() => handleClaim(m.id)} className="w-full py-1.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-50 dark:bg-emerald-950/600 shadow-md active:scale-95 transition-all">
                      {t('Submit Claim Request', 'کلیم کی درخواست جمع کریں')}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-1.5 border-t border-slate-50 text-xs">
                <span className="text-slate-400">{t('Monthly Alloc:', 'ماہانہ مختص:')} <strong className="text-[#374151] dark:text-[#CBD5E1] font-bold">Rs {m.monthlyAllocation.toLocaleString()}</strong></span>
                <span className="text-slate-400">{t('Claimed:', 'کلیم کردہ:')} <strong className="text-emerald-600 font-bold">Rs {m.claimed.toLocaleString()}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
