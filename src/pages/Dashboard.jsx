import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import '../components/ContentSection.css';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, CheckCircle, Zap, Star, Play, Edit, Share2, Bell, Shield, LogOut, ChevronRight, ChevronLeft, ArrowLeft, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { dashboardData } from '../data/mockData';

const DASHBOARD_BG = 'https://picsum.photos/seed/dashbg/1440/400';

const tabs = ['WATCH HISTORY', 'FAVORITES', 'DOWNLOADS'];

export default function Dashboard() {
  const navigate = useNavigate();
  const d = dashboardData;
  const [activeTab, setActiveTab] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [notifs, setNotifs] = useState(true);
  const [history, setHistory] = useState([]);

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

  return (
    <div className="dashboard">
      <Navbar />

      <button className="page-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
        <ArrowLeft size={16} strokeWidth={2} /> Back
      </button>

      {/* Cover / Banner */}
      <div className="dashboard__cover" style={{ backgroundImage: `url(${DASHBOARD_BG})` }}>
        <div className="dashboard__cover-overlay" />
      </div>

      {/* Profile card */}
      <div className="container">
        <div className="profile-card glass">
          <div className="profile-card__left">
            <div className="profile-card__avatar-wrap">
              <img src={d.user.avatar} alt={d.user.name} className="profile-card__avatar" />
              <span className="profile-card__avatar-badge badge badge-primary">PRO</span>
            </div>
            <div className="profile-card__info">
              <h1 className="profile-card__name">{d.user.name}</h1>
              <p className="profile-card__bio">{d.user.bio}</p>
              <div className="profile-card__tags">
                <span className="badge badge-outline">Member since {d.user.memberSince}</span>
                <span className="badge badge-outline">{d.user.badge}</span>
              </div>
            </div>
          </div>
          <div className="profile-card__actions">
            <Button variant="primary" size="sm" icon={Edit}>Edit Profile</Button>
            <button className="btn btn--icon-only btn--sm"><Share2 size={16} strokeWidth={1.5} /></button>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div className="dashboard-tabs" style={{ marginBottom: 0 }}>
              {tabs.map((t, i) => (
                <button
                  key={t}
                  className={`dashboard-tab ${activeTab === i ? 'active' : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {t}
                </button>
              ))}
            </div>
            {activeTab === 0 && history.length > 0 && (
              <button
                onClick={clearHistory}
                title="Clear watch history"
                style={{ background: 'none', border: '1px solid var(--outline)', borderRadius: 'var(--rounded-md)', padding: '6px 12px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', transition: 'color 0.2s, border-color 0.2s' }}
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
            {/* Theme */}
            <div className="settings-item">
              <div className="settings-item__icon-wrap">
                <Star size={18} strokeWidth={1.5} />
              </div>
              <div className="settings-item__text">
                <p className="settings-item__title">Theme Mode</p>
                <p className="settings-item__desc">Switch between dark and light cinematic experience</p>
              </div>
              <div className="settings-theme-toggle">
                <button className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>DARK</button>
                <button className={`theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>LIGHT</button>
              </div>
            </div>
            {/* Notifications */}
            <div className="settings-item">
              <div className="settings-item__icon-wrap">
                <Bell size={18} strokeWidth={1.5} />
              </div>
              <div className="settings-item__text">
                <p className="settings-item__title">Notifications</p>
                <p className="settings-item__desc">Manage alerts for new releases and community mentions</p>
              </div>
              <div
                className={`toggle-switch ${notifs ? 'on' : ''}`}
                onClick={() => setNotifs(!notifs)}
                role="switch"
                aria-checked={notifs}
              >
                <div className="toggle-switch__knob" />
              </div>
            </div>
            {/* Security */}
            <div className="settings-item">
              <div className="settings-item__icon-wrap">
                <Shield size={18} strokeWidth={1.5} />
              </div>
              <div className="settings-item__text">
                <p className="settings-item__title">Security &amp; Privacy</p>
                <p className="settings-item__desc">Two-factor authentication and active sessions</p>
              </div>
              <span className="label settings-manage-btn" style={{ color: 'var(--text-dim)', fontSize: '11px', cursor: 'pointer' }}>MANAGE</span>
            </div>
            {/* Logout */}
            <div className="settings-item settings-item--danger">
              <div className="settings-item__icon-wrap settings-item__icon-wrap--danger">
                <LogOut size={18} strokeWidth={1.5} />
              </div>
              <div className="settings-item__text">
                <p className="settings-item__title settings-item__title--danger">Logout</p>
                <p className="settings-item__desc">Securely sign out of your premium account</p>
              </div>
              <Button variant="primary" size="sm" onClick={() => navigate('/login')}>Sign Out</Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
