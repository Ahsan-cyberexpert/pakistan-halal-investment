import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen selection:bg-emerald-200 overflow-x-hidden">
      {/* Navigation - Glassmorphic */}
      <nav className="fixed w-full z-[100] px-6 py-4">
        <div className="max-w-7xl mx-auto glass rounded-[2rem] border border-white/40 px-8 py-3 flex justify-between items-center shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-emerald-200">🇵🇰</div>
            <span className="text-xl font-black text-slate-800 tracking-tighter">Roziq</span>
          </div>
          <div className="hidden md:flex items-center space-x-10 text-sm font-bold text-slate-500">
            <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
            <a href="#security" className="hover:text-emerald-600 transition-colors">Security</a>
            <a href="#mission" className="hover:text-emerald-600 transition-colors">Mission</a>
          </div>
          <Link href="/dashboard" className="btn-premium px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Open App
          </Link>
        </div>
      </nav>

      {/* Hero Section - Immersive */}
      <section className="relative pt-48 pb-32 lg:pt-64 lg:pb-48">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-50/40 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="text-emerald-600">✨</span>
            <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Pakistan's First Halal Wealth OS</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <span className="text-slate-900">Wealth that stays</span><br />
            <span className="text-gradient">Pure.</span>
          </h1>
          
          <p className="max-w-2xl text-xl text-slate-500 mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
            The sovereign financial operating system designed for the modern Muslim. Build your future with Shariah-compliant tools, automated Zakat, and Riba-free growth.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000">
            <Link href="/dashboard" className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-xl hover:bg-slate-800 shadow-2xl shadow-slate-900/20 hover:-translate-y-1 transition-all">
              Launch App
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid - Detailed */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-4">The Roziq Pillars</h2>
            <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Built on Faith, Powered by AI.</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                emoji: '⚖️', 
                title: 'Shariah Screener', 
                desc: 'Real-time PSX filtering based on AAOIFI standards. We ensure zero Riba and zero Gharar.' 
              },
              { 
                emoji: '🤖', 
                title: 'Wali AI Autopilot', 
                desc: 'An elite guardian for your wealth. Automates halal trades only when your portfolio reaches the elite tier.' 
              },
              { 
                emoji: '🕋', 
                title: 'Hajj & Zakat', 
                desc: 'Automate your spiritual obligations. National Zakat Vault integration with live audit tracking.' 
              },
              { 
                emoji: '📜', 
                title: 'Inheritance Engine', 
                desc: 'Calculates your estate according to Islamic laws. Secure your family’s future legally and spiritually.' 
              }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-[3rem] bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all">
                <div className="text-4xl mb-6">{f.emoji}</div>
                <h4 className="text-xl font-black text-slate-900 mb-3">{f.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Info - Educational */}
      <section id="security" className="py-32 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-emerald-500 font-black uppercase tracking-widest text-xs mb-4">Sovereign Security</h2>
              <h3 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Your wealth, protected by code and faith.</h3>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">🔐</div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">Mandatory 1234 PIN</h4>
                    <p className="text-slate-400 text-sm">Every access point is guarded by your personal security PIN. We never store your clear-text keys.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">🛡️</div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">CNIC Heir-Lock</h4>
                    <p className="text-slate-400 text-sm">Our inheritance engine uses CNIC-level verification to ensure only your legal heirs can claim wealth.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12 backdrop-blur-3xl">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
               </div>
               <div className="space-y-4 font-mono text-xs text-emerald-500/80">
                  <p>&gt; initializing shariah_screener_v1.0</p>
                  <p>&gt; filtering non_compliant_assets...</p>
                  <p className="text-emerald-400">&gt; SUCCESS: 100% Halal Portfolio Verified</p>
                  <p>&gt; secure_pin_bridge: active</p>
                  <p className="animate-pulse">_</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-6 italic">The Sovereign Mission</h2>
          <blockquote className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-12">
            "To build a financial future where technology respects the soul, and every Pakistani can grow their wealth without fear of interest."
          </blockquote>
          <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-sm shadow-lg shadow-emerald-200">🇵🇰</div>
            <span className="text-lg font-black text-slate-800 tracking-tighter">Roziq</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">© 2026 Roziq. Built with pride for Pakistan. 🕌</p>
          <div className="flex space-x-6 text-slate-400">
            <a href="#" className="hover:text-emerald-600">Twitter</a>
            <a href="#" className="hover:text-emerald-600">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
