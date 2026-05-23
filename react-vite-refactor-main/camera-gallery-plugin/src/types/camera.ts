export type PermissionStatus = 'idle' | 'granted' | 'denied' | 'prompt' | 'unsupported';

export type CaptureMode = 'camera' | 'gallery' | 'both';

export interface CapturedMedia {
  dataUrl: string;       // base64 data URL for display / upload
  file?: File;           // original File object (from gallery pick)
  blob?: Blob;           // blob (from live camera capture)
  mimeType: string;
  width?: number;
  height?: number;
  source: 'camera' | 'gallery';
  timestamp: number;
}

export interface UseCameraGalleryOptions {
  /** Facing mode for live camera: 'environment' (back) | 'user' (front) */
  facingMode?: 'environment' | 'user';
  /** Image quality 0–1 when capturing from live camera */
  imageQuality?: number;
  /** MIME type for captured canvas output */
  mimeType?: 'image/jpeg' | 'image/png' | 'image/webp';
  /** Max width to resize captured image (px). 0 = no resize */
  maxWidth?: number;
  /** Max height to resize captured image (px). 0 = no resize */
  maxHeight?: number;
  /** Called on every successful capture */
  onCapture?: (media: CapturedMedia) => void;
  /** Called on any error */
  onError?: (err: Error) => void;
}

export interface UseCameraGalleryReturn {
  /* State */
  permissionStatus: PermissionStatus;
  isStreaming: boolean;
  isCameraSupported: boolean;

  /* Refs to attach to elements */
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;

  /* Actions */
  requestPermission: () => Promise<void>;
  startCamera: (facingMode?: 'environment' | 'user') => Promise<void>;
  stopCamera: () => void;
  capturePhoto: () => CapturedMedia | null;
  openGallery: () => void;
  switchCamera: () => Promise<void>;
}
