import Link from "next/link";
import DemoModeBanner from "@/components/DemoModeBanner";

const stats = [
  { value: "Demo", label: "Interactive experience", sub: "Explore with virtual money" },
  { value: "0", label: "Real payments", sub: "No money moves in demo" },
  { value: "36+", label: "Feature concepts", sub: "Tools & modules to explore" },
  { value: "2.5M+", label: "Example Nisab", sub: "Demo calculation only" },
];

const featureCategories = [
  {
    category: "Invest",
    tagline: "Shariah-screened equities, asset-backed Sukuks, and real-sector financing",
    items: [
      {
        emoji: "⚖️",
        title: "Shariah PSX Screener",
        desc: "Automated PSX filtering adhering to AAOIFI Standard No. 35. Verifies debt-to-market-cap, non-compliant income, and liquidity ratios.",
        badge: "Screening",
        bg: "bg-emerald-50",
      },
      {
        emoji: "🏛️",
        title: "Fractional Sukuks",
        desc: "Simulated asset-backed Islamic sovereign and corporate bonds. Fixed income models without riba or speculative derivatives.",
        badge: "Asset-Backed",
        bg: "bg-blue-50",
      },
      {
        emoji: "🌍",
        title: "Global Halal ETFs",
        desc: "Exposure to international Shariah-compliant funds (e.g. SPUS, HLAL) with simulated forex conversion calculations.",
        badge: "Global",
        bg: "bg-indigo-50",
      },
      {
        emoji: "🌾",
        title: "Agri-Financing (Salam)",
        desc: "Direct forward financing models (Bay' Al-Salam) connecting capital with real-sector Pakistani agriculture.",
        badge: "Real Sector",
        bg: "bg-amber-50",
      },
    ],
  },
  {
    category: "Plan",
    tagline: "Sovereign financial roadmap, community mutuals, and family protection",
    items: [
      {
        emoji: "🤖",
        title: "Wali AI Autopilot",
        desc: "Strategic wealth guardian that simulates halal rebalancing, market alerts, and disciplined entry barriers.",
        badge: "Autopilot",
        bg: "bg-amber-50",
      },
      {
        emoji: "🤝",
        title: "Digital Kameti (ROSCA)",
        desc: "Rotating savings and credit mutuals formalized with digital ledgers, transparent contracts, and zero interest.",
        badge: "Community",
        bg: "bg-orange-50",
      },
      {
        emoji: "🏥",
        title: "Family Health Takaful",
        desc: "Mutual cooperative emergency pool (Tabarru) designed to shield families against medical emergencies without conventional insurance.",
        badge: "Takaful",
        bg: "bg-rose-50",
      },
    ],
  },
  {
    category: "Purify",
    tagline: "Spiritual financial obligations, Nisab automation, and charity tracking",
    items: [
      {
        emoji: "🕋",
        title: "Zakat & Hajj Vault",
        desc: "Live Nisab monitoring (Gold/Silver) with automated calculation on eligible holdings and transparent simulated distribution.",
        badge: "Wajib",
        bg: "bg-teal-50",
      },
      {
        emoji: "💧",
        title: "Dividend Purification (Tathir)",
        desc: "Calculates impermissible non-operating revenue percentages from stocks and routes purification charity with full receipt trails.",
        badge: "Tathir",
        bg: "bg-cyan-50",
      },
    ],
  },
  {
    category: "Learn",
    tagline: "Verified Shariah guidance, estate planning, and financial education",
    items: [
      {
        emoji: "📜",
        title: "Wirasat Calculator",
        desc: "Rigorous Islamic estate distribution engine implementing Quranic inheritance fractions for spouses, children, and parents.",
        badge: "Fiqh & Law",
        bg: "bg-purple-50",
      },
      {
        emoji: "🎙️",
        title: "Roziq AI Financial Mufti",
        desc: "Context-aware bilingual AI advisor trained on AAOIFI Shariah standards, offering voice and text guidance on Pakistani finance.",
        badge: "Bilingual AI",
        bg: "bg-emerald-50",
      },
    ],
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Launch Instant Demo",
    desc: "Explore immediately with pre-seeded virtual funds. No CNIC or GPS required to experience the platform.",
    icon: "🚀",
  },
  {
    step: "02",
    title: "Explore Shariah Tools",
    desc: "Scan PSX stocks against AAOIFI criteria, simulate Sukuk purchases, and test automated dividend purification.",
    icon: "⚖️",
  },
  {
    step: "03",
    title: "Plan and Purify",
    desc: "Calculate Zakat on your simulated holdings, model family inheritance via Wirasat, and explore community Kametis.",
    icon: "🕋",
  },
  {
    step: "04",
    title: "Consult the AI Mufti",
    desc: "Ask financial and fiqh questions in Urdu or English with an AI guardian aware of your portfolio context.",
    icon: "🤖",
  },
];

