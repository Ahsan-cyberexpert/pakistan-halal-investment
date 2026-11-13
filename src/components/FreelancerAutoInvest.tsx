'use client';
import { useState } from 'react';

export default function FreelancerAutoInvest() {
  const [connected, setConnected] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">💻</div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Freelancer Auto-Invest</h2>
          <p className="text-xs text-gray-500">Route Upwork/Fiverr income to Halal Funds</p>
        </div>
      </div>

      {!connected ? (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl">
          <div className="flex justify-around items-center mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/Payoneer_logo.svg" alt="Payoneer" className="h-4 opacity-70 grayscale" />
            <span className="text-gray-300">|</span>
            <div className="font-black text-emerald-500 text-lg tracking-tighter">SadaPay</div>
          </div>
          <p className="text-xs text-gray-600 text-center mb-4">
            Connect your receiving accounts. Automatically invest 10% of every USD remittance before it loses value to inflation.
          </p>
          <button 
            onClick={() => setConnected(true)}
            className="w-full bg-gray-900 text-white font-bold py-2 rounded-xl hover:bg-gray-800 text-sm"
          >
            Connect Accounts
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-emerald-900">Payoneer Connected ✅</span>
            <span className="bg-emerald-200 text-emerald-800 text-xs font-bold px-2 py-1 rounded-md">ACTIVE</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-emerald-100 flex justify-between items-center text-sm">
            <span className="text-gray-600">Auto-Invest Rule</span>
            <span className="font-bold text-gray-800">10% of Incoming</span>
          </div>
          <div className="text-xs text-emerald-600 mt-2 text-center">Next deduction on next incoming remittance.</div>
        </div>
      )}
    </div>
  );
}
