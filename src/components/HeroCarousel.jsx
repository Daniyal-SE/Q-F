import React, { useState, useEffect } from 'react';
import './HeroCarousel.css';
import { Play, Download, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

export default function HeroCarousel({ slides }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto slide every 8 seconds
  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const timer = setInterval(handleNext, 8000);
    return () => clearInterval(timer);
  }, [currentIndex, slides]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="hero-carousel">
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`hero-carousel__slide ${isActive ? 'active' : ''}`}
          >
            {slide.trailerVideo ? (
              <video
                src={slide.trailerVideo}
                className="hero-carousel__bg-media"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img src={slide.bg} alt="" className="hero-carousel__bg-media" />
            )}
            <div className="hero-carousel__gradient" />

            <div className="hero-carousel__content container">
              <div className="hero-carousel__inner">
                {/* ── Left side: Text Details ── */}
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
                    <Button variant="primary" size="lg" icon={Play} onClick={() => navigate('/watch/1')}>
                      Watch Trailer
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

      {/* ── Navigation Arrows ── */}
      <button className="hero-carousel__arrow hero-carousel__arrow--left" onClick={handlePrev} aria-label="Previous Slide">
        <ChevronLeft size={32} />
      </button>
      <button className="hero-carousel__arrow hero-carousel__arrow--right" onClick={handleNext} aria-label="Next Slide">
        <ChevronRight size={32} />
      </button>

      {/* ── Bottom fade & Dots ── */}
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
