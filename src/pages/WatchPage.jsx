import React, { useState } from 'react';
import './WatchPage.css';
import { useNavigate } from 'react-router-dom';
import { Play, SkipForward, Volume2, Settings, Maximize, Plus, Share2, Download, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { watchData } from '../data/mockData';

export default function WatchPage() {
  const navigate = useNavigate();
  const w = watchData;
  const [progress, setProgress] = useState(w.progress);
  const [muted, setMuted] = useState(false);

  return (
    <div className="watch-page">
      <Navbar />

      <button className="page-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
        <ArrowLeft size={16} strokeWidth={2} /> Back
      </button>

      {/* Video player */}
      <div className="watch-player">
        <div className="watch-player__bg" style={{ backgroundImage: `url(${w.hero})` }}>
          <div className="watch-player__overlay" />
        </div>
        {/* Controls */}
        <div className="watch-player__controls">
          <div
            className="video-progress watch-progress"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = ((e.clientX - rect.left) / rect.width) * 100;
              setProgress(Math.round(pct));
            }}
          >
            <div className="video-progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="watch-controls-row">
            <div className="watch-controls-left">
              <button className="watch-ctrl-btn" aria-label="Play">
                <Play size={18} fill="white" strokeWidth={0} />
              </button>
              <button className="watch-ctrl-btn" aria-label="Skip forward">
                <SkipForward size={18} strokeWidth={1.5} />
              </button>
              <button className="watch-ctrl-btn" aria-label="Volume" onClick={() => setMuted(!muted)}>
                <Volume2 size={18} strokeWidth={1.5} style={{ opacity: muted ? 0.4 : 1 }} />
              </button>
              <span className="watch-time">{w.currentTime} / {w.totalTime}</span>
            </div>
            <div className="watch-controls-right">
              <span className="badge badge-glass">4K</span>
              <button className="watch-ctrl-btn" aria-label="Subtitles">CC</button>
              <button className="watch-ctrl-btn" aria-label="Settings">
                <Settings size={16} strokeWidth={1.5} />
              </button>
              <button className="watch-ctrl-btn" aria-label="Fullscreen">
                <Maximize size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content below player */}
      <div className="watch-content container">
        <div className="watch-body">
          {/* Left: info + episodes */}
          <div className="watch-main">
            <h1 className="watch-title">{w.title}</h1>
            <div className="watch-rating-badge">
              <span className="badge badge-outline">{w.rating} RATING</span>
            </div>
            <div className="watch-tags">
              {w.tags.map(t => (
                <span key={t} className="badge badge-outline">{t}</span>
              ))}
            </div>
            <p className="watch-desc">{w.description}</p>
            <div className="watch-actions">
              <Button variant="secondary" icon={Plus}>My List</Button>
              <Button variant="ghost" icon={Share2}>Share</Button>
            </div>

            {/* Episodes */}
            <div className="watch-episodes">
              <div className="section-heading">
                <h2>Episodes</h2>
                <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Season 01 • 12 Episodes</span>
              </div>
              <div className="watch-episodes-grid">
                {w.episodes.map(ep => (
                  <div
                    key={ep.id}
                    className={`watch-ep-card ${ep.current ? 'watch-ep-card--current' : ''}`}
                  >
                    <div className="watch-ep-card__thumb">
                      <img src={ep.thumb} alt={ep.title} loading="lazy" />
                      <div className="watch-ep-card__overlay">
                        <Play size={18} fill="white" strokeWidth={0} />
                      </div>
                    </div>
                    <div className="watch-ep-card__info">
                      <span className="label" style={{ fontSize: '9px', color: 'var(--text-dim)', display: 'block', marginBottom: '3px' }}>
                        {ep.label}
                      </span>
                      <h4 className="watch-ep-card__title">{ep.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar */}
            <div className="watch-similar">
              <h2 style={{ marginBottom: '16px' }}>Similar Content</h2>
              <div className="watch-similar-grid">
                {w.similar.map(s => (
                  <div key={s.id} className="watch-sim-card" onClick={() => navigate(`/movie/${s.id}`)}>
                    <div className="watch-sim-card__poster">
                      <img src={s.poster} alt={s.title} loading="lazy" />
                      <div className="watch-sim-card__overlay"><Play size={16} fill="white" strokeWidth={0} /></div>
                    </div>
                    <h4 className="watch-sim-card__title">{s.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: offline access */}
          <div className="watch-sidebar">
            <div className="watch-downloads glass-light">
              <h3>Offline Access</h3>
              {w.downloads.map(d => (
                <div key={d.quality} className="download-item">
                  <div>
                    <p className="download-item__quality">{d.quality}</p>
                    <p className="download-item__size">{d.size} • {d.audio}</p>
                  </div>
                  <button className="download-item__btn" aria-label="Download">
                    <Download size={16} strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
