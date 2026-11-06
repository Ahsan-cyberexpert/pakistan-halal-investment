'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ─── Sign-up Modal ────────────────────────────────────────────────────────────
function StartModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  function handleDemo() {
    onClose();
    router.push('/dashboard');
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 p-8"
        style={{ background: '#111' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>

        <h2 className="text-xl font-semibold text-white mb-1">How would you like to start?</h2>
        <p className="text-sm text-slate-400 mb-6">You can switch at any time.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Demo account */}
          <div className="flex flex-col rounded-xl border border-white/10 p-5 bg-white/5">
            <div className="mb-4">
              {/* Flask icon */}
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-emerald-400">
                <path d="M10 4v8L4 20a2 2 0 001.76 2.95h16.48A2 2 0 0024 20l-6-8V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 4h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2">Demo account</h3>
            <p className="text-sm text-slate-400 flex-1 mb-5">
              Practise with PKR 5,000,000 of virtual cash. No CNIC or bank account needed.
            </p>
            <button
              onClick={handleDemo}
              className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-black hover:bg-slate-100 transition-colors"
            >
              Start demo
            </button>
          </div>

          {/* Real account */}
          <div className="flex flex-col rounded-xl border border-emerald-500/40 p-5 bg-emerald-500/5">
            <div className="flex items-start justify-between mb-4">
              {/* Bank icon */}
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-emerald-400">
                <rect x="3" y="12" width="22" height="11" rx="1" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M3 12l11-8 11 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12v11M14 12v11M20 12v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
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
              className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors"
              onClick={() => {
                alert('Waitlist coming soon! We will notify you when real accounts open.');
              }}
            >
              Join the waitlist
            </button>
          </div>
        </div>
      </div>
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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5C4 1.5 1.5 4 1.5 7S4 12.5 7 12.5 12.5 10 12.5 7 10 1.5 7 1.5z" stroke="#000" strokeWidth="1.4"/>
                <path d="M7 4.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" fill="#000"/>
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-white">Roziq</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {['Invest', 'Zakat', 'Standards', 'FAQ'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-slate-400 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>

          {/* Auth buttons */}
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
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
          Shariah-compliant, AAOIFI standards
        </div>

        {/* Headline */}
        <h1 className="mb-5 max-w-2xl text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight">
          Invest in Pakistan,{' '}
          <span className="text-emerald-400">the halal way.</span>
        </h1>

        {/* Sub */}
        <p className="mb-10 max-w-md text-lg text-slate-400 leading-relaxed">
          Shariah-screened stocks, Sukuk and automated Zakat in one trusted platform.
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap items-center justify-center gap-4">
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

        {/* Feature cards */}
        <div className="mt-20 grid w-full max-w-3xl grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {[
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-emerald-400">
                  <rect x="2" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M2 10h18M7 3l-2 3M15 3l2 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              ),
              title: 'Screened stocks',
              desc: 'Every PSX stock checked for debt and impure income.',
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-emerald-400">
                  <path d="M11 2v4M11 16v4M4.22 4.22l2.83 2.83M14.95 14.95l2.83 2.83M2 11h4M16 11h4M4.22 17.78l2.83-2.83M14.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              ),
              title: 'Automated Zakat',
              desc: 'Nisab and 2.5% calculated from live gold and silver prices.',
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-emerald-400">
                  <path d="M21 15a2 2 0 01-2 2H7l-5 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              title: 'AI Mufti',
              desc: 'Ask questions in Urdu or English, by text or voice.',
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-white/8 p-5"
              style={{ background: '#141414' }}
            >
              <div className="mb-3">{icon}</div>
              <h3 className="mb-1 text-sm font-semibold text-white">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* ── How it works ── */}
      <section id="how-it-works" className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { step: '01', title: 'Open demo account', desc: 'Start instantly with virtual PKR 5,000,000. No documents required.' },
              { step: '02', title: 'Screen & invest', desc: 'Browse Shariah-screened PSX stocks and Sukuk with full audit trail.' },
              { step: '03', title: 'Calculate & purify', desc: 'Auto-calculate Zakat, purify dividends, and track your impact.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center">
                <span className="mb-4 text-4xl font-black text-emerald-500/30">{step}</span>
                <h3 className="mb-2 text-base font-semibold text-white">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-white">FAQ</h2>
          <div className="space-y-3">
            {[
              {
                q: 'Is Roziq a licensed broker?',
                a: 'This is an interactive demo platform. All balances and trades are simulated with virtual funds. Phase 4 of our roadmap includes formal SECP registration and SBP Raast settlement.',
              },
              {
                q: 'What Shariah standard is used for screening?',
                a: 'We follow AAOIFI Standard No. 21 inspired guidelines: interest-bearing debt below 33% of market cap, impure income below 5% of gross revenue, illiquid assets at least 10% of total assets.',
              },
              {
                q: 'Do I need real money or a CNIC?',
                a: 'No. The demo account is fully frictionless — no documents, no real money. You get virtual PKR 5,000,000 to explore every feature.',
              },
              {
                q: 'How does dividend purification work?',
                a: 'When dividends contain incidental impure income, Roziq calculates the exact tainted fraction and routes it to charitable causes with a full receipt trail.',
              },
            ].map(({ q, a }, i) => (
              <FaqItem key={i} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA bar ── */}
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
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <span>© 2026 Roziq. Demo platform — virtual funds only. No real money moves.</span>
          <span>AAOIFI Standard No. 21 inspired guidelines. Not certified by any regulatory body.</span>
        </div>
      </footer>
    </div>
  );
}

// ─── FAQ Accordion Item ────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl border border-white/8 overflow-hidden"
      style={{ background: '#111' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-white hover:bg-white/5 transition-colors"
      >
        <span>{q}</span>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          className={`flex-shrink-0 ml-3 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="border-t border-white/5 px-5 py-4 text-sm text-slate-400 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}
