import React, { useState, useEffect, useRef } from 'react';
import './TMDBDetail.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Play, Star, Clock, Calendar, Globe, ChevronLeft, ChevronRight, Server, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomPlayer from '../components/CustomPlayer';

const TMDB_KEY = '1fa448de74c5dac88e0d31d99c7e916d';
const IMG_BASE = 'https://image.tmdb.org/t/p/';

export default function TMDBDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeParam = searchParams.get('type'); // 'tv' or 'movie'

  const [movie, setMovie] = useState(null);
  const [mediaType, setMediaType] = useState('movie');
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [recommended, setRecommended] = useState([]);
  const [stills, setStills] = useState([]);
  const [episodesList, setEpisodesList] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [server, setServer] = useState('vidsrc');
  const [showServers, setShowServers] = useState(false);
  const [customStreamData, setCustomStreamData] = useState(null);
  const [isFetchingCustom, setIsFetchingCustom] = useState(false);
  const topRef = useRef(null);
  const epRowRef = useRef(null);
  const watchSecondsRef = useRef(0);

  useEffect(() => {
    let interval = null;
    if (playing) {
      interval = setInterval(() => {
        watchSecondsRef.current += 1;
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (watchSecondsRef.current > 0 && movie) {
        try {
          const history = JSON.parse(localStorage.getItem('cinestream_watch_history') || '[]');
          const idx = history.findIndex(h => h.id === movie.id);
          if (idx !== -1) {
            history[idx].watchSeconds = (history[idx].watchSeconds || 0) + watchSecondsRef.current;
            // Move to front
            const item = history.splice(idx, 1)[0];
            history.unshift(item);
          } else {
            history.unshift({
              id: movie.id,
              title: movie.title || movie.name,
              poster: movie.poster_path ? `${IMG_BASE}w500${movie.poster_path}` : null,
              year: (movie.release_date || movie.first_air_date)?.split('-')[0] || 'N/A',
              genre: movie.genres?.[0]?.name || 'TMDB',
              type: mediaType === 'tv' ? 'TV Show' : 'Movie',
              isTMDB: true,
              watchSeconds: watchSecondsRef.current
            });
          }
          localStorage.setItem('cinestream_watch_history', JSON.stringify(history.slice(0, 20)));
        } catch (e) { }
        watchSecondsRef.current = 0;
      }
    };
  }, [playing, movie, mediaType]);

  useEffect(() => {
    setPlaying(false);
    setLoading(true);
    setMovie(null);
    setSeason(1);
    setEpisode(1);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });

    const fetchAll = async () => {
      try {
        let currentMediaType = typeParam === 'tv' ? 'tv' : 'movie';
        let detail = null;

        // If ID starts with 'tt', it's IMDB. We can fetch from RapidAPI or fallback to TMDB find.
        if (id.startsWith('tt')) {
          try {
            const options = {
              method: 'GET',
              headers: {
                'x-rapidapi-key': 'b7722b0064msh7cd5086cff01924p13b142jsna013f6e6bdde',
                'x-rapidapi-host': 'imdb236.p.rapidapi.com'
              }
            };
            // For now, TMDB find is much more reliable to get rich TMDB metadata using IMDB id.
            // RapidAPI title detail endpoint: `https://imdb236.p.rapidapi.com/imdb/${id}`
            const imdbRes = await fetch(`https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_KEY}&external_source=imdb_id`);
            const imdbData = await imdbRes.json();
            
            if (imdbData.movie_results?.length > 0) {
              currentMediaType = 'movie';
              const tmdbId = imdbData.movie_results[0].id;
              const dRes = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_KEY}&language=en-US&append_to_response=credits`);
              detail = await dRes.json();
            } else if (imdbData.tv_results?.length > 0) {
              currentMediaType = 'tv';
              const tmdbId = imdbData.tv_results[0].id;
              const dRes = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_KEY}&language=en-US&append_to_response=credits`);
              detail = await dRes.json();
            }
          } catch(e) { console.error("IMDB fetch error", e); }
        }

        if (!detail) {
          let detailRes = await fetch(`https://api.themoviedb.org/3/${currentMediaType}/${id}?api_key=${TMDB_KEY}&language=en-US&append_to_response=credits`);
          detail = await detailRes.json();

          // Fallback logic if we guessed wrong and user didn't provide a strict type parameter
          if ((!detail || detail.success === false) && !typeParam) {
            currentMediaType = 'tv';
            detailRes = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_KEY}&language=en-US&append_to_response=credits`);
            detail = await detailRes.json();
          }
        }

        const userSession = sessionStorage.getItem('cinestream_user') || '';
        const adultEnabled = localStorage.getItem(`cinestream_adult_enabled_${userSession}`) === 'true';
        const adultParam = adultEnabled ? '&include_adult=true' : '&include_adult=false';

        const realId = detail.id || id;
        const [recRes, imgRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/${currentMediaType}/${realId}/recommendations?api_key=${TMDB_KEY}&language=en-US&page=1${adultParam}`),
          fetch(`https://api.themoviedb.org/3/${currentMediaType}/${realId}/images?api_key=${TMDB_KEY}`)
        ]);

        const rec = await recRes.json();
        const imgData = await imgRes.json();

        setMovie({ ...detail, displayId: id }); // keep original ID (might be IMDB) for iframe
        setMediaType(currentMediaType);

        const adultKeywords = ['sex', 'fuck', 'fucked', 'adult', '18+', 'erotic', 'porn', 'nude', 'sexually', 'romance'];
        const containsAdultWord = (text) => {
          if (!text) return false;
          const lower = text.toLowerCase();
          return adultKeywords.some(word => lower.includes(word));
        };

        setRecommended(rec.results?.filter(m => {
          if (adultEnabled) return true;
          if (m.adult === true) return false;
          if (containsAdultWord(m.title) || containsAdultWord(m.name) || containsAdultWord(m.overview)) return false;
          return true;
        }).slice(0, 18) || []);

        // Filter out bad aspect ratios or low quality if needed, just take first 6 backdrops
        setStills(imgData.backdrops?.slice(0, 6) || []);
      } catch (e) {
        console.error('TMDB fetch error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id, typeParam]);

  useEffect(() => {
    if (mediaType === 'tv' && movie && movie.id) {
      const fetchEpisodes = async () => {
        try {
          const res = await fetch(`https://api.themoviedb.org/3/tv/${movie.id}/season/${season}?api_key=${TMDB_KEY}&language=en-US`);
          const data = await res.json();
          setEpisodesList(data.episodes || []);

          // Use episode stills as scene images for TV shows
          const episodeStills = (data.episodes || [])
            .filter(ep => ep.still_path)
            .slice(0, 9)
            .map(ep => ({ file_path: ep.still_path }));
          if (episodeStills.length > 0) {
            setStills(episodeStills);
          }
        } catch (e) {
          console.error("Episode fetch error", e);
        }
      };
      fetchEpisodes();
    }
  }, [season, id, mediaType, movie]);



  if (loading) {
    return (
      <div className="tmdb-detail">
        <Navbar showBack={true} />
        <div className="tmdb-detail__loading">
          <div className="tmdb-detail__spinner" />
          <p>Loading details...</p>
        </div>
      </div>
    );
  }

  if (!movie || movie.success === false) {
    return (
      <div className="tmdb-detail">
        <Navbar showBack={true} />
        <div className="tmdb-detail__loading">
          <p>Content not found.</p>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `${IMG_BASE}original${movie.backdrop_path}`
    : movie.poster_path
      ? `${IMG_BASE}w1280${movie.poster_path}`
      : null;

  const posterUrl = movie.poster_path
    ? `${IMG_BASE}w500${movie.poster_path}`
    : null;

  const title = movie.title || movie.name;
  const releaseYear = (movie.release_date || movie.first_air_date)?.split('-')[0] || 'N/A';
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : movie.episode_run_time?.[0] ? `${movie.episode_run_time[0]}m` : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  const director = movie.credits?.crew?.find(c => c.job === 'Director')?.name || 'N/A';
  const cast = movie.credits?.cast?.slice(0, 5).map(c => c.name).join(', ') || 'N/A';

  // Determine iframe source based on selected server
  const getIframeSrc = () => {
    const playId = movie.displayId || id;
    if (server === 'vidsrc') {
      return mediaType === 'tv'
        ? `https://vidsrc.me/embed/tv?tmdb=${playId}&season=${season}&episode=${episode}`
        : `https://vidsrc.me/embed/movie?tmdb=${playId}`;
    }
    if (server === 'vidsrcto') {
      return mediaType === 'tv'
        ? `https://vidsrc.to/embed/tv/${playId}/${season}/${episode}`
        : `https://vidsrc.to/embed/movie/${playId}`;
    }
    if (server === 'vidsrcpro') {
      return mediaType === 'tv'
        ? `https://vidsrc.pro/embed/tv/${playId}/${season}/${episode}`
        : `https://vidsrc.pro/embed/movie/${playId}`;
    }
    if (server === 'embedsu') {
      return mediaType === 'tv'
        ? `https://embed.su/embed/tv/${playId}/${season}/${episode}`
        : `https://embed.su/embed/movie/${playId}`;
    }
    if (server === 'multiembed') {
      return mediaType === 'tv'
        ? `https://multiembed.mov/?video_id=${playId}&tmdb=1&s=${season}&e=${episode}`
        : `https://multiembed.mov/?video_id=${playId}&tmdb=1`;
    }
    if (server === 'vidsrcxyz') {
      return mediaType === 'tv'
        ? `https://vidsrc.xyz/embed/tv/${playId}/${season}/${episode}`
        : `https://vidsrc.xyz/embed/movie/${playId}`;
    }
    if (server === 'smashystream') {
      return mediaType === 'tv'
        ? `https://player.smashy.stream/tv/${playId}?s=${season}&e=${episode}`
        : `https://player.smashy.stream/movie/${playId}`;
    }
    if (server === '2embed') {
      return mediaType === 'tv'
        ? `https://www.2embed.cc/embedtv/${playId}&s=${season}&e=${episode}`
        : `https://www.2embed.cc/embed/${playId}`;
    }
    if (server === 'superembed') {
      return mediaType === 'tv'
        ? `https://superembed.stream/embed?tmdb_id=${playId}&type=tv&season=${season}&episode=${episode}`
        : `https://superembed.stream/embed?tmdb_id=${playId}&type=movie`;
    }
    return '';
  };

  const handleServerChange = (srv) => {
    setServer(srv);
    setShowServers(false);
    setCustomStreamData(null);
    // All servers now use iframes — no special fetch needed
    if (!playing) setPlaying(true);
  };

  const scrollLeft = () => epRowRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  const scrollRight = () => epRowRef.current?.scrollBy({ left: 320, behavior: 'smooth' });

  return (
    <div className="tmdb-detail" ref={topRef}>
      <Navbar showBack={true} />

      {/* Floating Back Button — always on top, never blocked by iframe */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 18px',
          borderRadius: '9999px',
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          transition: 'all 0.2s ease',
          pointerEvents: 'all'
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(229,9,20,0.85)'; e.currentTarget.style.borderColor = 'rgba(229,9,20,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.75)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
        aria-label="Go Back"
      >
        &#8592; Back
      </button>

      {/* Hero backdrop */}
      {backdropUrl && (
        <div
          className="tmdb-detail__hero"
          style={{ backgroundImage: `url("${backdropUrl}")` }}
        >
          <div className="tmdb-detail__hero-gradient" />
        </div>
      )}

      <div className="tmdb-detail__content container">

        {/* Header */}
        <div className="tmdb-detail__header">

          {/* Poster */}
          {posterUrl && (
            <div className="tmdb-detail__poster">
              <img src={posterUrl} alt={title} />
            </div>
          )}

          {/* Info */}
          <div className="tmdb-detail__info">
            {/* Genres */}
            <div className="tmdb-detail__genres">
              {movie.genres?.map(g => (
                <span key={g.id} className="genre-tag">{g.name}</span>
              ))}
            </div>

            <h1 className="tmdb-detail__title">{title}</h1>

            {movie.tagline && (
              <p className="tmdb-detail__tagline">"{movie.tagline}"</p>
            )}

            <div className="tmdb-detail__meta">
              <span className="tmdb-detail__rating">
                <Star size={14} fill="#f5c518" stroke="none" />
                {rating}
                <span className="tmdb-detail__vote-count">({movie.vote_count?.toLocaleString()} votes)</span>
              </span>
              <span>•</span>
              <span><Calendar size={13} /> {releaseYear}</span>
              <span>•</span>
              <span><Clock size={13} /> {runtime}</span>
              {movie.original_language && (
                <>
                  <span>•</span>
                  <span><Globe size={13} /> {movie.original_language?.toUpperCase()}</span>
                </>
              )}
            </div>

            {/* Credits */}
            <div className="tmdb-detail__credits">
              <div className="credit-item">
                <span className="label">{mediaType === 'tv' ? 'Creator' : 'Director'}</span>
                <span>{mediaType === 'tv' ? (movie.created_by?.[0]?.name || 'N/A') : director}</span>
              </div>
              <div className="credit-item">
                <span className="label">Starring</span>
                <span>{cast}</span>
              </div>
              {movie.production_companies?.[0] && (
                <div className="credit-item">
                  <span className="label">Studio</span>
                  <span>{movie.production_companies[0].name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="tmdb-detail__overview">
          <h2>Overview</h2>
          <p>{movie.overview || 'No description available.'}</p>
        </div>

        {/* Stream Player */}
        <div className="tmdb-detail__trailer">
          <h2>Stream {mediaType === 'tv' ? 'Series' : 'Movie'}</h2>

          {mediaType === 'tv' && (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <select
                value={season}
                onChange={(e) => { setSeason(e.target.value); setEpisode(1); }}
                style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--surface-10)', color: 'white', border: '1px solid var(--outline)', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
              >
                {movie.seasons?.filter(s => s.season_number > 0).map(s => (
                  <option key={s.season_number} value={s.season_number}>Season {s.season_number}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <button 
              onClick={() => setShowServers(true)} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--primary)', background: 'rgba(229,9,20,0.1)', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
            >
              <Server size={18} color="var(--primary)" /> Change Server
            </button>

            {showServers && (
              <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 100, background: 'var(--bg-surface)', border: '1px solid var(--outline)', borderRadius: '12px', padding: '16px', width: '100%', maxWidth: '600px', marginTop: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>Select Streaming Server</h3>
                  <button onClick={() => setShowServers(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                  {[
                    { id: 'vidsrc',      label: 'VidSrc.me',     badge: '★ Fast' },
                    { id: 'vidsrcto',    label: 'VidSrc.to',     badge: '' },
                    { id: 'vidsrcpro',   label: 'VidSrc.pro',    badge: '' },
                    { id: 'embedsu',     label: 'Embed.su',      badge: '★ HD' },
                    { id: 'multiembed',  label: 'MultiEmbed',    badge: '' },
                    { id: 'vidsrcxyz',   label: 'VidSrc.xyz',    badge: '' },
                    { id: 'smashystream',label: 'SmashyStream',  badge: '' },
                    { id: '2embed',      label: '2Embed',        badge: '' },
                    { id: 'superembed',  label: 'SuperEmbed',    badge: '' },
                  ].map(({ id: srv, label, badge }) => (
                    <button 
                      key={srv}
                      onClick={() => handleServerChange(srv)} 
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid', borderColor: server === srv ? 'var(--primary)' : 'var(--surface-10)', background: server === srv ? 'rgba(229,9,20,0.2)' : 'var(--surface-10)', color: 'white', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s', textAlign: 'center' }}
                      onMouseEnter={e => { if(server!==srv) e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
                      onMouseLeave={e => { if(server!==srv) e.currentTarget.style.borderColor = 'var(--surface-10)'; }}
                    >
                      <div>{label}</div>
                      {badge && <div style={{ fontSize: '10px', color: '#f5c518', marginTop: '3px' }}>{badge}</div>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="trailer-player" style={{ position: 'relative' }}>
            {/* Iframe click-recapture overlay: appears briefly after click in iframe to restore page focus */}
            {playing && !customStreamData && !isFetchingCustom && (
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '50px',
                  zIndex: 10,
                  background: 'transparent',
                  cursor: 'default'
                }}
                title="Click here to restore page controls"
              />
            )}
            {!playing ? (
              <>
                {backdropUrl && (
                  <img
                    className="trailer-player__bg"
                    src={backdropUrl}
                    alt="stream backdrop"
                  />
                )}
                <div className="trailer-player__overlay" />
                <button
                  className="trailer-player__play"
                  onClick={() => setPlaying(true)}
                  aria-label={`Play ${mediaType === 'tv' ? 'Episode' : 'Movie'}`}
                >
                  <Play size={28} fill="white" strokeWidth={0} />
                </button>
              </>
            ) : isFetchingCustom ? (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: 'white' }}>
                 Loading Custom Stream...
              </div>
            ) : customStreamData ? (
              <CustomPlayer src={customStreamData.src} type={customStreamData.type} poster={backdropUrl} />
            ) : (
              <iframe
                width="100%"
                height="100%"
                src={getIframeSrc()}
                title="Stream Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '8px' }}
              />
            )}
          </div>
          {/* Fullscreen = landscape on mobile */}
          <style dangerouslySetInnerHTML={{
            __html: `
            @media (max-width: 768px) {
              .trailer-player iframe:-webkit-full-screen { transform: rotate(90deg) scale(1.78); transform-origin: center center; }
              .trailer-player iframe:fullscreen { transform: rotate(90deg) scale(1.78); transform-origin: center center; }
            }
          `}} />
        </div>

        {/* Episodes Row */}
        {mediaType === 'tv' && episodesList.length > 0 && (
          <div className="tmdb-detail__episodes" style={{ marginTop: '80px', position: 'relative' }}>
            <h2 style={{ marginBottom: '16px', fontSize: '22px' }}>Season {season} Episodes</h2>

            <button className="ep-arrow left" onClick={scrollLeft} style={{ position: 'absolute', left: '-20px', top: '55%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={24} />
            </button>

            <div ref={epRowRef} style={{ display: 'flex', overflowX: 'auto', gap: '20px', scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'x mandatory', paddingBottom: '10px' }}>
              {episodesList.map(ep => (
                <div
                  key={ep.id}
                  onClick={() => { setEpisode(ep.episode_number); setPlaying(true); topRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                  style={{ flex: '0 0 280px', scrollSnapAlign: 'start', background: 'var(--surface)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: Number(episode) === ep.episode_number ? '2px solid var(--primary)' : '2px solid transparent', transition: '0.2s' }}
                >
                  <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: 'var(--surface-10)', position: 'relative' }}>
                    {ep.still_path ? (
                      <img src={`${IMG_BASE}w300${ep.still_path}`} alt={ep.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No Image</div>
                    )}
                    <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
                      Ep {ep.episode_number}
                    </div>
                  </div>
                  <div style={{ padding: '12px' }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ep.name}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-dim)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {ep.overview || 'No overview available.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="ep-arrow right" onClick={scrollRight} style={{ position: 'absolute', right: '-20px', top: '55%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={24} />
            </button>
            <style dangerouslySetInnerHTML={{
              __html: `
              .tmdb-detail__episodes > div::-webkit-scrollbar { display: none; }
              @media (max-width: 768px) {
                .ep-arrow { display: none !important; }
                .tmdb-detail__episodes > div { padding: 0 16px; margin: 0 -16px; scroll-padding-left: 16px; }
              }
            `}} />
          </div>
        )}

        {/* Stills / Scenes */}
        {stills.length > 0 && (
          <div className="tmdb-detail__stills" style={{ marginTop: '80px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>{mediaType === 'tv' ? 'Scene Stills' : 'Movie Scenes'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {stills.map((still, i) => (
                <img
                  key={i}
                  src={`${IMG_BASE}w780${still.file_path}`}
                  alt="Scene"
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '8px', background: 'var(--surface-10)' }}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        )}

        {/* Recommended Movies */}
        {recommended.length > 0 && (
          <div className="tmdb-detail__recommended" style={{ marginTop: '80px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>You May Also Like</h2>
            <div className="tmdb-recommended-grid">
              {recommended.map(rec => (
                <div
                  key={rec.id}
                  className="tmdb-rec-card"
                  onClick={() => navigate(`/tmdb/${rec.id}?type=${mediaType}`)}
                  title={rec.title || rec.name}
                >
                  <div className="tmdb-rec-card__poster">
                    {rec.poster_path ? (
                      <img
                        src={`${IMG_BASE}w300${rec.poster_path}`}
                        alt={rec.title || rec.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="tmdb-rec-card__no-poster">
                        <span>{(rec.title || rec.name)?.[0]}</span>
                      </div>
                    )}
                    <div className="tmdb-rec-card__overlay">
                      <Play size={20} fill="white" strokeWidth={0} />
                    </div>
                    {rec.vote_average > 0 && (
                      <span className="tmdb-rec-card__rating">
                        <Star size={9} fill="#f5c518" stroke="none" />
                        {rec.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div className="tmdb-rec-card__info">
                    <p className="tmdb-rec-card__title">{rec.title || rec.name}</p>
                    <p className="tmdb-rec-card__year">{(rec.release_date || rec.first_air_date)?.split('-')[0] || ''}</p>
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
