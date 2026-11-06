'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ─── Types ─────────────────────────────────────────────────────────────────────
type TabId = 'invest' | 'zakat' | 'mufti' | 'sukuk';
type ScreenerFilter = 'all' | 'halal' | 'excluded';

// ─── Static data ───────────────────────────────────────────────────────────────
const STOCKS = [
  { name: 'Meezan Bank', score: 9.8, compliant: true },
  { name: 'Systems Limited', score: 9.5, compliant: true },
  { name: 'Habib Bank', score: 2.1, compliant: false },
  { name: 'Lucky Cement', score: 8.7, compliant: true },
  { name: 'Engro Corp', score: 7.4, compliant: true },
  { name: 'MCB Bank', score: 2.8, compliant: false },
];

const MUFTI_REPLY =
  'Yes. Debt is 22.4% and impure income 4.2%, both within limits. Purify 4.2% of dividends.';

const FAQ_ITEMS = [
  {
    q: 'Is Roziq a licensed broker?',
    a: 'Real accounts will open with accredited PSX brokers under SECP rules. Join the waitlist to be first.',
  },
  {
    q: 'Which Shariah standards do you use?',
    a: 'We follow AAOIFI Standard No. 21 inspired guidelines: interest-bearing debt below 33% of market cap, impure income below 5% of gross revenue, illiquid assets at least 10% of total assets.',
  },
  {
    q: 'How does dividend purification work?',
    a: 'When dividends contain incidental impure income, Roziq calculates the exact tainted fraction and routes it to charitable causes with a full receipt trail.',
  },
];

