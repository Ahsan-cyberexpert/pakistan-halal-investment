export default function BalanceCard({ balance, onDeposit, onWithdraw }: any) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-200/50 group transition-all duration-500 hover:shadow-emerald-300/60">
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl group-hover:bg-emerald-400/30 transition-all duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-emerald-50/80 text-xs font-bold uppercase tracking-widest mb-1">Total Net Worth</p>
            <h2 className="text-4xl font-black tracking-tight">
              <span className="text-2xl mr-1 opacity-70">PKR</span>
              {balance.toLocaleString()}
            </h2>
          </div>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
            <span className="text-2xl">🕌</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onDeposit} 
            className="group/btn relative py-4 bg-white text-emerald-800 rounded-2xl font-bold text-sm shadow-lg shadow-black/5 hover:bg-emerald-50 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 overflow-hidden"
          >
            <span className="relative z-10">💰 Deposit</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
          </button>
          
          <button 
            onClick={onWithdraw} 
            className="group/btn relative py-4 bg-emerald-900/40 border border-white/20 text-white rounded-2xl font-bold text-sm backdrop-blur-md hover:bg-emerald-900/60 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>💸 Withdraw</span>
          </button>
        </div>
      </div>
    </div>
  );
}
