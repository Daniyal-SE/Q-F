import { useState, useCallback } from 'react';
import { useCameraGallery } from '../hooks/useCameraGallery';
import type { CapturedMedia } from '../types/camera';

interface Props {
  onCapture?: (media: CapturedMedia) => void;
}

export default function CameraGalleryPicker({ onCapture }: Props) {
  const [captures, setCaptures] = useState<CapturedMedia[]>([]);
  const [activeTab, setActiveTab] = useState<'camera' | 'gallery'>('camera');
  const [error, setError] = useState<string | null>(null);

  const handleCapture = useCallback(
    (media: CapturedMedia) => {
      setCaptures((prev) => [media, ...prev].slice(0, 12));
      onCapture?.(media);
    },
    [onCapture]
  );

  const {
    permissionStatus,
    isStreaming,
    isCameraSupported,
    videoRef,
    canvasRef,
    fileInputRef,
    requestPermission,
    startCamera,
    stopCamera,
    capturePhoto,
    openGallery,
    switchCamera,
    _handleFileChange,
  } = useCameraGallery({
    facingMode: 'environment',
    maxWidth: 1920,
    maxHeight: 1080,
    imageQuality: 0.92,
    onCapture: handleCapture,
    onError: (e) => setError(e.message),
  }) as ReturnType<typeof useCameraGallery> & {
    _handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };

  const handleStartCamera = async () => {
    setError(null);
    await startCamera();
  };

  const handleCapPhoto = () => {
    const m = capturePhoto();
    if (!m) setError('Failed to capture. Is the camera running?');
  };

  return (
    <div style={styles.wrapper}>
      {/* ── Tabs ── */}
      <div style={styles.tabBar}>
        {(['camera', 'gallery'] as const).map((tab) => (
          <button
            key={tab}
            style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
            onClick={() => { setActiveTab(tab); if (tab === 'gallery') stopCamera(); }}
          >
            {tab === 'camera' ? '📷 Camera' : '🖼️ Gallery'}
          </button>
        ))}
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div style={styles.errorBanner}>
          ⚠️ {error}
          <button style={styles.errorClose} onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* ══ CAMERA TAB ══════════════════════════════════════════════════════ */}
      {activeTab === 'camera' && (
        <div style={styles.panel}>
          {!isCameraSupported ? (
            <StatusCard
              emoji="🚫"
              title="Camera not supported"
              desc="Your browser or device doesn't support camera access."
            />
          ) : permissionStatus === 'denied' ? (
            <StatusCard
              emoji="🔒"
              title="Camera access denied"
              desc="Please enable camera permission in your browser / device settings, then reload."
            />
          ) : !isStreaming ? (
            <div style={styles.startArea}>
              <div style={styles.cameraIcon}>📷</div>
              <p style={styles.hint}>
                {permissionStatus === 'idle'
                  ? 'Tap below to allow camera access'
                  : 'Camera is ready — tap Start'}
              </p>
              <button style={styles.primaryBtn} onClick={handleStartCamera}>
                {permissionStatus === 'idle' ? 'Allow Camera' : 'Start Camera'}
              </button>
              {permissionStatus === 'idle' && (
                <button style={styles.ghostBtn} onClick={requestPermission}>
                  Check Permission
                </button>
              )}
            </div>
          ) : (
            <div style={styles.liveArea}>
              {/* Live viewfinder */}
              <div style={styles.viewfinder}>
                {/* ✅ playsinline + muted required for iOS Safari */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={styles.video}
                />
                <div style={styles.viewfinderCorners} />
              </div>

              {/* Controls */}
              <div style={styles.controls}>
                <button style={styles.iconBtn} title="Switch camera" onClick={switchCamera}>
                  🔄
                </button>
                <button style={styles.captureBtn} onClick={handleCapPhoto} title="Take photo">
                  <span style={styles.captureBtnInner} />
                </button>
                <button style={styles.iconBtn} title="Stop camera" onClick={stopCamera}>
                  ⏹️
                </button>
              </div>
            </div>
          )}

          {/* Hidden canvas for snapshot */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}

      {/* ══ GALLERY TAB ═════════════════════════════════════════════════════ */}
      {activeTab === 'gallery' && (
        <div style={styles.panel}>
          <div style={styles.startArea}>
            <div style={styles.cameraIcon}>🖼️</div>
            <p style={styles.hint}>Pick a photo or video from your device</p>

            {/* Standard gallery picker */}
            <button style={styles.primaryBtn} onClick={openGallery}>
              Choose from Gallery
            </button>

            {/* Mobile native: opens camera directly */}
            <button
              style={styles.ghostBtn}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.capture = 'environment'; // opens back camera on Android/iOS
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    handleCapture({
                      dataUrl: ev.target!.result as string,
                      file,
                      mimeType: file.type,
                      source: 'gallery',
                      timestamp: Date.now(),
                    });
                  };
                  reader.readAsDataURL(file);
                };
                input.click();
              }}
            >
              Open Native Camera
            </button>

            {/* Hidden file input for gallery */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              style={{ display: 'none' }}
              onChange={_handleFileChange}
            />
          </div>
        </div>
      )}

      {/* ══ CAPTURES GRID ═══════════════════════════════════════════════════ */}
      {captures.length > 0 && (
        <div style={styles.grid}>
          <h3 style={styles.gridTitle}>Captured ({captures.length})</h3>
          <div style={styles.gridInner}>
            {captures.map((c, i) => (
              <div key={i} style={styles.thumb}>
                <img src={c.dataUrl} alt={`capture-${i}`} style={styles.thumbImg} />
                <span style={styles.thumbBadge}>{c.source === 'camera' ? '📷' : '🖼️'}</span>
                <a
                  href={c.dataUrl}
                  download={`capture-${c.timestamp}.jpg`}
                  style={styles.thumbDl}
                  title="Download"
                >
                  ⬇
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Small helper ─────────────────────────────────────────────────────────────
function StatusCard({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div style={styles.startArea}>
      <div style={styles.cameraIcon}>{emoji}</div>
      <h3 style={{ margin: '0 0 8px', color: '#f1f5f9' }}>{title}</h3>
      <p style={styles.hint}>{desc}</p>
    </div>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    fontFamily: "'DM Sans', system-ui, sans-serif",
    maxWidth: 480,
    margin: '0 auto',
    background: '#0f172a',
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
  },
  tabBar: {
    display: 'flex',
    background: '#1e293b',
    borderBottom: '1px solid #334155',
  },
  tab: {
    flex: 1,
    padding: '14px 0',
    border: 'none',
    background: 'transparent',
    color: '#64748b',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    letterSpacing: '0.02em',
  },
  tabActive: {
    color: '#38bdf8',
    borderBottom: '2px solid #38bdf8',
  },
  errorBanner: {
    background: '#7f1d1d',
    color: '#fca5a5',
    padding: '10px 16px',
    fontSize: 13,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorClose: {
    background: 'none',
    border: 'none',
    color: '#fca5a5',
    fontSize: 18,
    cursor: 'pointer',
    padding: '0 4px',
  },
  panel: {
    minHeight: 340,
    display: 'flex',
    flexDirection: 'column',
  },
  startArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    gap: 12,
  },
  cameraIcon: {
    fontSize: 56,
    lineHeight: 1,
    marginBottom: 8,
    filter: 'drop-shadow(0 4px 12px rgba(56,189,248,0.3))',
  },
  hint: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    margin: 0,
    lineHeight: 1.5,
  },
  primaryBtn: {
    marginTop: 8,
    padding: '12px 32px',
    borderRadius: 100,
    border: 'none',
    background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(56,189,248,0.3)',
    transition: 'transform 0.15s, box-shadow 0.15s',
    width: '100%',
    maxWidth: 280,
  },
  ghostBtn: {
    padding: '11px 32px',
    borderRadius: 100,
    border: '1.5px solid #334155',
    background: 'transparent',
    color: '#94a3b8',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    width: '100%',
    maxWidth: 280,
  },
  liveArea: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  viewfinder: {
    position: 'relative',
    background: '#000',
    aspectRatio: '4/3',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  viewfinderCorners: {},
  controls: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '16px 24px',
    background: '#0f172a',
  },
  iconBtn: {
    background: '#1e293b',
    border: '1.5px solid #334155',
    borderRadius: '50%',
    width: 48,
    height: 48,
    fontSize: 20,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtn: {
    width: 68,
    height: 68,
    borderRadius: '50%',
    border: '3px solid #fff',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  captureBtnInner: {
    display: 'block',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: '#fff',
  },
  grid: {
    padding: '16px',
    borderTop: '1px solid #1e293b',
  },
  gridTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    margin: '0 0 12px',
  },
  gridInner: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
  },
  thumb: {
    position: 'relative',
    aspectRatio: '1',
    borderRadius: 10,
    overflow: 'hidden',
    background: '#1e293b',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  thumbBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    fontSize: 11,
    background: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    padding: '1px 4px',
  },
  thumbDl: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: 4,
    padding: '2px 6px',
    fontSize: 13,
  },
};
