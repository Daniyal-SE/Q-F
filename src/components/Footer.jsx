import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { Globe, Share2, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-left">
          <span className="footer-logo">CineStream</span>
          <p>© 2024 CineStream. Cinematic immersion redefined.</p>
        </div>
        <div className="footer-links">
          <Link to="/search">Browse</Link>
          <Link to="/dashboard">Watchlist</Link>
          <Link to="/dashboard">Account</Link>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
        <div className="footer-icons">
          <button className="footer-icon-btn" aria-label="Language"><Globe size={16} strokeWidth={1.5} /></button>
          <button className="footer-icon-btn" aria-label="Share"><Share2 size={16} strokeWidth={1.5} /></button>
          <button className="footer-icon-btn" aria-label="Email"><Mail size={16} strokeWidth={1.5} /></button>
        </div>
      </div>
    </footer>
  );
}
