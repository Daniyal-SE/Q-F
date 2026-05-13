import React, { useState, useEffect, useRef } from 'react';
import './TMDBDetail.css';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Star, ArrowLeft, Clock, Calendar, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TMDB_KEY = '1fa448de74c5dac88e0d31d99c7e916d';
const IMG_BASE = 'https://image.tmdb.org/t/p/';

export default function TMDBDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const topRef = useRef(null);

  useEffect(() => {
    setPlaying(false);
    setLoading(true);
    setMovie(null);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });

    const fetchAll = async () => {
      try {
        const [detailRes, videosRes, recRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=en-US&append_to_response=credits`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${TMDB_KEY}&language=en-US&page=1`),
        ]);

        const detail = await detailRes.json();
        const videos = await videosRes.json();
        const rec = await recRes.json();

        setMovie(detail);

        // Find the best trailer
        const trailerVideo =
          videos.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
          videos.results?.find(v => v.site === 'YouTube');
        setTrailer(trailerVideo || null);

        setRecommended(rec.results?.slice(0, 18) || []);
      } catch (e) {
        console.error('TMDB fetch error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <div className="tmdb-detail">
        <Navbar />
        <div className="tmdb-detail__loading">
          <div className="tmdb-detail__spinner" />
          <p>Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie || movie.success === false) {
    return (
      <div className="tmdb-detail">
        <Navbar />
        <div className="tmdb-detail__loading">
          <p>Movie not found.</p>
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

  const posterUrl = movie.poster_path
    ? `${IMG_BASE}w500${movie.poster_path}`
    : null;

  const releaseYear = movie.release_date?.split('-')[0] || 'N/A';
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  const director = movie.credits?.crew?.find(c => c.job === 'Director')?.name || 'N/A';
  const cast = movie.credits?.cast?.slice(0, 5).map(c => c.name).join(', ') || 'N/A';

  return (
    <div className="tmdb-detail" ref={topRef}>
      <Navbar />

      {/* Hero backdrop */}
      {backdropUrl && (
        <div
          className="tmdb-detail__hero"
          style={{ backgroundImage: `url("${backdropUrl}")` }}
        >
          <div className="tmdb-detail__hero-gradient" />
        </div>
      )}

      <button className="page-back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} strokeWidth={2} /> Back
      </button>

      <div className="tmdb-detail__content container">

        {/* Header */}
        <div className="tmdb-detail__header">

          {/* Poster */}
          {posterUrl && (
            <div className="tmdb-detail__poster">
              <img src={posterUrl} alt={movie.title} />
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

            <h1 className="tmdb-detail__title">{movie.title}</h1>

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

            <div className="tmdb-detail__actions">
              {trailer && (
                <button className="btn btn-primary" onClick={() => setPlaying(true)}>
                  <Play size={16} fill="white" strokeWidth={0} />
                  Watch Trailer
                </button>
              )}
              <button className="btn btn-outline" onClick={() => navigate(-1)}>
                <ArrowLeft size={15} /> Back to Search
              </button>
            </div>

            {/* Credits */}
            <div className="tmdb-detail__credits">
              <div className="credit-item">
                <span className="label">Director</span>
                <span>{director}</span>
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

        {/* Trailer */}
        {trailer && (
          <div className="tmdb-detail__trailer">
            <h2>Official Trailer</h2>
            <div className="trailer-player">
              {!playing ? (
                <>
                  {backdropUrl && (
                    <img
                      className="trailer-player__bg"
                      src={backdropUrl}
                      alt="trailer backdrop"
                    />
                  )}
                  <div className="trailer-player__overlay" />
                  <button
                    className="trailer-player__play"
                    onClick={() => setPlaying(true)}
                    aria-label="Play trailer"
                  >
                    <Play size={28} fill="white" strokeWidth={0} />
                  </button>
                </>
              ) : (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                  title="Official Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />
              )}
            </div>
          </div>
        )}

        {/* Recommended Movies */}
        {recommended.length > 0 && (
          <div className="tmdb-detail__recommended">
            <h2>You May Also Like</h2>
            <div className="tmdb-recommended-grid">
              {recommended.map(rec => (
                <div
                  key={rec.id}
                  className="tmdb-rec-card"
                  onClick={() => navigate(`/tmdb/${rec.id}`)}
                  title={rec.title}
                >
                  <div className="tmdb-rec-card__poster">
                    {rec.poster_path ? (
                      <img
                        src={`${IMG_BASE}w300${rec.poster_path}`}
                        alt={rec.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="tmdb-rec-card__no-poster">
                        <span>{rec.title?.[0]}</span>
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
                    <p className="tmdb-rec-card__title">{rec.title}</p>
                    <p className="tmdb-rec-card__year">{rec.release_date?.split('-')[0] || ''}</p>
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
