import React from 'react';
import './CustomPlayer.css';

/**
 * CustomPlayer — Reserved for future HLS/Plyr integration.
 * Currently a placeholder. Props: src, poster.
 */
export default function CustomPlayer({ src, poster }) {
  if (!src) {
    return (
      <div className="custom-player-empty">
        <div className="custom-player-empty-icon">🎬</div>
        <h3>No Stream Source</h3>
        <p>Provide a valid video source URL to begin playback.</p>
      </div>
    );
  }

  return (
    <div className="custom-player-video-container">
      <video
        className="custom-player-native"
        src={src}
        poster={poster}
        controls
        playsInline
        autoPlay
      />
    </div>
  );
}
