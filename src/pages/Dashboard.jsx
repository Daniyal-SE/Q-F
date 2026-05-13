import React, { useState } from 'react';
import './Dashboard.css';
import '../components/ContentSection.css';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, CheckCircle, Zap, Star, Play, Edit, Share2, Bell, Shield, LogOut, ChevronRight, ChevronLeft } from 'lucide-react';
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

  const continueScrollRef = React.useRef(null);

  const scrollContinueLeft = () => {
    if (continueScrollRef.current) {
      continueScrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollContinueRight = () => {
    if (continueScrollRef.current) {
      continueScrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
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
              <p className="stat-card__value">{d.stats.hoursWatched.toLocaleString()}</p>
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

        {/* Continue Watching */}
        <section className="dashboard-section">
          <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>Continue Watching</h2>
            <div className="content-section__nav-buttons">
              <button className="content-section__nav-btn" onClick={scrollContinueLeft} aria-label="Scroll left">
                <ChevronLeft size={20} />
              </button>
              <button className="content-section__nav-btn" onClick={scrollContinueRight} aria-label="Scroll right">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="continue-grid" ref={continueScrollRef}>
            {d.continueWatching.map(item => (
              <div key={item.id} className="continue-card" onClick={() => navigate(`/watch/${item.id}`)}>
                <div className="continue-card__thumb">
                  <img src={item.thumb} alt={item.title} loading="lazy" />
                  <div className="continue-card__overlay"><Play size={22} fill="white" strokeWidth={0} /></div>
                </div>
                <h4 className="continue-card__title">{item.title}</h4>
                <p className="continue-card__info">{item.info}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Watch History Tabs */}
        <section className="dashboard-section">
          <div className="dashboard-tabs">
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
          <div className="history-grid">
            {d.watchHistory.map(item => (
              <div key={item.id} className="history-card" onClick={() => navigate(`/movie/${item.id}`)}>
                <div className="history-card__poster">
                  <img src={item.poster} alt={item.title} loading="lazy" />
                  <div className="history-card__overlay"><Play size={20} fill="white" strokeWidth={0} /></div>
                  {item.isNew && <span className="badge badge-new history-card__badge">NEW</span>}
                </div>
                <h4 className="history-card__title">{item.title}</h4>
                <p className="history-card__meta">{item.year} · {item.genre}</p>
              </div>
            ))}
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
