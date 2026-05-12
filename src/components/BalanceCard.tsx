export default function BalanceCard({ balance, onDeposit, onWithdraw }: any) {
  return (
    <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 text-white shadow-lg mb-6">
      <p className="text-green-100 text-sm mb-1">Total Balance</p>
      <h2 className="text-4xl font-bold mb-4">PKR {balance.toLocaleString()}</h2>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={onDeposit} className="py-3 bg-white text-green-700 rounded-xl font-semibold hover:bg-green-50 transition">
          💰 Deposit
        </button>
        <button onClick={onWithdraw} className="py-3 bg-green-700 border border-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition">
          💸 Withdraw
        </button>
      </div>
    </div>
  );
}
