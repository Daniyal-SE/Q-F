import React, { useState, useEffect, useCallback } from 'react';
import './Search.css';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Star, ChevronDown, ArrowLeft, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TMDB_KEY = '1fa448de74c5dac88e0d31d99c7e916d';
const IMG_BASE = 'https://image.tmdb.org/t/p/w300';

const TRENDING_TAGS = ['Avengers', 'Spider-Man', 'Demon Slayer', 'Inception', 'Interstellar', 'Oppenheimer'];

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  const types = ['All', 'Movie', 'TV Show'];

  // Fetch trending on mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_KEY}`
        );
        const data = await res.json();
        setTrending(data.results?.slice(0, 18) || []);
        setResults(data.results?.slice(0, 18) || []);
      } catch (e) {
        console.error('Trending fetch error:', e);
      }
    };
    fetchTrending();
  }, []);

  // Live search with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults(trending);
      setTotalResults(trending.length);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Choose endpoint based on type filter
        let url = '';
        if (activeType === 'Movie') {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&sort_by=release_date.desc&language=en-US&page=1`;
        } else if (activeType === 'TV Show') {
          url = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`;
        } else {
          url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();

        // Format results sorted by release date (newest first)
        let formatted = (data.results || [])
          .filter(item => item.media_type !== 'person' && (item.poster_path || item.backdrop_path))
          .sort((a, b) => {
            const dateA = a.release_date || a.first_air_date || '0';
            const dateB = b.release_date || b.first_air_date || '0';
            return dateB.localeCompare(dateA);
          })
          .map(item => ({
            id: item.id,
            title: item.title || item.name,
            poster: item.poster_path ? `${IMG_BASE}${item.poster_path}` : null,
            type: item.media_type === 'tv' ? 'TV Show' : 'Movie',
            year: (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A',
            rating: item.vote_average ? item.vote_average.toFixed(1) : null,
            genre: item.genre_ids?.[0] || null,
          }));

        setResults(formatted);
        setTotalResults(data.total_results || formatted.length);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to fetch results. Please try again.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 350); // 350ms debounce — fast enough to feel instant

    return () => clearTimeout(timer);
  }, [query, activeType, trending]);

  const goToDetail = (item) => {
    navigate(`/tmdb/${item.id}`);
  };

  const clearQuery = () => setQuery('');

  return (
    <div className="search-page">
      <Navbar />

      <button className="page-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
        <ArrowLeft size={16} strokeWidth={2} /> Back
      </button>

      <div className="search-page__content">
        <div className="container">

          {/* Search bar */}
          <div className="search-bar-wrap">
            <div className="search-bar">
              <SearchIcon size={20} strokeWidth={1.5} className="search-bar__icon" />
              <input
                id="search-input"
                type="text"
                className="search-bar__input"
                placeholder="Search any movie, TV show..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoFocus
              />
              {query && (
                <button
                  className="search-bar__mic"
                  aria-label="Clear search"
                  onClick={clearQuery}
                >
                  <X size={16} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>

          {/* Trending tags */}
          <div className="search-trending">
            <span className="label" style={{ color: 'var(--text-dim)', fontSize: '11px' }}>Trending:</span>
            {TRENDING_TAGS.map(tag => (
              <button key={tag} className="search-tag" onClick={() => setQuery(tag)}>{tag}</button>
            ))}
          </div>

          {/* Type filters */}
          <div className="search-filters">
            <div className="search-type-tabs">
              {types.map(t => (
                <button
                  key={t}
                  className={`search-type-tab ${activeType === t ? 'active' : ''}`}
                  onClick={() => setActiveType(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="search-sort">
              <span className="label" style={{ color: 'var(--text-dim)', fontSize: '11px' }}>
                {query
                  ? `${totalResults.toLocaleString()} results for "${query}"`
                  : 'Trending This Week'}
              </span>
            </div>
          </div>

          <div className="search-divider" />

          {/* Results grid */}
          <div className="search-results">
            {isLoading ? (
              <div className="search-loading" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ marginTop: '12px' }}>Searching TMDB...</p>
              </div>
            ) : error ? (
              <div className="search-error" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: '#ff4d4d' }}>
                {error}
              </div>
            ) : (
              <>
                {results.map(item => (
                  <div key={item.id} className="search-result-card" onClick={() => goToDetail(item)}>
                    <div className="search-result-card__poster">
                      {item.poster ? (
                        <img src={item.poster} alt={item.title} loading="lazy" />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'var(--surface-10)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 900, color: 'var(--text-dim)' }}>
                          {item.title?.[0]}
                        </div>
                      )}
                      <div className="search-result-card__overlay">
                        <span>▶</span>
                      </div>
                      {item.rating && (
                        <span className="search-result-card__rating">
                          <Star size={10} fill="#f5c518" stroke="none" /> {item.rating}
                        </span>
                      )}
                    </div>
                    <div className="search-result-card__info">
                      <h3 className="search-result-card__title">{item.title}</h3>
                      <p className="search-result-card__meta">
                        {item.year} • {item.type}
                      </p>
                    </div>
                  </div>
                ))}

                {results.length === 0 && query && (
                  <div className="search-empty" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                    No results found for "{query}". Try a different keyword.
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
