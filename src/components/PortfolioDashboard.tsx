'use client';

interface Holding {
  symbol: string;
  name: string;
  invested: number;
  currentPrice: number;
  units: number;
  pnl: number;
}

interface PortfolioDashboardProps {
  holdings: Holding[];
  totalValue: number;
  dailyPnl: number;
}

export default function PortfolioDashboard({ holdings, totalValue, dailyPnl }: PortfolioDashboardProps) {
  if (holdings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mb-6">
        <div className="text-4xl mb-3">📈</div>
        <h3 className="text-lg font-bold text-gray-800">No Investments Yet</h3>
        <p className="text-gray-500 text-sm mt-1">Start investing in Halal stocks to build your portfolio.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">💼 My Portfolio</h2>
        <div className={`text-sm font-semibold px-2 py-1 rounded-lg ${dailyPnl >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {dailyPnl >= 0 ? '▲' : '▼'} PKR {Math.abs(dailyPnl).toFixed(2)} Today
        </div>
      </div>

      {/* Allocation Bar */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-1">Asset Allocation</div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
          {holdings.map((h, i) => {
            const width = (h.invested / totalValue) * 100;
            const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];
            return <div key={h.symbol} style={{ width: `${width}%` }} className={`h-full ${colors[i % colors.length]}`} title={`${h.symbol}: ${width.toFixed(1)}%`}></div>;
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          {holdings.map(h => <span key={h.symbol}>{h.symbol}</span>)}
        </div>
      </div>

      {/* Holdings List */}
      <div className="space-y-2">
        {holdings.map(h => (
          <div key={h.symbol} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <div>
              <div className="font-bold text-gray-900">{h.symbol}</div>
              <div className="text-xs text-gray-500">{h.units.toFixed(4)} units @ PKR {h.currentPrice}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">PKR {(h.invested + h.pnl).toFixed(2)}</div>
              <div className={`text-sm ${h.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {h.pnl >= 0 ? '+' : ''}{h.pnl.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-sm text-gray-600">Total Portfolio Value</span>
        <span className="text-xl font-bold text-gray-900">PKR {totalValue.toFixed(2)}</span>
      </div>
    </div>
  );
}
