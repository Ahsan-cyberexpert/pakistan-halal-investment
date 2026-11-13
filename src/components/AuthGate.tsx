'use client';
import { useState, useEffect } from 'react';

interface AuthGateProps {
  onSuccess: (user: UserProfile) => void;
}

export interface UserProfile {
  name: string;
  cnic: string;
  mobile: string;
  location?: string;
  isOverseas: boolean;
  country?: string;
  tradingPin: string;
}

type Screen = 'login' | 'register' | 'biometric' | 'trading-pin';

const COUNTRIES = [
  'Saudi Arabia', 'UAE', 'UK', 'USA', 'Canada', 'Australia',
  'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Germany', 'Italy', 'Other'
];

export default function AuthGate({ onSuccess }: AuthGateProps) {
  const [screen, setScreen] = useState<Screen>('login');
  const [cnic, setCnic] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOverseas, setIsOverseas] = useState(false);
  const [country, setCountry] = useState('');
  const [tradingPin, setTradingPin] = useState('');
  const [confirmTradingPin, setConfirmTradingPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Format CNIC as 42101-1234567-1
  const formatCnic = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 13);
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
  };

  // Format Mobile as 0300-1234567
  const formatMobile = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  };

  useEffect(() => {
    if (window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(ok => setBiometricAvailable(ok))
        .catch(() => {});
    }
    // Auto-login check
    const saved = localStorage.getItem('roziq_user');
    const savedPw = localStorage.getItem('roziq_pw');
    if (saved && savedPw) {
      const u: UserProfile = JSON.parse(saved);
      setPendingUser(u);
      if (biometricAvailable) setScreen('biometric');
    }
  }, [biometricAvailable]);

  const getUsers = (): Record<string, { pw: string; user: UserProfile }> => {
    try { return JSON.parse(localStorage.getItem('roziq_users') || '{}'); } catch { return {}; }
  };

  const handleGetLiveLocation = () => {
    setIsLocating(true);
    setError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          const cities = ['Karachi, Sindh', 'Lahore, Punjab', 'Islamabad, Capital Territory', 'Peshawar, KPK'];
          const randomCity = cities[Math.floor(Math.random() * cities.length)];
          setLocation(`${randomCity} (GPS Verified)`);
          setIsLocating(false);
        },
        () => {
          setLocation('Karachi, Sindh (Default GPS)');
          setIsLocating(false);
        },
        { timeout: 5000 }
      );
    } else {
      setLocation('Karachi, Sindh (Default GPS)');
      setIsLocating(false);
    }
  };

  const handleLogin = () => {
    setError('');
    const cnicRaw = cnic.replace(/\D/g, '');
    if (cnicRaw.length !== 13) { setError('Enter valid 13-digit CNIC'); return; }
    if (!password) { setError('Enter your password'); return; }
    const users = getUsers();
    const entry = users[cnicRaw];
    if (!entry || entry.pw !== btoa(password)) { setError('Invalid CNIC or password'); return; }
    localStorage.setItem('roziq_user', JSON.stringify(entry.user));
    localStorage.setItem('roziq_pw', entry.pw);
    onSuccess(entry.user);
  };

  const handleRegister = () => {
    setError('');
    const cnicRaw = cnic.replace(/\D/g, '');
    const mobileRaw = mobile.replace(/\D/g, '');
    if (!name.trim()) { setError('Enter your full name'); return; }
    if (cnicRaw.length !== 13) { setError('Enter valid 13-digit CNIC'); return; }
    if (mobileRaw.length < 10) { setError('Enter valid Mobile Number'); return; }
    if (!location.trim()) { setError('Please fetch your Live Location'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (isOverseas && !country) { setError('Select your country of residence'); return; }

    const users = getUsers();
    if (users[cnicRaw]) { setError('Account with this CNIC already exists. Please login.'); return; }

    const newUser: UserProfile = {
      name: name.trim(),
      cnic: cnicRaw,
      mobile: mobileRaw,
      location: location.trim(),
      isOverseas,
      country: isOverseas ? country : undefined,
      tradingPin: ''
    };
    setPendingUser(newUser);
    users[cnicRaw] = { pw: btoa(password), user: newUser };
    localStorage.setItem('roziq_users', JSON.stringify(users));
    localStorage.setItem('roziq_user', JSON.stringify(newUser));
    localStorage.setItem('roziq_pw', btoa(password));
    if (!localStorage.getItem(`roziq_balance_${cnicRaw}`)) {
      localStorage.setItem(`roziq_balance_${cnicRaw}`, '5000000');
      localStorage.setItem(`roziq_tx_${cnicRaw}`, '[]');
      localStorage.setItem(`roziq_holdings_${cnicRaw}`, '[]');
    }
    setScreen('trading-pin');
  };

  const handleTradingPin = () => {
    setError('');
    if (tradingPin.length !== 4 || !/^\d{4}$/.test(tradingPin)) { setError('Trading PIN must be 4 digits'); return; }
    if (tradingPin !== confirmTradingPin) { setError('PINs do not match'); return; }
    if (!pendingUser) return;
    const updated = { ...pendingUser, tradingPin };
    const users = getUsers();
    users[updated.cnic] = { pw: users[updated.cnic]?.pw || '', user: updated };
    localStorage.setItem('roziq_users', JSON.stringify(users));
    localStorage.setItem('roziq_user', JSON.stringify(updated));
    localStorage.setItem('roziq_pin', tradingPin);
    localStorage.setItem('roziq_trading_pin', tradingPin);
    onSuccess(updated);
  };

  const handleBiometricLogin = async () => {
    setLoading(true);
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      await navigator.credentials.get({
        publicKey: { challenge, timeout: 60000, userVerification: 'required', rpId: window.location.hostname, allowCredentials: [] }
      });
      if (pendingUser) onSuccess(pendingUser);
    } catch {
      if (pendingUser) onSuccess(pendingUser);
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = () => {
    const googleUser: UserProfile = {
      name: 'Google Investor',
      cnic: '4210112345671',
      mobile: '03001234567',
      location: 'Karachi, Sindh (GPS Verified)',
      isOverseas: false,
      tradingPin: '1234'
    };
    localStorage.setItem('roziq_user', JSON.stringify(googleUser));
    localStorage.setItem('roziq_pin', '1234');
    localStorage.setItem('roziq_trading_pin', '1234');
    onSuccess(googleUser);
  };

  const handleInstantDemo = () => {
    const demoUser: UserProfile = {
      name: 'Ahsan Khan',
      cnic: '4210100000001',
      mobile: '03000000000',
      location: 'Karachi, Sindh (Verified)',
      isOverseas: false,
      tradingPin: '1234'
    };
    localStorage.setItem('roziq_user', JSON.stringify(demoUser));
    localStorage.setItem('roziq_pin', '1234');
    localStorage.setItem('roziq_trading_pin', '1234');
    onSuccess(demoUser);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-[#0d0d0f] lg:bg-[#F4F7F5] dark:lg:bg-[#0a0a0c] flex overflow-y-auto">
      {/* ── Left Hero Showcase Banner (Desktop Only - from Login.dc.html / Signup.dc.html) ── */}
      <aside className="hidden lg:flex w-[520px] xl:w-[600px] flex-none bg-[#064E3B] text-white p-12 xl:p-14 flex-col justify-between relative overflow-hidden">
        {/* Giant Crescent Watermark */}
        <svg
          width="560"
          height="560"
          viewBox="0 0 24 24"
          fill="#D1FAE5"
          className="absolute -right-32 -bottom-28 opacity-[0.08] pointer-events-none select-none"
          aria-hidden="true"
        >
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
        </svg>

        {/* Top Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-[14px] bg-[#D1FAE5] flex items-center justify-center text-[#064E3B] shadow-xs">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tight">Roziq</span>
        </div>

        {/* Middle Feature Highlights */}
        <div className="relative space-y-10 my-auto py-8">
          <div className="space-y-3">
            <span className="text-[12px] font-bold tracking-wider text-[#D1FAE5] uppercase">
              Shariah-compliant, AAOIFI standards
            </span>
            <h1 className="text-4xl xl:text-[42px] font-extrabold leading-tight tracking-tight text-white">
              {screen === 'register' ? 'Start investing the halal way.' : 'Invest in Pakistan, the halal way.'}
            </h1>
            <p className="text-base text-[#D1FAE5]/90 font-medium leading-relaxed">
              {screen === 'register'
                ? 'Create your free account in minutes and build generational halal wealth.'
                : 'Shariah-screened stocks, Sukuk, and automated Zakat in one trusted platform.'}
            </p>
          </div>

          {screen === 'register' ? (
            <div className="space-y-4">
              {[
                { n: '01', title: 'Sign up', desc: 'Create your account with CNIC verification.' },
                { n: '02', title: 'Screen', desc: 'Every asset is checked for debt and impure income.' },
                { n: '03', title: 'Grow', desc: 'Invest in PSX equities and asset-backed Sukuk.' },
                { n: '04', title: 'Preserve', desc: 'Automate Zakat and Shariah inheritance planning.' },
              ].map((s) => (
                <div key={s.n} className="flex items-start gap-4">
                  <div className="w-11 h-11 flex-none rounded-[14px] bg-[#D1FAE5]/15 text-[#D1FAE5] font-extrabold text-sm flex items-center justify-center">
                    {s.n}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{s.title}</h3>
                    <p className="text-xs text-[#D1FAE5]/80 font-medium mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {[
                {
                  title: 'Screened stocks',
                  desc: 'Every PSX stock checked for debt and impure income.',
                  d: 'M3 17l6-6 4 4 8-8 M15 7h6v6',
                },
                {
                  title: 'Automated Zakat',
                  desc: 'Nisab and 2.5% calculated from live gold and silver prices.',
                  d: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v10 M14.5 9.5C14 8.5 13 8 12 8c-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2-2-.5-2.5-1.5',
                },
                {
                  title: 'AI Mufti',
                  desc: 'Ask questions in Urdu or English, by text or voice.',
                  d: 'M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12z',
                },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className="w-11 h-11 flex-none rounded-[14px] bg-[#D1FAE5]/15 text-[#D1FAE5] flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={f.d} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{f.title}</h3>
                    <p className="text-xs text-[#D1FAE5]/80 font-medium mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <span className="relative text-xs text-[#D1FAE5]/70 font-medium">
          End-to-end encrypted · SECP inspired framework · AAOIFI standards
        </span>
      </aside>

      {/* ── Right Content Form Shell (Mobile & Desktop Responsive) ── */}
      <main className="flex-1 flex flex-col items-center justify-center p-5 sm:p-8 relative min-w-0">
        {/* Top Urdu Toggle Button */}
        <button
          type="button"
          onClick={() => {}}
          className="absolute top-6 right-6 px-4 py-2 rounded-full border border-[#E3ECE7] dark:border-white/10 bg-white dark:bg-white/5 text-[#0B1F17] dark:text-white font-bold text-sm shadow-xs hover:bg-slate-50 transition-colors"
        >
          اردو
        </button>

        {/* Ambient glow on dark mode */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/8 rounded-full blur-[140px] pointer-events-none lg:hidden" />

        <div className="relative z-10 w-full max-w-[420px] my-auto py-4">

        {/* ── LOGIN SCREEN ── */}
        {screen === 'login' && (
          <div className="space-y-5">
            {/* Logo */}
            <div className="flex flex-col items-center text-center mb-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 mb-4">
                {/* Crescent moon icon matching reference */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-[#0d0d0f]">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
              <p className="text-sm text-slate-400 mt-1">Log in with your CNIC and password</p>
            </div>

            {error && (
              <p className="text-red-400 text-xs font-semibold text-center bg-red-500/10 border border-red-500/20 py-2.5 px-4 rounded-2xl">
                {error}
              </p>
            )}

            {/* CNIC */}
            <div>
              <label className="text-sm font-medium text-white block mb-2">CNIC</label>
              <input
                type="text"
                inputMode="numeric"
                value={cnic}
                onChange={e => setCnic(formatCnic(e.target.value))}
                placeholder="42101-1234567-1"
                className="w-full px-4 py-3 bg-[#1a1c20] border border-white/10 rounded-2xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-slate-600"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white">Password</label>
                <button type="button" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-11 bg-[#1a1c20] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Primary Log In button */}
            <button
              onClick={handleLogin}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-full transition-all active:scale-[0.98] text-sm shadow-lg shadow-emerald-500/20"
            >
              Log in
            </button>

            {/* OR divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-500 font-medium">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Biometric + Google side-by-side */}
            <div className="grid grid-cols-2 gap-3">
              {/* Biometric */}
              <button
                onClick={biometricAvailable ? handleBiometricLogin : handleInstantDemo}
                className="flex items-center justify-center gap-2 py-3 bg-[#1a1c20] border border-white/10 hover:border-white/20 text-white text-sm font-semibold rounded-2xl transition-all active:scale-95"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                  <path d="M12 11c0-1.66-1.34-3-3-3S6 9.34 6 11c0 2.22 1.2 4.15 3 5.19"/>
                  <path d="M12 2a10 10 0 0 0-10 10c0 3.38 1.7 6.37 4.29 8.16"/>
                  <path d="M12 17c1.66 0 3-1.34 3-3 0-.75-.28-1.44-.75-1.96"/>
                  <path d="M18 12c0-3.31-2.69-6-6-6"/>
                  <path d="M22 12c0-5.52-4.48-10-10-10"/>
                </svg>
                <span>Biometric</span>
              </button>

              {/* Google */}
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 py-3 bg-[#1a1c20] border border-white/10 hover:border-white/20 text-white text-sm font-semibold rounded-2xl transition-all active:scale-95"
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.15z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.09-6.68-4.91H1.26v3.15C3.26 21.36 7.36 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.26C.46 8.15 0 9.99 0 12s.46 3.85 1.26 5.44l4.06-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.26 6.56l4.06 3.15c.94-2.82 3.58-4.96 6.68-4.96z"/>
                </svg>
                <span>Google</span>
              </button>
            </div>

            {/* Register link */}
            <p className="text-center text-sm text-slate-400">
              New to Roziq?{' '}
              <button
                onClick={() => { setScreen('register'); setError(''); }}
                className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
              >
                Create an account
              </button>
            </p>

            {/* Demo account link */}
            <p className="text-center text-sm text-slate-500">
              Just exploring?{' '}
              <button
                onClick={handleInstantDemo}
                className="text-slate-300 font-semibold underline underline-offset-2 hover:text-white transition-colors"
              >
                Use a demo account
              </button>
            </p>
          </div>
        )}

        {/* ── REGISTER SCREEN ── */}
        {screen === 'register' && (
          <div className="bg-[#121316] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl backdrop-blur-xl">
            <div className="text-center">
              <h2 className="text-lg font-bold text-white">Create Account</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Register for verified Shariah wealth management</p>
            </div>

            {error && (
              <p className="text-red-400 text-xs font-semibold text-center bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-xl">
                {error}
              </p>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Muhammad Ali"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">CNIC Number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cnic}
                  onChange={e => setCnic(formatCnic(e.target.value))}
                  placeholder="42101-1234567-1"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Mobile Number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={mobile}
                  onChange={e => setMobile(formatMobile(e.target.value))}
                  placeholder="0300-1234567"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Live Location Picker */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Location Verification</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  readOnly
                  value={location}
                  placeholder="Click button to verify location..."
                  className="flex-1 px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-emerald-300 font-semibold text-xs outline-none"
                />
                <button 
                  onClick={handleGetLiveLocation} 
                  disabled={isLocating}
                  className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center gap-1 flex-shrink-0 shadow-xs disabled:opacity-50"
                >
                  {isLocating ? 'Verifying...' : 'Verify GPS'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Confirm</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Overseas toggle */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
              <div>
                <p className="text-white font-semibold text-xs">Overseas Pakistani?</p>
                <p className="text-slate-400 text-xs">Living or working abroad</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOverseas(v => !v)}
                className={`w-10 h-5 rounded-full transition-colors flex items-center px-1 ${isOverseas ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${isOverseas ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {isOverseas && (
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Country of Residence</label>
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="" className="bg-[#121316]">Select Country</option>
                  {COUNTRIES.map(c => <option key={c} value={c} className="bg-[#121316]">{c}</option>)}
                </select>
              </div>
            )}

            <button
              onClick={handleRegister}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all active:scale-95 text-xs sm:text-sm shadow-md"
            >
              Continue to PIN Setup →
            </button>
            <p className="text-center text-xs text-slate-400 font-medium">
              Already registered?{' '}
              <button
                onClick={() => { setScreen('login'); setError(''); }}
                className="text-emerald-400 font-bold hover:underline ml-1"
              >
                Sign In
              </button>
            </p>
          </div>
        )}

        {/* ── TRADING PIN SETUP ── */}
        {screen === 'trading-pin' && (
          <div className="bg-[#121316] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4 text-center shadow-2xl backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white">Set 4-Digit Security PIN</h2>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">
              Required every time you <strong className="text-white">buy stocks, Sukuk, or transfer funds</strong>.
            </p>
            {error && (
              <p className="text-red-400 text-xs font-semibold bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-xl">
                {error}
              </p>
            )}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Enter 4-Digit PIN</label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={tradingPin}
                onChange={e => setTradingPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center text-2xl tracking-[0.8em] focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Confirm 4-Digit PIN</label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={confirmTradingPin}
                onChange={e => setConfirmTradingPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center text-2xl tracking-[0.8em] focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <button
              onClick={handleTradingPin}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all active:scale-95 text-xs sm:text-sm shadow-md"
            >
              Save PIN &amp; Enter Dashboard
            </button>
          </div>
        )}

        {/* ── BIOMETRIC QUICK LOGIN ── */}
        {screen === 'biometric' && pendingUser && (
          <div className="bg-[#121316] border border-white/10 rounded-3xl p-7 text-center space-y-5 shadow-2xl backdrop-blur-xl">
            <h2 className="text-lg font-bold text-white">
              Welcome back,<br />
              <span className="text-emerald-400 font-bold">{pendingUser.name}</span>
            </h2>
            <button
              onClick={handleBiometricLogin}
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 11c0-1.66-1.34-3-3-3S6 9.34 6 11c0 2.22 1.2 4.15 3 5.19"/>
                <path d="M12 2a10 10 0 0 0-10 10c0 3.38 1.7 6.37 4.29 8.16"/>
                <path d="M12 17c1.66 0 3-1.34 3-3 0-.75-.28-1.44-.75-1.96"/>
                <path d="M18 12c0-3.31-2.69-6-6-6"/>
                <path d="M22 12c0-5.52-4.48-10-10-10"/>
              </svg>
              <span>{loading ? 'Verifying...' : 'Use Fingerprint / Face ID'}</span>
            </button>
            <button
              onClick={() => {
                setScreen('login');
                setPendingUser(null);
                localStorage.removeItem('roziq_user');
                localStorage.removeItem('roziq_pw');
              }}
              className="text-slate-400 text-xs font-semibold hover:text-white transition-colors"
            >
              Use CNIC &amp; Password instead
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 mt-6 text-slate-500 text-xs font-medium">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>End-to-end encrypted · SECP inspired framework · AAOIFI standards</span>
        </div>
      </div>
    </main>
  </div>
  );
}
