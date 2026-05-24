import { useRef, useState, useCallback, useEffect } from 'react';
import type {
  PermissionStatus,
  CapturedMedia,
  UseCameraGalleryOptions,
  UseCameraGalleryReturn,
} from '../types/camera';

// ─── helpers ────────────────────────────────────────────────────────────────

function isCameraSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function'
  );
}

/** Resize a raw dataUrl to maxW × maxH keeping aspect ratio */
function resizeDataUrl(
  dataUrl: string,
  maxWidth: number,
  maxHeight: number,
  mimeType: string,
  quality: number
): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (maxWidth && width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
      if (maxHeight && height > maxHeight) { width = Math.round((width * maxHeight) / height); height = maxHeight; }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      resolve({ dataUrl: canvas.toDataURL(mimeType, quality), width, height });
    };
    img.src = dataUrl;
  });
}

// ─── hook ───────────────────────────────────────────────────────────────────

export function useCameraGallery(options: UseCameraGalleryOptions = {}): UseCameraGalleryReturn {
  const {
    facingMode: defaultFacing = 'environment',
    imageQuality = 0.92,
    mimeType = 'image/jpeg',
    maxWidth = 1920,
    maxHeight = 1080,
    onCapture,
    onError,
  } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const currentFacingRef = useRef<'environment' | 'user'>(defaultFacing);

  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('idle');
  const [isStreaming, setIsStreaming] = useState(false);

  // ── Stop stream helper ──────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => stopCamera(), [stopCamera]);

  // ── Request permission (Permissions API where available) ────────────────
  const requestPermission = useCallback(async () => {
    if (!isCameraSupported()) {
      setPermissionStatus('unsupported');
      return;
    }
    try {
      // Use Permissions API first (Chrome/Android)
      if (navigator.permissions?.query) {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setPermissionStatus(result.state as PermissionStatus);
        result.onchange = () => setPermissionStatus(result.state as PermissionStatus);
        if (result.state === 'denied') return;
      }
      // Trigger the actual browser dialog
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      stream.getTracks().forEach((t) => t.stop()); // just checking; don't keep it
      setPermissionStatus('granted');
    } catch (err) {
      const e = err as Error;
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        setPermissionStatus('denied');
      }
      onError?.(e);
    }
  }, [onError]);

  // ── Start live camera ───────────────────────────────────────────────────
  const startCamera = useCallback(
    async (facing: 'environment' | 'user' = currentFacingRef.current) => {
      if (!isCameraSupported()) {
        setPermissionStatus('unsupported');
        onError?.(new Error('Camera not supported on this device/browser.'));
        return;
      }
      stopCamera();
      currentFacingRef.current = facing;
      try {
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        setPermissionStatus('granted');

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // ✅ iOS Safari requires these attributes
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.setAttribute('muted', 'true');
          videoRef.current.muted = true;
          await videoRef.current.play();
          setIsStreaming(true);
        }
      } catch (err) {
        const e = err as Error;
        if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
          setPermissionStatus('denied');
        }
        onError?.(e);
      }
    },
    [stopCamera, onError]
  );

  // ── Capture a photo from the live video stream ──────────────────────────
  const capturePhoto = useCallback((): CapturedMedia | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !isStreaming) return null;

    const vw = video.videoWidth || video.clientWidth;
    const vh = video.videoHeight || video.clientHeight;
    canvas.width = vw;
    canvas.height = vh;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0, vw, vh);
    const rawDataUrl = canvas.toDataURL(mimeType, imageQuality);

    const processAndEmit = async () => {
      let finalUrl = rawDataUrl;
      let w = vw, h = vh;
      if (maxWidth || maxHeight) {
        const r = await resizeDataUrl(rawDataUrl, maxWidth, maxHeight, mimeType, imageQuality);
        finalUrl = r.dataUrl; w = r.width; h = r.height;
      }
      const media: CapturedMedia = {
        dataUrl: finalUrl,
        mimeType,
        width: w,
        height: h,
        source: 'camera',
        timestamp: Date.now(),
      };
      onCapture?.(media);
    };
    processAndEmit();

    // Return synchronous raw for immediate UI use (before resize)
    return {
      dataUrl: rawDataUrl,
      mimeType,
      width: vw,
      height: vh,
      source: 'camera',
      timestamp: Date.now(),
    };
  }, [isStreaming, mimeType, imageQuality, maxWidth, maxHeight, onCapture]);

  // ── Open gallery (file picker) ──────────────────────────────────────────
  const openGallery = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // ── Handle gallery file selection ───────────────────────────────────────
  // (attach this to the hidden <input onChange>) — exported for convenience
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const rawUrl = ev.target?.result as string;
        let finalUrl = rawUrl;
        let w: number | undefined, h: number | undefined;
        if (maxWidth || maxHeight) {
          const r = await resizeDataUrl(rawUrl, maxWidth, maxHeight, file.type || mimeType, imageQuality);
          finalUrl = r.dataUrl; w = r.width; h = r.height;
        }
        const media: CapturedMedia = {
          dataUrl: finalUrl,
          file,
          mimeType: file.type || mimeType,
          width: w,
          height: h,
          source: 'gallery',
          timestamp: Date.now(),
        };
        onCapture?.(media);
      };
      reader.readAsDataURL(file);
      // Reset so same file can be re-selected
      e.target.value = '';
    },
    [maxWidth, maxHeight, mimeType, imageQuality, onCapture]
  );

  // ── Switch camera (front ↔ back) ────────────────────────────────────────
  const switchCamera = useCallback(async () => {
    const next = currentFacingRef.current === 'environment' ? 'user' : 'environment';
    await startCamera(next);
  }, [startCamera]);

  return {
    permissionStatus,
    isStreaming,
    isCameraSupported: isCameraSupported(),
    videoRef,
    canvasRef,
    fileInputRef,
    requestPermission,
    startCamera,
    stopCamera,
    capturePhoto,
    openGallery,
    switchCamera,
    // expose handleFileChange for the hidden input
    _handleFileChange: handleFileChange,
  } as UseCameraGalleryReturn & { _handleFileChange: typeof handleFileChange };
}
