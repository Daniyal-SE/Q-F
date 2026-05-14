import React, { useState, useEffect } from "react";
import "./MovieDetail.css";
import "../components/ContentSection.css";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Play,
  Download,
  Plus,
  Star,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MediaCard from "../components/MediaCard";
import Button from "../components/Button";
import { getMediaById } from "../data/mockData";

export default function MovieDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const m = getMediaById(id);
  const [playing, setPlaying] = useState(false);
  const [realTrailer, setRealTrailer] = useState(null);

  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("v=")) {
      const v = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${v}`;
    }
    return url;
  };

  useEffect(() => {
    // If the movie already has a curated trailer URL, use it directly — no TMDB fetch needed
    if (m?.trailer) {
      setRealTrailer(getEmbedUrl(m.trailer));
      return;
    }
    // Only fetch from TMDB if NO trailer is provided in the mock data
    if (m?.title) {
      const fetchTrailer = async () => {
        try {
          const searchRes = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=1fa448de74c5dac88e0d31d99c7e916d&query=${encodeURIComponent(m.title)}`,
          );
          const searchData = await searchRes.json();
          if (searchData.results?.[0]?.id) {
            const vidRes = await fetch(
              `https://api.themoviedb.org/3/movie/${searchData.results[0].id}/videos?api_key=1fa448de74c5dac88e0d31d99c7e916d`,
            );
            const vidData = await vidRes.json();
            const trailer = vidData.results?.find(
              (v) => v.type === "Trailer" && v.site === "YouTube",
            );
            if (trailer)
              setRealTrailer(`https://www.youtube.com/embed/${trailer.key}`);
          }
        } catch (e) {}
      };
      fetchTrailer();
    }
  }, [m?.title, m?.trailer]);

  // Scroll to top when the movie changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setPlaying(false);
  }, [id]);

  if (!m) {
    return (
      <div
        className="movie-detail"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <Navbar />
        <h2 style={{ marginBottom: "1rem" }}>Movie Not Found</h2>
        <Button variant="primary" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  const similarScrollRef = React.useRef(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [tmdbRecs, setTmdbRecs] = React.useState([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    if (!m?.title) return;
    const fetchRecs = async () => {
      try {
        const searchRes = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=1fa448de74c5dac88e0d31d99c7e916d&query=${encodeURIComponent(m.title)}`,
        );
        const searchData = await searchRes.json();
        const tmdbId = searchData.results?.[0]?.id;
        if (tmdbId) {
          const recRes = await fetch(
            `https://api.themoviedb.org/3/movie/${tmdbId}/recommendations?api_key=1fa448de74c5dac88e0d31d99c7e916d&language=en-US&page=1`,
          );
          const recData = await recRes.json();
          if (recData.results?.length > 0) {
            setTmdbRecs(
              recData.results.slice(0, 8).map((r) => ({
                id: r.id,
                title: r.title,
                poster: r.poster_path
                  ? `https://image.tmdb.org/t/p/w300${r.poster_path}`
                  : null,
                year: r.release_date?.split("-")[0] || "",
                genre: "Movie",
                type: "Movie",
                isTMDB: true,
              })),
            );
          }
        }
      } catch (e) {}
    };
    fetchRecs();
  }, [m?.title]);

  const scrollSimilarLeft = () => {
    if (similarScrollRef.current) {
      similarScrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollSimilarRight = () => {
    if (similarScrollRef.current) {
      similarScrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <div className="movie-detail">
      <Navbar />

      <button
        className="page-back-btn"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <ArrowLeft size={16} strokeWidth={2} /> Back
      </button>

      {/* Hero backdrop */}
      <div
        className="movie-detail__hero"
        style={{ backgroundImage: `url("${m.hero}")` }}
      >
        <div className="movie-detail__hero-gradient" />
        <div className="movie-detail__hero-bottom" />
      </div>

      {/* Main content */}
      <div className="movie-detail__content container">
        <div className="movie-detail__header">
          {/* Poster */}
          <div className="movie-detail__poster">
            <img src={m.poster} alt={m.title} />
          </div>

          {/* Info */}
          <div className="movie-detail__info">
            <div className="movie-detail__genres">
              {m.genres.map((g) => (
                <span key={g} className="badge badge-outline">
                  {g}
                </span>
              ))}
            </div>
            <h1 className="movie-detail__title">{m.title.toUpperCase()}</h1>
            <div className="movie-detail__meta">
              <span className="stars">
                <Star size={13} fill="#f5c518" stroke="none" /> {m.rating}
              </span>
              <span>{m.year}</span>
              <span>{m.duration}</span>
              <span className="badge badge-outline">{m.rating_label}</span>
            </div>
            <div className="movie-detail__actions">
              <Button
                variant="primary"
                size="lg"
                icon={Play}
                onClick={() => navigate(`/watch/${m.id}`)}
              >
                Watch Now
              </Button>
              <Button variant="secondary" size="lg" icon={Download}>
                Download
              </Button>
              <button className="btn btn--icon-only btn--md">
                <Plus size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Downloads panel */}
          <div className="movie-detail__downloads glass-light">
            <h3 className="movie-detail__downloads-title">Downloads</h3>
            {[
              { quality: "Ultra HD 4K", size: "12.4 GB • MKV" },
              { quality: "Full HD 1080p", size: "4.8 GB • MP4" },
            ].map((d) => (
              <div key={d.quality} className="download-item">
                <div>
                  <p className="download-item__quality">{d.quality}</p>
                  <p className="download-item__size">{d.size}</p>
                </div>
                <button className="download-item__btn" aria-label="Download">
                  <Download size={16} strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Overview + Credits */}
        <div className="movie-detail__body">
          <div className="movie-detail__overview">
            <h2>Overview</h2>
            <p>{m.description}</p>
            <div className="movie-detail__credits">
              {[
                { label: "Director", value: m.director },
                { label: "Writer", value: m.writer },
                { label: "Studio", value: m.studio },
                { label: "Language", value: m.language },
              ].map((c) => (
                <div key={c.label} className="credit-item">
                  <span className="label">{c.label}</span>
                  <span>{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trailer */}
        <section className="movie-detail__trailer">
          <h2>Official Trailer</h2>
          <div className="trailer-player">
            {!playing ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setPlaying(true);
                  try {
                    const history = JSON.parse(
                      localStorage.getItem("cinestream_watch_history") || "[]",
                    );
                    const newItem = {
                      id: m.id,
                      title: m.title,
                      poster: m.poster,
                      year: m.year,
                      genre: m.genre,
                      isTMDB: false,
                    };
                    const filtered = history.filter((h) => h.id !== m.id);
                    localStorage.setItem(
                      "cinestream_watch_history",
                      JSON.stringify([newItem, ...filtered].slice(0, 20)),
                    );
                  } catch (e) {}
                }}
              >
                <img
                  src={m.stills && m.stills[0] ? m.stills[0] : m.hero}
                  alt="Trailer"
                  className="trailer-player__bg"
                />
                <div className="trailer-player__overlay" />
                <button
                  className="trailer-player__play"
                  aria-label="Play trailer"
                >
                  <Play size={28} fill="white" strokeWidth={0} />
                </button>
                <div className="trailer-player__controls">
                  <div className="video-progress">
                    <div
                      className="video-progress-bar"
                      style={{ width: "0%" }}
                    />
                  </div>
                  <div className="trailer-controls-row">
                    <span
                      style={{ fontSize: "12px", color: "var(--text-muted)" }}
                    >
                      00:00 / 02:30
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                width="100%"
                height="100%"
                src={`${realTrailer || getEmbedUrl(m.trailer)}?autoplay=1`}
                title="Official Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              ></iframe>
            )}
          </div>
        </section>

        {/* Stills */}
        <section className="movie-detail__stills">
          <h2>Movie Scene</h2>
          <div className="stills-grid">
            {m.stills.map((src, i) => (
              <div key={i} className="still-item">
                <img src={src} alt={`Still ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
