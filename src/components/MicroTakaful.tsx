'use client';
import { useState } from 'react';

export default function MicroTakaful() {
  const [optedIn, setOptedIn] = useState(false);

  return (
    <div className="bg-sky-50 rounded-3xl p-6 shadow-sm border border-sky-100">
      <div className="flex items-center space-x-3 mb-4">
        <div className="text-3xl">🛡️</div>
        <div>
          <h2 className="text-xl font-bold text-sky-900">Health Takaful</h2>
          <p className="text-xs text-sky-700">Shariah-compliant Health Coverage</p>
        </div>
      </div>

      {!optedIn ? (
        <div className="bg-white p-4 rounded-2xl border border-sky-100 mb-2">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="font-bold text-gray-800">Family Health Cover</div>
              <div className="text-xs text-gray-500">Coverage up to PKR 500,000</div>
            </div>
            <div className="text-right">
              <div className="font-black text-sky-600 text-lg">PKR 200</div>
              <div className="text-[10px] text-gray-400">/ month</div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-4 leading-relaxed">
            By opting in, PKR 200 will be auto-deducted from your monthly investment profits and pooled into a Takaful fund to cover medical emergencies for the community.
          </p>
          <button 
            onClick={() => setOptedIn(true)}
            className="w-full bg-sky-600 text-white font-bold py-2 rounded-xl hover:bg-sky-700 text-sm shadow-md shadow-sky-200"
          >
            Opt-In to Takaful Pool
          </button>
        </div>
      ) : (
        <div className="bg-sky-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-sky-200">
          <div>
            <div className="text-sm font-bold">Protected ✅</div>
            <div className="text-xs text-sky-200 mt-1">PKR 500K Active Coverage</div>
          </div>
          <button className="bg-white text-sky-700 text-xs font-bold px-3 py-1 rounded-lg hover:bg-sky-50">
            View Policy
          </button>
        </div>
      )}
    </div>
  );
}
