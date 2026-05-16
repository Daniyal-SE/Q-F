import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MediaCard from '../components/MediaCard';
import { ArrowLeft } from 'lucide-react';
import './OTTPage.css';

const TMDB_KEY = '1fa448de74c5dac88e0d31d99c7e916d';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const platformDataMap = {
  '8': {
    name: 'Netflix',
    color: '#000000',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    icon: '/02_Netflix_Symbol/02_Netflix_Symbol/02_Netflix_Symbol/01_Netflix_Symbol_RGB/Netflix_Symbol_RGB.png',
    invert: false
  },
  '119': {
    name: 'Prime Video',
    color: '#0f2038',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg',
    invert: false
  },
  '384': {
    name: 'HBO NOW',
    color: '#ffffff',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/de/HBO_logo.svg',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/d/de/HBO_logo.svg',
    invert: false
  },

  '337': {
    name: 'Disney+',
    color: '#111333',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
    invert: false
  },
  '350': {
    name: 'Apple TV+',
    color: '#000000',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    invert: true
  }
};

export default function OTTPage() {
  const { platformId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [platformInfo, setPlatformInfo] = useState(
    location.state?.platform || platformDataMap[platformId] || { name: 'Streaming Platform', color: '#e50914', logo: '' }
  );

  useEffect(() => {
    setPage(1);
  }, [platformId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchPlatformContent = async () => {
      setLoading(true);
      try {
        const adultEnabled = localStorage.getItem('cinestream_adult_enabled') === 'true';
        const adultParam = adultEnabled ? '&include_adult=true' : '&include_adult=false';

        // Fetch both movies and TV shows for this platform
        const [moviesRes, tvRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_watch_providers=${platformId}&watch_region=US&sort_by=popularity.desc${adultParam}&page=${page}`),
          fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_KEY}&with_watch_providers=${platformId}&watch_region=US&sort_by=popularity.desc${adultParam}&page=${page}`)
        ]);

        const moviesData = await moviesRes.json();
        const tvData = await tvRes.json();

        // TMDB limits to 500 pages max
        const maxPages = Math.min(500, Math.max(moviesData.total_pages || 1, tvData.total_pages || 1));
        setTotalPages(maxPages);

        // Format and combine
        const adultKeywords = ['sex', 'fuck', 'fucked', 'adult', '18+', 'erotic', 'porn', 'nude', 'sexually', 'romance'];
        const containsAdultWord = (text) => {
          if (!text) return false;
          const lower = text.toLowerCase();
          return adultKeywords.some(word => lower.includes(word));
        };

        const formatTMDB = (results, isTV = false) => results?.filter(m => {
          if (adultEnabled) return true;
          if (m.adult === true) return false;
          if (containsAdultWord(m.title) || containsAdultWord(m.name) || containsAdultWord(m.overview)) return false;
          return true;
        }).map(m => ({
          id: m.id,
          title: m.title || m.name,
          poster: m.poster_path ? `${IMG_BASE}${m.poster_path}` : null,
          year: (m.release_date || m.first_air_date || '').split('-')[0],
          rating: m.vote_average ? m.vote_average.toFixed(1) : null,
          type: isTV ? 'TV Show' : 'Movie',
          isTMDB: true,
          popularity: m.popularity
        })) || [];

        const movies = formatTMDB(moviesData.results, false);
        const tvShows = formatTMDB(tvData.results, true);

        // Merge and sort by popularity
        const combined = [...movies, ...tvShows].sort((a, b) => b.popularity - a.popularity);
        setContent(combined);
      } catch (err) {
        console.error("Failed to fetch platform content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformContent();
  }, [platformId, page]);

  return (
    <div className="ott-page">
      <Navbar showBack={true} />

      <div className="ott-page__header" style={{ '--platform-color': platformInfo.color }}>
        <div className="ott-page__header-overlay"></div>
        <div className="ott-page__header-content">

          <div className="ott-page__brand">
            {(platformInfo.icon || platformInfo.logo) ? (
              <div className="ott-page__logo-wrapper">
                <img src={platformInfo.icon || platformInfo.logo} alt={platformInfo.name} className="ott-page__logo" style={{ filter: platformInfo.invert ? 'invert(1)' : 'none' }} />
              </div>
            ) : null}
            <div className="ott-page__title-area">
              <h1>{platformInfo.name}</h1>
              <p>Top trending movies and shows available on {platformInfo.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="ott-page__content">
        {loading ? (
          <div className="ott-page__loading">
            <div className="ott-page__spinner" style={{ borderTopColor: platformInfo.color }}></div>
          </div>
        ) : content.length > 0 ? (
          <div className="ott-page__grid">
            {content.map(item => (
              <MediaCard
                key={`${item.type}-${item.id}`}
                item={item}
                showRating={true}
                showYear={true}
              />
            ))}
          </div>
        ) : (
          <div className="ott-page__empty">
            <p>No content found for this platform.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && content.length > 0 && totalPages > 1 && (
          <div className="ott-page__pagination">
            <button
              className="ott-page__page-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="ott-page__page-info">
              Page <span>{page}</span> of {totalPages}
            </span>
            <button
              className="ott-page__page-btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
