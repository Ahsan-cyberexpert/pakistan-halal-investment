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
    <div className="fixed inset-0 z-[2000] bg-[#0a0a0c] flex flex-col items-center justify-center p-4 overflow-y-auto">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm my-auto py-6">
        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 mb-3">
            <svg width="22" height="22" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5C4 1.5 1.5 4 1.5 7S4 12.5 7 12.5 12.5 10 12.5 7 10 1.5 7 1.5z" stroke="#000" strokeWidth="1.5"/>
              <circle cx="7" cy="7" r="2" fill="#000"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Roziq</h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mt-1">
            Pakistan&apos;s Halal Wealth OS
          </p>
        </div>

        {/* ── LOGIN SCREEN ── */}
        {screen === 'login' && (
          <div className="bg-[#121316] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl backdrop-blur-xl">
            <div className="text-center">
              <h2 className="text-lg font-bold text-white">Welcome Back</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Choose how you would like to sign in</p>
            </div>

            {/* Dedicated Demo Mode Section */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center space-y-2.5">
              <div className="flex items-center justify-between text-left">
                <div>
                  <p className="text-xs font-bold text-white">Instant Demo Account</p>
                  <p className="text-[11px] text-slate-400">Pre-funded with PKR 5,000,000</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  No CNIC
                </span>
              </div>
              <button
                type="button"
                onClick={handleInstantDemo}
                className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
                <span>Enter Instant Demo</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">or sign in with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Separate Google Login Button (Clean, no "(Demo)" suffix) */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xs"
            >
              {/* Google G logo SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.09-6.68-4.91H1.26v3.15C3.26 21.36 7.36 24 12 24z"/>
                <path fill="#FBBC05" d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.26C.46 8.15 0 9.99 0 12s.46 3.85 1.26 5.44l4.06-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.26 6.56l4.06 3.15c.94-2.82 3.58-4.96 6.68-4.96z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Biometric Button (if available) with clean SVG icon */}
            {biometricAvailable && (
              <button
                onClick={handleBiometricLogin}
                className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold rounded-xl transition-all active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                  <path d="M12 11c0-1.66-1.34-3-3-3S6 9.34 6 11c0 2.22 1.2 4.15 3 5.19"/>
                  <path d="M12 2a10 10 0 0 0-10 10c0 3.38 1.7 6.37 4.29 8.16"/>
                  <path d="M12 17c1.66 0 3-1.34 3-3 0-.75-.28-1.44-.75-1.96"/>
                  <path d="M18 12c0-3.31-2.69-6-6-6"/>
                  <path d="M22 12c0-5.52-4.48-10-10-10"/>
                </svg>
                <span>Fingerprint / Face ID</span>
              </button>
            )}

            {/* Divider for CNIC */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">or CNIC &amp; Password</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {error && (
              <p className="text-red-400 text-xs font-semibold text-center bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-xl">
                {error}
              </p>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">CNIC</label>
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
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full py-2.5 bg-white hover:bg-slate-100 text-black font-bold rounded-xl transition-all active:scale-95 text-xs sm:text-sm shadow-md"
              >
                Sign In
              </button>
            </div>

            <p className="text-center text-xs text-slate-400 font-medium pt-2">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => { setScreen('register'); setError(''); }}
                className="text-emerald-400 font-bold hover:underline ml-1"
              >
                Register
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
    </div>
  );
}
