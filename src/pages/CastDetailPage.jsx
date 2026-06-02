import React, { useEffect, useState, useRef } from 'react';
import './CastDetailPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Film, Star, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MediaCard from '../components/MediaCard';

const TMDB_KEY = '1fa448de74c5dac88e0d31d99c7e916d';
const IMG_BASE = 'https://image.tmdb.org/t/p/';

export default function CastDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const topRef = useRef(null);

  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Start at the top of the page on render
    window.scrollTo({ top: 0, behavior: 'instant' });
    setLoading(true);

    const fetchActorDetails = async () => {
      try {
        const userSession = sessionStorage.getItem('cinestream_user') || '';
        const adultEnabled = localStorage.getItem(`cinestream_adult_enabled_${userSession}`) === 'true';

        // Fetch person info and credits in parallel
        const [personRes, creditsRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${TMDB_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${TMDB_KEY}&language=en-US`)
        ]);

        if (!personRes.ok || !creditsRes.ok) {
          throw new Error('Failed to fetch person details');
        }

        const personData = await personRes.json();
        const creditsData = await creditsRes.json();

        setPerson(personData);

        // Filter adult keywords and format credits
        const adultKeywords = ['sex', 'fuck', 'fucked', 'adult', '18+', 'erotic', 'porn', 'nude', 'sexually', 'romance'];
        const containsAdultWord = (text) => {
          if (!text) return false;
          const lower = text.toLowerCase();
          return adultKeywords.some(word => lower.includes(word));
        };

        const rawCast = creditsData.cast || [];
        
        // Remove duplicates and filter adult content
        const seenIds = new Set();
        const formattedCredits = rawCast
          .filter(c => {
            if (seenIds.has(c.id)) return false;
            seenIds.add(c.id);

            if (adultEnabled) return true;
            if (c.adult === true) return false;
            if (containsAdultWord(c.title) || containsAdultWord(c.name) || containsAdultWord(c.overview)) {
              return false;
            }
            return true;
          })
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0)) // Show most popular works first
          .map(c => ({
            id: c.id,
            title: c.title || c.name,
            poster: c.poster_path ? `${IMG_BASE}w500${c.poster_path}` : null,
            year: (c.release_date || c.first_air_date || '').split('-')[0] || 'N/A',
            rating: c.vote_average ? c.vote_average.toFixed(1) : null,
            type: c.media_type === 'tv' || c.name ? 'TV Show' : 'Movie',
            isTMDB: true
          }));

        setCredits(formattedCredits);
      } catch (err) {
        console.error('Error fetching actor details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActorDetails();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="cast-detail-page">
        <Navbar hideNavbar={true} />
        <div className="cast-detail-loading">
          <Loader2 className="spinner" size={40} />
          <p>Loading actor profile...</p>
        </div>
      </div>
    );
  }

  if (!person || person.success === false) {
    return (
      <div className="cast-detail-page">
        <Navbar hideNavbar={true} />
        <div className="cast-detail-loading">
          <p>Profile not found.</p>
          <button className="cast-detail-back-btn" onClick={handleBack} style={{ position: 'static', marginTop: '20px' }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const profileUrl = person.profile_path
    ? `${IMG_BASE}h632${person.profile_path}`
    : null;

  return (
    <div className="cast-detail-page" ref={topRef}>
      {/* Floating back button */}
      <button className="cast-detail-back-btn" onClick={handleBack} aria-label="Go back">
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="cast-detail-container container">
        {/* Profile Card & Info */}
        <div className="cast-profile-header">
          <div className="cast-profile-image-wrap">
            {profileUrl ? (
              <img src={profileUrl} alt={person.name} className="cast-profile-image" />
            ) : (
              <div className="cast-profile-fallback">
                <span>{person.name?.[0]}</span>
              </div>
            )}
          </div>

          <div className="cast-profile-info">
            <h1 className="cast-profile-name">{person.name}</h1>
            
            {person.known_for_department && (
              <span className="badge badge-primary cast-profile-dept">{person.known_for_department}</span>
            )}

            <div className="cast-profile-meta">
              {person.birthday && (
                <div className="cast-meta-item">
                  <Calendar size={14} />
                  <span>Born: {person.birthday}</span>
                </div>
              )}
              {person.place_of_birth && (
                <div className="cast-meta-item">
                  <MapPin size={14} />
                  <span>From: {person.place_of_birth}</span>
                </div>
              )}
              <div className="cast-meta-item">
                <Film size={14} />
                <span>Works: {credits.length} titles</span>
              </div>
            </div>

            {person.biography && (
              <div className="cast-profile-bio">
                <h3>Biography</h3>
                <p>{person.biography}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actor Credits Grid (5 Columns) */}
        <div className="cast-credits-section">
          <h2>Known For</h2>
          <div className="cast-credits-grid">
            {credits.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                size="md"
                showRating={true}
                showYear={true}
              />
            ))}
            {credits.length === 0 && (
              <p className="cast-credits-empty">No projects found for this actor.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
