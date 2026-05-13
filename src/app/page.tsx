import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-emerald-200">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🇵🇰</span>
              <span className="text-xl font-black text-emerald-800 tracking-tight">Roziq</span>
            </div>
            <div>
              <Link href="/dashboard" className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2 rounded-full font-bold transition-all shadow-md hover:shadow-lg">
                Open App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100 via-gray-50 to-white -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-500">Halal Wealth</span><br />
            Built for Pakistan.
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-600 mx-auto mb-10 leading-relaxed">
            The sovereign financial operating system. Invest in strictly Shariah-compliant stocks, fractional Sukuks, and automate your Zakat—all completely Riba-free.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl hover:-translate-y-1">
              Launch Dashboard →
            </Link>
            <div className="flex items-center space-x-2 text-sm font-bold text-emerald-700 bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100">
              <span>✅</span>
              <span>100% AAOIFI Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900">Everything you need to grow wealth purely.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl mb-6">🕋</div>
              <h3 className="text-xl font-bold mb-3">Shariah Stock Screener</h3>
              <p className="text-gray-600 leading-relaxed">Live algorithmic filtering of the PSX. We strictly remove any company with >33% debt or >5% haram income.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center text-2xl mb-6">💧</div>
              <h3 className="text-xl font-bold mb-3">Auto-Purification (Tathir)</h3>
              <p className="text-gray-600 leading-relaxed">Earned a dividend with 2% interest income? Roziq automatically calculates and routes the impure amount to charity.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl mb-6">👳🏽‍♂️</div>
              <h3 className="text-xl font-bold mb-3">AI Mufti Advisor</h3>
              <p className="text-gray-600 leading-relaxed">Have a question about Islamic finance? Our AI is trained directly on AAOIFI standards to give you instant guidance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-black mb-6">Say Goodbye to Riba.</h2>
          <p className="text-gray-400 mb-10 text-lg">Join the thousands of Pakistanis preserving their wealth without compromising their faith.</p>
          <Link href="/dashboard" className="px-10 py-4 bg-emerald-600 text-white rounded-full font-bold text-xl hover:bg-emerald-500 transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            Start Investing Now
          </Link>
        </div>
      </section>
    </div>
  );
}
