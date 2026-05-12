'use client';
import { useState } from 'react';
import VoiceAgent from '@/components/VoiceAgent';
import DepositFlow from '@/components/DepositFlow';
import WithdrawFlow from '@/components/WithdrawFlow';

export default function Home() {
  const [balance, setBalance] = useState(50000);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showFlow, setShowFlow] = useState<'deposit' | 'withdraw' | null>(null);

  const handleVoiceCommand = (command: string) => {
    if (command.includes('ڈیپوزٹ') || command.includes('deposit')) {
      setShowFlow('deposit');
    } else if (command.includes('وِڈڈرا') || command.includes('withdraw')) {
      setShowFlow('withdraw');
    } else if (command.includes('بیلنس') || command.includes('balance')) {
      alert(`آپ کا بیلنس: PKR ${balance.toLocaleString('ur-PK')}`);
    }
  };

  const handleTransaction = (data: any) => {
    setTransactions([
      { ...data, date: new Date().toLocaleDateString('ur-PK'), id: Math.random() },
      ...transactions
    ]);

    if (data.type === 'deposit') {
      setBalance(balance + data.amount);
    } else {
      setBalance(balance - data.amount);
    }
    
    setShowFlow(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white py-6 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold">🕌 پاکستان حلال سرمایہ کاری</h1>
          <p className="text-green-100 mt-2">Halal Investment Platform for Pakistan</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Balance Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-l-4 border-green-600">
          <p className="text-gray-600 text-lg mb-2">موجودہ بیلنس</p>
          <h2 className="text-5xl font-bold text-green-600">
            PKR {balance.toLocaleString('ur-PK')}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {['dashboard', 'transactions', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition ${
                activeTab === tab
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'dashboard' && '📊 ڈیشبورڈ'}
              {tab === 'transactions' && '📈 ٹرانزیکشنز'}
              {tab === 'settings' && '⚙️ ترتیبات'}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && !showFlow && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer"
              onClick={() => setShowFlow('deposit')}>
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-2">ڈیپوزٹ کریں</h3>
              <p className="text-gray-600">رقم شامل کریں اپنے اکاؤنٹ میں</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer"
              onClick={() => setShowFlow('withdraw')}>
              <div className="text-5xl mb-4">💸</div>
              <h3 className="text-2xl font-bold mb-2">وِڈڈرا کریں</h3>
              <p className="text-gray-600">اپنی رقم واپس لیں</p>
            </div>
          </div>
        )}

        {/* Deposit Flow */}
        {showFlow === 'deposit' && (
          <div className="mb-8">
            <button
              onClick={() => setShowFlow(null)}
              className="mb-4 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg font-medium"
            >
              ← واپس جائیں
            </button>
            <DepositFlow onSuccess={handleTransaction} />
          </div>
        )}

        {/* Withdraw Flow */}
        {showFlow === 'withdraw' && (
          <div className="mb-8">
            <button
              onClick={() => setShowFlow(null)}
              className="mb-4 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg font-medium"
            >
              ← واپس جائیں
            </button>
            <WithdrawFlow onSuccess={handleTransaction} />
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6">حالیہ ٹرانزیکشنز</h3>
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">کوئی ٹرانزیکشن نہیں</p>
            ) : (
              <div className="space-y-4">
                {transactions.map((t) => (
                  <div key={t.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-semibold capitalize">{t.type === 'deposit' ? '💰 ڈیپوزٹ' : '💸 وِڈڈرا'}</p>
                      <p className="text-sm text-gray-600">{t.method} • {t.date}</p>
                    </div>
                    <p className={`text-xl font-bold ${t.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'deposit' ? '+' : '-'} PKR {t.amount.toLocaleString('ur-PK')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6">ترتیبات</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-medium text-green-900">🔐 سیکیورٹی</p>
                <p className="text-sm text-gray-600 mt-2">اپنی PIN کو محفوظ رکھیں</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-900">🎤 آواز کی ترتیبات</p>
                <p className="text-sm text-gray-600 mt-2">اردو میں آواز کنٹرول فعال ہے</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Voice Agent Button */}
      <VoiceAgent onCommand={handleVoiceCommand} />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>© 2024 Pakistan Halal Investment Platform. تمام حقوق محفوظ ہیں۔</p>
        </div>
      </footer>
    </main>
  );
}
