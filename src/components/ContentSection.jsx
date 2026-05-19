import React from 'react';
import './ContentSection.css';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import MediaCard from './MediaCard';

/**
 * ContentSection — reusable, scalable content section component.
 *
 * Props
 * ─────
 * title         {string}   Section heading (required)
 * items         {array}    Array of media objects passed to MediaCard
 * viewAllPath   {string}   Route for "View All" link. Pass null to hide. (default '/search')
 * viewAllLabel  {string}   Label for the link (default 'View All')
 * cardSize      {string}   Size prop forwarded to every MediaCard (default 'md')
 * cardProps     {object}   Any extra props forwarded to every MediaCard (showGenre, showRating…)
 * layout        {string}   'scroll' = horizontal scroll row | 'grid' = CSS grid (default 'scroll')
 * gridMinWidth  {string}   Min column width for grid layout (default '160px')
 * cardWidth     {string}   Fixed width for scroll-layout cards  (default '160px')
 * className     {string}   Extra class on the section root
 * style         {object}   Inline style on the section root
 *
 * Usage examples
 * ──────────────
 * // Basic row (scroll)
 * <ContentSection title="Trending Now" items={trending} />
 *
 * // Grid with genre shown, custom card size
 * <ContentSection title="Search Results" items={results}
 *   layout="grid" gridMinWidth="160px"
 *   cardProps={{ showGenre: true, showRating: true }} />
 *
 * // No "View All" link
 * <ContentSection title="Continue Watching" items={list} viewAllPath={null} />
 *
 * // Custom card nav handler
 * <ContentSection title="Recommendations" items={recs}
 *   cardProps={{ onNavigate: (item) => console.log(item) }} />
 */
export default function ContentSection({
  title,
  items         = [],
  cardSize      = 'md',
  cardProps     = {},
  layout        = 'scroll',
  gridMinWidth  = '160px',
  cardWidth     = '160px',
  className     = '',
  style,
  id,
}) {
  return (
    <section
      id={id}
      className={`content-section content-section--${layout} ${className}`}
      style={style}
    >
      <div className="container">

        {/* Section heading */}
        <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{title}</h2>
          {id && items.length > 0 && (
            <Link 
              to={`/category/${id}`}
              style={{
                fontSize: '13px', fontWeight: 600, color: 'var(--primary)',
                textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer'
              }}
            >
              See All →
            </Link>
          )}
        </div>

        {/* Cards */}
        {layout === 'scroll' ? (
          <div className="content-section__scroll" style={{ '--card-w': cardWidth }}>
            {items.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                size={cardSize}
                {...cardProps}
              />
            ))}
            {items.length === 0 && (
              <p className="content-section__empty">No items to show.</p>
            )}
          </div>
        ) : (
          <div
            className="content-section__grid"
            style={{ '--grid-min': gridMinWidth }}
          >
            {items.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                size={cardSize}
                {...cardProps}
              />
            ))}
            {items.length === 0 && (
              <p className="content-section__empty">No items to show.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
