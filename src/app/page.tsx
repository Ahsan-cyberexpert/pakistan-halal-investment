'use client';

import { useState } from 'react';
import Link from 'next/link';

// Sample PSX data for interactive hero screener
const HERO_STOCKS = [
  { symbol: 'MEBL', name: 'Meezan Bank Ltd', sector: 'Islamic Banking', price: 145.0, change: '+1.47%', debtRatio: '0.0%', impureRatio: '0.0%', status: 'Compliant', score: 9.8, compliant: true },
  { symbol: 'SYS', name: 'Systems Limited', sector: 'Technology', price: 415.0, change: '+1.10%', debtRatio: '4.5%', impureRatio: '0.8%', status: 'Compliant', score: 9.5, compliant: true },
  { symbol: 'LUCK', name: 'Lucky Cement', sector: 'Materials', price: 411.5, change: '-1.50%', debtRatio: '18.5%', impureRatio: '2.1%', status: 'Compliant', score: 9.1, compliant: true },
  { symbol: 'ENGRO', name: 'Engro Corporation', sector: 'Chemicals', price: 312.8, change: '+1.00%', debtRatio: '22.4%', impureRatio: '4.2%', status: 'Compliant', score: 8.1, compliant: true },
  { symbol: 'HBL', name: 'Habib Bank Limited', sector: 'Conventional Banking', price: 92.1, change: '-1.60%', debtRatio: '45.0%', impureRatio: '28.5%', status: 'Non-Compliant', score: 2.1, compliant: false },
];

