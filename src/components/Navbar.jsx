import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, Settings, Play, Palette, RefreshCw, ArrowLeft } from "lucide-react";

const NAV_LINKS = [
  { label: "K-Drama", path: "kdrama" },
  { label: "Bollywood", path: "bollywood" },
  { label: "Hollywood", path: "hollywood" },
  { label: "Anime Picks", path: "anime-picks" },
  { label: "Anime", path: "anime" },
];

export default function Navbar({ showBack }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isAltTheme, setIsAltTheme] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Handle hash scrolling from other pages
  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      setTimeout(() => {
        const id = location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    // Always visible on detail/category pages that show a back button
    if (showBack) {
      setIsVisible(true);
      return;
    }

    const handleMouseMove = (e) => {
      // Keep visible on smaller screens like mobile/tablet
      if (window.innerWidth <= 1024) {
        setIsVisible(true);
        return;
      }

      // Show navbar if mouse is in the top 120px of the screen, or if the hamburger menu is open
      if (e.clientY < 120 || open) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [open, showBack]);

  const toggleTheme = () => {
    const isLight = document.body.classList.contains("theme-light");
    if (isLight) {
      document.body.classList.remove("theme-light");
      setIsAltTheme(false);
    } else {
      document.body.classList.remove("theme-alt");
      document.body.classList.add("theme-light");
      setIsAltTheme(true);
    }
  };

  const handleNavClick = (e, path) => {
    e.preventDefault();
    setOpen(false);

    if (location.pathname !== "/") {
      navigate(`/#${path}`);
    } else {
      const element = document.getElementById(path);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`navbar ${isVisible ? "navbar--visible" : "navbar--hidden"}`}
    >
      {showBack && (
        <button
          className="navbar-global-back"
          onClick={() => navigate(-1)}
          aria-label="Go Back"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      )}

      <div className="navbar-pill">
        {/* ── Logo circle ───────────────────────────────── */}
        <Link
          to="/"
          className="navbar-logo-circle"
          aria-label="CineStream Home"
        >
          <Play size={16} fill="#fff" strokeWidth={0} />
        </Link>

        {/* ── Nav links ─────────────────────────────────── */}
        <nav className={`navbar-links ${open ? "navbar-links--open" : ""}`}>
          {NAV_LINKS.map(({ label, path }) => (
            <a
              key={path}
              href={`/#${path}`}
              className={`navbar-link ${location.hash === `#${path}` ? "active" : ""}`}
              onClick={(e) => handleNavClick(e, path)}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* ── Right actions ─────────────────────────────── */}
        <div className="navbar-actions">
          <button
            className="nav-icon-btn"
            aria-label="Search"
            onClick={() => navigate("/search")}
          >
            <Search size={17} strokeWidth={1.5} />
          </button>
          <button
            className="nav-icon-btn"
            aria-label="Refresh Content"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={17} strokeWidth={1.5} />
          </button>
          <button
            className="nav-icon-btn"
            aria-label="Toggle Theme"
            onClick={toggleTheme}
          >
            <Palette size={17} strokeWidth={1.5} />
          </button>
          <Link to="/dashboard" className="navbar-avatar" aria-label="Profile">
            <img src="/img.jpeg" alt="User avatar" />
          </Link>
        </div>

        {/* ── Mobile hamburger ──────────────────────────── */}
        <button
          className={`navbar-hamburger ${open ? "open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
