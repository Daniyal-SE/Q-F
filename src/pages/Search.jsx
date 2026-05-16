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
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('cinestream_search_history') || '[]'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const types = ['All', 'Movie', 'TV Show', 'Anime'];

  // Fetch trending on mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_KEY}`
        );
        const data = await res.json();

        const userSession = sessionStorage.getItem('cinestream_user') || '';
        const adultEnabled = localStorage.getItem(`cinestream_adult_enabled_${userSession}`) === 'true';
        const adultKeywords = ['sex', 'fuck', 'fucked', 'adult', '18+', 'erotic', 'porn', 'nude', 'sexually', 'romance'];
        const containsAdultWord = (text) => {
          if (!text) return false;
          const lower = text.toLowerCase();
          return adultKeywords.some(word => lower.includes(word));
        };

        const formattedTrending = (data.results || [])
          .filter(item => {
            if (adultEnabled) return true;
            if (item.adult === true) return false;
            if (containsAdultWord(item.title) || containsAdultWord(item.name) || containsAdultWord(item.overview)) return false;
            return true;
          })
          .slice(0, 18).map(item => ({
            id: item.id,
            title: item.title || item.name,
            poster: item.poster_path ? `${IMG_BASE}${item.poster_path}` : null,
            type: item.media_type === 'tv' ? 'TV Show' : 'Movie',
            year: (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A',
            rating: item.vote_average ? item.vote_average.toFixed(1) : null,
            genre: item.genre_ids?.[0] || null,
          }));

        setTrending(formattedTrending);
        setResults(formattedTrending);
      } catch (e) {
        console.error('Trending fetch error:', e);
      }
    };
    fetchTrending();
  }, []);

  const saveToHistory = (q) => {
    if (!q || q.length < 2) return;
    setHistory(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== q.toLowerCase());
      const newHistory = [q, ...filtered].slice(0, 10);
      localStorage.setItem('cinestream_search_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('cinestream_search_history');
  };

  // Live search with debounce
  useEffect(() => {
    if (!query.trim()) {
      let filteredTrending = trending;
      if (activeType === 'Movie') {
        filteredTrending = trending.filter(t => t.type === 'Movie');
      } else if (activeType === 'TV Show') {
        filteredTrending = trending.filter(t => t.type === 'TV Show');
      } else if (activeType === 'Anime') {
        filteredTrending = trending.filter(t => t.genre === 16 || t.original_language === 'ja');
      }
      setResults(filteredTrending);
      setTotalResults(filteredTrending.length);
      setTotalPages(1);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      // Don't show full loading spinner if just loading next page
      if (page === 1) {
        setIsLoading(true);
      }
      setError(null);

      try {
        const userSession = sessionStorage.getItem('cinestream_user') || '';
        const adultEnabled = localStorage.getItem(`cinestream_adult_enabled_${userSession}`) === 'true';
        const adultKeywords = ['sex', 'fuck', 'fucked', 'adult', '18+', 'erotic', 'porn', 'nude', 'sexually', 'romance', 'virgin'];
        const containsAdultWord = (text) => {
          if (!text) return false;
          const lower = text.toLowerCase();
          return adultKeywords.some(word => lower.includes(word));
        };

        // Silently block the search query if it contains adult words and adult content is disabled
        if (!adultEnabled && containsAdultWord(query)) {
          setResults([]);
          setTotalResults(0);
          setIsLoading(false);
          return;
        }

        const adultParam = adultEnabled ? '&include_adult=true' : '&include_adult=false';

        // Choose endpoint based on type filter
        let url = '';
        if (activeType === 'Movie') {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&sort_by=release_date.desc&language=en-US&page=${page}${adultParam}`;
        } else if (activeType === 'TV Show' || activeType === 'Anime') {
          url = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=${page}${adultParam}`;
        } else {
          url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=${page}${adultParam}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();

        let formatted = (data.results || [])
          .filter(item => item.media_type !== 'person' && (item.poster_path || item.backdrop_path))
          .filter(item => {
            if (adultEnabled) return true;
            if (item.adult === true) return false;
            if (containsAdultWord(item.title) || containsAdultWord(item.name) || containsAdultWord(item.overview)) return false;
            return true;
          })
          .filter(item => activeType !== 'Anime' || (item.original_language === 'ja' || item.origin_country?.includes('JP')))
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

        if (page === 1) {
          setResults(formatted);
        } else {
          setResults(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newItems = formatted.filter(f => !existingIds.has(f.id));
            return [...prev, ...newItems];
          });
        }
        setTotalResults(data.total_results || formatted.length);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to fetch results. Please try again.');
        if (page === 1) setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query, activeType, trending, page]);

  const goToDetail = (item) => {
    saveToHistory(query.trim());
    navigate(`/tmdb/${item.id}?type=${item.type === 'TV Show' ? 'tv' : 'movie'}`);
  };

  const clearQuery = () => {
    setQuery('');
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const handleTypeChange = (t) => {
    setActiveType(t);
    setPage(1);
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
    setPage(1);
  };

  return (
    <div className="search-page">
      <Navbar />

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
                onChange={handleSearchChange}
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

          {/* Recent Searches */}
          {!query && history.length > 0 && (
            <div className="search-history" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="label" style={{ color: 'var(--text-dim)', fontSize: '11px' }}>Recent Searches:</span>
                <button
                  onClick={clearHistory}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '11px', cursor: 'pointer', padding: '0 4px' }}
                >
                  Clear History
                </button>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {history.map((h, i) => (
                  <button
                    key={i}
                    className="search-tag"
                    onClick={() => handleTagClick(h)}
                    style={{ background: 'var(--surface-10)', border: '1px solid var(--outline)' }}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending tags */}
          <div className="search-trending">
            <span className="label" style={{ color: 'var(--text-dim)', fontSize: '11px' }}>Trending:</span>
            {TRENDING_TAGS.map(tag => (
              <button key={tag} className="search-tag" onClick={() => handleTagClick(tag)}>{tag}</button>
            ))}
          </div>

          {/* Type filters */}
          <div className="search-filters">
            <div className="search-type-tabs">
              {types.map(t => (
                <button
                  key={t}
                  className={`search-type-tab ${activeType === t ? 'active' : ''}`}
                  onClick={() => handleTypeChange(t)}
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

          {/* Pagination / Load More */}
          {query && !isLoading && !error && page < totalPages && (
            <div style={{ textAlign: 'center', marginTop: '40px', gridColumn: '1 / -1' }}>
              <button
                onClick={() => setPage(p => p + 1)}
                style={{
                  background: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 32px',
                  borderRadius: '30px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(229, 9, 20, 0.3)',
                  transition: 'transform 0.2s, background 0.2s'
                }}
                onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.target.style.transform = 'none'}
              >
                Load Next Page
              </button>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
}
