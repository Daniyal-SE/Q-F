import CameraGalleryPicker from './components/CameraGalleryPicker';
import type { CapturedMedia } from './types/camera';

export default function App() {
  const handleCapture = (media: CapturedMedia) => {
    console.log('📸 Captured:', {
      source: media.source,
      size: `${media.width}×${media.height}`,
      type: media.mimeType,
    });
    // 👇 Upload to your API here:
    // const form = new FormData();
    // form.append('file', media.file ?? dataUrlToBlob(media.dataUrl));
    // await fetch('/api/upload', { method: 'POST', body: form });
  };

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(160deg, #020617 0%, #0f172a 50%, #1a0533 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      gap: 24,
    }}>
      <header style={{ textAlign: 'center' }}>
        <h1 style={{
          margin: 0,
          fontSize: 'clamp(22px, 5vw, 32px)',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #38bdf8, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em',
        }}>
          Camera & Gallery
        </h1>
        <p style={{ color: '#64748b', margin: '6px 0 0', fontSize: 14 }}>
          React · Vite · TypeScript · Vercel-ready
        </p>
      </header>

      <CameraGalleryPicker onCapture={handleCapture} />

      <p style={{ color: '#334155', fontSize: 12, textAlign: 'center', maxWidth: 320 }}>
        Works on iOS Safari, Android Chrome, and desktop browsers.<br />
        Requires HTTPS in production (provided by Vercel automatically).
      </p>
    </div>
  );
}
