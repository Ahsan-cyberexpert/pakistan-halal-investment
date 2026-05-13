'use client';

export default function DigitalCommittee() {
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="bg-purple-500/30 text-purple-200 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block border border-purple-400/30">Auto-Invest</span>
            <h2 className="text-2xl font-bold">Digital Beesi (Committee)</h2>
            <p className="text-indigo-200 text-sm mt-1">Pool money with family & invest in Halal Funds.</p>
          </div>
          <div className="text-4xl">👨‍👩‍👧‍👦</div>
        </div>

        <div className="bg-black/20 p-4 rounded-2xl backdrop-blur-sm border border-white/10 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-indigo-200 text-sm">Monthly Pool (10 Members)</span>
            <span className="font-bold">PKR 50,000</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-2">
            <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '40%' }}></div>
          </div>
          <div className="text-xs text-indigo-300 mt-2 text-right">Month 4 of 10</div>
        </div>

        <button className="w-full bg-white text-indigo-900 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors">
          Start a New Committee
        </button>
      </div>
      
      {/* Decorative background shapes */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl"></div>
    </div>
  );
}
