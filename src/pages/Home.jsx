import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { Play, Download, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContentSection from '../components/ContentSection';
import HeroCarousel from '../components/HeroCarousel';
import { heroSlides, kdrama, bollywood, hollywood, animePicks, anime, upcomming } from '../data/mockData';

/**
 * HOME PAGE
 *
 * Sections are driven by ContentSection props.
 * To add a new section in the future:
 *
 *   import { myNewData } from '../data/mockData';
 *   <ContentSection title="My New Section" items={myNewData} />
 *
 * To customise a section (e.g. show genre, use grid, change card size):
 *   <ContentSection
 *     title="Featured"
 *     items={featured}
 *     layout="grid"
 *     gridMinWidth="200px"
 *     cardSize="lg"
 *     cardProps={{ showGenre: true, showRating: true }}
 *   />
 */
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <Navbar />

      {/* ── Hero Carousel ──────────────────────────────────────── */}
      <HeroCarousel slides={heroSlides} />

      {/* ── Content rows ──────────────────────────────── */}
      <div className="home__content">

        {/* 2 extra row-spacer lines push "Trending Now" down */}
        <div className="home__section-spacer" />

        <ContentSection
          id="kdrama"
          title="K-Drama"
          items={kdrama}
          cardProps={{ showRating: true, showYear: true }}
        />

        <ContentSection
          id="bollywood"
          title="Bollywood"
          items={bollywood}
          cardProps={{ showRating: true, showYear: true }}
        />

        <ContentSection
          id="hollywood"
          title="Hollywood"
          items={hollywood}
          cardProps={{ showRating: true, showYear: true }}
        />

        <ContentSection
          id="anime-picks"
          title="Animated Film"
          items={animePicks}
          cardProps={{ showRating: true, showYear: true }}
        />

        <ContentSection
          id="upcomming"
          title="Upcoming"
          items={upcomming.map(m => ({ ...m, badge: 'COMING SOON' }))}
          cardProps={{ showRating: false, showYear: true, disableClick: true }}
        />

        <ContentSection
          id="anime"
          title="Anime"
          items={anime}
          cardProps={{ showRating: true, showYear: true }}
        />

      </div>

      <Footer />
    </div>
  );
}
