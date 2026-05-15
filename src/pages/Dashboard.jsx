import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import '../components/ContentSection.css';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, Zap, Play, Edit, LogOut, Trash2, Lock, Shield, X, Check, KeyRound } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { dashboardData } from '../data/mockData';

// ─── Hardcoded user accounts (same as Login.jsx) ─────────────────────────────
const USERS = [
  { username: 'tayyab4855', password: 'abcd1234', displayName: 'Tayyab' },
  { username: 'admin',      password: 'admin123', displayName: 'Admin'  },
];

const DASHBOARD_BG = 'https://picsum.photos/seed/dashbg/1440/400';
const tabs = ['WATCH HISTORY', 'FAVORITES', 'DOWNLOADS'];

export default function Dashboard() {
  const navigate = useNavigate();
  const d = dashboardData;

  // ── Session / profile ──────────────────────────────────────────────────────
  const sessionUser = sessionStorage.getItem('cinestream_user') || '';
  const matchedUser = USERS.find(u => u.username === sessionUser);
  const initials = matchedUser ? matchedUser.displayName[0].toUpperCase() : 'U';

  // ── Profile edit state ─────────────────────────────────────────────────────
  const [displayName, setDisplayName] = useState(
    () => localStorage.getItem(`cinestream_name_${sessionUser}`) || (matchedUser?.displayName ?? sessionUser)
  );
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editNameInput, setEditNameInput] = useState('');

  // ── Change password state ──────────────────────────────────────────────────
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  // ── Misc ───────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState(0);
  const [history, setHistory] = useState([]);

  // ── Parental Controls ──────────────────────────────────────────────────────
  const [adultEnabled, setAdultEnabled] = useState(localStorage.getItem('cinestream_adult_enabled') === 'true');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinMode, setPinMode] = useState('verify');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cinestream_watch_history') || '[]');
    setHistory(saved);
  }, []);

  const totalSeconds = history.reduce((sum, item) => sum + (item.watchSeconds || 0), 0);
  const displayHours = (totalSeconds / 3600).toFixed(1);

  const clearHistory = () => {
    localStorage.removeItem('cinestream_watch_history');
    setHistory([]);
  };

  // ── Profile edit ────────────────────────────────────────────────────────────
  const openEditProfile = () => {
    setEditNameInput(displayName);
    setShowEditProfile(true);
  };
  const saveProfile = (e) => {
    e.preventDefault();
    if (!editNameInput.trim()) return;
    const newName = editNameInput.trim();
    setDisplayName(newName);
    localStorage.setItem(`cinestream_name_${sessionUser}`, newName);
    setShowEditProfile(false);
  };

  // ── Change password ─────────────────────────────────────────────────────────
  const handleChangePwd = (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');
    const user = USERS.find(u => u.username === sessionUser);
    const savedPwd = localStorage.getItem(`cinestream_pwd_${sessionUser}`) || user?.password;
    if (pwdCurrent !== savedPwd) {
      setPwdError('Current password is incorrect.');
      return;
    }
    if (pwdNew.length < 6) {
      setPwdError('New password must be at least 6 characters.');
      return;
    }
    if (pwdNew !== pwdConfirm) {
      setPwdError('New passwords do not match.');
      return;
    }
    localStorage.setItem(`cinestream_pwd_${sessionUser}`, pwdNew);
    setPwdSuccess('Password changed successfully!');
    setPwdCurrent(''); setPwdNew(''); setPwdConfirm('');
    setTimeout(() => { setPwdSuccess(''); setShowChangePwd(false); }, 2000);
  };

  // ── Parental controls ───────────────────────────────────────────────────────
  const handleAdultToggle = () => {
    const existingPin = localStorage.getItem('cinestream_adult_pin');
    setPinMode(existingPin ? 'verify' : 'setup');
    setPinInput(''); setPinError('');
    setShowPinModal(true);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const existingPin = localStorage.getItem('cinestream_adult_pin');
    if (pinMode === 'setup') {
      if (pinInput.length !== 4) { setPinError('PIN must be 4 digits.'); return; }
      localStorage.setItem('cinestream_adult_pin', pinInput);
      localStorage.setItem('cinestream_adult_enabled', (!adultEnabled).toString());
      setAdultEnabled(!adultEnabled);
      setShowPinModal(false);
    } else {
      if (pinInput === existingPin) {
        localStorage.setItem('cinestream_adult_enabled', (!adultEnabled).toString());
        setAdultEnabled(!adultEnabled);
        setShowPinModal(false);
      } else {
        setPinError('Incorrect PIN.');
      }
    }
  };

  return (
    <div className="dashboard">
      <Navbar />

      {/* Cover / Banner */}
      <div className="dashboard__cover" style={{ backgroundImage: `url(${DASHBOARD_BG})` }}>
        <div className="dashboard__cover-overlay" />
      </div>

      {/* Profile card */}
      <div className="container">
        <div className="profile-card glass">
          <div className="profile-card__left">
            {/* Avatar — initial letter */}
            <div className="profile-card__avatar-wrap">
              <div className="profile-card__avatar profile-avatar-letter">
                {initials}
              </div>
              <span className="profile-card__avatar-badge badge badge-primary">PRO</span>
            </div>
            <div className="profile-card__info">
              <h1 className="profile-card__name">{displayName}</h1>
              <p className="profile-card__bio">@{sessionUser}</p>
              <div className="profile-card__tags">
                <span className="badge badge-outline">Member since {d.user.memberSince}</span>
                <span className="badge badge-outline">{d.user.badge}</span>
              </div>
            </div>
          </div>
          <div className="profile-card__actions">
            <Button variant="primary" size="sm" icon={Edit} onClick={openEditProfile}>Edit Profile</Button>
          </div>
        </div>

        {/* Overview Stats */}
        <section className="dashboard-section">
          <div className="section-heading" style={{ marginBottom: '16px' }}>
            <h2>Overview</h2>
          </div>
          <div className="stats-grid">
            <div className="stat-card glass-light">
              <div className="stat-card__header">
                <Clock size={18} strokeWidth={1.5} className="stat-card__icon" />
                <span className="stat-card__growth">{d.stats.hoursGrowth}</span>
              </div>
              <p className="stat-card__label">Hours Watched</p>
              <p className="stat-card__value">{displayHours}</p>
            </div>
            <div className="stat-card glass-light">
              <div className="stat-card__header">
                <CheckCircle size={18} strokeWidth={1.5} className="stat-card__icon" />
                <span className="stat-card__growth">{d.stats.seriesCount} series</span>
              </div>
              <p className="stat-card__label">Completed Series</p>
              <p className="stat-card__value">{d.stats.completedSeries} <span>Episodes</span></p>
            </div>
            <div className="stat-card glass-light">
              <div className="stat-card__header">
                <Zap size={18} strokeWidth={1.5} className="stat-card__icon" />
              </div>
              <p className="stat-card__label">Favorite Genre</p>
              <p className="stat-card__value stat-card__value--sm">{d.stats.favoriteGenre}</p>
            </div>
          </div>
        </section>

        {/* Watch History Tabs */}
        <section className="dashboard-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '12px', flexWrap: 'wrap' }}>
            <div className="dashboard-tabs" style={{ marginBottom: 0 }}>
              {tabs.map((t, i) => (
                <button key={t} className={`dashboard-tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>
                  {t}
                </button>
              ))}
            </div>
            {activeTab === 0 && history.length > 0 && (
              <button
                onClick={clearHistory}
                title="Clear watch history"
                style={{ background: 'none', border: '1px solid var(--outline)', borderRadius: 'var(--rounded-md)', padding: '6px 12px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', transition: 'color 0.2s, border-color 0.2s', flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.color = '#E50914'; e.currentTarget.style.borderColor = '#E50914'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--outline)'; }}
              >
                <Trash2 size={14} strokeWidth={1.5} /> Clear History
              </button>
            )}
          </div>
          <div className="history-grid">
            {history.length > 0 ? history.map(item => (
              <div key={item.id} className="history-card" onClick={() => navigate(item.isTMDB ? `/tmdb/${item.id}` : `/movie/${item.id}`)}>
                <div className="history-card__poster">
                  <img src={item.poster} alt={item.title} loading="lazy" />
                  <div className="history-card__overlay"><Play size={20} fill="white" strokeWidth={0} /></div>
                  {item.isNew && <span className="badge badge-new history-card__badge">NEW</span>}
                </div>
                <h4 className="history-card__title">{item.title}</h4>
                <p className="history-card__meta">
                  {item.year} · {item.genre}
                  {item.watchSeconds > 0 && ` · Watched ${Math.floor(item.watchSeconds / 60) > 0 ? `${Math.floor(item.watchSeconds / 60)}m ` : ''}${item.watchSeconds % 60}s`}
                </p>
              </div>
            )) : (
              <div style={{ padding: '40px 0', color: 'var(--text-muted)' }}>
                You haven't watched any trailers yet.
              </div>
            )}
          </div>
        </section>

        {/* Account Settings */}
        <section className="dashboard-section">
          <div className="section-heading">
            <h2>Account Settings</h2>
          </div>
          <div className="settings-list glass-light">
            {/* Change Password */}
            <div className="settings-item">
              <div className="settings-item__icon-wrap"><KeyRound size={18} strokeWidth={1.5} /></div>
              <div className="settings-item__text">
                <p className="settings-item__title">Change Password</p>
                <p className="settings-item__desc">Update your account login password</p>
              </div>
              <span
                className="label settings-manage-btn"
                style={{ color: 'var(--primary)', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => { setShowChangePwd(true); setPwdError(''); setPwdSuccess(''); }}
              >CHANGE</span>
            </div>
            {/* Security */}
            <div className="settings-item">
              <div className="settings-item__icon-wrap"><Shield size={18} strokeWidth={1.5} /></div>
              <div className="settings-item__text">
                <p className="settings-item__title">Security &amp; Privacy</p>
                <p className="settings-item__desc">Two-factor authentication and active sessions</p>
              </div>
              <span className="label settings-manage-btn" style={{ color: 'var(--text-dim)', fontSize: '11px', cursor: 'pointer' }}>MANAGE</span>
            </div>
            {/* Parental Controls */}
            <div className="settings-item">
              <div className="settings-item__icon-wrap"><Lock size={18} strokeWidth={1.5} /></div>
              <div className="settings-item__text">
                <p className="settings-item__title">18+ Adult Content</p>
                <p className="settings-item__desc">Toggle ON to SHOW mature content. Toggle OFF to HIDE it.</p>
              </div>
              <div className={`toggle-switch ${adultEnabled ? 'on' : ''}`} onClick={handleAdultToggle} role="switch" aria-checked={adultEnabled}>
                <div className="toggle-switch__knob" />
              </div>
            </div>
            {/* Logout */}
            <div className="settings-item settings-item--danger">
              <div className="settings-item__icon-wrap settings-item__icon-wrap--danger"><LogOut size={18} strokeWidth={1.5} /></div>
              <div className="settings-item__text">
                <p className="settings-item__title settings-item__title--danger">Logout</p>
                <p className="settings-item__desc">Securely sign out of your premium account</p>
              </div>
              <Button variant="primary" size="sm" onClick={() => {
                sessionStorage.removeItem('cinestream_session');
                sessionStorage.removeItem('cinestream_user');
                navigate('/login');
              }}>Sign Out</Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* ── Edit Profile Modal ─────────────────────────────────────────────── */}
      {showEditProfile && (
        <div className="pin-modal-overlay">
          <div className="pin-modal glass">
            <button className="pin-modal-close" onClick={() => setShowEditProfile(false)}><X size={20} /></button>
            <div className="pin-modal-header">
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, color: 'white' }}>{initials}</div>
              <h3>Edit Profile</h3>
            </div>
            <p className="pin-modal-desc">Update your display name shown across CineStream.</p>
            <form onSubmit={saveProfile} className="pin-modal-form">
              <input
                type="text"
                value={editNameInput}
                onChange={e => setEditNameInput(e.target.value)}
                placeholder="Display Name"
                className="pin-modal-input"
                style={{ fontSize: '16px', letterSpacing: '1px', textAlign: 'left', padding: '14px 16px' }}
                autoFocus
              />
              <Button variant="primary" type="submit" disabled={!editNameInput.trim()}>Save Changes</Button>
            </form>
          </div>
        </div>
      )}

      {/* ── Change Password Modal ──────────────────────────────────────────── */}
      {showChangePwd && (
        <div className="pin-modal-overlay">
          <div className="pin-modal glass" style={{ maxWidth: '440px' }}>
            <button className="pin-modal-close" onClick={() => setShowChangePwd(false)}><X size={20} /></button>
            <div className="pin-modal-header">
              <KeyRound size={24} color="var(--primary)" />
              <h3>Change Password</h3>
            </div>
            <form onSubmit={handleChangePwd} className="pin-modal-form" style={{ gap: '12px' }}>
              <input type="password" placeholder="Current password" value={pwdCurrent} onChange={e => setPwdCurrent(e.target.value)}
                className="pin-modal-input" style={{ fontSize: '14px', letterSpacing: '2px', textAlign: 'left', padding: '14px 16px' }} required />
              <input type="password" placeholder="New password (min 6 chars)" value={pwdNew} onChange={e => setPwdNew(e.target.value)}
                className="pin-modal-input" style={{ fontSize: '14px', letterSpacing: '2px', textAlign: 'left', padding: '14px 16px' }} required />
              <input type="password" placeholder="Confirm new password" value={pwdConfirm} onChange={e => setPwdConfirm(e.target.value)}
                className="pin-modal-input" style={{ fontSize: '14px', letterSpacing: '2px', textAlign: 'left', padding: '14px 16px' }} required />
              {pwdError && <p className="pin-error-text">{pwdError}</p>}
              {pwdSuccess && <p style={{ color: '#22c55e', fontSize: '13px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} />{pwdSuccess}</p>}
              <Button variant="primary" type="submit">Update Password</Button>
            </form>
          </div>
        </div>
      )}

      {/* ── Adult PIN Modal ────────────────────────────────────────────────── */}
      {showPinModal && (
        <div className="pin-modal-overlay">
          <div className="pin-modal glass">
            <button className="pin-modal-close" onClick={() => setShowPinModal(false)}><X size={20} /></button>
            <div className="pin-modal-header">
              <Lock size={24} color="var(--primary)" />
              <h3>{pinMode === 'setup' ? 'Set Up 4-Digit PIN' : 'Enter 4-Digit PIN'}</h3>
            </div>
            <p className="pin-modal-desc">
              {pinMode === 'setup'
                ? 'Create a 4-digit PIN to restrict access to adult content.'
                : `Enter your PIN to turn ${adultEnabled ? 'OFF' : 'ON'} adult content.`}
            </p>
            <form onSubmit={handlePinSubmit} className="pin-modal-form">
              <input
                type="password" maxLength={4} value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="0000" className="pin-modal-input" autoFocus
              />
              {pinError && <p className="pin-error-text">{pinError}</p>}
              <Button variant="primary" type="submit" disabled={pinInput.length !== 4}>
                {pinMode === 'setup' ? 'Set PIN' : 'Verify'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