const testimonials = [
  {
    name: "Ahmed Raza",
    role: "Software Engineer, Karachi",
    quote: "Finally a platform that respects my faith and my finances. The Shariah screener alone is worth it!",
    avatar: "👨‍💻",
  },
  {
    name: "Fatima Khan",
    role: "Doctor, Lahore",
    quote: "The Zakat automation is brilliant. I never have to worry about miscalculations. JazakAllah khair, Roziq!",
    avatar: "👩‍⚕️",
  },
  {
    name: "Usman Ali",
    role: "Overseas Pakistani, UAE",
    quote: "As an overseas Pakistani, the remittance and overseas invest features are game-changers for my family.",
    avatar: "👨‍💼",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* Navigation */}
      <nav className="site-nav-safe fixed w-full z-[100] px-3 sm:px-6 py-3 sm:py-4" aria-label="Main navigation">
        <div className="relative max-w-7xl mx-auto glass rounded-[2rem] border border-white/40 px-4 sm:px-8 py-2.5 sm:py-3 flex justify-between items-center shadow-2xl">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-lg sm:text-xl shadow-lg shadow-emerald-200 flex-shrink-0">
              🇵🇰
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black text-slate-800 tracking-tighter">Roziq</span>
              <div className="text-xs font-black text-emerald-700 uppercase tracking-[0.12em] -mt-0.5">Halal Wealth OS</div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-500">
            <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How It Works</a>
            <a href="#security" className="hover:text-emerald-600 transition-colors">Demo Safety</a>
            <a href="#real-account-info" className="hover:text-emerald-600 transition-colors">Real Account</a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard?mode=demo"
              className="touch-target px-4 sm:px-6 py-2.5 bg-emerald-600 text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-900/20 hover:-translate-y-0.5 transition-all flex-shrink-0"
            >
              Try Demo →
            </Link>
          </div>

          <details className="relative md:hidden">
            <summary aria-label="Open navigation menu" className="touch-target list-none [&::-webkit-details-marker]:hidden cursor-pointer gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 text-sm font-bold text-slate-700 shadow-sm">
              <span aria-hidden="true" className="text-base">☰</span>
              <span>Menu</span>
            </summary>
            <div className="absolute right-0 top-full z-[110] mt-2 w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <a href="#features" className="touch-target w-full justify-start rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800">Features</a>
              <a href="#how-it-works" className="touch-target w-full justify-start rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800">How It Works</a>
              <a href="#security" className="touch-target w-full justify-start rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800">Demo Safety</a>
              <a href="#real-account-info" className="touch-target w-full justify-start rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800">Real Account Roadmap</a>
            </div>
          </details>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-28 sm:pt-40 lg:pt-44 pb-14 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] bg-emerald-100/40 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] bg-teal-100/30 rounded-full blur-[90px] translate-y-1/4 -translate-x-1/4" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl mb-5 sm:mb-6 animate-in fade-in duration-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-black text-emerald-700 uppercase tracking-wide sm:tracking-widest">
              Interactive Prototype · Roziq Halal Wealth OS
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-3.5 sm:mb-6 animate-in fade-in duration-700 leading-tight">
            <span className="text-slate-900">Explore your</span>{" "}
            <span className="text-gradient">halal wealth journey.</span>
          </h1>

          <p className="max-w-xl text-sm sm:text-base text-slate-600 mx-auto mb-6 sm:mb-8 leading-relaxed font-medium">
            Experience Islamic investing, savings, Zakat, and financial planning in one calm, guided OS.
            This presentation prototype uses simulated activity and virtual funds.
          </p>

          {/* Dual Path Choice: Demo vs Real Account Roadmap */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 animate-in fade-in duration-700 mb-10 sm:mb-16">
            <Link
              href="/dashboard?mode=demo"
              className="touch-target w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-emerald-900/20 hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2"
            >
              <span>🚀</span>
              <span>Try Interactive Demo (No CNIC Required)</span>
            </Link>
            <a
              href="#real-account-info"
              className="touch-target w-full sm:w-auto px-7 py-3.5 bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 rounded-xl font-bold text-sm sm:text-base hover:-translate-y-0.5 transition-all shadow-sm text-center flex items-center justify-center gap-2"
            >
              <span>🔒</span>
              <span>Create Real Account (Phase 4 Roadmap)</span>
            </a>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <DemoModeBanner />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/70 backdrop-blur-sm border border-slate-100 rounded-2xl p-3 sm:p-4 shadow-sm">
                <div className="text-lg sm:text-2xl font-black text-slate-900 mb-0.5">{s.value}</div>
                <div className="text-xs font-black text-slate-700">{s.label}</div>
                <div className="text-xs text-slate-500 font-medium leading-snug">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GROUPED FEATURES BY GOAL: Invest, Plan, Purify, Learn */}
      <section id="features" className="scroll-mt-28 py-14 sm:py-24 lg:py-32" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl mb-6">
              <span className="text-emerald-600 text-xs">⚡</span>
              <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Four Core Pillars</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Invest. Plan. <span className="text-gradient">Purify. Learn.</span>
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto font-medium">
              Every tool in Roziq is organized around what you want to achieve with your wealth.
            </p>
          </div>

          <div className="space-y-12 sm:space-y-16">
            {featureCategories.map((group) => (
              <div key={group.category} className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-100 pb-3 gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">{group.category === 'Invest' ? '📈' : group.category === 'Plan' ? '🧭' : group.category === 'Purify' ? '🕋' : '📚'}</span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{group.category}</h3>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-500">{group.tagline}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                  {group.items.map((item, i) => (
                    <div
                      key={i}
                      className="group relative p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                      style={{ background: "var(--bg-primary)" }}
                    >
                      <div className="relative z-10">
                        <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center text-xl mb-4 shadow-xs group-hover:scale-105 transition-transform duration-200`}>
                          {item.emoji}
                        </div>
                        <div className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-lg mb-2">
                          <span className="text-xs font-black text-slate-600 uppercase tracking-wider">{item.badge}</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-slate-900 mb-1.5 tracking-tight">{item.title}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-28 py-14 sm:py-24 lg:py-32" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 px-4 py-2 rounded-2xl mb-6">
              <span className="text-teal-600 text-xs">🛤️</span>
              <span className="text-xs font-black text-teal-700 uppercase tracking-widest">Guided Flow</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Simple. Transparent. <span className="text-gradient">Sovereign.</span>
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto font-medium">
              Designed for first-time Muslim investors and seasoned halal savers alike.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
            <div className="hidden lg:block absolute top-16 left-[14%] right-[14%] h-0.5 bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
            {howItWorks.map((step, i) => (
              <div key={i} className="relative text-center group">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-5 shadow-xl shadow-emerald-900/20 group-hover:scale-105 transition-transform duration-300">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-slate-900 rounded-xl sm:rounded-2xl flex items-center justify-center text-xs font-black text-white border-2 border-white shadow-md">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO SAFETY & TRANSPARENCY */}
      <section id="security" className="scroll-mt-28 py-14 sm:py-24 lg:py-32 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-600/10 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl mb-6">
                <span className="text-emerald-400 text-xs">🛡️</span>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Demo Safety &amp; Governance</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6 leading-tight">
                Transparent code.<br />
                <span className="text-gradient">Zero real funds at risk.</span>
              </h2>
              <div className="space-y-5">
                {[
                  { icon: "🧪", title: "100% Simulated Sandbox", desc: "Try deposits, withdrawals, stock buys/sells, and Zakat without linking bank accounts or transferring real money." },
                  { icon: "🧾", title: "Standardized Demo Receipts", desc: "Every mock transaction outputs a verifiable receipt with timestamps, unique reference codes, and explicit simulated notes." },
                  { icon: "🔁", title: "Scoped Demo Reset", desc: "Resetting your demo account only clears roziq-prefixed browser data, ensuring non-destructive presentation runs." },
                  { icon: "⚖️", title: "AAOIFI Standard No. 35", desc: "Financial ratios and screening rules reflect authoritative global Shariah standards for academic and evaluation fidelity." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg flex-shrink-0 group-hover:bg-emerald-600/20 group-hover:border-emerald-500/30 transition-all duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base mb-0.5 text-white">{item.title}</h4>
                      <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-3xl overflow-x-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-md shadow-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-md shadow-amber-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50" />
                <span className="ml-2 text-slate-400 text-xs font-mono">roziq_demo_audit.log</span>
              </div>
              <div className="space-y-3 font-mono text-xs sm:text-sm">
                <p className="text-slate-400"><span className="text-emerald-400">[INFO]</span> Roziq Halal Wealth OS — Presentation Build</p>
                <p className="text-slate-400"><span className="text-blue-400">[DEMO]</span> Mode: Simulated Sandbox (No Real Payment Gateways)</p>
                <p className="text-emerald-400"><span className="text-emerald-500">[STATUS]</span> Virtual Ledger initialized (PKR 5,000,000 mock cash)</p>
                <p className="text-slate-400"><span className="text-amber-400">[DATA]</span> PSX tickers sourced for demonstration and educational flow</p>
                <p className="text-slate-400"><span className="text-emerald-400">[AUDIT]</span> Demo receipts stored locally with cryptographic IDs</p>
                <p className="text-emerald-400"><span className="text-emerald-500">[READY]</span> Safe interactive exploration enabled</p>
                <p className="animate-pulse text-emerald-400">_</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REAL ACCOUNT ROADMAP SECTION (STRUCTURAL SEPARATION) */}
      <section id="real-account-info" className="scroll-mt-28 py-14 sm:py-24" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl mb-6">
            <span className="text-amber-600 text-xs">🔒</span>
            <span className="text-xs font-black text-amber-800 uppercase tracking-widest">Future Real Account Foundation (Phase 4)</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Looking for Real Brokerage &amp; Banking?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            Roziq maintains a strict structural boundary between the interactive presentation demo and future production infrastructure. Real accounts will not reuse demo credentials, local storage state, or simulated payment callbacks.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mb-8">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-lg mb-2 block">🏦</span>
              <h4 className="text-sm font-bold text-slate-900 mb-1">SECP-Regulated Broker FIX</h4>
              <p className="text-xs text-slate-500">Live order routing to accredited PSX brokers via formal broker FIX/REST API protocols.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-lg mb-2 block">⚡</span>
              <h4 className="text-sm font-bold text-slate-900 mb-1">State Bank Raast Gateway</h4>
              <p className="text-xs text-slate-500">Instant Pakistani fiat on-ramps and off-ramps through Raast, 1Link, and partner banks.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-lg mb-2 block">📜</span>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Formal Shariah Board</h4>
              <p className="text-xs text-slate-500">Documented religious governance and independent scholar audits before any live fund handling.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800 mb-6">
            ℹ️ Production registration will open post-hackathon during Phase 4. For now, experience all capabilities using the interactive simulated demo.
          </div>

          <Link
            href="/dashboard?mode=demo"
            className="touch-target inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <span>Launch Interactive Demo Now →</span>
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 sm:py-28" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
              Community <span className="text-gradient">Feedback</span>
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">Reflecting the needs of ethical Pakistani investors</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl sm:rounded-3xl border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300" style={{ background: "var(--bg-secondary)" }}>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-xs sm:text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500 font-medium">{t.role}</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-xs">★</span>)}
                </div>
                <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed italic">&quot;{t.quote}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t" style={{ borderColor: "var(--border-color)", background: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-lg shadow-md shadow-emerald-200">
                  🇵🇰
                </div>
                <div>
                  <span className="text-lg font-black text-slate-800 tracking-tighter">Roziq</span>
                  <div className="text-xs font-black text-emerald-600 uppercase tracking-wider">Halal Wealth OS</div>
                </div>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-sm">
                An interactive prototype for exploring halal wealth tools, savings goals, Zakat, and investing concepts with virtual money. 🕌
              </p>
            </div>
            <div>
              <h5 className="font-black text-slate-800 text-xs mb-3 uppercase tracking-wider">Platform Demo</h5>
              <ul className="space-y-2">
                {["Dashboard", "Halal Stocks", "Zakat Hub", "Hajj Vault", "Sukuks"].map(l => (
                  <li key={l}><Link href="/dashboard?mode=demo" className="text-slate-500 text-xs font-medium hover:text-emerald-600 transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-black text-slate-800 text-xs mb-3 uppercase tracking-wider">Governance</h5>
              <ul className="space-y-2">
                {["Demo Safety", "AAOIFI Standards", "Phase 4 Roadmap", "Terms of Service"].map(l => (
                  <li key={l}><a href="#security" className="text-slate-500 text-xs font-medium hover:text-emerald-600 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t" style={{ borderColor: "var(--border-color)" }}>
            <p className="text-slate-400 text-xs font-medium text-center sm:text-left">
              © 2026 Roziq Halal Wealth OS. Interactive presentation prototype — balances, prices, trades, and returns are simulated.
            </p>
            <div className="flex space-x-5 text-slate-400 text-xs font-bold">
              <Link href="/dashboard?mode=demo" className="text-emerald-600 hover:text-emerald-700">Open Demo</Link>
              <a href="#security" className="hover:text-emerald-600">Safety &amp; Auditing</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
