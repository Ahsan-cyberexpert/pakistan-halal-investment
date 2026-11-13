'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// ─── Stock data for Shariah screener ──────────────────────────────────────────
const STOCKS = [
  { name: 'Meezan Bank', score: 9.8, compliant: true },
  { name: 'Systems Limited', score: 9.5, compliant: true },
  { name: 'Habib Bank', score: 2.1, compliant: false },
  { name: 'Lucky Cement', score: 8.7, compliant: true },
  { name: 'Engro Corp', score: 7.4, compliant: true },
  { name: 'MCB Bank', score: 2.8, compliant: false },
];

export default function Home() {
  const [filter, setFilter] = useState<'all' | 'ok' | 'no'>('all');
  const [amt, setAmt] = useState('5,000,000');
  const [menuOpen, setMenuOpen] = useState(false);

  // Calculate live Zakat estimation (2.5%)
  const numericAmt = parseInt(amt.replace(/[^0-9]/g, ''), 10) || 0;
  const zakatEstimated = Math.round(numericAmt * 0.025);

  const handleAmtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = parseInt(raw, 10);
    if (!num) {
      setAmt('');
    } else {
      setAmt(num.toLocaleString('en-US'));
    }
  };

  const filteredStocks = STOCKS.filter(stock => {
    if (filter === 'all') return true;
    if (filter === 'ok') return stock.compliant;
    return !stock.compliant;
  });

  return (
    <div className="landing-page">
      {/* ── Embedded CSS from design ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Figtree:wght@400;500;600;700&family=Noto+Nastaliq+Urdu&display=swap');

        :root {
          --bg: #FBFCFB;
          --sf: #fff;
          --alt: #F2F6F4;
          --ink: #0F1F1A;
          --mut: #566761;
          --ln: #E1E9E5;
          --br: #0B5D45;
          --brh: #094A37;
          --tint: #E6F1EC;
          --gold: #A67C2E;
          --bad: #B42318;
          --badbg: #FCECEA;
          --onb: #fff;
          --sh: 0 1px 2px rgba(15,31,26,.05), 0 28px 56px -28px rgba(15,31,26,.22);
        }
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) {
            --bg: #0A1410;
            --sf: #101D18;
            --alt: #0D1914;
            --ink: #EAF2EE;
            --mut: #9AAFA6;
            --ln: #1F342C;
            --br: #4CC9A0;
            --brh: #6FDDB9;
            --tint: #13302A;
            --gold: #D9AE5B;
            --bad: #F97066;
            --badbg: #3A1714;
            --onb: #07231A;
            --sh: 0 28px 56px -28px #000;
            color-scheme: dark;
          }
        }
        :root[data-theme="dark"], html.dark {
          --bg: #0A1410;
          --sf: #101D18;
          --alt: #0D1914;
          --ink: #EAF2EE;
          --mut: #9AAFA6;
          --ln: #1F342C;
          --br: #4CC9A0;
          --brh: #6FDDB9;
          --tint: #13302A;
          --gold: #D9AE5B;
          --bad: #F97066;
          --badbg: #3A1714;
          --onb: #07231A;
          --sh: 0 28px 56px -28px #000;
          color-scheme: dark;
        }

        .landing-page {
          background: var(--bg);
          color: var(--ink);
          font: 400 17px/1.65 Figtree, system-ui, -apple-system, Segoe UI, sans-serif;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }
        .landing-page * {
          box-sizing: border-box;
        }
        .landing-page a {
          color: inherit;
          text-decoration: none;
        }
        .landing-page :focus-visible {
          outline: 3px solid var(--br);
          outline-offset: 3px;
          border-radius: 6px;
        }
        .landing-page .skip {
          position: absolute;
          left: 12px;
          top: -60px;
          background: var(--br);
          color: var(--onb);
          padding: 10px 16px;
          border-radius: 8px;
          z-index: 30;
        }
        .landing-page .skip:focus {
          top: calc(env(safe-area-inset-top, 0px) + 12px);
        }
        .landing-page .wrap {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 28px;
        }
        .landing-page header {
          position: sticky;
          top: env(safe-area-inset-top, 0px);
          z-index: 40;
          background: color-mix(in srgb, var(--bg) 92%, transparent);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--ln);
        }
        .landing-page nav {
          display: flex;
          align-items: center;
          height: 72px;
          gap: 36px;
        }
        .landing-page .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font: 500 27px Newsreader, Georgia, serif;
          letter-spacing: -.01em;
        }
        .landing-page .logo svg {
          width: 32px;
          height: 32px;
        }
        .landing-page .lk {
          display: flex;
          gap: 30px;
          font-size: 15px;
          font-weight: 500;
          color: var(--mut);
        }
        .landing-page .lk a:hover {
          color: var(--ink);
        }
        .landing-page .end {
          margin-left: auto;
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .landing-page .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 50px;
          padding: 0 26px;
          border-radius: 10px;
          font: 600 16px Figtree, sans-serif;
          border: 1px solid var(--ln);
          background: var(--sf);
          color: var(--ink);
          cursor: pointer;
          transition: background .15s, border-color .15s;
        }
        .landing-page .btn:hover {
          border-color: var(--mut);
        }
        .landing-page .btn.p {
          background: var(--br);
          border-color: var(--br);
          color: var(--onb);
        }
        .landing-page .btn.p:hover {
          background: var(--brh);
          border-color: var(--brh);
        }
        .landing-page .btn.s {
          min-height: 42px;
          padding: 0 18px;
          font-size: 15px;
        }
        .landing-page .txt {
          font-weight: 600;
          color: var(--br);
          border-bottom: 2px solid var(--tint);
          padding-bottom: 2px;
        }
        .landing-page .txt:hover {
          border-color: var(--br);
        }
        .landing-page .menu {
          display: none;
          width: 42px;
          height: 42px;
          border: 1px solid var(--ln);
          border-radius: 10px;
          background: var(--sf);
          color: var(--ink);
          cursor: pointer;
        }
        .landing-page .menu svg {
          width: 20px;
          height: 20px;
          stroke: currentColor;
          fill: none;
          stroke-width: 2;
        }
        .landing-page #mm {
          display: none;
          border-top: 1px solid var(--ln);
          padding: 12px 28px 20px;
          background: var(--bg);
        }
        .landing-page #mm a {
          display: block;
          padding: 14px 0;
          font-weight: 500;
          border-bottom: 1px solid var(--ln);
        }
        .landing-page #mm.open {
          display: block;
        }
        .landing-page .hero {
          padding: 88px 0 96px;
        }
        .landing-page .hero .wrap {
          display: grid;
          grid-template-columns: 1.1fr .9fr;
          gap: 72px;
          align-items: center;
        }
        .landing-page h1, .landing-page h2 {
          font-family: Newsreader, Georgia, serif;
          font-weight: 400;
          letter-spacing: -.022em;
          line-height: 1.06;
        }
        .landing-page h1 {
          font-size: clamp(44px, 6vw, 76px);
        }
        .landing-page h2 {
          font-size: clamp(32px, 4vw, 48px);
          max-width: 16em;
        }
        .landing-page .lead {
          font-size: 20px;
          color: var(--mut);
          max-width: 28em;
          margin: 24px 0 36px;
        }
        .landing-page .cta {
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
        }
        .landing-page .trust {
          display: flex;
          gap: 26px;
          flex-wrap: wrap;
          margin-top: 40px;
          font-size: 15px;
          color: var(--mut);
        }
        .landing-page .trust span {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .landing-page .ic {
          width: 20px;
          height: 20px;
          stroke: var(--br);
          fill: none;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
          flex: none;
        }
        .landing-page .card {
          background: var(--sf);
          border: 1px solid var(--ln);
          border-radius: 16px;
          box-shadow: var(--sh);
        }
        .landing-page .scr {
          padding: 26px;
        }
        .landing-page .hd {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          font-size: 18px;
        }
        .landing-page .tag {
          font-size: 13px;
          font-weight: 600;
          padding: 4px 11px;
          border-radius: 99px;
          background: var(--tint);
          color: var(--br);
        }
        .landing-page .tag.x {
          background: var(--badbg);
          color: var(--bad);
        }
        .landing-page .tabs {
          display: flex;
          gap: 4px;
          margin: 18px 0 4px;
          padding: 4px;
          background: var(--alt);
          border-radius: 10px;
          width: max-content;
        }
        .landing-page .tabs button {
          border: 0;
          background: none;
          color: var(--mut);
          padding: 7px 16px;
          border-radius: 7px;
          font: 600 14px Figtree, sans-serif;
          cursor: pointer;
          transition: background .15s, color .15s;
        }
        .landing-page .tabs button[aria-pressed=true] {
          background: var(--sf);
          color: var(--ink);
          box-shadow: 0 1px 3px rgba(0,0,0,.14);
        }
        .landing-page .row {
          display: grid;
          grid-template-columns: 1fr 40px 96px;
          gap: 12px;
          align-items: center;
          padding: 15px 0;
          border-top: 1px solid var(--ln);
        }
        .landing-page .row:first-child {
          border-top: 0;
        }
        .landing-page .sc {
          font-variant-numeric: tabular-nums;
          text-align: right;
          color: var(--mut);
        }
        .landing-page .tag.o {
          text-align: center;
        }
        .landing-page .foot {
          font-size: 13px;
          color: var(--mut);
          margin-top: 6px;
        }
        .landing-page .infra {
          border-block: 1px solid var(--ln);
          background: var(--alt);
        }
        .landing-page .infra .wrap {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          padding-block: 36px;
        }
        .landing-page .it {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .landing-page .it .ic {
          width: 28px;
          height: 28px;
          margin-top: 2px;
        }
        .landing-page .it h3 {
          font-size: 17px;
          margin-bottom: 2px;
        }
        .landing-page .it p {
          font-size: 15px;
          color: var(--mut);
        }
        .landing-page section {
          padding: 104px 0;
        }
        .landing-page .alt {
          background: var(--alt);
          border-block: 1px solid var(--ln);
        }
        .landing-page .sub {
          color: var(--mut);
          margin: 16px 0 56px;
          max-width: 34em;
          font-size: 19px;
        }
        .landing-page .feats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
        }
        .landing-page .f .ic {
          width: 30px;
          height: 30px;
          margin-bottom: 18px;
        }
        .landing-page .f {
          border-top: 2px solid var(--br);
          padding-top: 22px;
        }
        .landing-page .f h3 {
          font-size: 20px;
          margin-bottom: 8px;
        }
        .landing-page .f p, .landing-page .pt p, .landing-page .stat p {
          color: var(--mut);
          font-size: 16px;
        }
        .landing-page .split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 72px;
          align-items: center;
        }
        .landing-page .calc {
          padding: 30px;
        }
        .landing-page .calc label {
          font-weight: 600;
          font-size: 15px;
        }
        .landing-page .in {
          display: flex;
          align-items: center;
          border: 1px solid var(--ln);
          border-radius: 10px;
          margin: 10px 0 24px;
          background: var(--bg);
          overflow: hidden;
        }
        .landing-page .in:focus-within {
          border-color: var(--br);
          box-shadow: 0 0 0 3px var(--tint);
        }
        .landing-page .in span {
          padding: 0 0 0 16px;
          color: var(--mut);
          font-weight: 600;
        }
        .landing-page .in input {
          flex: 1;
          border: 0;
          background: none;
          color: var(--ink);
          font: 600 22px Figtree, sans-serif;
          padding: 14px 16px 14px 10px;
          min-width: 0;
          outline: 0;
        }
        .landing-page .res {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid var(--ln);
        }
        .landing-page .res b {
          font: 400 40px Newsreader, Georgia, serif;
          color: var(--br);
        }
        .landing-page .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 1px solid var(--ln);
          border-radius: 16px;
          background: var(--sf);
          overflow: hidden;
        }
        .landing-page .stat {
          padding: 36px;
        }
        .landing-page .stat + .stat {
          border-left: 1px solid var(--ln);
        }
        .landing-page .num {
          font: 400 64px/1 Newsreader, Georgia, serif;
          letter-spacing: -.03em;
          color: var(--br);
        }
        .landing-page .stat h3 {
          font-size: 18px;
          margin: 16px 0 6px;
        }
        .landing-page .chat {
          padding: 26px;
          display: grid;
          gap: 12px;
        }
        .landing-page .b {
          padding: 12px 17px;
          border-radius: 14px;
          font-size: 16px;
          max-width: 88%;
        }
        .landing-page .q {
          background: var(--br);
          color: var(--onb);
          justify-self: end;
          border-bottom-right-radius: 4px;
        }
        .landing-page .a {
          background: var(--alt);
          border: 1px solid var(--ln);
          border-bottom-left-radius: 4px;
        }
        .landing-page .ur {
          font-family: "Noto Nastaliq Urdu", serif;
          direction: rtl;
          line-height: 2.2;
        }
        .landing-page .path {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
          position: relative;
        }
        .landing-page .path::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 19px;
          border-top: 1px solid var(--ln);
        }
        .landing-page .pt span {
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--sf);
          border: 1px solid var(--br);
          color: var(--br);
          font-weight: 700;
          margin-bottom: 20px;
          position: relative;
        }
        .landing-page .pt h3 {
          font-size: 20px;
          margin-bottom: 6px;
        }
        .landing-page details {
          border-top: 1px solid var(--ln);
          padding: 24px 0;
          max-width: 800px;
        }
        .landing-page details:last-of-type {
          border-bottom: 1px solid var(--ln);
        }
        .landing-page summary {
          font-weight: 600;
          font-size: 19px;
          cursor: pointer;
          list-style: none;
          display: flex;
          justify-content: space-between;
          gap: 16px;
        }
        .landing-page summary::-webkit-details-marker {
          display: none;
        }
        .landing-page summary::after {
          content: "+";
          color: var(--br);
          font-size: 26px;
          line-height: 1;
        }
        .landing-page details[open] summary::after {
          content: "−";
        }
        .landing-page details p {
          color: var(--mut);
          margin-top: 12px;
        }
        .landing-page .final {
          background: #0B3D2E;
          color: #fff;
          border-radius: 20px;
          padding: 80px 32px;
          text-align: center;
        }
        .landing-page .final h2 {
          margin: 0 auto;
          color: #fff;
        }
        .landing-page .final p {
          color: #B9D9CC;
          margin: 16px 0 34px;
          font-size: 19px;
        }
        .landing-page .final .btn.p {
          background: #fff;
          border-color: #fff;
          color: #0B3D2E;
        }
        .landing-page .final .btn.p:hover {
          background: #eaf5f0;
          border-color: #eaf5f0;
        }
        .landing-page footer {
          border-top: 1px solid var(--ln);
          padding: 64px 0 40px;
          color: var(--mut);
          font-size: 15px;
        }
        .landing-page .fg {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 48px;
        }
        .landing-page .fg h4 {
          color: var(--ink);
          font-size: 15px;
          margin-bottom: 14px;
        }
        .landing-page .fg a {
          display: block;
          padding: 5px 0;
        }
        .landing-page .fg a:hover {
          color: var(--ink);
        }
        .landing-page .fg p {
          max-width: 26em;
          margin-top: 14px;
        }
        .landing-page .legal {
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid var(--ln);
          font-size: 13px;
          line-height: 1.7;
        }
        @media (max-width: 900px) {
          .landing-page .lk, .landing-page .end .btn.g {
            display: none;
          }
          .landing-page .menu {
            display: grid;
            place-items: center;
          }
          .landing-page .hero {
            padding: 48px 0 64px;
          }
          .landing-page .hero .wrap, .landing-page .split {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .landing-page section {
            padding: 68px 0;
          }
          .landing-page .infra .wrap,
          .landing-page .stats,
          .landing-page .feats,
          .landing-page .path,
          .landing-page .fg {
            grid-template-columns: 1fr;
          }
          .landing-page .feats {
            gap: 32px;
          }
          .landing-page .path::before {
            display: none;
          }
          .landing-page .stat + .stat {
            border-left: 0;
            border-top: 1px solid var(--ln);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .landing-page {
            scroll-behavior: auto;
          }
          .landing-page * {
            transition: none !important;
          }
        }
      ` }} />

      {/* ── SVG Symbol Definitions ── */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <symbol id="i-check" viewBox="0 0 24 24">
            <path d="M5 12l5 5 9-10" />
          </symbol>
          <symbol id="i-shield" viewBox="0 0 24 24">
            <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
            <path d="M9 12l2 2 4-4" />
          </symbol>
          <symbol id="i-bank" viewBox="0 0 24 24">
            <path d="M3 10l9-6 9 6M5 10v8m4-8v8m6-8v8m4-8v8M3 20h18" />
          </symbol>
          <symbol id="i-book" viewBox="0 0 24 24">
            <path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19V5" />
          </symbol>
          <symbol id="i-scan" viewBox="0 0 24 24">
            <path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3M8 12h8" />
          </symbol>
          <symbol id="i-coin" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v8M9.5 10.5c0-1 1-1.5 2.5-1.5s2.5.5 2.5 1.5-1 1.3-2.5 1.5-2.5.5-2.5 1.5 1 1.5 2.5 1.5 2.5-.5 2.5-1.5" />
          </symbol>
          <symbol id="i-drop" viewBox="0 0 24 24">
            <path d="M12 3s6 6.2 6 10.5a6 6 0 01-12 0C6 9.2 12 3 12 3z" />
          </symbol>
          <symbol id="i-users" viewBox="0 0 24 24">
            <circle cx="9" cy="8" r="3" />
            <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.5a3 3 0 010 5.5M18 14.5c2 .7 3 2.8 3 5.5" />
          </symbol>
          <symbol id="i-mark" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="9" fill="var(--br)" />
            <path d="M20.5 8.5a8.5 8.5 0 100 15 7 7 0 010-15z" fill="var(--onb)" />
            <circle cx="21.5" cy="11" r="1.5" fill="var(--onb)" />
          </symbol>
        </defs>
      </svg>

      <a className="skip" href="#main">Skip to content</a>

      {/* ── Sticky Header ── */}
      <header>
        <div className="wrap">
          <nav aria-label="Main">
            <Link className="logo" href="#top" aria-label="Roziq home">
              <svg><use href="#i-mark" /></svg>
              <span>Roziq</span>
            </Link>
            <div className="lk">
              <a href="#features">Features</a>
              <a href="#zakat">Zakat</a>
              <a href="#standards">Standards</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="end">
              <Link className="btn p s" href="/dashboard">
                Get started
              </Link>
              <button
                className="menu"
                id="mb"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mm"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
            </div>
          </nav>
        </div>
        <div id="mm" className={menuOpen ? 'open' : ''}>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#zakat" onClick={() => setMenuOpen(false)}>Zakat</a>
          <a href="#standards" onClick={() => setMenuOpen(false)}>Standards</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--br)', marginTop: 8 }}
          >
            Go to App →
          </Link>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main id="main">
        <span id="top" />

        {/* ── Hero ── */}
        <div className="hero">
          <div className="wrap">
            <div>
              <h1>Invest in Pakistan, the halal way.</h1>
              <p className="lead">
                Shariah-screened stocks, automated Zakat and an AI Mufti who answers in Urdu or English. One trusted place for your halal wealth.
              </p>
              <div className="cta">
                <Link className="btn p" href="/dashboard">
                  Get started
                </Link>
                <a className="txt" href="#features">
                  See how it works
                </a>
              </div>
              <div className="trust">
                <span>
                  <svg className="ic"><use href="#i-check" /></svg>
                  AAOIFI standards
                </span>
                <span>
                  <svg className="ic"><use href="#i-check" /></svg>
                  Riba-free
                </span>
                <span>
                  <svg className="ic"><use href="#i-check" /></svg>
                  Urdu and English
                </span>
              </div>
            </div>

            {/* Shariah Screener Card */}
            <div className="card scr" aria-label="Shariah screener">
              <div className="hd">
                <span>Shariah screener</span>
                <span className="tag">PSX</span>
              </div>
              <div className="tabs" role="group" aria-label="Filter results">
                <button
                  type="button"
                  aria-pressed={filter === 'all'}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button
                  type="button"
                  aria-pressed={filter === 'ok'}
                  onClick={() => setFilter('ok')}
                >
                  Halal
                </button>
                <button
                  type="button"
                  aria-pressed={filter === 'no'}
                  onClick={() => setFilter('no')}
                >
                  Excluded
                </button>
              </div>
              <div id="rows" aria-live="polite">
                {filteredStocks.map(stock => (
                  <div key={stock.name} className="row">
                    <b>{stock.name}</b>
                    <span className="sc">{stock.score.toFixed(1)}</span>
                    <span className={`tag o ${stock.compliant ? '' : 'x'}`}>
                      {stock.compliant ? 'Compliant' : 'Excluded'}
                    </span>
                  </div>
                ))}
              </div>
              <p className="foot">Example results for illustration. Scores are out of 10.</p>
            </div>
          </div>
        </div>

        {/* ── Infrastructure ── */}
        <div className="infra">
          <div className="wrap">
            <div className="it">
              <svg className="ic"><use href="#i-bank" /></svg>
              <div>
                <h3>Licensed brokers</h3>
                <p>PSX execution under SECP rules.</p>
              </div>
            </div>
            <div className="it">
              <svg className="ic"><use href="#i-coin" /></svg>
              <div>
                <h3>Raast payments</h3>
                <p>Instant PKR deposits and withdrawals.</p>
              </div>
            </div>
            <div className="it">
              <svg className="ic"><use href="#i-book" /></svg>
              <div>
                <h3>Shariah board</h3>
                <p>Independent scholar reviews.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Features ── */}
        <section id="features">
          <div className="wrap">
            <h2>Everything you need to invest with confidence</h2>
            <p className="sub">Screening, Zakat, purification and savings in one platform.</p>
            <div className="feats">
              <div className="f">
                <svg className="ic"><use href="#i-scan" /></svg>
                <h3>Screened stocks</h3>
                <p>Every PSX stock is checked for debt and impure income before you see it.</p>
              </div>
              <div className="f">
                <svg className="ic"><use href="#i-coin" /></svg>
                <h3>Automated Zakat</h3>
                <p>Nisab and 2.5% worked out from live gold and silver prices.</p>
              </div>
              <div className="f">
                <svg className="ic"><use href="#i-drop" /></svg>
                <h3>Dividend purification</h3>
                <p>The impure share of each dividend is set aside for charity.</p>
              </div>
              <div className="f">
                <svg className="ic"><use href="#i-users" /></svg>
                <h3>Sukuk and kameti</h3>
                <p>Riba-free ways to save and grow with your community.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Zakat Calculator ── */}
        <section className="alt" id="zakat">
          <div className="wrap split">
            <div>
              <h2>Know your Zakat in seconds</h2>
              <p className="sub" style={{ marginBottom: 0 }}>
                Enter your eligible wealth for a quick estimate. In the app, Roziq checks the nisab with live gold and silver prices.
              </p>
            </div>
            <div className="card calc">
              <label htmlFor="amt">Eligible wealth</label>
              <div className="in">
                <span>PKR</span>
                <input
                  id="amt"
                  inputMode="numeric"
                  value={amt}
                  onChange={handleAmtChange}
                  aria-describedby="zr"
                />
              </div>
              <div className="res" id="zr">
                <span style={{ color: 'var(--mut)' }}>Estimated Zakat (2.5%)</span>
                <b id="zo">PKR {zakatEstimated.toLocaleString('en-US')}</b>
              </div>
            </div>
          </div>
        </section>

        {/* ── Standards ── */}
        <section id="standards">
          <div className="wrap">
            <h2>Three tests every company must pass</h2>
            <p className="sub">Every stock is screened to global Islamic standards.</p>
            <div className="stats">
              <div className="stat">
                <div className="num">33%</div>
                <h3>Debt limit</h3>
                <p>Interest-bearing debt must stay under 33% of market cap.</p>
              </div>
              <div className="stat">
                <div className="num">5%</div>
                <h3>Impure income</h3>
                <p>Any impure income is fully purified through charity.</p>
              </div>
              <div className="stat">
                <div className="num">10%</div>
                <h3>Real assets</h3>
                <p>At least 10% of total assets must be tangible.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── AI Mufti Conversation ── */}
        <section className="alt">
          <div className="wrap split">
            <div>
              <h2>Ask the AI Mufti, in your language</h2>
              <p className="sub" style={{ marginBottom: 0 }}>
                Type or speak in Urdu or English and get a clear answer on whether a stock, dividend or deal is halal.
              </p>
            </div>
            <div className="card chat" aria-label="Example conversation">
              <div className="b q">Is my portfolio halal?</div>
              <div className="b a">4 of your 5 holdings pass screening. One needs a small dividend purification.</div>
              <div className="b q ur">زکوٰۃ کتنی بنتی ہے؟</div>
            </div>
          </div>
        </section>

        {/* ── Four Steps ── */}
        <section id="how">
          <div className="wrap">
            <h2>Four steps to halal growth</h2>
            <p className="sub">From sign-up to Zakat, in one app.</p>
            <div className="path">
              <div className="pt">
                <span>1</span>
                <h3>Sign up</h3>
                <p>Create your account.</p>
              </div>
              <div className="pt">
                <span>2</span>
                <h3>Screen</h3>
                <p>Every asset is checked.</p>
              </div>
              <div className="pt">
                <span>3</span>
                <h3>Grow</h3>
                <p>Invest and purify dividends.</p>
              </div>
              <div className="pt">
                <span>4</span>
                <h3>Preserve</h3>
                <p>Zakat and inheritance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="alt" id="faq">
          <div className="wrap">
            <h2>Questions, answered</h2>
            <p className="sub"></p>
            <details>
              <summary>Is Roziq a licensed broker?</summary>
              <p>Roziq places PSX orders through licensed brokers under SECP rules.</p>
            </details>
            <details>
              <summary>Which Shariah standards do you use?</summary>
              <p>Screening follows AAOIFI standards and PSX Shariah criteria for debt, income and assets, with independent scholar review.</p>
            </details>
            <details>
              <summary>How does dividend purification work?</summary>
              <p>The impure share of a dividend is calculated, set aside, and routed to charity.</p>
            </details>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section style={{ padding: '0 0 104px' }}>
          <div className="wrap">
            <div className="final">
              <h2>Start investing the halal way</h2>
              <p>Create your free account in minutes. Screened stocks, automated Zakat and Riba-free savings.</p>
              <Link className="btn p" href="/dashboard">
                Get started
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer>
        <div className="wrap">
          <div className="fg">
            <div>
              <Link className="logo" href="#top" style={{ padding: 0 }}>
                <svg><use href="#i-mark" /></svg>
                <span>Roziq</span>
              </Link>
              <p>The halal wealth platform for Pakistan. Shariah-compliant investing, Zakat and savings in one place.</p>
            </div>
            <div>
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#zakat">Zakat calculator</a>
              <a href="#standards">Standards</a>
              <a href="#faq">FAQ</a>
            </div>
          </div>
          <p className="legal">
            © 2026 Roziq. All rights reserved. Investing in securities involves risk, including loss of capital, and past performance does not guarantee future results. Zakat figures are estimates; consult a qualified scholar for rulings specific to your situation.
          </p>
        </div>
      </footer>
    </div>
  );
}
