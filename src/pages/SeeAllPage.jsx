import React, { useEffect, useRef, useState } from 'react';
import './SeeAllPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import MediaCard from '../components/MediaCard';
import Footer from '../components/Footer';

const TMDB_KEY = '1fa448de74c5dac88e0d31d99c7e916d';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

// Mapping each section ID to its corresponding TMDB API endpoint configuration
const CATEGORY_ENDPOINTS = {
  kdrama: {
    url: (page, adultParam) =>
      `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_KEY}&with_original_language=ko&sort_by=popularity.desc${adultParam}&page=${page}`,
    applyFilter: false
  },
  bollywood: {
    url: (page, adultParam, movieCertParam) =>
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_original_language=hi&sort_by=popularity.desc${adultParam}${movieCertParam}&page=${page}`,
    applyFilter: false
  },
  action: {
    url: (page, adultParam, movieCertParam) =>
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=28&sort_by=popularity.desc${adultParam}${movieCertParam}&page=${page}`,
    applyFilter: true
  },
  hollywood: {
    url: (page, adultParam, movieCertParam) =>
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_original_language=en&sort_by=popularity.desc${adultParam}${movieCertParam}&page=${page}`,
    applyFilter: true
  },
  scifi: {
    url: (page, adultParam, movieCertParam) =>
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=878&sort_by=popularity.desc${adultParam}${movieCertParam}&page=${page}`,
    applyFilter: true
  },
  'anime-picks': {
    url: (page, adultParam, movieCertParam) =>
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=16&sort_by=popularity.desc${adultParam}${movieCertParam}&page=${page}`,
    applyFilter: true
  },
  punjabi: {
    url: (page, adultParam, movieCertParam) =>
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_original_language=pa&sort_by=popularity.desc${adultParam}${movieCertParam}&page=${page}`,
    applyFilter: false
  },
  anime: {
    url: (page, adultParam) =>
      `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_KEY}&with_genres=16&with_original_language=ja&sort_by=popularity.desc${adultParam}&page=${page}`,
    applyFilter: true
  },
  romance: {
    // Romance genre (10749) — always force include_adult=true, no keyword filter
    url: (page) =>
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=10749&sort_by=popularity.desc&include_adult=true&page=${page}`,
    applyFilter: false
  }
};

export default function SeeAllPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const topRef = useRef(null);
  const observerRef = useRef(null);
  const loadMoreTriggerRef = useRef(null);

  // Data is passed via router state: { id, title, items, fromScrollY }
  const { id = '', title = 'All Titles', items = [], fromScrollY = 0 } = location.state || {};

  const [allTitles, setAllTitles] = useState(items);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(items.length > 0);

  useEffect(() => {
    // Always start at the top of the SeeAll page
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleBack = () => {
    navigate(-1);
    // After navigation, restore scroll position on the home page
    setTimeout(() => {
      window.scrollTo({ top: fromScrollY, behavior: 'instant' });
    }, 50);
  };

  // Fetch next page of content
  const loadNextPage = async () => {
    if (loading || !hasMore || !id || !CATEGORY_ENDPOINTS[id]) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const userSession = sessionStorage.getItem('cinestream_user') || '';
      const adultEnabled = localStorage.getItem(`cinestream_adult_enabled_${userSession}`) === 'true';
      const adultParam = adultEnabled ? '&include_adult=true' : '&include_adult=false';
      const movieCertParam = adultEnabled ? '' : '&certification_country=US&certification.lte=PG-13';

      const config = CATEGORY_ENDPOINTS[id];
      const fetchUrl = config.url(nextPage, adultParam, movieCertParam);

      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error("API call failed");

      const data = await res.json();
      const results = data.results || [];

      if (results.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      // Filter adult content
      const adultKeywords = ['sex', 'fuck', 'fucked', 'adult', '18+', 'erotic', 'porn', 'nude', 'sexually', 'romance'];
      const containsAdultWord = (text) => {
        if (!text) return false;
        const lower = text.toLowerCase();
        return adultKeywords.some(word => lower.includes(word));
      };

      const formatted = results.filter(m => {
        if (adultEnabled) return true;
        if (m.adult === true) return false;
        if (config.applyFilter) {
          if (containsAdultWord(m.title) || containsAdultWord(m.name) || containsAdultWord(m.overview)) {
            return false;
          }
        }
        return true;
      }).map(m => ({
        id: m.id,
        title: m.title || m.name,
        poster: m.poster_path ? `${IMG_BASE}${m.poster_path}` : null,
        year: (m.release_date || m.first_air_date || '').split('-')[0],
        rating: m.vote_average ? m.vote_average.toFixed(1) : null,
        type: m.media_type === 'tv' || m.name ? 'TV Show' : 'Movie',
        isTMDB: true
      }));

      if (formatted.length > 0) {
        // Filter duplicates just in case
        setAllTitles(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const uniqueNew = formatted.filter(item => !existingIds.has(item.id));
          return [...prev, ...uniqueNew];
        });
        setPage(nextPage);
      } else {
        // If all items on this page were filtered out, try loading the next page recursively
        setPage(nextPage);
      }

      // If TMDB returns fewer results than standard page size (usually 20), we are at the end
      if (results.length < 20 || nextPage >= data.total_pages) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load more titles:", err);
      // Stop attempting to load if we hit an error
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // IntersectionObserver for infinite scrolling
  useEffect(() => {
    if (!hasMore || loading || !id) return;

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadNextPage();
      }
    }, { threshold: 0.1 });

    if (loadMoreTriggerRef.current) {
      observerRef.current.observe(loadMoreTriggerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [page, hasMore, loading, id]);

  return (
    <div className="see-all-page" ref={topRef}>
      {/* Floating back button — independent of navbar */}
      <button className="see-all-back-btn" onClick={handleBack} aria-label="Go back">
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="see-all-header">
        <h1 className="see-all-title">{title}</h1>
        <p className="see-all-count">{allTitles.length} titles</p>
      </div>

      <div className="see-all-grid">
        {allTitles.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            size="md"
            showRating={true}
            showYear={true}
          />
        ))}
        {allTitles.length === 0 && (
          <p className="see-all-empty">No items to show.</p>
        )}
      </div>

      {/* Loading state / Load More trigger container */}
      {hasMore && (
        <div ref={loadMoreTriggerRef} className="see-all-loader-container">
          <button
            className="see-all-load-more-btn"
            onClick={loadNextPage}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="spinner" size={16} />
                <span>Loading More...</span>
              </>
            ) : (
              <span>Load More Titles</span>
            )}
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
