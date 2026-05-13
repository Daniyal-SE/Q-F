import React, { useState, useEffect, useRef } from 'react';
import './WatchPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Share2, Plus, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TMDB_KEY = '1fa448de74c5dac88e0d31d99c7e916d';
const IMG_BASE = 'https://image.tmdb.org/t/p/';

export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const topRef = useRef(null);
  const watchSecondsRef = useRef(0);

  // Track watch time
  useEffect(() => {
    let interval = null;
    if (playing) {
      interval = setInterval(() => { watchSecondsRef.current += 1; }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
      if (watchSecondsRef.current > 0 && movie) {
        try {
          const history = JSON.parse(localStorage.getItem('cinestream_watch_history') || '[]');
          const idx = history.findIndex(h => h.id === movie.id);
          const posterUrl = movie.poster_path ? `${IMG_BASE}w500${movie.poster_path}` : null;
          if (idx !== -1) {
            history[idx].watchSeconds = (history[idx].watchSeconds || 0) + watchSecondsRef.current;
            const item = history.splice(idx, 1)[0];
            history.unshift(item);
          } else {
            history.unshift({
              id: movie.id,
              title: movie.title || movie.name,
              poster: posterUrl,
              year: (movie.release_date || movie.first_air_date || '').split('-')[0] || 'N/A',
              genre: movie.genres?.[0]?.name || 'Movie',
              isTMDB: true,
              watchSeconds: watchSecondsRef.current
            });
          }
          localStorage.setItem('cinestream_watch_history', JSON.stringify(history.slice(0, 20)));
        } catch (e) {}
        watchSecondsRef.current = 0;
      }
    };
  }, [playing, movie]);

  useEffect(() => {
    setPlaying(false);
    setLoading(true);
    setMovie(null);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });

    const fetchAll = async () => {
      try {
        // Try movie first, then TV
        let detailRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=en-US&append_to_response=credits`);
        let detail = await detailRes.json();
        let mediaType = 'movie';

        if (!detail || detail.success === false) {
          detailRes = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_KEY}&language=en-US&append_to_response=credits`);
          detail = await detailRes.json();
          mediaType = 'tv';
        }

        const [videosRes, recRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${TMDB_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/${mediaType}/${id}/recommendations?api_key=${TMDB_KEY}&language=en-US&page=1`),
        ]);

        const videos = await videosRes.json();
        const rec = await recRes.json();

        setMovie(detail);
        const trailerVideo =
          videos.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
          videos.results?.find(v => v.site === 'YouTube');
        setTrailer(trailerVideo || null);
        setRecommended(rec.results?.slice(0, 12) || []);
      } catch (e) {
        console.error('WatchPage fetch error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <div className="watch-page" ref={topRef}>
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="tmdb-detail__spinner" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading stream...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!movie || movie.success === false) {
    return (
      <div className="watch-page">
        <Navbar />
        <div style={{ textAlign: 'center', padding: '120px 20px' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Content not found.</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `${IMG_BASE}original${movie.backdrop_path}`
    : movie.poster_path
    ? `${IMG_BASE}w1280${movie.poster_path}`
    : null;

  const posterUrl = movie.poster_path ? `${IMG_BASE}w500${movie.poster_path}` : null;
  const title = movie.title || movie.name;
  const releaseYear = (movie.release_date || movie.first_air_date || '').split('-')[0] || 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;
  const director = movie.credits?.crew?.find(c => c.job === 'Director')?.name;
  const cast = movie.credits?.cast?.slice(0, 4).map(c => c.name).join(', ');

  const handlePlay = () => {
    setPlaying(true);
    // Save entry to history immediately
    try {
      const history = JSON.parse(localStorage.getItem('cinestream_watch_history') || '[]');
      const idx = history.findIndex(h => h.id === movie.id);
      if (idx === -1) {
        history.unshift({ id: movie.id, title, poster: posterUrl, year: releaseYear, genre: movie.genres?.[0]?.name || 'Movie', isTMDB: true, watchSeconds: 0 });
        localStorage.setItem('cinestream_watch_history', JSON.stringify(history.slice(0, 20)));
      }
    } catch (e) {}
  };

  return (
    <div className="watch-page" ref={topRef}>
      <Navbar />

      <button className="page-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
        <ArrowLeft size={16} strokeWidth={2} /> Back
      </button>

      {/* ── Full-Screen Video Player ── */}
      <div className="watch-player" style={{ background: '#000', position: 'relative', aspectRatio: '16/9' }}>
        {!playing ? (
          <>
            {backdropUrl && (
              <img
                src={backdropUrl}
                alt={title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
              />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              {trailer ? (
                <button
                  onClick={handlePlay}
                  style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--primary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 32px rgba(229,9,20,0.6)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 0 48px rgba(229,9,20,0.9)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(229,9,20,0.6)'; }}
                  aria-label="Play trailer"
                >
                  <Play size={30} fill="white" strokeWidth={0} />
                </button>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No trailer available for this title.</p>
              )}
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>
                {trailer ? 'Click to play official trailer' : ''}
              </p>
            </div>
            {/* Bottom info overlay */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 32px', background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                {movie.genres?.slice(0, 3).map(g => (
                  <span key={g.id} style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: 'rgba(229,9,20,0.25)', color: '#ff6b6b', border: '1px solid rgba(229,9,20,0.4)' }}>{g.name}</span>
                ))}
              </div>
              <h1 style={{ fontSize: 'clamp(20px,3vw,36px)', fontWeight: 900, fontFamily: 'var(--font-heading)', margin: 0, color: '#fff' }}>{title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8, color: 'var(--text-muted)', fontSize: 13, flexWrap: 'wrap' }}>
                <span style={{ color: '#f5c518', fontWeight: 700 }}>★ {rating}</span>
                <span>{releaseYear}</span>
                {runtime && <span>{runtime}</span>}
              </div>
            </div>
          </>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        )}
      </div>

      {/* ── Movie Info ── */}
      <div style={{ width: '92%', margin: '0 auto', padding: '40px 0 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start', marginBottom: 40 }}>
          <div>
            <h2 style={{ fontSize: 'clamp(22px,2.5vw,32px)', fontWeight: 900, marginBottom: 12 }}>{title}</h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f5c518', fontWeight: 700 }}>
                <Star size={13} fill="#f5c518" stroke="none" /> {rating}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>{releaseYear}</span>
              {runtime && <span style={{ color: 'var(--text-muted)' }}>{runtime}</span>}
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 720, marginBottom: 24, fontSize: 14 }}>
              {movie.overview || 'No description available.'}
            </p>
            {director && <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 6 }}><strong style={{ color: 'var(--text-muted)' }}>Director:</strong> {director}</p>}
            {cast && <p style={{ fontSize: 13, color: 'var(--text-dim)' }}><strong style={{ color: 'var(--text-muted)' }}>Cast:</strong> {cast}</p>}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ background: 'var(--surface-10)', border: '1px solid var(--outline)', borderRadius: 8, padding: '10px 16px', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <Plus size={15} /> My List
            </button>
            <button style={{ background: 'var(--surface-10)', border: '1px solid var(--outline)', borderRadius: 8, padding: '10px 16px', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <Share2 size={15} /> Share
            </button>
          </div>
        </div>

        {/* ── Recommended ── */}
        {recommended.length > 0 && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>You May Also Like</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
              {recommended.map(rec => (
                <div
                  key={rec.id}
                  onClick={() => navigate(`/watch/${rec.id}`)}
                  style={{ cursor: 'pointer', borderRadius: 8, overflow: 'hidden', background: 'var(--bg-surface)', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ aspectRatio: '2/3', position: 'relative', overflow: 'hidden' }}>
                    {rec.poster_path ? (
                      <img src={`${IMG_BASE}w300${rec.poster_path}`} alt={rec.title || rec.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-high)', color: 'var(--text-dim)', fontSize: 28 }}>
                        {(rec.title || rec.name)?.[0]}
                      </div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
                    >
                      <Play size={22} fill="white" strokeWidth={0} style={{ opacity: 0.9 }} />
                    </div>
                  </div>
                  <div style={{ padding: '8px 10px 12px' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3, marginBottom: 4 }}>{rec.title || rec.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>{(rec.release_date || rec.first_air_date || '').split('-')[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
