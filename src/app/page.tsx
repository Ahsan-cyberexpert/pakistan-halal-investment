import Link from "next/link";

const stats = [
  { value: "Demo", label: "Interactive experience", sub: "Explore with virtual money" },
  { value: "0", label: "Real payments", sub: "No money moves in demo" },
  { value: "36+", label: "Feature concepts", sub: "Tools & modules to explore" },
  { value: "2.5M+", label: "Example Nisab", sub: "Demo calculation only" },
];

const features = [
  {
    emoji: "⚖️",
    title: "Shariah Screener",
    desc: "Real-time PSX filtering using AAOIFI standards. Every stock is verified for Riba, Gharar, and Haram sectors before you invest.",
    badge: "AI-Powered",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
  },
  {
    emoji: "🤖",
    title: "Wali AI Autopilot",
    desc: "An elite wealth guardian that automates halal trades on your behalf. Smart rebalancing, market alerts, and portfolio protection.",
    badge: "Premium Elite",
    color: "from-amber-400 to-yellow-500",
    bg: "bg-amber-50",
  },
  {
    emoji: "🕋",
    title: "Zakat & Hajj Vault",
    desc: "Automate your spiritual obligations. National Zakat Vault integration with live audit tracking and transparent distribution.",
    badge: "Shariah Compliant",
    color: "from-teal-500 to-cyan-600",
    bg: "bg-teal-50",
  },
  {
    emoji: "📜",
    title: "Wirasat Calculator",
    desc: "Calculate your estate according to Islamic inheritance laws. Protect your family's future with CNIC-secured heir verification.",
    badge: "Legal & Spiritual",
    color: "from-purple-500 to-violet-600",
    bg: "bg-purple-50",
  },
  {
    emoji: "🏥",
    title: "Family Health Takaful",
    desc: "Riba-free family health savings through Islamic mutual assistance. Save monthly, protect your loved ones from medical emergencies.",
    badge: "Riba-Free",
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50",
  },
  {
    emoji: "📈",
    title: "Fractional Sukuks",
    desc: "Invest in government-backed Islamic bonds starting from PKR 1,000. Earn halal returns with sovereign-grade security.",
    badge: "Gov. Backed",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
  },
  {
    emoji: "🌍",
    title: "Overseas Remittance",
    desc: "Pakistani diaspora can invest directly from abroad. Multi-currency support with halal global ETFs and real-time forex.",
    badge: "Global",
    color: "from-cyan-500 to-sky-600",
    bg: "bg-cyan-50",
  },
  {
    emoji: "🤝",
    title: "Digital Kameti",
    desc: "Modernized Islamic rotating savings (Kameti) with CNIC verification, legal contracts, and transparent fund management.",
    badge: "Community",
    color: "from-orange-500 to-amber-600",
    bg: "bg-orange-50",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Create Your Account",
    desc: "Register with your CNIC for a secure, verified Islamic wealth account. Biometric authentication keeps your funds safe.",
    icon: "🔐",
  },
  {
    step: "02",
    title: "Get Shariah Screened",
    desc: "Our AI scans your portfolio and watchlist against AAOIFI standards in real time — only halal assets pass through.",
    icon: "⚖️",
  },
  {
    step: "03",
    title: "Build Your Wealth",
    desc: "Invest in PSX Halal stocks, Sukuks, Hajj savings, and Global Halal ETFs — all with zero commission.",
    icon: "📈",
  },
  {
    step: "04",
    title: "Fulfill Your Duties",
    desc: "Automated Zakat calculation and one-tap distribution to verified NGOs. Purify your wealth with confidence.",
    icon: "🕋",
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
      <nav className="fixed w-full z-[100] px-3 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto glass rounded-[2rem] border border-white/40 px-4 sm:px-8 py-2.5 sm:py-3 flex justify-between items-center shadow-2xl">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-lg sm:text-xl shadow-lg shadow-emerald-200 flex-shrink-0">
              🇵🇰
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black text-slate-800 tracking-tighter">Roziq</span>
              <div className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.2em] -mt-0.5">Halal Wealth OS</div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-500">
            <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How It Works</a>
            <a href="#security" className="hover:text-emerald-600 transition-colors">Security</a>
            <a href="#mission" className="hover:text-emerald-600 transition-colors">Mission</a>
          </div>

          <Link
            href="/dashboard"
            className="px-4 sm:px-8 py-2 sm:py-3 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-900/20 hover:-translate-y-0.5 transition-all flex-shrink-0"
          >
            Open App →
          </Link>
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
            <span className="text-[9px] sm:text-[10px] font-black text-emerald-700 uppercase tracking-wider sm:tracking-widest">
              Interactive demo · Roziq Halal Wealth OS
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-3.5 sm:mb-6 animate-in fade-in duration-700 leading-tight">
            <span className="text-slate-900">Explore your</span>{" "}
            <span className="text-gradient">halal wealth journey.</span>
          </h1>

          <p className="max-w-xl text-xs sm:text-base text-slate-500 mx-auto mb-6 sm:mb-8 leading-relaxed font-medium">
            Explore investing, savings, Zakat, and financial goals in one guided experience.
            This presentation demo uses virtual money and simulated activity.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-2.5 sm:gap-3 animate-in fade-in duration-700 mb-10 sm:mb-16">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-emerald-700 shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 transition-all text-center"
            >
              Try the interactive demo →
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-7 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs sm:text-sm hover:border-emerald-300 hover:text-emerald-700 hover:-translate-y-0.5 transition-all shadow-sm text-center"
            >
              See how it works →
            </a>
          </div>

          <div className="max-w-2xl mx-auto mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left sm:text-center" role="status">
            <p className="text-xs sm:text-sm font-black text-amber-800">DEMO MODE · Virtual money only</p>
            <p className="mt-1 text-xs sm:text-sm leading-relaxed text-amber-700">Balances, market prices, payments, investments, and AI answers are simulated. No real account or transaction is created.</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/70 backdrop-blur-sm border border-slate-100 rounded-2xl p-3 sm:p-4 shadow-sm">
                <div className="text-lg sm:text-2xl font-black text-slate-900 mb-0.5">{s.value}</div>
                <div className="text-xs font-black text-slate-700">{s.label}</div>
                <div className="text-[10px] text-slate-400 font-medium">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 sm:py-32" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-24">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl mb-6">
              <span className="text-emerald-600 text-xs">⚡</span>
                <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Explore the demo features</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight mb-4">
              Built on Faith.{" "}
              <span className="text-gradient">Powered by AI.</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
              Explore the product vision through four simple goals: invest, plan, purify, and learn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative p-6 sm:p-7 rounded-[2rem] border border-slate-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500 cursor-default overflow-hidden"
                style={{ background: "var(--bg-primary)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/0 group-hover:from-emerald-50/80 group-hover:to-teal-50/40 transition-all duration-500 rounded-[2rem]" />
                <div className="relative z-10">
                  <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                    {f.emoji}
                  </div>
                  <div className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg mb-3">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{f.badge}</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 mb-2 tracking-tight">{f.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 sm:py-32" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 px-4 py-2 rounded-2xl mb-6">
              <span className="text-teal-600 text-xs">🛤️</span>
              <span className="text-xs font-black text-teal-700 uppercase tracking-widest">Your Journey</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight mb-4">
              Simple.{" "}
              <span className="text-gradient">Sovereign.</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">
              Get started in minutes. No complex forms, no hidden charges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
            <div className="hidden lg:block absolute top-16 left-[14%] right-[14%] h-0.5 bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
            {howItWorks.map((step, i) => (
              <div key={i} className="relative text-center group">
                <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-xl shadow-emerald-900/20 group-hover:scale-105 transition-transform duration-300">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-2xl flex items-center justify-center text-xs font-black text-white border-2 border-white shadow-md">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-3">{step.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section id="security" className="py-24 sm:py-32 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-600/10 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl mb-8">
                <span className="text-emerald-400 text-xs">🛡️</span>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Demo safety and transparency</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-8 leading-tight">
                Your wealth,<br />
                <span className="text-gradient">protected by code</span><br />
                and faith.
              </h2>
              <div className="space-y-6">
                {[
                  { icon: "🧪", title: "Interactive simulation", desc: "Try deposits, withdrawals, stock actions, Zakat, and portfolio updates without moving real money." },
                  { icon: "🔁", title: "Repeatable demo", desc: "Reset the demo account and replay the same journey for presentations and feedback." },
                  { icon: "📊", title: "Transparent states", desc: "Demo balances, simulated prices, and example calculations are designed to be clearly labeled." },
                  { icon: "⚖️", title: "Shariah-focused vision", desc: "Production screening and scholar review will be documented separately before any real service launches." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-emerald-600/20 group-hover:border-emerald-500/30 transition-all duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-base sm:text-lg mb-1 text-white">{item.title}</h4>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-[3rem] p-5 sm:p-12 backdrop-blur-3xl overflow-x-auto">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                <span className="ml-2 text-slate-500 text-[11px] sm:text-xs font-mono">roziq_security.log</span>
              </div>
              <div className="space-y-3 sm:space-y-4 font-mono text-[11px] sm:text-sm">
                <p className="text-slate-400"><span className="text-emerald-400">[INFO]</span> Initializing Shariah Screener v2.0...</p>
                <p className="text-slate-400"><span className="text-blue-400">[DEMO]</span> Loading example PSX screening data...</p>
                <p className="text-emerald-400"><span className="text-emerald-500">[INFO]</span> Example screened stocks available for exploration</p>
                <p className="text-slate-400"><span className="text-amber-400">[DATA]</span> Prices may be simulated or delayed</p>
                <p className="text-slate-400"><span className="text-amber-400">[SAFE]</span> No bank, broker, or payment call is made</p>
                <p className="text-slate-400"><span className="text-blue-400">[RESET]</span> Demo state can be replayed anytime</p>
                <p className="text-emerald-400"><span className="text-emerald-500">[READY]</span> Safe interactive walkthrough available</p>
                <p className="animate-pulse text-emerald-400">_</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 sm:py-32" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Trusted by <span className="text-gradient">Pakistani Muslims</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium">Real stories from our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-7 rounded-[2rem] border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300" style={{ background: "var(--bg-primary)" }}>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500 font-medium">{t.role}</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-sm">★</span>)}
                </div>
                <p className="text-slate-600 text-sm font-medium leading-relaxed italic">&quot;{t.quote}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" className="py-24 sm:py-32" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl mb-8">
            <span className="text-emerald-600">🕌</span>
            <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">The Sovereign Mission</span>
          </div>
          <blockquote className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-10">
            &quot;To build a financial future where technology respects the soul, and every Pakistani can grow their wealth without fear of interest.&quot;
          </blockquote>
          <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-full mb-12" />

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xl hover:bg-emerald-700 shadow-2xl shadow-slate-900/20 hover:shadow-emerald-900/30 hover:-translate-y-1 transition-all"
            >
              Start Your Halal Wealth Journey 🇵🇰
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 border-t" style={{ borderColor: "var(--border-color)", background: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-emerald-200">
                  🇵🇰
                </div>
                <div>
                  <span className="text-xl font-black text-slate-800 tracking-tighter">Roziq</span>
                  <div className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.2em]">Halal Wealth OS</div>
                </div>
              </div>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
                An interactive prototype for exploring halal wealth tools, savings goals, Zakat, and investing concepts. 🕌
              </p>
            </div>
            <div>
              <h5 className="font-black text-slate-800 text-sm mb-4 uppercase tracking-widest">Platform</h5>
              <ul className="space-y-2.5">
                {["Dashboard", "Halal Stocks", "Zakat Hub", "Hajj Vault", "Sukuks"].map(l => (
                  <li key={l}><Link href="/dashboard" className="text-slate-500 text-sm font-medium hover:text-emerald-600 transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-black text-slate-800 text-sm mb-4 uppercase tracking-widest">Company</h5>
              <ul className="space-y-2.5">
                {["Mission", "Security", "Privacy Policy", "Terms of Service", "Contact"].map(l => (
                  <li key={l}><a href="#" className="text-slate-500 text-sm font-medium hover:text-emerald-600 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t" style={{ borderColor: "var(--border-color)" }}>
            <p className="text-slate-400 text-sm font-medium">
              © 2026 Roziq. Interactive prototype — demo balances, prices, transactions, and recommendations are simulated and not financial advice.
            </p>
            <div className="flex space-x-6 text-slate-400">
              <a href="#" className="hover:text-emerald-600 font-bold text-sm transition-colors">Twitter</a>
              <a href="#" className="hover:text-emerald-600 font-bold text-sm transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-emerald-600 font-bold text-sm transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
