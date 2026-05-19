import React, { useState, useEffect } from 'react';
import './CastPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Play, Star } from 'lucide-react';

const TMDB_KEY = '1fa448de74c5dac88e0d31d99c7e916d';
const IMG_BASE = 'https://image.tmdb.org/t/p/';

export default function CastPage() {
  const { castId } = useParams();
  const navigate = useNavigate();
  const [actor, setActor] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchCastData = async () => {
      try {
        // 1. Fetch Person Details (bio, profile picture)
        const actorRes = await fetch(`https://api.themoviedb.org/3/person/${castId}?api_key=${TMDB_KEY}&language=en-US`);
        const actorData = await actorRes.json();
        setActor(actorData);

        // 2. Fetch Combined Credits (Movies & TV Shows)
        const creditsRes = await fetch(`https://api.themoviedb.org/3/person/${castId}/combined_credits?api_key=${TMDB_KEY}&language=en-US`);
        const creditsData = await creditsRes.json();

        // Sort by popularity and filter out items without posters
        const sortedItems = (creditsData.cast || [])
          .filter(item => item.poster_path)
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
          .map(m => ({
            id: m.id,
            title: m.title || m.name,
            poster: `${IMG_BASE}w500${m.poster_path}`,
            year: (m.release_date || m.first_air_date || '').split('-')[0] || 'N/A',
            rating: m.vote_average ? m.vote_average.toFixed(1) : null,
            type: m.media_type === 'tv' ? 'TV Show' : 'Movie',
            character: m.character
          }));

        setItems(sortedItems);
      } catch (err) {
        console.error("Failed to fetch cast details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCastData();
  }, [castId]);

  if (loading) {
    return (
      <div className="cast-page">
        <Navbar showBack={true} />
        <div className="cast-page__loading">
          <div className="spinner"></div>
          <p>Loading filmography...</p>
        </div>
      </div>
    );
  }

  if (!actor || actor.success === false) {
    return (
      <div className="cast-page">
        <Navbar showBack={true} />
        <div className="cast-page__loading">
          <p>Actor not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cast-page">
      <Navbar showBack={true} />

      {/* Floating Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="cast-page__back-btn"
      >
        &#8592; Back
      </button>

      <div className="cast-container">
        
        {/* Actor Profile Header */}
        <div className="cast-profile">
          <div className="cast-profile__avatar">
            {actor.profile_path ? (
              <img src={`${IMG_BASE}h632${actor.profile_path}`} alt={actor.name} />
            ) : (
              <div className="cast-profile__no-avatar">
                <span>{actor.name?.[0]}</span>
              </div>
            )}
          </div>
          <div className="cast-profile__info">
            <h1 className="cast-profile__name">{actor.name}</h1>
            {actor.known_for_department && (
              <span className="cast-profile__dept">{actor.known_for_department}</span>
            )}
            {actor.place_of_birth && (
              <p className="cast-profile__meta"><strong>Born:</strong> {actor.birthday} in {actor.place_of_birth}</p>
            )}
            {actor.biography && (
              <div className="cast-profile__bio">
                <p>{actor.biography}</p>
              </div>
            )}
          </div>
        </div>

        {/* Filmography Header */}
        <h2 className="cast-filmography__title">Filmography ({items.length} titles)</h2>

        {/* Filmography Grid */}
        <div className="cast-grid">
          {items.map(item => (
            <div 
              key={`${item.id}-${item.character}`} 
              className="cast-card" 
              onClick={() => navigate(`/tmdb/${item.id}?type=${item.type === 'TV Show' ? 'tv' : 'movie'}`)}
            >
              <div className="cast-card__poster">
                {item.poster ? (
                  <img src={item.poster} alt={item.title} loading="lazy" />
                ) : (
                  <div className="cast-card__no-poster">
                    <span>{item.title?.[0]}</span>
                  </div>
                )}
                <div className="cast-card__overlay">
                  <Play size={24} fill="white" strokeWidth={0} />
                </div>
                {item.rating && (
                  <span className="cast-card__rating">
                    <Star size={11} fill="#f5c518" stroke="none" />
                    {item.rating}
                  </span>
                )}
              </div>
              <div className="cast-card__info">
                <p className="cast-card__title">{item.title}</p>
                {item.character && (
                  <p className="cast-card__char">as {item.character}</p>
                )}
                <p className="cast-card__meta">{item.year} • {item.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
