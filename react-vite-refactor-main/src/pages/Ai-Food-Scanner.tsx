import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCameraGallery, type CapturedMedia } from "@/hooks/useCameraGallery";

const AiFoodScanner: React.FC = () => {
  const navigate = useNavigate();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);

  const handleCapture = useCallback((media: CapturedMedia) => {
    setCapturedImage(media.dataUrl);
  }, []);

  const handleError = useCallback((err: Error) => {
    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
      setCameraError("Camera permission was denied. Click the 🔒 icon in your browser's address bar and allow camera access, then try again.");
    } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
      setCameraError("No camera was found on this device.");
    } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
      setCameraError("Your camera is already in use by another application. Please close it and try again.");
    } else {
      setCameraError(`Camera error: ${err.message}. Try uploading from your gallery instead.`);
    }
  }, []);

  const {
    isStreaming,
    videoRef,
    canvasRef,
    fileInputRef,
    startCamera,
    stopCamera,
    capturePhoto,
    openGallery,
    handleFileChange,
  } = useCameraGallery({
    facingMode: "environment",
    maxWidth: 1920,
    maxHeight: 1080,
    imageQuality: 0.92,
    onCapture: handleCapture,
    onError: handleError,
  });

  const handleCameraButton = async () => {
    if (isStartingCamera) return;
    setCameraError(null);

    if (isStreaming) {
      // Camera is active → capture photo
      const media = capturePhoto();
      if (!media) {
        setCameraError("Capture failed. Is the camera running?");
        return;
      }
      stopCamera();
    } else {
      // Start camera
      setIsStartingCamera(true);
      await startCamera();
      setIsStartingCamera(false);
    }
  };

  const handleStopCamera = () => {
    stopCamera();
    setCameraError(null);
  };

  return (
    <div
      className="bg-[#0c1321] text-[#dce2f6] font-inter min-h-screen pb-32"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Header ── */}
      <header className="w-full top-0 z-50 sticky bg-[#0c1321] flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[#4ade80] active:scale-95 transition-transform duration-200 cursor-pointer">
            menu
          </span>
        </div>
        <h1
          className="font-black tracking-tighter text-2xl text-[#4ade80] uppercase"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          KINETIC
        </h1>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#3d4a3e] hover:opacity-80 transition-opacity cursor-pointer">
          <img
            alt="User Profile"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4i7RlbQ4l304ud1zxmMU7fqKzh9QV1LSi39NPeIyQ8_bISd9ncovJOraB9kBs3BDUmXSxDXUbd3oc0_yQsLQqKNMVyr8Vf4QrUVXEPXy8HkaD4AuOn_-QmExGXamINh6zo5pOZKf5mdDdIWs6rJiNT70EBOgBXj6ohUK0gC_8pQM5Vzq0q7H_EcaKwvRL1VV3v_2kb_J3h3u0JhcJ3jTjtpQobvH0VP45-pMoGRspcknfrc0ZxtYx3PyYw6_9S9jJLzNFOO4gBdRi"
          />
        </div>
      </header>

      <main className="px-6 pt-8 max-w-2xl mx-auto">
        {/* ── Title ── */}
        <section className="mb-6 text-center md:text-left">
          <h2
            className="text-4xl font-extrabold tracking-tight text-[#dce2f6] mb-2"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Scan Your Meal
          </h2>
          <p className="text-[#bccabb] text-lg">
            Upload or capture your food to analyze nutrients.
          </p>
        </section>

        {/* ── Error Banner ── */}
        {cameraError && (
          <div className="mb-6 flex items-start gap-3 bg-red-900/30 border border-red-500/40 rounded-xl px-4 py-3 text-red-300 text-sm">
            <span className="material-symbols-outlined text-red-400 mt-0.5 shrink-0">warning</span>
            <span>{cameraError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          {/* ── Scanner Card ── */}
          <div className="relative group">
            <div className="w-full aspect-square md:aspect-video bg-[#151b2a] rounded-xl flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(74,222,128,0.15)]">

              {/* Captured photo overlay */}
              {capturedImage && (
                <img
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  src={capturedImage}
                  alt="Scanned Food"
                />
              )}

              {/* VIDEO: always in DOM, visibility controlled by CSS */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                controls={false}
                className="absolute inset-0 w-full h-full object-cover z-0"
                style={{ display: isStreaming && !capturedImage ? "block" : "none" }}
              />

              {/* Hidden canvas for snapshot */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Placeholder background image (shown when idle) */}
              {!capturedImage && !isStreaming && (
                <img
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity z-0"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_-xEzyFOY1TCD_56mMJu3QZp9clLCg_ZD9A0y0PujHMTNx0dsNwFrR1JTIB0k877ZYhhKuntIB_rmKfPnIq-z-wPici05KfkQHDiMuXz1l4rccv3W1VBMo8ZzdszFrYv61uR-ERsTmOoPIoNViM0gmTJNATGECs1Wvf4uaXjh7IeO0WqZlWOUKdXP6qWQIeTH74c4djypyzKwVFydoculqyvDPHzMT1bWuStNONSrajapXORUF8YDvQlHnO386NWpgTWI-VcPE_AF"
                  alt="food bowl"
                />
              )}

              {/* Scan line */}
              {!capturedImage && (
                <div
                  className="absolute top-1/2 w-full h-[2px] z-10"
                  style={{ background: "linear-gradient(90deg, transparent, #6bfb9a, transparent)" }}
                />
              )}

              {/* Controls overlay */}
              <div className="relative z-10 flex flex-col items-center gap-4 bg-black/30 p-4 rounded-3xl backdrop-blur-sm">
                <div className="flex gap-6 items-center">

                  {/* Camera / Capture / Stop button */}
                  <div
                    onClick={(e) => { e.stopPropagation(); handleCameraButton(); }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-[#6bfb9a]/20 active:scale-90 transition-all cursor-pointer select-none ${
                      isStartingCamera
                        ? "bg-[#6bfb9a]/60 text-[#003919]"
                        : isStreaming
                        ? "bg-white text-[#003919]"
                        : "bg-[#6bfb9a] text-[#003919]"
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-3xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {isStartingCamera ? "hourglass_top" : "photo_camera"}
                    </span>
                  </div>

                  {/* Stop camera button (visible when active) */}
                  {isStreaming && (
                    <div
                      onClick={(e) => { e.stopPropagation(); handleStopCamera(); }}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-[#2e3544]/80 text-[#bccabb] active:scale-90 transition-transform cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xl">close</span>
                    </div>
                  )}

                  {/* Gallery picker */}
                  <label
                    onClick={(e) => e.stopPropagation()}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-[#4de082] active:scale-90 transition-transform bg-[#2e3544]/80 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-3xl">gallery_thumbnail</span>
                    {/* Hidden file input driven by the hook's fileInputRef */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </label>
                </div>

                {/* Status text */}
                {!capturedImage && (
                  <p className="font-medium uppercase tracking-widest text-xs text-[#6dfe9c]">
                    {isStartingCamera
                      ? "Opening camera…"
                      : isStreaming
                      ? "Tap camera to capture"
                      : "Tap camera to scan"}
                  </p>
                )}

                {/* Retake button */}
                {capturedImage && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setCapturedImage(null); }}
                    className="font-bold uppercase tracking-widest text-xs text-white"
                  >
                    Retake Photo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Results Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#232a39] rounded-xl p-6 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span
                    className="text-[#4ade80] text-2xl font-bold"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    Avocado Toast
                  </span>
                  <p className="text-[#bccabb] font-medium">Whole Grain / Poached Egg</p>
                </div>
                <div className="bg-[#4ade80]/10 px-3 py-1 rounded-full border border-[#4ade80]/20">
                  <span className="text-[#4ade80] text-xs font-bold uppercase tracking-wider">Healthy Choice</span>
                </div>
              </div>
              <div className="flex items-end gap-2 mt-6">
                <span
                  className="text-4xl font-black text-[#6bfb9a]"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  +320
                </span>
                <span className="text-[#bccabb] font-medium mb-1">kcal</span>
              </div>
              <div className="mt-6 flex gap-4">
                {["Carbs / 24g", "Protein / 12g", "Fat / 18g"].map((item) => {
                  const [label, val] = item.split(" / ");
                  return (
                    <div key={label} className="flex-1 bg-[#2e3544]/50 p-3 rounded-lg text-center">
                      <p className="text-[10px] uppercase tracking-widest text-[#bccabb] mb-1">{label}</p>
                      <p className="font-bold text-[#dce2f6]" style={{ fontFamily: "'Manrope', sans-serif" }}>{val}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDB56t75EXUK6hxr9w-E5kIgUef1M0Pqwf9ebmLCmL9WB49fI77kOpgGlOTzwuc4nVuSAzCimzLopzYG5xd3GcZSPivkKOzkWxa_X3odrTwDzZZCfNYYbSs-c7E-tcAw6nw1x6KQFLcvC9wRcXeP2sQE1nfCIeKA4MyB7DizGJD3oiFcZOLQD9vVdTVsdCH_7mBlMF__kkHmN7Elll-QSGlY7Rgr0JWURpHesSi8YMFr8cblArIIinHNDLnGmBn0sgcYxiYo7_oTlpD", name: "Green Smoothie", time: "2 mins ago" },
                { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuByCuiIGS09NeOdRLn3zah4BZD2rIrUifq6JAviLHulmINb6oElG5AQHIo8na3r8t5IZiCS7ibZhkjoP5PMXJw-izNyqumgqx_12QI2lIN7HAwziWZzOmwk2ygIuektxRdikXFYe-wOuyV63MJTMM-2SYPZDxkbpeZqygi7BSeJz4Q1fPl2krrvcWiN6pzhP0-lUXejnbjwzs0MFQo9TbC9jWm7xxHEj6x9wv9imfCyKFwtKY3_Z2LTccOnn3geADHQ0LsM8JjA7Ld4", name: "Greek Salad", time: "15 mins ago" },
              ].map((item) => (
                <div key={item.name} className="bg-[#151b2a] rounded-xl p-5 flex items-center gap-4 hover:bg-[#232a39] transition-colors cursor-pointer">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#2e3544] shrink-0">
                    <img className="w-full h-full object-cover" src={item.src} alt={item.name} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#dce2f6]" style={{ fontFamily: "'Manrope', sans-serif" }}>{item.name}</h4>
                    <p className="text-xs text-[#4de082]">Detected {item.time}</p>
                  </div>
                  <span className="material-symbols-outlined text-[#bccabb]">chevron_right</span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full py-5 rounded-xl bg-gradient-to-br from-[#6bfb9a] to-[#4ade80] text-[#003919] font-extrabold text-lg uppercase tracking-widest shadow-lg shadow-[#6bfb9a]/20 hover:scale-[1.02] active:scale-95 transition-all mt-4">
            Add to Today
          </button>
        </div>
      </main>

      {/* ── Bottom Nav ── */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-6 pb-8 pt-4 bg-[#151b2a]/80 backdrop-blur-xl z-50 rounded-t-[1.5rem] shadow-[0_-16px_32px_rgba(74,222,128,0.06)]">
        <div onClick={() => navigate("/dashboard")} className="flex flex-col items-center justify-center text-slate-500 py-2 hover:text-[#4ADE80] transition-colors active:scale-90 duration-300 ease-out cursor-pointer">
          <span className="material-symbols-outlined">timer</span>
          <span className="font-medium text-[10px] uppercase tracking-widest mt-1">Focus</span>
        </div>
        <div onClick={() => navigate("/ai-food-scanner")} className="flex flex-col items-center justify-center bg-gradient-to-br from-[#6bfb9a] to-[#4ade80] text-[#0c1321] rounded-[1.5rem] px-5 py-2 active:scale-90 duration-300 ease-out cursor-pointer">
          <span className="material-symbols-outlined">install_mobile</span>
          <span className="font-medium text-[10px] uppercase tracking-widest mt-1">Scan</span>
        </div>
        <div onClick={() => navigate("/exercise-tracker")} className="flex flex-col items-center justify-center text-slate-500 py-2 hover:text-[#4ADE80] transition-colors active:scale-90 duration-300 ease-out cursor-pointer">
          <span className="material-symbols-outlined">fitness_center</span>
          <span className="font-medium text-[10px] uppercase tracking-widest mt-1">Train</span>
        </div>
        <div onClick={() => navigate("/calorie-detail-breakdown")} className="flex flex-col items-center justify-center text-slate-500 py-2 hover:text-[#4ADE80] transition-colors active:scale-90 duration-300 ease-out cursor-pointer">
          <span className="material-symbols-outlined">analytics</span>
          <span className="font-medium text-[10px] uppercase tracking-widest mt-1">Stats</span>
        </div>
      </nav>
    </div>
  );
};

export default AiFoodScanner;
