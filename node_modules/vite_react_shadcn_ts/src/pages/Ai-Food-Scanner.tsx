import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCameraGallery, type CapturedMedia } from "@/hooks/useCameraGallery";
import BottomNav from "@/components/BottomNav";

const AiFoodScanner: React.FC = () => {
  const navigate = useNavigate();
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);

  const getAuthRole = () => {
    const saved = localStorage.getItem("userAuth");
    if (saved) {
      const auth = JSON.parse(saved);
      return auth.role; // 'user' or 'guest'
    }
    return "guest";
  };

  const handleCapture = useCallback((media: CapturedMedia) => {
    const role = getAuthRole();
    if (role === "guest" && capturedImages.length >= 1) {
      setShowAuthModal(true);
      return;
    }
    if (capturedImages.length >= 3) {
      alert("You have already captured the maximum limit of 3 photos!");
      return;
    }
    setCapturedImages((prev) => [...prev, media.dataUrl]);
  }, [capturedImages]);

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

    const role = getAuthRole();
    if (isStreaming) {
      if (role === "guest" && capturedImages.length >= 1) {
        setShowAuthModal(true);
        stopCamera();
        return;
      }
      if (capturedImages.length >= 3) {
        alert("Maximum limit of 3 photos reached!");
        stopCamera();
        return;
      }

      // Camera is active → capture photo
      const media = capturePhoto();
      if (!media) {
        setCameraError("Capture failed. Is the camera running?");
        return;
      }

      const nextCount = capturedImages.length + 1;
      if ((role === "guest" && nextCount >= 1) || nextCount >= 3) {
        stopCamera();
      }
    } else {
      if (role === "guest" && capturedImages.length >= 1) {
        setShowAuthModal(true);
        return;
      }
      if (capturedImages.length >= 3) {
        alert("Maximum limit of 3 photos reached! Remove photos to scan more.");
        return;
      }
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
              {capturedImages.length > 0 && (
                <img
                  className="absolute inset-0 w-full h-full object-cover z-0 animate-in fade-in duration-300"
                  src={capturedImages[capturedImages.length - 1]}
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
                style={{ display: isStreaming && capturedImages.length === 0 ? "block" : "none" }}
              />

              {/* Hidden canvas for snapshot */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Placeholder background image (shown when idle) */}
              {capturedImages.length === 0 && !isStreaming && (
                <img
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity z-0"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_-xEzyFOY1TCD_56mMJu3QZp9clLCg_ZD9A0y0PujHMTNx0dsNwFrR1JTIB0k877ZYhhKuntIB_rmKfPnIq-z-wPici05KfkQHDiMuXz1l4rccv3W1VBMo8ZzdszFrYv61uR-ERsTmOoPIoNViM0gmTJNATGECs1Wvf4uaXjh7IeO0WqZlWOUKdXP6qWQIeTH74c4djypyzKwVFydoculqyvDPHzMT1bWuStNONSrajapXORUF8YDvQlHnO386NWpgTWI-VcPE_AF"
                  alt="food bowl"
                />
              )}

              {/* Scan line */}
              {capturedImages.length === 0 && (
                <div
                  className="absolute top-1/2 w-full h-[2px] z-10"
                  style={{ background: "linear-gradient(90deg, transparent, #6bfb9a, transparent)" }}
                />
              )}

              {/* Shutter button positioned down (Task 3) */}
              <div 
                className={`${
                  isStreaming 
                    ? "absolute bottom-4 left-1/2 -translate-x-1/2 w-fit bg-black/60 px-5 py-2 rounded-full border border-white/10" 
                    : "relative"
                } z-10 flex flex-col items-center gap-2 backdrop-blur-sm transition-all`}
              >
                <div className="flex gap-6 items-center">

                  {/* Camera / Capture / Stop button */}
                  <div
                    onClick={(e) => { e.stopPropagation(); handleCameraButton(); }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-[#6bfb9a]/20 active:scale-90 transition-all cursor-pointer select-none ${isStartingCamera
                        ? "bg-[#6bfb9a]/60 text-[#003919]"
                        : isStreaming
                          ? "bg-white text-[#003919]"
                          : "bg-[#6bfb9a] text-[#003919]"
                      }`}
                  >
                    <span
                      className="material-symbols-outlined text-2xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {isStartingCamera ? "hourglass_top" : isStreaming ? "lens" : "photo_camera"}
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
                  {!isStreaming && (
                    <label
                      onClick={(e) => e.stopPropagation()}
                      className="w-14 h-14 rounded-full flex items-center justify-center text-[#4de082] active:scale-90 transition-transform bg-[#2e3544]/80 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-2xl">gallery_thumbnail</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </label>
                  )}
                </div>

                {/* Status text */}
                {capturedImages.length === 0 && (
                  <p className="font-semibold uppercase tracking-widest text-[9px] text-[#6dfe9c] text-center">
                    {isStartingCamera
                      ? "Opening camera…"
                      : isStreaming
                        ? "Tap shutter to capture"
                        : "Tap camera to scan"}
                  </p>
                )}

                {/* Retake button */}
                {capturedImages.length > 0 && !isStreaming && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setCapturedImages([]); }}
                    className="font-bold uppercase tracking-widest text-[10px] text-white"
                  >
                    Retake All
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 3 Picture Slots Area (Task 2) */}
          <div className="bg-[#121A2B] p-4 rounded-xl border border-white/5 space-y-3">
            <p className="text-[10px] font-black tracking-widest text-[#bccabb] uppercase">
              Captured Meal Slots (Up to 3 images)
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((index) => {
                const img = capturedImages[index];
                const isLocked = index >= 1 && getAuthRole() === "guest";
                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (img) {
                        if (confirm("Remove this photo from analysis?")) {
                          setCapturedImages((prev) => prev.filter((_, i) => i !== index));
                        }
                      } else if (isLocked) {
                        setShowAuthModal(true);
                      } else {
                        alert("Tap the shutter button or open gallery above to add photo!");
                      }
                    }}
                    className={`aspect-square rounded-xl bg-[#151b2a] border-2 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 select-none cursor-pointer ${
                      img 
                        ? "border-[#4ade80] scale-105" 
                        : isLocked 
                          ? "border-red-900/30 text-red-400 bg-red-950/10" 
                          : "border-dashed border-slate-700 text-slate-500 hover:border-slate-600"
                    }`}
                  >
                    {img ? (
                      <>
                        <img src={img} alt={`Slot ${index + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-bold shadow-md">
                          ✕
                        </div>
                      </>
                    ) : (
                      <div className="text-center flex flex-col items-center gap-1 p-2">
                        <span className="material-symbols-outlined text-xl">
                          {isLocked ? "lock" : "add_a_photo"}
                        </span>
                        <span className="text-[8px] font-black tracking-wider uppercase block">
                          {isLocked ? "Locked" : `Slot ${index + 1}`}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
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

          <button 
            onClick={() => {
              if (capturedImages.length === 0) {
                alert("Please scan or upload a meal photo first!");
                return;
              }
              const saved = localStorage.getItem("foodEntries");
              const entries = saved ? JSON.parse(saved) : [];
              entries.push({
                id: Date.now().toString(),
                name: "Healthy Scanned Meal",
                calories: 320,
                carbs: 24,
                protein: 12,
                fat: 18,
                date: new Date().toISOString(),
                images: capturedImages,
              });
              localStorage.setItem("foodEntries", JSON.stringify(entries));

              const todayStr = new Date().toISOString().split("T")[0];
              const savedRecords = localStorage.getItem("dailyRecords");
              const records = savedRecords ? JSON.parse(savedRecords) : [];
              records.push({
                date: todayStr,
                completed: true,
                precision: "sugar",
                duration: 24,
              });
              localStorage.setItem("dailyRecords", JSON.stringify(records));

              alert("Meal logged successfully! 🥑");
              navigate("/dashboard");
            }}
            className="w-full py-5 rounded-xl bg-gradient-to-br from-[#6bfb9a] to-[#4ade80] text-[#003919] font-extrabold text-lg uppercase tracking-widest shadow-lg shadow-[#6bfb9a]/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
          >
            Add to Today
          </button>
        </div>
      </main>

      {/* Guest Lock Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/85 z-[100] flex items-end sm:items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#121A2B] w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 sm:p-8 space-y-6 animate-in slide-in-from-bottom-5 border border-white/10 shadow-2xl">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-400">
                <span className="material-symbols-outlined text-4xl">lock</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white uppercase" style={{ fontFamily: "'Manrope', sans-serif" }}>
                Unlock Multi-Photo Scanning
              </h3>
              <p className="text-[#bccabb] text-sm leading-relaxed">
                Guest accounts are limited to **exactly 1 photo scan** per meal. Register or Sign In to capture up to 3 photos for full nutritional breakdown analysis!
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <button
                onClick={() => { setShowAuthModal(false); navigate("/auth"); }}
                className="w-full py-4 rounded-xl bg-gradient-to-br from-[#6bfb9a] to-[#4ade80] text-[#003919] font-black text-base uppercase tracking-wider shadow-lg active:scale-95 transition-all"
              >
                Create Account / Sign In
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full py-3 rounded-xl bg-[#2e3544]/50 text-slate-300 font-bold text-sm uppercase hover:bg-[#2e3544]/75 transition-all"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Nav ── */}
      <BottomNav active="scan" />
    </div>
  );
};

export default AiFoodScanner;
