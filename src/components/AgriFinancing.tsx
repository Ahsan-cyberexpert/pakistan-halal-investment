'use client';

export default function AgriFinancing() {
  return (
    <div className="bg-amber-50 rounded-3xl p-6 shadow-sm border border-amber-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-amber-900">🌾 Fund a Farmer (Salam)</h2>
          <p className="text-sm text-amber-700">Advance funding for crops. Earn on harvest.</p>
        </div>
        <span className="text-3xl">🚜</span>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-amber-50 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-gray-800">Wheat Season 2026 - Punjab</span>
          <span className="text-emerald-600 font-bold text-sm">+22% Est. Return</span>
        </div>
        <p className="text-xs text-gray-500 mb-3">Funding seeds & fertilizer for 50 acres. Harvest in 6 months.</p>
        
        <div className="flex items-center space-x-4 mb-2">
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-amber-500 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <span className="text-xs font-bold text-gray-600">75% Funded</span>
        </div>
        <button className="w-full mt-2 bg-amber-600 text-white font-bold py-2 rounded-xl hover:bg-amber-700">
          Invest (Min PKR 5,000)
        </button>
      </div>
    </div>
  );
}
