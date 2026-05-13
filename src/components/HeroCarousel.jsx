import React, { useState, useEffect } from 'react';
import './HeroCarousel.css';
import { Play, Download, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const TMDB_KEY = '1fa448de74c5dac88e0d31d99c7e916d';
const IMG_BASE = 'https://image.tmdb.org/t/p/original';

export default function HeroCarousel({ slides }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  // backdrops keyed by slide.id: { url, loaded }
  const [backdrops, setBackdrops] = useState({});

  const handleNext = () => setCurrentIndex(prev => (prev + 1) % slides.length);
  const handlePrev = () => setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);

  // Auto slide every 8 seconds
  useEffect(() => {
    if (!slides?.length) return;
    const timer = setInterval(handleNext, 8000);
    return () => clearInterval(timer);
  }, [currentIndex, slides]);

  // Fetch the correct backdrop for every slide by searching TMDB with the title
  useEffect(() => {
    if (!slides?.length) return;
    slides.forEach(async slide => {
      if (backdrops[slide.id]) return; // already fetched
      try {
        // Try movie search first
        let res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(slide.title)}&page=1`
        );
        let data = await res.json();
        let result = data.results?.find(r => r.backdrop_path);

        if (!result) {
          // Fallback to TV search
          res = await fetch(
            `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_KEY}&query=${encodeURIComponent(slide.title)}&page=1`
          );
          data = await res.json();
          result = data.results?.find(r => r.backdrop_path);
        }

        if (result?.backdrop_path) {
          setBackdrops(prev => ({
            ...prev,
            [slide.id]: `${IMG_BASE}${result.backdrop_path}`
          }));
        } else {
          // Mark as failed so we use fallback
          setBackdrops(prev => ({ ...prev, [slide.id]: slide.bg || null }));
        }
      } catch (e) {
        setBackdrops(prev => ({ ...prev, [slide.id]: slide.bg || null }));
      }
    });
  }, [slides]);

  if (!slides?.length) return null;

  return (
    <div className="hero-carousel">
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        // Use the dynamically fetched backdrop, or fall back to the hardcoded bg
        const bgUrl = backdrops[slide.id] || slide.bg;

        return (
          <div
            key={slide.id}
            className={`hero-carousel__slide ${isActive ? 'active' : ''}`}
          >
            {bgUrl ? (
              <img
                src={bgUrl}
                alt={slide.title}
                className="hero-carousel__bg-media"
              />
            ) : (
              <div className="hero-carousel__bg-media" style={{ background: '#111' }} />
            )}
            <div className="hero-carousel__gradient" />

            <div className="hero-carousel__content container">
              <div className="hero-carousel__inner">
                <div className="hero-carousel__text">
                  <div className="hero-carousel__badges">
                    {slide.badges?.map((badge, i) => (
                      <span key={i} className="badge badge-primary">{badge}</span>
                    ))}
                    {slide.rating && (
                      <span className="stars">
                        <Star size={12} fill="#f5c518" stroke="none" />
                        {slide.rating}
                      </span>
                    )}
                  </div>
                  <h1 className="hero-carousel__title">{slide.title}</h1>
                  <p className="hero-carousel__desc">{slide.desc}</p>

                  <div className="hero-carousel__actions">
                    <Button variant="primary" size="lg" icon={Play} onClick={() => navigate(`/watch/${slide.tmdbId}`)}>
                      Watch Now
                    </Button>
                    <Button variant="secondary" size="lg" icon={Download}>
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button className="hero-carousel__arrow hero-carousel__arrow--left" onClick={handlePrev} aria-label="Previous Slide">
        <ChevronLeft size={32} />
      </button>
      <button className="hero-carousel__arrow hero-carousel__arrow--right" onClick={handleNext} aria-label="Next Slide">
        <ChevronRight size={32} />
      </button>

      {/* Bottom fade & Dots */}
      <div className="hero-carousel__bottom-fade" />
      <div className="hero-carousel__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-carousel__dot ${i === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
