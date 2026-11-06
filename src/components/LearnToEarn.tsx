'use client';
import { useState } from 'react';

export default function LearnToEarn() {
  const [completed, setCompleted] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">🎓</div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Learn & Earn</h2>
          <p className="text-xs text-gray-500">Master Islamic Finance</p>
        </div>
      </div>

      {!completed ? (
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider mb-2 inline-block">Lesson 1</span>
          <h3 className="font-bold text-blue-900 mb-1">What is Murabaha?</h3>
          <p className="text-xs text-blue-800 mb-4 leading-relaxed">
            Murabaha is not a loan. It is a sale where the seller discloses their cost and profit markup. 
            Unlike conventional loans, the markup cannot compound if you are late on a payment.
          </p>
          <button 
            onClick={() => setCompleted(true)}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl hover:bg-blue-700 text-sm"
          >
            I Understand (+ PKR 50 Reward)
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-center">
          <div className="text-3xl mb-2">🎉</div>
          <h3 className="font-bold text-emerald-900 mb-1">Lesson Completed!</h3>
          <p className="text-xs text-emerald-700">PKR 50 has been added to your Roziq wallet.</p>
        </div>
      )}
    </div>
  );
}
