import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OTTPlatformStrip.css';

const platforms = [
  {
    id: '8',
    name: 'Netflix',
    bg: '#000000',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    icon: '/02_Netflix_Symbol/02_Netflix_Symbol/02_Netflix_Symbol/01_Netflix_Symbol_RGB/Netflix_Symbol_RGB.png',
    invert: false
  },
  {
    id: '119',
    name: 'Prime Video',
    bg: '#0f2038',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg',
    invert: false,
    scale: 1.2
  },
  {
    id: '384',
    name: 'HBO',
    bg: '#ffffff',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/de/HBO_logo.svg',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/d/de/HBO_logo.svg',
    textSuffix: ' NOW',
    invert: false,
    textColor: '#000'
  },

  {
    id: '337',
    name: 'Disney+',
    bg: '#111333',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
    invert: false,
    scale: 1.5
  },
  {
    id: '350',
    name: 'Apple TV+',
    bg: '#000000',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    invert: true,
    scale: 1.1
  }
];

export default function OTTPlatformStrip() {
  const navigate = useNavigate();

  const handlePlatformClick = (platform) => {
    navigate(`/platform/${platform.id}`, { state: { platform: { ...platform, color: platform.bg === '#ffffff' ? '#333' : platform.bg } } });
  };

  return (
    <div className="ott-strip-container">
      <div className="ott-strip">
        {platforms.map(platform => (
          <div
            key={platform.id}
            className="ott-platform-rectangle"
            onClick={() => handlePlatformClick(platform)}
            style={{ backgroundColor: platform.bg }}
          >
            <div className="ott-platform-logo-container">
              <img
                src={platform.logo}
                alt={platform.name}
                className="ott-platform-svg"
                style={{
                  filter: platform.invert ? 'invert(1)' : 'none',
                  transform: `scale(${platform.scale || 1})`
                }}
              />
              {platform.textSuffix && (
                <span className="ott-platform-suffix" style={{ color: platform.textColor }}>
                  {platform.textSuffix}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
