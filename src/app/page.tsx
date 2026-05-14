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
            <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Now Live in Pakistan</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <span className="text-slate-900">Wealth that stays</span><br />
            <span className="text-gradient">Pure.</span>
          </h1>
          
          <p className="max-w-2xl text-xl text-slate-500 mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
            The sovereign financial operating system for the modern Muslim. Invest in Shariah-compliant stocks, Sukuks, and automate your Zakat—all completely Riba-free.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000">
            <Link href="/dashboard" className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-xl hover:bg-slate-800 shadow-2xl shadow-slate-900/20 hover:-translate-y-1 transition-all">
              Start Investing →
            </Link>
            <div className="flex items-center space-x-4 px-6 py-4 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Joined by 10k+ Pakistanis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid - Modern Cards */}
      <section id="features" className="py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-4">Core Platform</h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Everything you need to grow wealth purely.</h3>
            </div>
            <p className="max-w-xs text-slate-500 font-medium leading-relaxed">
              We've combined world-class technology with ancient ethical principles.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                emoji: '🕋', 
                title: 'Shariah Screener', 
                desc: 'Live algorithmic filtering of the PSX. We strictly remove any company with >33% debt or >5% haram income.',
                color: 'bg-emerald-50'
              },
              { 
                emoji: '💧', 
                title: 'Auto-Purification', 
                desc: 'Roziq automatically calculates and routes impure dividend income to charity, keeping your wealth halal.',
                color: 'bg-teal-50'
              },
              { 
                emoji: '👳🏽‍♂️', 
                title: 'AI Mufti Advisor', 
                desc: 'Instant guidance on Islamic finance based directly on AAOIFI standards. Ask anything, anytime.',
                color: 'bg-cyan-50'
              }
            ].map((f, i) => (
              <div key={i} className="premium-card p-10 group">
                <div className={`w-20 h-20 ${f.color} rounded-[2rem] flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                  {f.emoji}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section - Dark Glass */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto glass-dark rounded-[4rem] p-16 md:p-24 text-center overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-600/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Say Goodbye to Riba.</h2>
            <p className="text-emerald-100/60 mb-12 text-xl max-w-2xl mx-auto font-medium">
              Join the thousands of Pakistanis preserving their wealth without compromising their faith.
            </p>
            <Link href="/dashboard" className="inline-flex px-12 py-5 bg-emerald-500 text-white rounded-[2rem] font-bold text-xl hover:bg-emerald-400 transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:-translate-y-1">
              Start Investing Now
            </Link>
          </div>
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
