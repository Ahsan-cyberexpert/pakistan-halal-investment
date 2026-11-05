"use client";
import { useState } from "react";

interface BalanceCardProps {
  balance: number;
  onDeposit: () => void;
  onWithdraw: () => void;
  portfolioValue?: number;
}

export default function BalanceCard({ balance, onDeposit, onWithdraw, portfolioValue = 0 }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);
  const totalWealth = balance + portfolioValue;

  const formatPKR = (n: number) =>
    n >= 10_000_000
      ? `${(n / 10_000_000).toFixed(2)} Cr`
      : n >= 100_000
      ? `${(n / 100_000).toFixed(1)} L`
      : n.toLocaleString("en-PK");

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 rounded-2xl p-5 sm:p-6 text-white shadow-xl shadow-emerald-950/20 border border-emerald-600/30">
      {/* Subtle Ambient Light */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header Row */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-emerald-200/90 uppercase">
                Available Demo Cash
              </span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                aria-label={showBalance ? "Hide demo cash balance" : "Show demo cash balance"}
                className="touch-target text-emerald-300/70 hover:text-white transition-colors p-0.5"
                title={showBalance ? "Hide Balance" : "Show Balance"}
              >
                {showBalance ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-baseline gap-1.5">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
                {showBalance ? (
                  <>
                    <span className="text-lg sm:text-xl font-medium text-emerald-200/80 mr-1">PKR</span>
                    {balance.toLocaleString("en-PK")}
                  </>
                ) : (
                  <span className="text-xl tracking-widest font-mono">••••••••</span>
                )}
              </h2>
            </div>

            {portfolioValue > 0 && showBalance && (
              <p className="text-[11px] text-emerald-200/90 font-medium mt-1">
                + ₨{formatPKR(portfolioValue)} in demo assets · Total: <strong className="text-white font-semibold">₨{formatPKR(totalWealth)}</strong>
              </p>
            )}
          </div>

          <div className="w-9 h-9 bg-emerald-600/50 border border-emerald-400/30 rounded-xl flex items-center justify-center text-emerald-100 shadow-inner">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>

        {/* Demo status tags */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-900/40 border border-amber-300/30 rounded-lg text-[10px] font-semibold text-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
            Virtual Demo Balance
          </span>
          <span className="inline-flex items-center px-2 py-1 bg-emerald-900/40 border border-emerald-400/20 rounded-lg text-[10px] font-semibold text-emerald-200/90">
            No real funds
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onDeposit}
            className="touch-target py-2.5 bg-white text-emerald-900 rounded-xl font-semibold text-xs sm:text-sm hover:bg-emerald-50 transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <svg className="w-4 h-4 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Deposit</span>
          </button>

          <button
            onClick={onWithdraw}
            className="touch-target py-2.5 bg-emerald-900/60 border border-emerald-400/30 text-white rounded-xl font-semibold text-xs sm:text-sm hover:bg-emerald-900/80 transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M20 12H4" />
            </svg>
            <span>Withdraw</span>
          </button>
        </div>
      </div>
    </div>
  );
}
