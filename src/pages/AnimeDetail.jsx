import React, { useState, useEffect } from 'react';
import './AnimeDetail.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Play, Download, Plus, Star, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { animeDetail, getMediaById } from '../data/mockData';

export default function AnimeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const a = getMediaById(id);
  const [playing, setPlaying] = useState(false);

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('v=')) {
      const v = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${v}`;
    }
    return url;
  };

  // Scroll to top when the movie changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setPlaying(false);
  }, [id]);

  if (!a) {
    return (
      <div className="anime-detail" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        <Navbar />
        <h2 style={{ marginBottom: '1rem' }}>Anime Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  // Fallback arrays for generated content that doesn't have episodes/features
  const episodes_list = a.episodes_list || animeDetail.episodes_list;
  const features = a.features || animeDetail.features;
  const recommended = a.recommended || animeDetail.recommended;
  const stills = a.stills || animeDetail.stills;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < Math.floor(rating) ? '#f5c518' : 'none'}
        stroke={i < Math.floor(rating) ? 'none' : 'var(--outline-variant)'}
      />
    ));
  };

  return (
    <div className="anime-detail">
      <Navbar />

      <button className="page-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
        <ArrowLeft size={16} strokeWidth={2} /> Back
      </button>

      {/* Hero */}
      <div className="anime-detail__hero" style={{ backgroundImage: `url("${a.hero}")` }}>
        <div className="anime-detail__hero-overlay" />
        <div className="anime-detail__hero-bottom" />

        {/* Info overlay */}
        <div className="anime-detail__header-content container">
          <div className="anime-detail__poster-wrap">
            <img src={a.poster} alt={a.title} className="anime-detail__poster" />
          </div>
          <div className="anime-detail__info">
            <div className="anime-detail__genres">
              {a.genres.map(g => (
                <span key={g} className="badge badge-outline">{g}</span>
              ))}
            </div>
            <h1 className="anime-detail__title">{a.title.toUpperCase()}</h1>
            <div className="anime-detail__meta">
              <span className="anime-stars">{renderStars(a.rating)}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{a.rating}</span>
              <span className="anime-meta-dot">•</span>
              <span>{a.episodes} Episodes</span>
              <span className="anime-meta-dot">•</span>
              <span>{a.year}</span>
              <span className="badge badge-outline">{a.rating_label}</span>
            </div>
            <p className="anime-detail__desc">{a.description}</p>
            <div className="anime-detail__actions">
              <Button variant="primary" size="lg" icon={Play} onClick={() => navigate(`/watch/${a.id}`)}>
                Watch Anime
              </Button>
              <Button variant="secondary" size="lg" icon={Download}>
                Download Episodes
              </Button>
              <button className="btn btn--icon-only btn--md">
                <Plus size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="anime-detail__content container">

        {/* Episodes */}
        <section className="anime-section">
          <div className="section-heading">
            <h2>Episodes</h2>
            <div className="anime-nav-arrows">
              <button className="anime-nav-btn"><ChevronLeft size={18} /></button>
              <button className="anime-nav-btn"><ChevronRight size={18} /></button>
            </div>
          </div>
          <div className="episodes-grid">
            {episodes_list.map((ep, i) => (
              <div key={ep.id} className={`episode-card ${i === 0 ? 'episode-card--current' : ''}`}
                onClick={() => navigate(`/watch/${a.id}`)}>
                <div className="episode-card__thumb">
                  <img src={ep.thumb} alt={ep.title} loading="lazy" />
                  <div className="episode-card__overlay">
                    <Play size={20} fill="white" strokeWidth={0} />
                  </div>
                  {i === 0 && <span className="episode-card__now-playing label">Now Playing</span>}
                </div>
                <div className="episode-card__info">
                  <span className="episode-card__number label">{ep.number}</span>
                  <h4 className="episode-card__title">{ep.title}</h4>
                  <p className="episode-card__desc">{ep.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trailer + Features */}
        <section className="anime-trailer-section">
          <div className="anime-trailer-player">
            {!playing ? (
              <div 
                style={{ width: '100%', height: '100%', position: 'relative', cursor: 'pointer' }}
                onClick={() => setPlaying(true)}
              >
                <img src={stills && stills[0] ? stills[0] : a.hero} alt="Trailer" className="trailer-player__bg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className="anime-trailer__overlay" />
                <button className="anime-trailer__play">
                  <Play size={24} fill="white" strokeWidth={0} />
                </button>
                <div className="anime-trailer__controls">
                  <div className="video-progress">
                    <div className="video-progress-bar" style={{ width: '0%' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>00:00 / 02:45</span>
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                width="100%"
                height="100%"
                src={`${getEmbedUrl(a.trailer)}?autoplay=1`}
                title="Official Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              ></iframe>
            )}
          </div>
          <div className="anime-features">
            <h3>Watch Trailer</h3>
            <p className="anime-features__desc">
              Experience the adrenaline-fueled world of Night City in this official series trailer. Witness the stunning animation by Studio Trigger and the pulse-pounding soundtrack.
            </p>
            <ul className="anime-features__list">
              {features.map((f, i) => (
                <li key={i} className="anime-feature-item">
                  <span className="anime-feature-check">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Stills & Art */}
        <section className="anime-section">
          <h2 style={{ marginBottom: '16px' }}>Stills &amp; Art</h2>
          <div className="anime-stills">
            {stills.map((src, i) => (
              <div key={i} className="anime-still">
                <img src={src} alt={`Still ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </section>

        {/* Recommended */}
        <section className="anime-section">
          <h2 style={{ marginBottom: '16px' }}>Recommended For You</h2>
          <div className="anime-recommended">
            {recommended.map(r => (
              <div key={r.id} className="rec-card" onClick={() => navigate(`/anime/${r.id}`)}>
                <div className="rec-card__poster">
                  <img src={r.poster} alt={r.title} loading="lazy" />
                  <div className="rec-card__overlay"><Play size={20} fill="white" strokeWidth={0} /></div>
                </div>
                <h4 className="rec-card__title">{r.title}</h4>
                <p className="rec-card__match">{r.match}% Match</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