// ─── Sign-up Modal ─────────────────────────────────────────────────────────────
function StartModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 p-8"
        style={{ background: '#111' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-white mb-1">How would you like to start?</h2>
        <p className="text-sm text-slate-400 mb-6">You can switch at any time.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Demo */}
          <div className="flex flex-col rounded-xl border border-white/10 p-5 bg-white/5">
            <div className="mb-4">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-emerald-400">
                <path d="M10 4v8L4 20a2 2 0 001.76 2.95h16.48A2 2 0 0024 20l-6-8V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 4h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2">Demo account</h3>
            <p className="text-sm text-slate-400 flex-1 mb-5">
              Practise with PKR 5,000,000 of virtual cash. No CNIC or bank account needed.
            </p>
            <button
              onClick={() => { onClose(); router.push('/dashboard'); }}
              className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-black hover:bg-slate-100 transition-colors"
            >
              Start demo
            </button>
          </div>
          {/* Real */}
          <div className="flex flex-col rounded-xl border border-emerald-500/40 p-5 bg-emerald-500/5">
            <div className="flex items-start justify-between mb-4">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-emerald-400">
                <rect x="3" y="12" width="22" height="11" rx="1" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3 12l11-8 11 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 12v11M14 12v11M20 12v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-full px-2.5 py-0.5">
                Opening soon
              </span>
            </div>
            <h3 className="font-semibold text-white mb-2">Real account</h3>
            <p className="text-sm text-slate-400 flex-1 mb-5">
              Invest real money in Shariah-screened assets. Requires CNIC verification.
            </p>
            <button
              onClick={() => alert('Waitlist coming soon! We will notify you when real accounts open.')}
              className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors"
            >
              Join the waitlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Interactive product tabs ──────────────────────────────────────────────────
function ProductTabs() {
  const [tab, setTab] = useState<TabId>('invest');
  const [filter, setFilter] = useState<ScreenerFilter>('all');
  const [cash, setCash] = useState(1200000);
  const [gold, setGold] = useState(600000);
  const [investments, setInvestments] = useState(600000);
  const [muftiInput, setMuftiInput] = useState('');
  const [muftiQ, setMuftiQ] = useState('Can I hold Engro shares?');
  const [muftiShown, setMuftiShown] = useState(true);
  const [muftiLang, setMuftiLang] = useState<'en' | 'ur'>('en');

  const totalAssets = cash + gold + investments;
  const nisab = 2450000;
  const zakatDue = totalAssets >= nisab ? Math.round(totalAssets * 0.025) : 0;
  const aboveNisab = totalAssets >= nisab;

  const filtered = STOCKS.filter(s =>
    filter === 'all' ? true : filter === 'halal' ? s.compliant : !s.compliant
  );

  const TABS: { id: TabId; label: string }[] = [
    { id: 'invest', label: 'Tab 1: Invest' },
    { id: 'zakat', label: 'Tab 2: Zakat' },
    { id: 'mufti', label: 'Tab 3: AI Mufti' },
    { id: 'sukuk', label: 'Tab 4: Sukuk and Kameti' },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Tab bar */}
      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-white/10 text-white'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="rounded-2xl border border-white/8 p-6" style={{ background: '#111' }}>
        {/* ── Tab 1: Invest ── */}
        {tab === 'invest' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Shariah screener</h3>
              <div className="flex gap-1 rounded-lg bg-white/5 p-1">
                {(['all', 'halal', 'excluded'] as ScreenerFilter[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors ${
                      filter === f ? 'bg-white/15 text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'halal' ? 'Halal' : 'Excluded'}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-2 grid grid-cols-3 text-xs font-medium text-slate-500 uppercase tracking-wide pb-2 border-b border-white/5">
              <span>Company</span>
              <span className="text-center">Score</span>
              <span className="text-right">Status</span>
            </div>
            <div className="space-y-1">
              {filtered.map(s => (
                <div key={s.name} className="grid grid-cols-3 items-center py-2.5 border-b border-white/5 last:border-0">
                  <span className="text-sm font-medium text-white">{s.name}</span>
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.compliant ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ width: `${(s.score / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-300">{s.score}</span>
                  </div>
                  <div className="flex justify-end">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      s.compliant
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-red-500/15 text-red-400'
                    }`}>
                      {s.compliant ? 'Compliant' : 'Excluded'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab 2: Zakat ── */}
        {tab === 'zakat' && (
          <div>
            <h3 className="mb-4 text-base font-semibold text-white">Zakat calculator</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                {[
                  { label: 'Cash', value: cash, set: setCash },
                  { label: 'Gold', value: gold, set: setGold },
                  { label: 'Investments', value: investments, set: setInvestments },
                ].map(({ label, value, set }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-400">{label}</span>
                      <span className="text-sm font-medium text-white">
                        {value.toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={5000000}
                      step={50000}
                      value={value}
                      onChange={e => set(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-white/8 bg-white/5 p-6 text-center">
                <p className="text-xs text-slate-400 mb-2">Zakat due at 2.5%</p>
                <p className="text-3xl font-black text-white">
                  PKR {zakatDue.toLocaleString()}
                </p>
                <p className={`mt-2 text-sm font-medium ${aboveNisab ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {aboveNisab ? 'Above Nisab' : 'Below Nisab — not yet due'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 3: AI Mufti ── */}
        {tab === 'mufti' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">AI Mufti</h3>
              <div className="flex gap-1 rounded-lg bg-white/5 p-1">
                {(['en', 'ur'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setMuftiLang(l)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      muftiLang === l ? 'bg-white/15 text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {l === 'en' ? 'English' : 'اردو'}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-white/5 p-4 space-y-3 min-h-[160px]">
              {muftiShown && (
                <>
                  <div className="flex justify-end">
                    <span className="rounded-xl rounded-tr-sm bg-white/10 px-3 py-2 text-sm text-white max-w-xs">
                      {muftiQ}
                    </span>
                  </div>
                  <div className="flex justify-start">
                    <span className="rounded-xl rounded-tl-sm bg-emerald-900/60 border border-emerald-700/40 px-3 py-2 text-sm text-emerald-100 max-w-xs">
                      {MUFTI_REPLY}
                    </span>
                  </div>
                </>
              )}
            </div>
            <form
              className="mt-3 flex gap-2"
              onSubmit={e => {
                e.preventDefault();
                if (muftiInput.trim()) {
                  setMuftiQ(muftiInput.trim());
                  setMuftiShown(true);
                  setMuftiInput('');
                }
              }}
            >
              <input
                value={muftiInput}
                onChange={e => setMuftiInput(e.target.value)}
                placeholder="Ask about Zakat or Sukuk"
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50"
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-black hover:bg-emerald-400 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M6 8l1.5 1.5L10.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </div>
        )}

        {/* ── Tab 4: Sukuk & Kameti ── */}
        {tab === 'sukuk' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sukuk */}
              <div className="rounded-xl border border-white/8 bg-white/5 p-5">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">Sukuk</p>
                <h4 className="mb-1 text-base font-semibold text-white">Asset-backed infrastructure</h4>
                <div className="mt-4 mb-2">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Funding progress</span>
                    <span>62%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div className="h-full w-[62%] rounded-full bg-emerald-500" />
                  </div>
                </div>
                <p className="text-xs text-slate-500">62% funded · Virtual demo only</p>
              </div>
              {/* Kameti */}
              <div className="rounded-xl border border-white/8 bg-white/5 p-5">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">Kameti</p>
                <h4 className="mb-1 text-base font-semibold text-white">Family savings circle</h4>
                <div className="mt-4 flex gap-1.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className={`h-6 w-6 rounded-full ${i <= 4 ? 'bg-emerald-500' : 'bg-white/15'}`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500">Member 4 of 5 this round</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FAQ Accordion Item ────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/8">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-white hover:text-emerald-400 transition-colors"
      >
        <span>{q}</span>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          className={`flex-shrink-0 ml-3 text-slate-400 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
        >
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <p className="pb-4 text-sm text-slate-400 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a', color: '#fff' }}>
      {showModal && <StartModal onClose={() => setShowModal(false)} />}

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 border-b border-white/5" style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5C4 1.5 1.5 4 1.5 7S4 12.5 7 12.5 12.5 10 12.5 7 10 1.5 7 1.5z" stroke="#000" strokeWidth="1.4" />
                <path d="M7 4.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" fill="#000" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-white">Roziq</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {['Invest', 'Zakat', 'Standards', 'Roadmap', 'FAQ'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-slate-400 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden sm:inline text-sm text-slate-400 hover:text-white transition-colors">
              Log in
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors"
            >
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="flex flex-col items-center px-6 py-24 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
          Shariah-compliant, AAOIFI standards
        </div>
        <h1 className="mb-5 max-w-2xl text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight">
          Invest in Pakistan,{' '}
          <span className="text-emerald-400">the halal way.</span>
        </h1>
        <p className="mb-10 max-w-md text-lg text-slate-400 leading-relaxed">
          Shariah-screened stocks, Sukuk and automated Zakat in one trusted platform.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-emerald-500 px-7 py-3 text-base font-semibold text-black hover:bg-emerald-400 transition-colors"
          >
            Get started
          </button>
          <a
            href="#how-it-works"
            className="rounded-lg border border-white/15 px-7 py-3 text-base font-semibold text-white hover:border-white/30 hover:bg-white/5 transition-colors"
          >
            How it works
          </a>
        </div>

        {/* Feature chips */}
        <div className="mb-16 grid w-full max-w-3xl grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {[
            {
              icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-emerald-400"><rect x="2" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M2 10h18M7 3l-2 3M15 3l2 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>,
              title: 'Screened stocks',
              desc: 'Every PSX stock checked for debt and impure income.',
            },
            {
              icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-emerald-400"><path d="M11 2v4M11 16v4M4.22 4.22l2.83 2.83M14.95 14.95l2.83 2.83M2 11h4M16 11h4M4.22 17.78l2.83-2.83M14.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>,
              title: 'Automated Zakat',
              desc: 'Nisab and 2.5% calculated from live gold and silver prices.',
            },
            {
              icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-emerald-400"><path d="M21 15a2 2 0 01-2 2H7l-5 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
              title: 'AI Mufti',
              desc: 'Ask questions in Urdu or English, by text or voice.',
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-white/8 p-5" style={{ background: '#141414' }}>
              <div className="mb-3">{icon}</div>
              <h3 className="mb-1 text-sm font-semibold text-white">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* ── Interactive product tabs ── */}
        <ProductTabs />
      </main>

      {/* ── Standards ── */}
      <section id="standards" className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-500">Standards</p>
          <h2 className="mb-10 text-3xl font-bold text-white">Screened to global Islamic standards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { pct: '33%', label: 'Debt limit', desc: 'Interest-bearing debt under 33% of market cap.' },
              { pct: '5%', label: 'Impure income', desc: 'Fully purified through charity.' },
              { pct: '10%', label: 'Real assets', desc: 'At least 10% of total assets are tangible.' },
            ].map(({ pct, label, desc }) => (
              <div key={label} className="rounded-xl border border-white/8 p-6" style={{ background: '#111' }}>
                <p className="text-3xl font-black text-white mb-1">{pct}</p>
                <p className="text-sm font-semibold text-white mb-1">{label}</p>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-500">How it works</p>
          <h2 className="mb-12 text-3xl font-bold text-white">Four steps to halal growth</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { n: '01', title: 'Sign up', desc: 'Create your account.' },
              { n: '02', title: 'Screen', desc: 'Every asset is checked.' },
              { n: '03', title: 'Grow', desc: 'Invest and purify dividends.' },
              { n: '04', title: 'Preserve', desc: 'Zakat and inheritance.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col">
                <span className="mb-3 text-sm font-bold text-slate-600">{n}</span>
                <h3 className="mb-1 text-sm font-semibold text-white">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section id="roadmap" className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-500">Roadmap</p>
          <h2 className="mb-10 text-3xl font-bold text-white">Built on trusted infrastructure</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-400"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>,
                title: 'Licensed brokers',
                desc: 'PSX execution under SECP rules.',
              },
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-400"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
                title: 'Raast payments',
                desc: 'Instant PKR deposits and withdrawals.',
              },
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
                title: 'Shariah board',
                desc: 'Independent scholar reviews.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-white/8 p-6" style={{ background: '#111' }}>
                <div className="mb-4">{icon}</div>
                <h3 className="mb-1 text-sm font-semibold text-white">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-500">FAQ</p>
          <h2 className="mb-8 text-3xl font-bold text-white">Questions, answered</h2>
          <div>
            {FAQ_ITEMS.map(({ q, a }) => (
              <FaqItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <div className="border-t border-white/5 px-6 py-6" style={{ background: '#111' }}>
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-white">Start investing the halal way</p>
            <p className="text-sm text-slate-500">Create your free account in minutes.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors whitespace-nowrap"
          >
            Get started
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5C4 1.5 1.5 4 1.5 7S4 12.5 7 12.5 12.5 10 12.5 7 10 1.5 7 1.5z" stroke="#000" strokeWidth="1.6" />
                <path d="M7 4.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" fill="#000" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">Roziq</span>
          </div>
          <div className="flex flex-wrap gap-5">
            {['Invest', 'Zakat', 'Standards', 'Roadmap', 'FAQ'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                {item}
              </a>
            ))}
          </div>
          <span className="text-xs text-slate-600">2026 Roziq. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
