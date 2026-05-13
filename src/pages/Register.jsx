import React, { useState } from 'react';
import './Login.css';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye } from 'lucide-react';
import Button from '../components/Button';

const BG = 'https://picsum.photos/seed/registercity/800/900';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [agreed, setAgreed] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="auth-page auth-page--register" style={{ backgroundImage: `url(${BG})` }}>
      <div className="auth-page__overlay" />

      {/* Left brand */}
      <div className="auth-page__brand">
        <Link to="/" className="auth-logo">CINESTREAM</Link>
        <div className="auth-brand__bottom">
          <h2 className="auth-brand__headline">Experience the Future of Cinema.</h2>
          <p className="auth-brand__tagline">Join the elite network of movie enthusiasts and anime fans in a high-fidelity command center designed for ultimate immersion.</p>
        </div>
      </div>

      {/* Right form */}
      <div className="auth-page__form-panel">
        <div className="auth-form-card glass">
          <h1 className="auth-form-card__title">Create Account</h1>
          <p className="auth-form-card__subtitle">Enter your details to start your journey.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label label">Username</label>
              <div className="form-input-wrap">
                <User size={16} strokeWidth={1.5} className="form-input-icon" />
                <input id="reg-username" type="text" className="form-input" placeholder="cine_enthusiast"
                  value={form.username} onChange={e => update('username', e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label label">Email Address</label>
              <div className="form-input-wrap">
                <Mail size={16} strokeWidth={1.5} className="form-input-icon" />
                <input id="reg-email" type="email" className="form-input" placeholder="name@example.com"
                  value={form.email} onChange={e => update('email', e.target.value)} required />
              </div>
            </div>

            <div className="form-row-two">
              <div className="form-group">
                <label className="form-label label">Password</label>
                <div className="form-input-wrap">
                  <Lock size={16} strokeWidth={1.5} className="form-input-icon" />
                  <input id="reg-password" type="password" className="form-input" placeholder="••••••••"
                    value={form.password} onChange={e => update('password', e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label label">Confirm</label>
                <div className="form-input-wrap">
                  <Eye size={16} strokeWidth={1.5} className="form-input-icon" />
                  <input id="reg-confirm" type="password" className="form-input" placeholder="••••••••"
                    value={form.confirm} onChange={e => update('confirm', e.target.value)} required />
                </div>
              </div>
            </div>

            <label className="form-checkbox">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} required />
              <span>I agree to the <a href="#" className="auth-link">Terms of Service</a> and <a href="#" className="auth-link">Privacy Policy</a></span>
            </label>

            <Button type="submit" variant="primary" size="lg" fullWidth>
              Register Now
            </Button>
          </form>

          <div className="auth-divider">
            <span className="divider" />
            <span className="auth-divider__text label">Or Register With</span>
            <span className="divider" />
          </div>

          <div className="auth-social">
            <button className="auth-social-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="12" fill="#4285F4" opacity="0.15" />
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button className="auth-social-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--text-muted)">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>

          <p className="auth-footer-text">
            Already have an account? <Link to="/login" className="auth-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