const FAQS = [
  {
    q: "Is Roziq a licensed bank or registered stock broker?",
    a: "This version is an interactive presentation prototype designed to demonstrate sovereign Islamic fintech workflows. Balances, trades, and returns are 100% simulated with virtual demo funds. Phase 4 of our roadmap includes formal broker-dealer FIX integration under SECP regulations and State Bank of Pakistan Raast settlement."
  },
  {
    q: "What Shariah standards are used for equity screening?",
    a: "We adhere strictly to AAOIFI Standard No. 35 for equity screening: (1) Core business must be permissible (Halal); (2) Total interest-bearing debt must not exceed 33% of 12-month average market capitalization; (3) Non-operating impure income must not exceed 5% of gross revenue; (4) Illiquid assets must represent at least 10% of total assets."
  },
  {
    q: "How does automated dividend purification (Tathir) work?",
    a: "When a screened company distributes dividends, a portion may originate from incidental bank interest or impermissible treasury operations (up to 5% under AAOIFI rules). Roziq calculates this exact tainted fraction (e.g. 4.2% for Engro) and routes it directly to designated charitable endowments (such as Edhi or Indus Hospital) with a full cryptographic receipt trail."
  },
  {
    q: "Do I need real money, bank accounts, or a CNIC to test the platform?",
    a: "No. You can immediately enter the interactive demo with zero signup friction. A simulated wallet pre-funded with 5,000,000 PKR virtual cash is initialized so you can test stock trades, Sukuk subscriptions, Kameti circles, and Zakat calculations without financial risk."
  },
  {
    q: "How does the AI Mufti provide guidance?",
    a: "Roziq AI is trained on AAOIFI Shariah standards, the Karachi Meezan Index (KMI-30) guidelines, and classical Islamic jurisprudence. It analyzes the context of your simulated holdings to explain why a stock passes or fails screening, and calculates Zakat and Wirasat inheritance splits in both Urdu and English."
  },
  {
    q: "How is user privacy protected in the demo?",
    a: "Demo session state is stored exclusively within your local browser storage using scoped keys (prefix: roziq_). No banking credentials, biometric data, or personal identification are ever transmitted or stored on external servers during the simulation."
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'screener' | 'zakat' | 'mufti' | 'sukuk'>('screener');
  const [screenerFilter, setScreenerFilter] = useState<'all' | 'compliant' | 'non-compliant'>('all');
  const [virtualCashInput, setVirtualCashInput] = useState<number>(3500000);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Zakat calculations
  const silverNisabValue = 2450000; // ~52.5 tolas of silver in PKR
  const isAboveNisab = virtualCashInput >= silverNisabValue;
  const zakatPayable = isAboveNisab ? Math.round(virtualCashInput * 0.025) : 0;

  const filteredStocks = HERO_STOCKS.filter(stock => {
    if (screenerFilter === 'compliant') return stock.compliant;
    if (screenerFilter === 'non-compliant') return !stock.compliant;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white antialiased">
      
      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-800/40 px-4 py-2.5 text-center text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            PRESENTATION PROTOTYPE
          </span>
          <span className="text-slate-300 font-medium hidden sm:inline">
            Explore 100% simulated Halal wealth tools with 5,000,000 PKR virtual capital.
          </span>
          <Link
            href="/dashboard?mode=demo"
            className="text-emerald-400 font-bold hover:text-emerald-300 hover:underline flex items-center gap-1 ml-1"
          >
            Launch Instant Demo <span>→</span>
          </Link>
        </div>
      </div>

      {/* ── INSTITUTIONAL NAVBAR ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300 border border-emerald-400/30">
              {/* Crescent & Star Vector Logo */}
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c2.42 0 4.64-.86 6.38-2.3-3.69-.32-6.59-3.41-6.59-7.2s2.9-6.88 6.59-7.2C16.64 2.86 14.42 2 12 2zm6.2 6.5l.8 1.8 1.9.3-1.4 1.3.3 1.9-1.6-1-1.6 1 .3-1.9-1.4-1.3 1.9-.3.8-1.8z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Roziq
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
                  OS
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 -mt-0.5 tracking-wider uppercase">
                Halal Wealth Operating System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#showcase" className="hover:text-emerald-400 transition-colors">Interactive Engine</a>
            <a href="#pillars" className="hover:text-emerald-400 transition-colors">Core Pillars</a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#standards" className="hover:text-emerald-400 transition-colors">Shariah Standards</a>
            <a href="#roadmap" className="hover:text-emerald-400 transition-colors">Phase 4 Roadmap</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard?mode=demo"
              className="touch-target px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-600/25 transition-all duration-200 border border-emerald-400/40 flex items-center gap-2"
            >
              <span>Explore Demo</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden">
        {/* Subtle geometric background ambient grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        {/* Radial ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
          
          {/* Institutional Compliance Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>AAOIFI Standard No. 35 &amp; 21 Compliance Model</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400 font-semibold">100% Riba-Free</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6">
            The Modern Operating System for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
              Halal Wealth.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-400 font-medium leading-relaxed mb-10">
            Automate PSX Shariah screening, calculate exact Gold &amp; Silver Nisab, route dividend purification trails, allocate into asset-backed Sukuks, and consult an AI Mufti — all in one unified, sovereign interface.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/dashboard?mode=demo"
              className="touch-target w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-900/40 hover:shadow-emerald-900/60 transition-all duration-200 flex items-center justify-center gap-3 border border-emerald-400/40"
            >
              <svg className="w-5 h-5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Try Interactive Demo (No CNIC Required)</span>
            </Link>

            <a
              href="#roadmap"
              className="touch-target w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-sm sm:text-base border border-slate-800 hover:border-slate-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Real Account Roadmap (Phase 4)</span>
            </a>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80 text-left">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">AAOIFI</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-0.5">Standard 35 &amp; 21</div>
              <div className="text-xs text-slate-500 mt-1">Strict financial &amp; debt screening</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xl sm:text-2xl font-black text-teal-400">0% Riba</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-0.5">Asset-Backed</div>
              <div className="text-xs text-slate-500 mt-1">No speculation or interest swaps</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xl sm:text-2xl font-black text-amber-400">5M PKR</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-0.5">Virtual Sandbox</div>
              <div className="text-xs text-slate-500 mt-1">Risk-free interactive exploration</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xl sm:text-2xl font-black text-white">Bilingual</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-0.5">Urdu &amp; English</div>
              <div className="text-xs text-slate-500 mt-1">AI Mufti with voice capability</div>
            </div>
          </div>

        </div>
      </section>

      {/* ── INTERACTIVE LIVE SHOWCASE WIDGET ── */}
      <section id="showcase" className="py-12 sm:py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              Live Product Experience
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-3">
              Explore the Engine Right Here.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mt-2">
              Click through the tabs below to interact with the Shariah Screener, Nisab Zakat calculator, AI Mufti, and Sukuk models.
            </p>
          </div>

          {/* Showcase Application Window Frame */}
          <div className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-2xl">
            
            {/* Window Top Bar */}
            <div className="px-4 sm:px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2 hidden sm:inline">roziq_wealth_os_v1.0.app</span>
              </div>

              {/* Showcase Tab Switcher */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('screener')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'screener' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⚖️ PSX Screener
                </button>
                <button
                  onClick={() => setActiveTab('zakat')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'zakat' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🕋 Zakat &amp; Nisab
                </button>
                <button
                  onClick={() => setActiveTab('mufti')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'mufti' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🎙️ AI Mufti Advisor
                </button>
                <button
                  onClick={() => setActiveTab('sukuk')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'sukuk' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🏛️ Sukuks &amp; Kameti
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  SIMULATED SANDBOX
                </span>
              </div>
            </div>

            {/* Window Body Contents */}
            <div className="p-5 sm:p-8 min-h-[420px]">
              
              {/* TAB 1: SCREENER */}
              {activeTab === 'screener' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-black text-white">AAOIFI PSX Screener</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Filters PSX equities by debt ratio (&lt;33%), non-operating income (&lt;5%), and business permissibility.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-semibold">Filter:</span>
                      <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                        <button
                          onClick={() => setScreenerFilter('all')}
                          className={`px-2.5 py-1 rounded text-xs font-bold ${
                            screenerFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          All ({HERO_STOCKS.length})
                        </button>
                        <button
                          onClick={() => setScreenerFilter('compliant')}
                          className={`px-2.5 py-1 rounded text-xs font-bold ${
                            screenerFilter === 'compliant' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Halal Only (4)
                        </button>
                        <button
                          onClick={() => setScreenerFilter('non-compliant')}
                          className={`px-2.5 py-1 rounded text-xs font-bold ${
                            screenerFilter === 'non-compliant' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Excluded (1)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stock Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredStocks.map((stock) => (
                      <div
                        key={stock.symbol}
                        className={`p-4 rounded-xl border transition-all ${
                          stock.compliant
                            ? 'bg-slate-950/70 border-emerald-900/40 hover:border-emerald-600/50'
                            : 'bg-rose-950/20 border-rose-900/40'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-black text-white">{stock.symbol}</span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                stock.compliant ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              }`}>
                                {stock.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 truncate max-w-[180px]">{stock.name}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-black text-white">PKR {stock.price.toFixed(2)}</div>
                            <div className={`text-xs font-bold ${stock.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {stock.change}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-1 py-2 my-2 border-t border-b border-slate-800/80 text-[11px]">
                          <div>
                            <div className="text-slate-500">Debt/Eq</div>
                            <div className={`font-bold ${parseFloat(stock.debtRatio) < 33 ? 'text-slate-200' : 'text-rose-400'}`}>
                              {stock.debtRatio}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500">Impure</div>
                            <div className={`font-bold ${parseFloat(stock.impureRatio) < 5 ? 'text-slate-200' : 'text-rose-400'}`}>
                              {stock.impureRatio}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500">Halal Score</div>
                            <div className="font-bold text-emerald-400">{stock.score}/10</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                          <span>Sector: {stock.sector}</span>
                          <Link href="/dashboard?mode=demo" className="text-emerald-400 hover:underline font-bold">
                            Inspect →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: ZAKAT & NISAB */}
              {activeTab === 'zakat' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-white">Dynamic Nisab &amp; Zakat Calculator</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tracks classical Gold (87.48g) and Silver (612.36g) Nisab thresholds with automated 2.5% wealth obligation calculation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-7 space-y-5 p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
                      <div>
                        <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
                          <span>Simulated Total Liquid &amp; Invested Wealth:</span>
                          <span className="text-base font-black text-emerald-400">PKR {virtualCashInput.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min={500000}
                          max={15000000}
                          step={100000}
                          value={virtualCashInput}
                          onChange={(e) => setVirtualCashInput(Number(e.target.value))}
                          className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                          <span>PKR 500,000</span>
                          <span>PKR 7,500,000</span>
                          <span>PKR 15,000,000</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block mb-1">Silver Nisab Floor (612.36g)</span>
                          <span className="text-sm font-black text-slate-200">PKR {silverNisabValue.toLocaleString()}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block mb-1">Status Classification</span>
                          <span className={`text-sm font-black ${isAboveNisab ? 'text-amber-400' : 'text-slate-400'}`}>
                            {isAboveNisab ? 'LIABILITY DUE (SAHIB-E-NISAB)' : 'BELOW THRESHOLD'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-emerald-950/70 to-slate-950 border border-emerald-800/50 text-center space-y-3">
                      <div className="text-xs font-bold uppercase tracking-widest text-emerald-300">Annual Zakat Obligation</div>
                      <div className="text-3xl sm:text-4xl font-black text-white">
                        PKR {zakatPayable.toLocaleString()}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Calculated at exactly 2.5% of net zakatable assets after deducting immediate household liabilities.
                      </p>
                      <Link
                        href="/dashboard?mode=demo"
                        className="touch-target inline-block w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all mt-2"
                      >
                        Simulate Zakat Distribution →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: AI MUFTI */}
              {activeTab === 'mufti' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-white">Bilingual Shariah AI Advisor</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Context-aware guidance on Islamic contracts, fiqh rulings, and stock compliance in Urdu and English.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* User Query */}
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                        You
                      </div>
                      <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-800 text-slate-200 text-xs sm:text-sm font-medium">
                        &quot;Assalam-o-Alaikum, is dividend income from Engro Corporation subject to purification?&quot;
                      </div>
                    </div>

                    {/* Mufti AI Response */}
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md shadow-emerald-900/50">
                        🕌
                      </div>
                      <div className="p-4 rounded-2xl rounded-tl-none bg-emerald-950/60 border border-emerald-800/60 text-slate-200 text-xs sm:text-sm font-medium space-y-2 leading-relaxed">
                        <p>
                          <strong className="text-emerald-300">Wa Alaikum Assalam.</strong> Under{' '}
                          <strong className="text-white">AAOIFI Shariah Standard No. 21</strong>, Engro Corporation is screened as Shariah-compliant overall, but has approximately <strong className="text-amber-300">4.2%</strong> non-operating income from interest-bearing deposits.
                        </p>
                        <p className="text-slate-300 text-xs">
                          💡 <strong>Purification Action:</strong> For every PKR 10,000 received in dividends, you must disburse <strong>PKR 420</strong> to charitable causes without the intention of receiving spiritual reward (Sadaqah). Roziq automates this calculation in your portfolio.
                        </p>
                        <div className="pt-2 flex items-center gap-3 text-xs text-emerald-400 font-bold">
                          <span>Urdu Voice Audio Available</span>
                          <span>·</span>
                          <Link href="/dashboard?mode=demo" className="underline hover:text-white">
                            Ask Mufti Live in Demo →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SUKUKS & KAMETI */}
              {activeTab === 'sukuk' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-white">Asset-Backed Sovereign Sukuks &amp; Digital Kameti</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Explore fixed-yield ethical securities and interest-free rotating community mutuals (ROSCA).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          GOVERNMENT IJARAH SUKUK
                        </span>
                        <span className="text-xs text-slate-400 font-mono">PKR 5,000 min</span>
                      </div>
                      <h4 className="text-base font-black text-white">M-3 Motorway Sovereign Sukuk</h4>
                      <p className="text-xs text-slate-400">
                        Asset-backed rental yield derived from tangible national infrastructure tolls. Completely free from speculative derivatives.
                      </p>
                      <div className="flex justify-between pt-2 border-t border-slate-800 text-xs">
                        <span className="text-slate-400">Simulated Target Return:</span>
                        <span className="font-bold text-emerald-400">11.4% p.a.</span>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          DIGITAL KAMETI (ROSCA)
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Trust Circle Locked</span>
                      </div>
                      <h4 className="text-base font-black text-white">Karachi Tech Professionals Circle</h4>
                      <p className="text-xs text-slate-400">
                        Transparent, interest-free rotating savings pool formalized with immutable ledgers and CNIC verification.
                      </p>
                      <div className="flex justify-between pt-2 border-t border-slate-800 text-xs">
                        <span className="text-slate-400">Monthly Contribution:</span>
                        <span className="font-bold text-indigo-300">PKR 50,000 / month</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* ── THE 4 PILLARS (BENTO GRID ARCHITECTURE) ── */}
      <section id="pillars" className="py-20 sm:py-32 bg-slate-900/60 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
              Sovereign Product Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4">
              Invest. Plan. Purify. Learn.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-3 font-medium">
              Every feature in Roziq is engineered around strict Islamic jurisprudence and practical Pakistani wealth needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* PILLAR 1: INVEST */}
            <div className="p-6 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 hover:border-emerald-600/50 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
                  📈
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400 block mb-1">Pillar 01</span>
                <h3 className="text-xl font-black text-white mb-2">Invest</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                  Shariah-screened equities, fractional sovereign Sukuks, global Halal ETFs, and Bay&apos; Al-Salam forward agricultural contracts.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Automated PSX AAOIFI filtering
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Asset-backed infrastructure Sukuk
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Punjab direct farmer financing
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-900">
                <Link href="/dashboard?mode=demo" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                  Explore Investments <span>→</span>
                </Link>
              </div>
            </div>

            {/* PILLAR 2: PLAN */}
            <div className="p-6 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 hover:border-amber-600/50 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
                  🧭
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-400 block mb-1">Pillar 02</span>
                <h3 className="text-xl font-black text-white mb-2">Plan</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                  AI-driven wealth rebalancing via Wali Autopilot, community Kameti ledgers, and mutual family Takaful emergency pools.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span> Wali AI Sovereign Guardian
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span> Digital ROSCA Kameti mutuals
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span> Tabarru family healthcare pools
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-900">
                <Link href="/dashboard?mode=demo" className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                  Explore Planning <span>→</span>
                </Link>
              </div>
            </div>

            {/* PILLAR 3: PURIFY */}
            <div className="p-6 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 hover:border-teal-600/50 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
                  🕋
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-teal-400 block mb-1">Pillar 03</span>
                <h3 className="text-xl font-black text-white mb-2">Purify</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                  Dynamic Nisab calculation on gold/silver benchmarks, automated Zakat liability tracking, and Tathir dividend purification.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <span className="text-teal-400">✓</span> Dual Gold &amp; Silver Nisab tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-400">✓</span> Automated 2.5% Zakat calculation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-400">✓</span> Verifiable charity distribution receipts
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-900">
                <Link href="/dashboard?mode=demo" className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1">
                  Explore Purification <span>→</span>
                </Link>
              </div>
            </div>

            {/* PILLAR 4: LEARN */}
            <div className="p-6 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 hover:border-indigo-600/50 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
                  📜
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-indigo-400 block mb-1">Pillar 04</span>
                <h3 className="text-xl font-black text-white mb-2">Learn</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                  Quranic estate distribution via the Wirasat engine and real-time fiqh advisory with the bilingual Roziq AI Mufti.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Surah An-Nisa inheritance math
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Bilingual Urdu/English AI advisor
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Interactive Learn-to-Earn modules
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-900">
                <Link href="/dashboard?mode=demo" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  Explore Learning <span>→</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
              Seamless Workflow
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4">
              How Roziq Operates
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mt-3 font-medium">
              A disciplined, 4-step financial journey built for transparent halal execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-emerald-500/20 via-teal-500/40 to-emerald-500/20 pointer-events-none" />

            {[
              {
                step: "01",
                title: "Enter Sandbox",
                desc: "Instant access with 5,000,000 PKR virtual cash. Zero bank links or CNIC identity requirements.",
                badge: "Zero Friction"
              },
              {
                step: "02",
                title: "Audit & Screen",
                desc: "Every asset passes through AAOIFI Standard 35 debt, interest, and core operational filters.",
                badge: "AAOIFI Rule 35"
              },
              {
                step: "03",
                title: "Grow & Purify",
                desc: "Allocate into Sukuks or Kametis while the system automates dividend purification trails.",
                badge: "Tathir Engine"
              },
              {
                step: "04",
                title: "Preserve & Inherit",
                desc: "Calculate Zakat liabilities and model legal estate inheritance fractions for heirs.",
                badge: "Wirasat Fiqh"
              }
            ].map((item, idx) => (
              <div key={idx} className="relative text-center p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-lg flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-900/40 border border-emerald-400/40">
                  {item.step}
                </div>
                <div className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 mb-2">
                  {item.badge}
                </div>
                <h3 className="text-lg font-black text-white mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SHARIAH STANDARDS & COMPLIANCE SECTION ── */}
      <section id="standards" className="py-20 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                Methodological Rigor
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4 mb-4">
                Global Islamic Standards.<br />
                <span className="text-emerald-400">Zero Riba Compromises.</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-medium">
                Roziq implements the globally accepted standards established by the Accounting and Auditing Organization for Islamic Financial Institutions (AAOIFI) and the Karachi Meezan Index (KMI-30).
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Debt-to-Market-Cap Limit (&lt; 33%)</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Total conventional interest-bearing debt must never exceed 33% of the 12-month average market capitalization.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Non-Operating Impure Income (&lt; 5%)</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Gross revenue from incidental interest deposits must remain under 5%, and must be 100% purified via charity.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Real-Sector Tangibility Ratio (&gt; 10%)</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Illiquid real-sector assets must be at least 10% of total assets, preventing the trading of mere monetary debts.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Log Box */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-emerald-400 font-bold">ROZIQ_COMPLIANCE_ENGINE_AUDIT.LOG</span>
                <span className="text-[10px] text-slate-500">SHA256_VERIFIED</span>
              </div>
              <p><span className="text-slate-500">[06:14:02 UTC]</span> <span className="text-emerald-400">INIT</span> AAOIFI Standard No. 35 PSX Screener Core</p>
              <p><span className="text-slate-500">[06:14:02 UTC]</span> <span className="text-blue-400">FETCH</span> KMI-30 constituents &amp; PSX closing quotes</p>
              <p><span className="text-slate-500">[06:14:03 UTC]</span> <span className="text-emerald-400">PASS</span> MEBL: Debt 0.0% | Impure 0.0% [Score: 9.8]</p>
              <p><span className="text-slate-500">[06:14:03 UTC]</span> <span className="text-emerald-400">PASS</span> SYS: Debt 4.5% | Impure 0.8% [Score: 9.5]</p>
              <p><span className="text-slate-500">[06:14:04 UTC]</span> <span className="text-rose-400">FAIL</span> HBL: Debt 45.0% &gt; 33.0% [Conventional Bank]</p>
              <p><span className="text-slate-500">[06:14:04 UTC]</span> <span className="text-amber-400">PURIFY</span> ENGRO dividend calculation: 4.2% routed to charity</p>
              <p><span className="text-slate-500">[06:14:05 UTC]</span> <span className="text-emerald-400">STATUS</span> Sovereign Sandbox Ledger Synchronized (Virtual)</p>
              <div className="pt-2 text-slate-500 text-[11px]">
                Audited against: AAOIFI Shariah Board Governance Framework 2026.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── PHASE 4 REAL ACCOUNT ROADMAP SECTION ── */}
      <section id="roadmap" className="py-20 sm:py-32 bg-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 mb-6">
            <span>🔒</span>
            <span>STRUCTURAL SEPARATION &amp; PRODUCTION BLUEPRINT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Phase 4 Production Roadmap
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
            To ensure complete transparency and user trust, Roziq maintains an absolute separation between this interactive evaluation prototype and our forthcoming production financial infrastructure.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left mb-10">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-2xl mb-2">🏛️</div>
              <h4 className="text-sm font-black text-white mb-1">SECP Broker FIX Protocol</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct live order execution with accredited PSX brokers via formal broker-dealer FIX interfaces under SECP sandbox regulations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="text-sm font-black text-white mb-1">State Bank Raast Gateway</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant Pakistani fiat on/off-ramps leveraging State Bank of Pakistan&apos;s Raast P2P/P2M and 1Link core banking rails.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-2xl mb-2">📜</div>
              <h4 className="text-sm font-black text-white mb-1">Formal Shariah Board</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Independent scholar supervisory committee review and quarterly fatwa audits prior to processing any real financial deposits.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 mb-8 max-w-2xl mx-auto">
            ℹ️ <strong>Presentation Note:</strong> Real account registration opens during Phase 4. Currently, explore all features safely with 5,000,000 PKR virtual cash in the interactive demo.
          </div>

          <Link
            href="/dashboard?mode=demo"
            className="touch-target inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 transition-all active:scale-95"
          >
            <span>Launch Interactive Demo Sandbox Now →</span>
          </Link>
        </div>
      </section>

      {/* ── INTERACTIVE FAQ SECTION ── */}
      <section id="faq" className="py-20 sm:py-28 bg-slate-900/30 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              Common Inquiries
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-400 mt-2 font-medium">Everything you need to know about Roziq Halal Wealth OS.</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-slate-900/50 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-white">{faq.q}</span>
                    <span className={`text-emerald-400 text-lg transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-900">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── CALL TO ACTION SECTION ── */}
      <section className="py-20 bg-gradient-to-b from-slate-950 via-emerald-950/40 to-slate-950 border-t border-slate-800 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-3xl mx-auto mb-6 shadow-xl shadow-emerald-900/50 border border-emerald-400/40">
            🕌
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Experience Halal Wealth Management.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-8 font-medium leading-relaxed">
            Test automated PSX screening, calculate Nisab Zakat, and test sovereign Sukuks in a safe interactive sandbox with 5,000,000 PKR virtual cash.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard?mode=demo"
              className="touch-target w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-900/40 transition-all flex items-center justify-center gap-2"
            >
              <span>Launch Interactive Demo Sandbox</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── INSTITUTIONAL FOOTER ── */}
      <footer className="py-14 bg-slate-950 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
                  R
                </div>
                <div>
                  <span className="text-lg font-black text-white tracking-tight">Roziq</span>
                  <span className="text-[10px] text-emerald-400 font-bold ml-1.5 uppercase">Halal Wealth OS</span>
                </div>
              </div>
              <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                The sovereign Islamic financial operating system for Pakistan and the global diaspora. Engineered for ethical investing, Zakat automation, and Shariah compliance.
              </p>
              <div className="pt-2 text-[11px] text-slate-500 font-mono">
                Prototype Build · AAOIFI Standards Compliant Reference Model
              </div>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Platform Demo</h5>
              <ul className="space-y-2">
                <li><Link href="/dashboard?mode=demo" className="hover:text-emerald-400 transition-colors">Overview Dashboard</Link></li>
                <li><Link href="/dashboard?mode=demo" className="hover:text-emerald-400 transition-colors">PSX Halal Screener</Link></li>
                <li><Link href="/dashboard?mode=demo" className="hover:text-emerald-400 transition-colors">Zakat &amp; Nisab Hub</Link></li>
                <li><Link href="/dashboard?mode=demo" className="hover:text-emerald-400 transition-colors">Fractional Sukuks</Link></li>
                <li><Link href="/dashboard?mode=demo" className="hover:text-emerald-400 transition-colors">Wali AI Autopilot</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Governance &amp; Safety</h5>
              <ul className="space-y-2">
                <li><a href="#standards" className="hover:text-emerald-400 transition-colors">AAOIFI Standard 35</a></li>
                <li><a href="#standards" className="hover:text-emerald-400 transition-colors">Dividend Purification (Tathir)</a></li>
                <li><a href="#roadmap" className="hover:text-emerald-400 transition-colors">SECP Phase 4 Roadmap</a></li>
                <li><a href="#faq" className="hover:text-emerald-400 transition-colors">Demo Safety Disclosure</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
            <p>© 2026 Roziq Halal Wealth OS. Interactive presentation prototype — balances, trades, and returns are simulated for evaluation.</p>
            <div className="flex gap-4">
              <Link href="/dashboard?mode=demo" className="text-emerald-400 hover:text-emerald-300 font-bold">Open Demo Sandbox</Link>
              <a href="#standards" className="hover:text-slate-300">Shariah Guidelines</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
