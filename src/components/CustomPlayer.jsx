import React, { useEffect, useRef } from 'react';
import './CustomPlayer.css';
import Hls from 'hls.js';
import WebTorrent from 'webtorrent/dist/webtorrent.min.js'; // Use dist for browser

/**
 * CustomPlayer — Supports HLS (.m3u8) and WebTorrent (magnet)
 * Props: src, poster, type (m3u8, magnet, mp4)
 */
export default function CustomPlayer({ src, poster, type }) {
  const videoRef = useRef(null);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!src || !videoRef.current) return;

    if (type === 'm3u8') {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          videoRef.current.play().catch(e => console.log('Autoplay prevented', e));
        });
        return () => hls.destroy();
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS (Safari)
        videoRef.current.src = src;
      }
    } else if (type === 'magnet') {
      // WebTorrent logic
      try {
        if (!clientRef.current) {
          clientRef.current = new WebTorrent();
        }
        clientRef.current.add(src, function (torrent) {
          const file = torrent.files.find(function (f) {
            return f.name.endsWith('.mp4') || f.name.endsWith('.mkv') || f.name.endsWith('.webm');
          });
          if (file) {
            file.renderTo(videoRef.current, { autoplay: true });
          }
        });
      } catch (err) {
        console.error("WebTorrent error", err);
      }
      return () => {
        if (clientRef.current) {
          clientRef.current.destroy();
          clientRef.current = null;
        }
      };
    } else {
      videoRef.current.src = src;
    }
  }, [src, type]);

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
        ref={videoRef}
        className="custom-player-native"
        poster={poster}
        controls
        playsInline
        style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
      />
    </div>
  );
}
