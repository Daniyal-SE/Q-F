import React, { useState, useEffect } from 'react';
import './Search.css';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Mic, Star, ChevronDown, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { searchResults } from '../data/mockData';

const TRENDING_TAGS = ['Demon Slayer', 'The Batman', 'Attack on Titan', 'Oppenheimer'];

const getBadgeClass = (badge) => {
  if (!badge) return '';
  if (badge === '4K') return 'badge-4k';
  if (badge === 'TV') return 'badge-tv';
  if (badge === 'NEW') return 'badge-new';
  return 'badge-outline';
};

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [genre, setGenre] = useState('All');
  const [year, setYear] = useState('2024');

  const [results, setResults] = useState(searchResults);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const types = ['All', 'Movies', 'Anime'];
  const genres = ['All', 'Action', 'Sci-Fi', 'Anime', 'Thriller', 'Adventure', 'Mystery', 'Comedy'];
  const years = ['All', '2024', '2023', '2022', '2021', '2020'];

  // =========================================================================
  // API CONFIGURATION (PLACE YOUR API DETAILS HERE)
  // =========================================================================
  const API_KEYS = {
    MOVIES: 'YOUR_MOVIE_API_KEY_HERE', // e.g., TMDB API Key
    ANIME: 'YOUR_ANIME_API_KEY_HERE',  // e.g., Jikan API (leave blank if no key needed)
    ALL: 'YOUR_DEFAULT_API_KEY_HERE'   // e.g., A generic multi-search API Key
  };

  const API_ENDPOINTS = {
    MOVIES: 'https://api.themoviedb.org/3/search/movie',
    ANIME: 'https://api.jikan.moe/v4/anime',
    ALL: 'https://api.themoviedb.org/3/search/multi'
  };

  useEffect(() => {
    // If no filters/query are active, you can either fetch trending data or show default mock data
    if (!query && genre === 'All' && activeType === 'All' && year === 'All') {
      setResults(searchResults);
      return;
    }

    const fetchApiData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        /*
        // -----------------------------------------------------------------
        // UNCOMMENT THIS BLOCK TO ACTIVATE YOUR REAL APIS
        // -----------------------------------------------------------------
        
        // 1. Select the correct API URL based on what tab the user clicked
        let fetchUrl = '';
        
        if (activeType === 'Movies') {
          fetchUrl = `${API_ENDPOINTS.MOVIES}?query=${encodeURIComponent(query)}&api_key=${API_KEYS.MOVIES}`;
        } else if (activeType === 'Anime') {
          fetchUrl = `${API_ENDPOINTS.ANIME}?q=${encodeURIComponent(query)}&limit=20`; // Jikan usually uses 'q'
        } else {
          // 'All' tab - Use a multi-search API endpoint
          fetchUrl = `${API_ENDPOINTS.ALL}?query=${encodeURIComponent(query)}&api_key=${API_KEYS.ALL}`;
        }

        // 2. Fetch the data securely
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error(`Network response failed for ${activeType} API`);
        const data = await response.json();
        
        // 3. Format the data perfectly to match your UI, regardless of which API sent it
        let formattedResults = [];

        if (activeType === 'Movies') {
          formattedResults = data.results.map(item => ({
            id: item.id,
            title: item.title,
            poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'placeholder.jpg',
            type: 'Movie',
            genre: 'Action', // Use genre mapper function here if needed
            year: item.release_date ? item.release_date.split('-')[0] : 'N/A',
            rating: item.vote_average ? item.vote_average.toFixed(1) : null
          }));
        } else if (activeType === 'Anime') {
          formattedResults = data.data.map(item => ({
            id: item.mal_id,
            title: item.title,
            poster: item.images.jpg.large_image_url,
            type: 'Anime',
            genre: item.genres?.[0]?.name || 'Anime',
            year: item.year || 'N/A',
            rating: item.score ? item.score.toFixed(1) : null
          }));
        } else {
           // Mapping logic for the 'All' API ...
           formattedResults = data.results.map(item => ({
             id: item.id,
             title: item.title || item.name,
             poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'placeholder.jpg',
             type: item.media_type === 'tv' ? 'Anime' : 'Movie',
             genre: 'Mixed',
             year: item.release_date ? item.release_date.split('-')[0] : 'N/A',
             rating: item.vote_average ? item.vote_average.toFixed(1) : null
           }));
        }

        setResults(formattedResults);
        return; // Exit here so mock data doesn't override real data
        */

        // --- MOCK API DELAY (Simulating network request for testing) ---
        await new Promise(resolve => setTimeout(resolve, 400));

        // Temporary logic to filter mockData until you attach the real API above
        const simulatedData = searchResults.filter(item => {
          if (activeType !== 'All' && item.type !== activeType.replace('s', '')) return false;
          if (genre !== 'All' && item.genre !== genre) return false;
          if (year !== 'All' && String(item.year) !== year) return false;
          if (query && !item.title.toLowerCase().includes(query.toLowerCase())) return false;
          return true;
        });

        setResults(simulatedData);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch results. Please check your API connection.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the API call so it doesn't fire on every single keystroke
    const debounceTimer = setTimeout(() => {
      fetchApiData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query, activeType, genre, year]);

  const goToDetail = (item) => {
    if (item.type === 'Anime') navigate(`/anime/${item.id}`);
    else navigate(`/movie/${item.id}`);
  };

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
                placeholder="Search movies, anime, actors..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoFocus
              />
              <button className="search-bar__mic" aria-label="Voice search">
                <Mic size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Trending tags */}
          <div className="search-trending">
            <span className="label" style={{ color: 'var(--text-dim)', fontSize: '11px' }}>Trending:</span>
            {TRENDING_TAGS.map(tag => (
              <button key={tag} className="search-tag" onClick={() => setQuery(tag)}>{tag}</button>
            ))}
          </div>

          {/* Filters */}
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

            <div className="search-dropdowns">
              <div className="search-dropdown">
                <select value={genre} onChange={e => setGenre(e.target.value)} className="search-select">
                  {genres.map(g => <option key={g} value={g}>Genre: {g}</option>)}
                </select>
                <ChevronDown size={14} className="search-select-icon" />
              </div>
              <div className="search-dropdown">
                <select value={year} onChange={e => setYear(e.target.value)} className="search-select">
                  {years.map(y => <option key={y} value={y}>Year: {y}</option>)}
                </select>
                <ChevronDown size={14} className="search-select-icon" />
              </div>
            </div>

            <div className="search-sort">
              <span className="label" style={{ color: 'var(--text-dim)', fontSize: '11px' }}>Sort By</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Newest Arrivals</span>
            </div>
          </div>

          <div className="search-divider" />

          {/* Results grid */}
          <div className="search-results">
            {isLoading ? (
              <div className="search-loading" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                Searching our database...
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
                      <img src={item.poster} alt={item.title} loading="lazy" />
                      <div className="search-result-card__overlay">
                        <span>▶</span>
                      </div>
                      {item.badge && (
                        <span className={`badge ${getBadgeClass(item.badge)} search-result-card__badge`}>
                          {item.badge}
                        </span>
                      )}
                      {item.rating && (
                        <span className="search-result-card__rating">
                          <Star size={10} fill="#f5c518" stroke="none" /> {item.rating}
                        </span>
                      )}
                    </div>
                    <div className="search-result-card__info">
                      <h3 className="search-result-card__title">{item.title}</h3>
                      <p className="search-result-card__meta">
                        {item.year} • {item.type} • {item.genre}
                      </p>
                    </div>
                  </div>
                ))}

                {results.length === 0 && (
                  <div className="search-empty" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                    No results found for "{query}". Try a different genre or keyword.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Load more */}
          <div className="search-load-more">
            <button className="search-load-btn label">Load More Results</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
