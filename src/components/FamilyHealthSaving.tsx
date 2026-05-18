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
    onSave(amt);
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
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 mb-4 sm:mb-6" dir={isUrdu ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] sm:text-xs font-bold mb-1.5 sm:mb-2 border border-emerald-100 shadow-inner">
          <span>🩺</span> {t('Takaful Protection', 'تکافل تحفظ')}
        </div>
        <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">
          {t('Family Health Savings', 'فیملی ہیلتھ سیونگز')}
        </h2>
        <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5 sm:mt-1 leading-relaxed max-w-2xl">
          {t('A Shariah-compliant emergency medical fund for your family. Earn Halal dividends while keeping funds liquid for healthcare needs.', 'آپ کے خاندان کے لیے شریعہ کے مطابق ہنگامی طبی فنڈ۔ صحت کی دیکھ بھال کی ضروریات کے لیے فنڈز کو مائع رکھتے ہوئے حلال منافع کمائیں۔')}
        </p>
      </div>

      {/* Overview Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden border border-emerald-500/20">
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-[40px] pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div>
            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-emerald-200 mb-0.5 sm:mb-1">
              {t('Available Health Pool', 'دستیاب ہیلتھ پول')}
            </p>
            <h3 className="text-xl sm:text-3xl font-black tracking-tight">Rs {poolBalance.toLocaleString()}</h3>
          </div>
          <button onClick={() => setShowDeposit(true)}
            className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 bg-white text-emerald-700 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-xs shadow-md hover:bg-emerald-50 transition-all active:scale-95 text-center flex-shrink-0">
            + {t('Add Funds', 'فنڈز شامل کریں')}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-white/15 text-[11px] sm:text-xs">
          <div>
            <p className="text-emerald-200 font-medium">{t('Active Covered Members', 'فعال زیر کفالت ارکان')}</p>
            <p className="font-bold text-sm sm:text-base mt-0.5">{members.length} {t('Members', 'ارکان')}</p>
          </div>
          <div>
            <p className="text-emerald-200 font-medium">{t('Total Medical Claims', 'کل طبی کلیمز')}</p>
            <p className="font-bold text-sm sm:text-base mt-0.5">Rs {members.reduce((s,m) => s + m.claimed, 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl space-y-3 sm:space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-xs sm:text-sm text-slate-800">{t('Deposit to Health Pool', 'ہیلتھ پول میں جمع کریں')}</h4>
            <button onClick={() => setShowDeposit(false)} className="text-slate-400 hover:text-slate-600 text-xs sm:text-sm">✕</button>
          </div>
          {error && <p className="text-[11px] sm:text-xs font-bold text-red-500 bg-red-50 p-2 sm:p-2.5 rounded-xl">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 items-end">
            <div>
              <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                {t('Amount (PKR)', 'رقم (روپے)')}
              </label>
              <input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)}
                placeholder="50000"
                className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-slate-800 font-bold focus:outline-none focus:border-emerald-500 text-xs sm:text-sm outline-none" />
              <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1">{t('Current Wallet Balance:', 'موجودہ والٹ بیلنس:')} Rs {balance.toLocaleString()}</p>
            </div>
            <button onClick={handleAddDeposit} className="w-full py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl sm:rounded-2xl transition-all text-xs sm:text-sm shadow-md active:scale-95 flex-shrink-0">
              {t('Confirm Transfer', 'ٹرانسفر کی تصدیق کریں')}
            </button>
          </div>
        </div>
      )}

      {/* Member Management Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight">{t('Covered Family Members', 'زیر کفالت خاندانی ارکان')}</h3>
          <button onClick={() => setShowAdd(true)} className="text-[11px] sm:text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            <span>+</span> {t('Add Member', 'رکن شامل کریں')}
          </button>
        </div>

        {/* Add Member Form */}
        {showAdd && (
          <div className="p-4 sm:p-6 bg-slate-100 rounded-2xl sm:rounded-3xl border border-slate-200 space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-xs sm:text-sm text-slate-800">{t('Add Family Member', 'خاندانی رکن شامل کریں')}</h4>
              <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600 text-xs sm:text-sm">✕</button>
            </div>
            {error && <p className="text-[11px] sm:text-xs font-bold text-red-500 bg-red-50 p-2 rounded-xl">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 items-end">
              <div>
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 block mb-1">{t('Full Name', 'پورا نام')}</label>
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ammi Jan"
                  className="w-full p-2.5 sm:p-3 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-xs outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 block mb-1">{t('Relation', 'رشتہ')}</label>
                <input type="text" value={newRelation} onChange={e => setNewRelation(e.target.value)} placeholder="Mother"
                  className="w-full p-2.5 sm:p-3 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-xs outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 block mb-1">{t('Age', 'عمر')}</label>
                <input type="number" value={newAge} onChange={e => setNewAge(e.target.value)} placeholder="62"
                  className="w-full p-2.5 sm:p-3 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-xs outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 block mb-1">{t('Monthly Alloc (PKR)', 'ماہانہ مختص')}</label>
                <input type="number" value={newAlloc} onChange={e => setNewAlloc(e.target.value)} placeholder="10000"
                  className="w-full p-2.5 sm:p-3 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-xs outline-none focus:border-emerald-500" />
              </div>
            </div>
            <button onClick={handleAddMember} className="w-full py-2.5 sm:py-3 bg-emerald-600 text-white font-bold rounded-xl sm:rounded-2xl text-xs hover:bg-emerald-500 shadow-md active:scale-95 transition-all">
              {t('Save Member', 'رکن محفوظ کریں')}
            </button>
          </div>
        )}

        {/* Member List - Responsive 2-Column Grid on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-start">
          {members.map(m => (
            <div key={m.id} className="p-4 sm:p-5 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-all space-y-2.5 sm:space-y-3 flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base sm:text-lg font-bold flex-shrink-0 border border-emerald-100">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800 tracking-tight">{m.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">{m.relation} · {m.age} {t('years old', 'سال عمر')}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowClaim(m.id)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-50 hover:bg-emerald-50 text-emerald-700 rounded-xl font-bold text-[10px] sm:text-xs border border-slate-100 hover:border-emerald-200 transition-all flex-shrink-0 active:scale-95 shadow-sm">
                    {t('File Claim', 'کلیم کریں')}
                  </button>
                </div>

                {/* Claim Form */}
                {showClaim === m.id && (
                  <div className="pt-2.5 sm:pt-3 border-t border-slate-100 space-y-2.5 sm:space-y-3 animate-in fade-in duration-200 mb-2 sm:mb-3">
                    <div className="flex justify-between items-center">
                      <p className="text-[11px] sm:text-xs font-bold text-slate-700">{t('File Medical Claim', 'طبی کلیم جمع کریں')}</p>
                      <button onClick={() => setShowClaim(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
                    </div>
                    {error && <p className="text-[11px] sm:text-xs font-bold text-red-500 bg-red-50 p-2 rounded-xl">{error}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[8px] sm:text-[9px] font-bold text-slate-400 block mb-1">{t('Claim Amount', 'کلیم کی رقم')}</label>
                        <input type="number" value={claimAmount} onChange={e => setClaimAmount(e.target.value)} placeholder="15000"
                          className="w-full p-2 sm:p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="text-[8px] sm:text-[9px] font-bold text-slate-400 block mb-1">{t('Medical Reason', 'طبی وجہ')}</label>
                        <input type="text" value={claimReason} onChange={e => setClaimReason(e.target.value)} placeholder="Doctor Visit / Meds"
                          className="w-full p-2 sm:p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500" />
                      </div>
                    </div>
                    <button onClick={() => handleClaim(m.id)} className="w-full py-2 sm:py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-500 shadow-md active:scale-95 transition-all">
                      {t('Submit Claim Request', 'کلیم کی درخواست جمع کریں')}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2.5 sm:pt-3 border-t border-slate-50 text-[10px] sm:text-[11px]">
                <span className="text-slate-400">{t('Monthly Alloc:', 'ماہانہ مختص:')} <strong className="text-slate-700 font-bold">Rs {m.monthlyAllocation.toLocaleString()}</strong></span>
                <span className="text-slate-400">{t('Claimed:', 'کلیم کردہ:')} <strong className="text-emerald-600 font-bold">Rs {m.claimed.toLocaleString()}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
