import React from 'react';
import './MediaCard.css';
import { useNavigate } from 'react-router-dom';
import { Play, Star } from 'lucide-react';

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
  playIconSize = 22,
  onNavigate,
  disableClick = false,
  className = '',
}) {
  const navigate = useNavigate();

  if (!item) return null;

  const handleClick = () => {
    if (onNavigate) return onNavigate(item);
    if (item.type === 'Anime') navigate(`/anime/${item.id}`);
    else navigate(`/movie/${item.id}`);
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
