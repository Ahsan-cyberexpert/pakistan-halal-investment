'use client';
import { useState } from 'react';

interface ZakatCalculatorProps {
  balance: number;
  portfolioValue: number;
  onDonate: (amount: number, recipient: string) => void;
}

const NISAB_THRESHOLD = 300000; // Mock Gold Nisab value

export default function ZakatCalculator({ balance, portfolioValue, onDonate }: ZakatCalculatorProps) {
  const totalWealth = balance + portfolioValue;
  const zakatAmount = totalWealth * 0.025;
  const isEligible = totalWealth >= NISAB_THRESHOLD;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [donated, setDonated] = useState(false);

  const recipients = ['Edhi Foundation', 'Al-Khidmat', 'Orphan Care', 'Local Masjid'];

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) return;
    
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate processing
    onDonate(zakatAmount, selectedRecipient);
    setLoading(false);
    setDonated(true);
  };

  if (donated) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 text-center mb-6 animate-fade-in">
        <div className="text-4xl mb-3">🌟</div>
        <h2 className="text-xl font-bold text-green-700">JazakAllah Khair!</h2>
        <p className="text-gray-600 mt-2">Your Zakat of PKR {zakatAmount.toFixed(2)} has been distributed.</p>
        <button onClick={() => { setDonated(false); setModalOpen(false); }} className="mt-4 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium">
          Close
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">🤲 Zakat Calculator</h2>
          {isEligible && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Due</span>}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Cash Balance</span>
            <span className="font-medium">PKR {balance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Portfolio Value</span>
            <span className="font-medium">PKR {portfolioValue.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-lg">
            <span>Total Wealth</span>
            <span>PKR {totalWealth.toFixed(2)}</span>
          </div>
        </div>

        {isEligible ? (
          <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-green-800 font-medium">Zakat Due (2.5%)</p>
            <p className="text-2xl font-bold text-green-700 mt-1">PKR {zakatAmount.toFixed(2)}</p>
            <button 
              onClick={() => setModalOpen(true)}
              className="mt-3 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Donate Now
            </button>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl text-center">
            <p className="text-gray-500 text-sm">Nisab threshold is PKR {NISAB_THRESHOLD.toLocaleString()}.<br/>Your wealth is currently below the limit.</p>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
            
            <h3 className="text-xl font-bold text-gray-800 mb-4">Select Recipient</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {recipients.map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRecipient(r)}
                  className={`p-3 border rounded-xl text-sm font-medium transition ${
                    selectedRecipient === r ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200' : 'hover:bg-gray-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {selectedRecipient && (
              <form onSubmit={handleDonate} className="space-y-4">
                <div className="p-3 bg-yellow-50 rounded-lg text-yellow-800 text-xs text-center">
                  Impact: Your PKR {zakatAmount.toFixed(2)} will provide meals, water, and education.
                </div>
                <label className="block text-sm font-medium text-gray-700">4 Digit PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="****"
                  className="w-full p-3 border rounded-xl text-center text-xl tracking-widest focus:ring-2 focus:ring-green-500 outline-none"
                />
                <button type="submit" disabled={loading} className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 font-medium">
                  {loading ? 'Processing...' : `Confirm Donation`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
