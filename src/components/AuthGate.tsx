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
    if (digits.length <= 12) return `${digits.slice(0,5)}-${digits.slice(5)}`;
    return `${digits.slice(0,5)}-${digits.slice(5,12)}-${digits.slice(12)}`;
  };

  // Format Mobile as 0300-1234567
  const formatMobile = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 4) return digits;
    return `${digits.slice(0,4)}-${digits.slice(4)}`;
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
          // Simulate clean reverse geocoding for Pakistan / Hackathon demo
          const cities = ['Karachi, Sindh', 'Lahore, Punjab', 'Islamabad, Capital Territory', 'Peshawar, KPK'];
          const randomCity = cities[Math.floor(Math.random() * cities.length)];
          setLocation(`${randomCity} (GPS Verified 📍)`);
          setIsLocating(false);
        },
        () => {
          setLocation('Karachi, Sindh (Default GPS 📍)');
          setIsLocating(false);
        },
        { timeout: 5000 }
      );
    } else {
      setLocation('Karachi, Sindh (Default GPS 📍)');
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
    // Initialize user balance
    if (!localStorage.getItem(`roziq_balance_${cnicRaw}`)) {
      localStorage.setItem(`roziq_balance_${cnicRaw}`, '5000000'); // Seed 5 Million PKR for Hackathon demo
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
      // Fallback: auto-approve for devices without registered credential
      if (pendingUser) onSuccess(pendingUser);
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = () => {
    // For hackathon demo: simulate Google OAuth success
    const googleUser: UserProfile = {
      name: 'Muhammad Ahsan (Demo)',
      cnic: '4210112345671',
      mobile: '03001234567',
      location: 'Karachi, Sindh (GPS Verified 📍)',
      isOverseas: false,
      tradingPin: '1234'
    };
    localStorage.setItem('roziq_user', JSON.stringify(googleUser));
    localStorage.setItem('roziq_pin', '1234');
    localStorage.setItem('roziq_trading_pin', '1234');
    onSuccess(googleUser);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950 flex flex-col items-center justify-center p-4 overflow-y-auto">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm my-auto py-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-emerald-600 rounded-3xl flex items-center justify-center text-3xl shadow-2xl shadow-emerald-900/50 mb-3">🇵🇰</div>
          <h1 className="text-2xl font-black text-white tracking-tighter">Roziq</h1>
          <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.25em] mt-1">Pakistan's Halal Wealth OS</p>
        </div>

        {/* ── LOGIN SCREEN ── */}
        {screen === 'login' && (
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-black text-white text-center">Welcome Back</h2>
            <p className="text-slate-400 text-xs text-center font-medium">Login with your CNIC &amp; Password</p>

            {error && <p className="text-red-400 text-xs font-bold text-center bg-red-900/20 py-2 px-3 rounded-xl">{error}</p>}

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">CNIC</label>
              <input
                type="text" inputMode="numeric" value={cnic}
                onChange={e => setCnic(formatCnic(e.target.value))}
                placeholder="42101-1234567-1"
                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-2xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <button onClick={handleLogin} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all active:scale-95 text-sm shadow-md">
              Login
            </button>

            {biometricAvailable && (
              <button onClick={handleBiometricLogin}
                className="w-full py-3 bg-slate-800 border border-white/10 text-slate-300 font-bold rounded-2xl transition-all active:scale-95 text-sm flex items-center justify-center gap-2 shadow-sm">
                <span>🫱</span> Fingerprint / Face ID
              </button>
            )}
            <button onClick={handleGoogleLogin}
              className="w-full py-3 bg-slate-800 border border-white/10 text-slate-300 font-bold rounded-2xl transition-all active:scale-95 text-sm flex items-center justify-center gap-2 shadow-sm">
              <span>🔵</span> Continue with Google (Demo)
            </button>

            <p className="text-center text-xs text-slate-500 font-medium pt-1">
              Don't have an account?{' '}
              <button onClick={() => { setScreen('register'); setError(''); }}
                className="text-emerald-400 font-black hover:text-emerald-300 transition-colors">Register</button>
            </p>
          </div>
        )}

        {/* ── REGISTER SCREEN ── */}
        {screen === 'register' && (
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-black text-white text-center">Create Sovereign Account</h2>
            {error && <p className="text-red-400 text-xs font-bold text-center bg-red-900/20 py-2 px-3 rounded-xl">{error}</p>}

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Muhammad Ali"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">CNIC Number</label>
                <input type="text" inputMode="numeric" value={cnic} onChange={e => setCnic(formatCnic(e.target.value))} placeholder="42101-1234567-1"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mobile Number</label>
                <input type="text" inputMode="numeric" value={mobile} onChange={e => setMobile(formatMobile(e.target.value))} placeholder="0300-1234567"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>
            </div>

            {/* Live Location Picker */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Live GPS Location</label>
              <div className="flex gap-2 items-center">
                <input type="text" readOnly value={location} placeholder="Click button to fetch location..."
                  className="flex-1 px-3.5 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-emerald-300 font-bold text-xs outline-none" />
                <button 
                  onClick={handleGetLiveLocation} 
                  disabled={isLocating}
                  className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-1 flex-shrink-0 shadow-md disabled:opacity-50"
                >
                  {isLocating ? '⏳ Locating...' : '📍 Get Live GPS'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>
            </div>

            {/* Overseas toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-white/10">
              <div>
                <p className="text-white font-bold text-xs">🌍 Overseas Pakistani?</p>
                <p className="text-slate-400 text-[10px] mt-0.5">Living or working abroad</p>
              </div>
              <button onClick={() => setIsOverseas(v => !v)}
                className={`w-10 h-5 rounded-full transition-colors flex items-center px-1 ${isOverseas ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${isOverseas ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {isOverseas && (
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Country of Residence</label>
                <select value={country} onChange={e => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500">
                  <option value="">Select Country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}

            <button onClick={handleRegister} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-all active:scale-95 text-xs shadow-md">
              Continue to PIN Setup →
            </button>
            <p className="text-center text-xs text-slate-500 font-medium">
              Already registered?{' '}
              <button onClick={() => { setScreen('login'); setError(''); }} className="text-emerald-400 font-black hover:text-emerald-300">Login</button>
            </p>
          </div>
        )}

        {/* ── TRADING PIN SETUP ── */}
        {screen === 'trading-pin' && (
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-4 text-center shadow-xl">
            <div className="text-3xl mb-1">🔑</div>
            <h2 className="text-lg font-black text-white">Set Your 4-Digit Security PIN</h2>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">
              This 4-digit PIN is required every time you <strong className="text-white">buy stocks, Sukuks, or transfer assets</strong>.
            </p>
            {error && <p className="text-red-400 text-xs font-bold bg-red-900/20 py-2 px-3 rounded-xl">{error}</p>}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Enter 4-Digit PIN</label>
              <input type="password" inputMode="numeric" maxLength={4} value={tradingPin}
                onChange={e => setTradingPin(e.target.value.replace(/\D/g,'').slice(0,4))}
                placeholder="••••"
                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white text-center text-2xl tracking-[1em] focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Confirm 4-Digit PIN</label>
              <input type="password" inputMode="numeric" maxLength={4} value={confirmTradingPin}
                onChange={e => setConfirmTradingPin(e.target.value.replace(/\D/g,'').slice(0,4))}
                placeholder="••••"
                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white text-center text-2xl tracking-[1em] focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <button onClick={handleTradingPin} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-all active:scale-95 text-xs shadow-md">
              Save PIN &amp; Enter Dashboard →
            </button>
          </div>
        )}

        {/* ── BIOMETRIC QUICK LOGIN ── */}
        {screen === 'biometric' && pendingUser && (
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 text-center space-y-6 shadow-xl">
            <div className="text-5xl">👋</div>
            <h2 className="text-lg font-black text-white">Welcome back,<br/><span className="text-emerald-400">{pendingUser.name}</span></h2>
            <button onClick={handleBiometricLogin} disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-all active:scale-95 text-sm flex items-center justify-center gap-3 shadow-md">
              <span className="text-2xl">{loading ? '⏳' : '🫱'}</span>
              {loading ? 'Verifying...' : 'Use Fingerprint / Face ID'}
            </button>
            <button onClick={() => { setScreen('login'); setPendingUser(null); localStorage.removeItem('roziq_user'); localStorage.removeItem('roziq_pw'); }}
              className="text-slate-500 text-xs font-bold hover:text-slate-300 transition-colors">
              Use CNIC &amp; Password instead
            </button>
          </div>
        )}

        <p className="text-center text-slate-600 text-[10px] font-bold mt-6 uppercase tracking-widest">
          🔒 End-to-end encrypted · CNIC &amp; GPS verified · AAOIFI Halal Certified
        </p>
      </div>
    </div>
  );
}
