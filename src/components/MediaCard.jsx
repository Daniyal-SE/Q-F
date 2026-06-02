import React, { useState, useCallback } from 'react';
import './MediaCard.css';
import { useNavigate } from 'react-router-dom';
import { Play, Star } from 'lucide-react';

// ─── Favourites helpers ───────────────────────────────────────────────────────
const FAVS_KEY = 'cinestream_favourites';

export function getFavourites() {
  try {
    return JSON.parse(localStorage.getItem(FAVS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function isFavourite(id) {
  return getFavourites().some(f => f.id === id);
}

export function toggleFavourite(item) {
  const favs = getFavourites();
  const idx = favs.findIndex(f => f.id === item.id);
  if (idx !== -1) {
    favs.splice(idx, 1);
  } else {
    favs.unshift({
      id: item.id,
      title: item.title,
      poster: item.poster ?? item.thumb ?? null,
      year: item.year ?? '',
      rating: item.rating ?? null,
      type: item.type ?? 'Movie',
      genre: item.genre ?? '',
      isTMDB: item.isTMDB ?? true,
    });
  }
  localStorage.setItem(FAVS_KEY, JSON.stringify(favs));
  return idx === -1; // true = added, false = removed
}
// ─────────────────────────────────────────────────────────────────────────────

/**
 * MediaCard — fully prop-driven, reusable poster/episode card.
 *
 * Props
 * ─────
 * item          {object}   Required. Data object (id, title, poster, type, year, rating, genre, badge, isNew, match)
 * size          {string}   'sm' | 'md' | 'lg' | 'wide'  (default 'md')
 * aspectRatio   {string}   CSS aspect-ratio override, e.g. '16/9'. Defaults to '2/3' ('wide' forces '16/9')
 * showRating    {boolean}  Show star + rating (default true)
 * showYear      {boolean}  Show release year  (default true)
 * showGenre     {boolean}  Show genre tag     (default false)
 * showBadge     {boolean}  Show corner badge  (default true)
 * showMatch     {boolean}  Show % match label (default false)
 * showFavBtn    {boolean}  Show favourite star button (default true)
 * playIconSize  {number}   Size of the play icon in overlay (default 22)
 * onNavigate    {function} Custom click handler — receives (item). Overrides default routing.
 * className     {string}   Extra class names on root element
 */
export default function MediaCard({
  item,
  size = 'md',
  aspectRatio,
  showRating = true,
  showYear = true,
  showGenre = false,
  showBadge = true,
  showMatch = false,
  showFavBtn = true,
  playIconSize = 22,
  onNavigate,
  disableClick = false,
  className = '',
}) {
  const navigate = useNavigate();
  const [favd, setFavd] = useState(() => isFavourite(item?.id));

  if (!item) return null;

  const handleClick = () => {
    if (onNavigate) return onNavigate(item);
    // Save current scroll so Home can restore it when Back is pressed
    sessionStorage.setItem('cinestream_home_scroll', String(window.scrollY));
    navigate(`/tmdb/${item.id}?type=${item.type === 'TV Show' ? 'tv' : 'movie'}`);
  };

  const handleFavClick = (e) => {
    e.stopPropagation(); // Don't trigger the card click
    const nowFavd = toggleFavourite(item);
    setFavd(nowFavd);
  };

  const isWide = size === 'wide';
  const ratio = aspectRatio ?? (isWide ? '16/9' : '2/3');
  // Map badge string to CSS class
  const badgeKey = item.badge?.toLowerCase().replace(/\s+/g, '-');
  const badgeClass = item.badge ? `badge badge-${badgeKey} media-card__badge` : '';
  const noClick = disableClick;

  return (
    <div
      className={`media-card media-card--${size} ${noClick ? 'media-card--no-click' : ''} ${className}`}
      onClick={noClick ? undefined : handleClick}
      role={noClick ? 'img' : 'button'}
      tabIndex={noClick ? -1 : 0}
      onKeyDown={(e) => !noClick && e.key === 'Enter' && handleClick()}
      title={item.title}
    >
      {/* Poster / Thumbnail */}
      <div className="media-card__poster" style={{ aspectRatio: ratio }}>
        <img src={item.poster ?? item.thumb} alt={item.title} loading="lazy" />

        {/* Play overlay */}
        <div className="media-card__overlay">
          <div className="media-card__play">
            <Play size={playIconSize} fill="white" strokeWidth={0} />
          </div>
        </div>

        {/* Corner badge */}
        {showBadge && item.badge && (
          <span className={badgeClass}>{item.badge}</span>
        )}
        {showBadge && item.isNew && (
          <span className="badge badge-new media-card__badge">NEW</span>
        )}

        {/* ── Favourite Star Button ── */}
        {showFavBtn && !noClick && (
          <button
            className={`media-card__fav-btn ${favd ? 'media-card__fav-btn--active' : ''}`}
            onClick={handleFavClick}
            aria-label={favd ? 'Remove from favourites' : 'Add to favourites'}
            title={favd ? 'Remove from favourites' : 'Add to favourites'}
          >
            <Star
              size={15}
              fill={favd ? '#f5c518' : 'none'}
              stroke={favd ? '#f5c518' : 'rgba(255,255,255,0.85)'}
              strokeWidth={1.8}
            />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="media-card__info">
        <h4 className="media-card__title">{item.title}</h4>
        <div className="media-card__meta">
          {showYear && item.year && <span>{item.year}</span>}
          {showRating && item.rating && (
            <span className="media-card__rating">
              <Star size={11} fill="#f5c518" stroke="none" />
              {item.rating}
            </span>
          )}
          {showGenre && item.genre && <span className="media-card__genre">{item.genre}</span>}
          {showMatch && item.match && (
            <span className="media-card__match">{item.match}% Match</span>
          )}
        </div>
      </div>
    </div>
  );
}
