import React, { useState, useEffect, useRef, useCallback } from 'react';
import './CategoryPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Play, Star } from 'lucide-react';

const TMDB_KEY = '1fa448de74c5dac88e0d31d99c7e916d';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Category Configuration
  const getCategoryConfig = (id) => {
    const sessionUser = sessionStorage.getItem('cinestream_user') || '';
    const adultEnabled = localStorage.getItem(`cinestream_adult_enabled_${sessionUser}`) === 'true';
    const unrestrictedRomance = localStorage.getItem('cinestream_romance_unrestricted') === 'true';
    
    // For romance, tayyab uses unrestricted toggle, others use standard adult profile setting.
    const romanceAdult = sessionUser === 'tayyab4855' ? unrestrictedRomance : adultEnabled;

    switch(id) {
      case 'kdrama':
        return { title: 'K-Drama', url: `discover/tv?with_original_language=ko&sort_by=popularity.desc`, adult: adultEnabled, keywordFilter: false };
      case 'bollywood':
        return { title: 'Bollywood', url: `discover/movie?with_original_language=hi&sort_by=popularity.desc&certification_country=US&certification.lte=${adultEnabled?'':'PG-13'}`, adult: adultEnabled, keywordFilter: false };
      case 'action':
        return { title: 'Action & Adventure', url: `discover/movie?with_genres=28&sort_by=popularity.desc&certification_country=US&certification.lte=${adultEnabled?'':'PG-13'}`, adult: adultEnabled, keywordFilter: true };
      case 'hollywood':
        return { title: 'Hollywood', url: `discover/movie?with_original_language=en&sort_by=popularity.desc&certification_country=US&certification.lte=${adultEnabled?'':'PG-13'}`, adult: adultEnabled, keywordFilter: true };
      case 'scifi':
        return { title: 'Sci-Fi & Fantasy', url: `discover/movie?with_genres=878&sort_by=popularity.desc&certification_country=US&certification.lte=${adultEnabled?'':'PG-13'}`, adult: adultEnabled, keywordFilter: true };
      case 'anime-picks':
        return { title: 'Animated Film', url: `discover/movie?with_genres=16&sort_by=popularity.desc&certification_country=US&certification.lte=${adultEnabled?'':'PG-13'}`, adult: adultEnabled, keywordFilter: true };
      case 'punjabi':
        return { title: 'Punjabi Movies', url: `discover/movie?with_original_language=pa&sort_by=popularity.desc&certification_country=US&certification.lte=${adultEnabled?'':'PG-13'}`, adult: adultEnabled, keywordFilter: false };
      case 'anime':
        return { title: 'Anime', url: `discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc`, adult: adultEnabled, keywordFilter: true };
      case 'romance':
        // If not tayyab, maybe redirect or just let them see generic romance? We will let them see it.
        if (sessionUser !== 'tayyab4855') {
            return { title: 'Romance', url: `discover/movie?with_genres=10749&sort_by=popularity.desc`, adult: adultEnabled, keywordFilter: true };
        }
        return { title: 'Romance', url: `discover/movie?with_genres=10749&sort_by=popularity.desc`, adult: romanceAdult, keywordFilter: !romanceAdult };
      default:
        return { title: 'Discover', url: `trending/all/day?`, adult: adultEnabled, keywordFilter: true };
    }
  };

  const config = getCategoryConfig(categoryId);

  // Reset when category changes
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [categoryId]);

  const fetchCategoryData = async (pageNum) => {
    setLoading(true);
    try {
      const adultParam = config.adult ? '&include_adult=true' : '&include_adult=false';
      const sep = config.url.includes('?') ? '&' : '?';
      
      const res = await fetch(`https://api.themoviedb.org/3/${config.url}${sep}api_key=${TMDB_KEY}${adultParam}&page=${pageNum}`);
      const data = await res.json();
      
      const adultKeywords = ['sex', 'fuck', 'fucked', 'adult', '18+', 'erotic', 'porn', 'nude', 'sexually'];
      const containsAdultWord = (text) => {
        if (!text) return false;
        const lower = text.toLowerCase();
        return adultKeywords.some(word => lower.includes(word));
      };

      const newItems = (data.results || []).filter(m => {
        if (config.adult) return true; // Unrestricted completely skips filters
        if (m.adult === true) return false;
        if (config.keywordFilter) {
           if (containsAdultWord(m.title) || containsAdultWord(m.name) || containsAdultWord(m.overview)) return false;
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

      setItems(prev => {
        const existing = new Set(prev.map(p => p.id));
        return [...prev, ...newItems.filter(i => !existing.has(i.id))];
      });

      if (pageNum >= (data.total_pages || 1) || pageNum > 500) { // TMDB page limit
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData(page);
  }, [page, categoryId]); // Fetch on page change or category mount

  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="category-page">
      <Navbar showBack={true} />
      <div className="category-container">
        <h1 className="category-title">{config.title}</h1>
        <div className="category-grid">
          {items.map((item, index) => {
            if (items.length === index + 1) {
              return (
                <div ref={lastElementRef} key={item.id} className="category-card" onClick={() => navigate(`/tmdb/${item.id}?type=${item.type === 'TV Show' ? 'tv' : 'movie'}`)}>
                  <CategoryCard item={item} />
                </div>
              );
            } else {
              return (
                <div key={item.id} className="category-card" onClick={() => navigate(`/tmdb/${item.id}?type=${item.type === 'TV Show' ? 'tv' : 'movie'}`)}>
                  <CategoryCard item={item} />
                </div>
              );
            }
          })}
        </div>
        {loading && (
          <div className="category-loading">
            <div className="spinner"></div>
            <p>Loading more content...</p>
          </div>
        )}
        {!hasMore && (
          <div className="category-end">
            <p>You have reached the end.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function CategoryCard({ item }) {
  return (
    <>
      <div className="category-card__poster">
        {item.poster ? (
          <img src={item.poster} alt={item.title} loading="lazy" />
        ) : (
          <div className="category-card__no-poster">
            <span>{item.title?.[0]}</span>
          </div>
        )}
        <div className="category-card__overlay">
          <Play size={24} fill="white" strokeWidth={0} />
        </div>
        {item.rating && (
          <span className="category-card__rating">
            <Star size={11} fill="#f5c518" stroke="none" />
            {item.rating}
          </span>
        )}
      </div>
      <div className="category-card__info">
        <p className="category-card__title">{item.title}</p>
        <p className="category-card__meta">{item.year} • {item.type}</p>
      </div>
    </>
  );
}
