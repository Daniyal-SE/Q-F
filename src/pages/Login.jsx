import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

// ─── Hardcoded user accounts ──────────────────────────────────────────────────
const USERS = [
  { username: 'tayyab4855', password: 'abcd1234', pin: '0319' },
  { username: 'admin',      password: 'admin123', pin: '1234' },
];

const BG = 'https://image.tmdb.org/t/p/original/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg';

export default function Login() {
  const navigate = useNavigate();

  // step: 'login' → 'pin'
  const [step, setStep] = useState('login');

  // ── Login fields ───────────────────────────────────────────────────────────
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');

  // ── PIN fields ─────────────────────────────────────────────────────────────
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  // ── Step 1: verify credentials ─────────────────────────────────────────────
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const user = USERS.find(
      (u) => u.username === username.trim() && u.password === password
    );
    if (user) {
      setLoginError('');
      // Store username so PIN step knows who logged in
      sessionStorage.setItem('cinestream_user', user.username);
      setStep('pin');
    } else {
      setLoginError('Invalid username or password. Please try again.');
    }
  };

  // ── Step 2: verify PIN ─────────────────────────────────────────────────────
  const handlePinSubmit = (e) => {
    e.preventDefault();
    const activeUser = sessionStorage.getItem('cinestream_user');
    const userConfig = USERS.find(u => u.username === activeUser) || { pin: '1234' };

    if (pin === userConfig.pin) {
      // Full session granted
      sessionStorage.setItem('cinestream_session', 'active');
      navigate('/', { replace: true });
    } else {
      setPinError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="auth-page" style={{ backgroundImage: `url(${BG})` }}>
      <div className="auth-page__overlay" />

      {/* Left branding */}
      <div className="auth-page__brand">
        <span className="auth-logo">CINESTREAM</span>
        <div className="auth-brand__bottom">
          <p className="auth-brand__tagline">
            Experience the future of theatrical storytelling. Your premium command
            center for global cinema and elite anime.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-page__form-panel">
        <div className="auth-form-card glass">

          {step === 'login' ? (
            /* ── STEP 1: Login ─────────────────────────────────────────────── */
            <>
              <h1 className="auth-form-card__title">Welcome Back</h1>
              <p className="auth-form-card__subtitle">
                Sign in to your CineStream account.
              </p>

              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label label">Username</label>
                  <div className="form-input-wrap">
                    <User size={16} strokeWidth={1.5} className="form-input-icon" />
                    <input
                      id="login-username"
                      type="text"
                      className="form-input"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label label">Password</label>
                  <div className="form-input-wrap">
                    <Lock size={16} strokeWidth={1.5} className="form-input-icon" />
                    <input
                      id="login-password"
                      type={showPass ? 'text' : 'password'}
                      className="form-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ paddingRight: '48px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <p style={{ color: 'var(--primary)', fontSize: '13px', margin: '-8px 0 4px' }}>
                    {loginError}
                  </p>
                )}

                <button type="submit" className="btn btn--primary btn--lg btn--full-width" style={{ width: '100%' }}>
                  Continue
                </button>
              </form>
            </>
          ) : (
            /* ── STEP 2: PIN ───────────────────────────────────────────────── */
            <>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'rgba(229,9,20,0.15)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
                }}>
                  <Lock size={24} color="var(--primary)" />
                </div>
                <h1 className="auth-form-card__title">Enter App PIN</h1>
                <p className="auth-form-card__subtitle">
                  Enter your 4-digit PIN to access CineStream.
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="auth-form">
                <div className="form-group">
                  <input
                    id="pin-input"
                    type="password"
                    maxLength={4}
                    className="form-input"
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                    style={{ textAlign: 'center', letterSpacing: '16px', fontSize: '28px', padding: '16px' }}
                    autoFocus
                  />
                </div>
                {pinError && (
                  <p style={{ color: 'var(--primary)', fontSize: '13px', textAlign: 'center', margin: '-8px 0 8px' }}>
                    {pinError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={pin.length !== 4}
                  className="btn btn--primary btn--lg btn--full-width"
                  style={{ width: '100%', opacity: pin.length !== 4 ? 0.5 : 1 }}
                >
                  Verify PIN
                </button>
                <button
                  type="button"
                  onClick={() => { setStep('login'); setPin(''); setPinError(''); setUsername(''); setPassword(''); }}
                  style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', marginTop: '8px', padding: '8px' }}
                >
                  ← Back to login
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
