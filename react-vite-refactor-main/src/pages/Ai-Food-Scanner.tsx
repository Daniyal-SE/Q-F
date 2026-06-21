import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCameraGallery, type CapturedMedia } from "@/hooks/useCameraGallery";
import BottomNav from "@/components/BottomNav";

interface FoodLogEntry {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  date: string;
  images?: string[];
}

interface AnalysisResult {
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  remark: string;
}

// ── ChatGPT API Configuration (OpenAI 2025 Models) ──
const OPENAI_API_KEY = (import.meta.env.VITE_OPENAI_API_KEY as string) || "YOUR_OPENAI_API_KEY_HERE"; // 🔑 Paste your OpenAI key (starts with sk-) 

const getApiConfig = () => {
  const cleanKey = OPENAI_API_KEY.trim();

  // If using OpenAI or OpenRouter key
  if (cleanKey.startsWith("sk-")) {
    const isOpenRouter = cleanKey.startsWith("sk-or-v1-");
    return {
      url: isOpenRouter ? "https://openrouter.ai/api/v1/chat/completions" : "https://api.openai.com/v1/chat/completions",
      model: isOpenRouter ? "openai/gpt-4.1" : "gpt-4.1",
      headers: {
        "Authorization": `Bearer ${cleanKey}`,
        "Content-Type": "application/json",
      }
    };
  }

  // Default to Google Gemini AI Studio (handles AIza, AQ. and fallback)
  return {
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    model: "gemini-2.5-flash",
    headers: {
      "Authorization": `Bearer ${cleanKey}`,
      "Content-Type": "application/json",
    }
  };
};

const NUTRITION_PROMPT = `You are a specialized AI Nutrition Assistant. Your task is to analyze images provided by the user through a camera feed. Follow these instructions strictly:

1. IMAGE VALIDATION:
- Immediately inspect the image to determine if it contains food or beverages.
- If the image does NOT contain food or drinks (e.g., it's a person, a room, a gadget, or any non-edible item), you must output ONLY the following exact error message: "ERROR: Invalid image. Please provide a picture of food or beverages only."
- Do not provide any analysis, nutritional breakdown, or conversational text if the image is invalid.

2. NUTRITIONAL ANALYSIS:
- If the image contains food or drinks, identify the item(s) and provide an accurate estimation of the following nutritional values:
  - Calories (kcal)
  - Carbohydrates (g)
  - Protein (g)
  - Fat (g)
- Present the information in a clean, structured format (Markdown table).

3. FORMATTING:
- First line: State the detected food/drink name in bold on its own line (e.g., **Avocado Toast**)
- Then use this table structure:
  | Nutrient | Amount |
  | :--- | :--- |
  | Calories | X kcal |
  | Protein | X g |
  | Carbs | X g |
  | Fat | X g |
- Add a short, helpful remark about the food item's health profile (e.g., "This is a high-protein meal, good for muscle recovery").

4. CONSTRAINTS:
- Do not mention that you are an AI.
- Be concise and direct.
- Never guess nutritional values for non-food items; if you are unsure if something is edible, trigger the ERROR message.`;

const parseNutritionResponse = (text: string): AnalysisResult => {
  // Extract values from markdown table
  const calorieMatch = text.match(/Calories\s*\|\s*~?(\d+)/i);
  const proteinMatch = text.match(/Protein\s*\|\s*~?(\d+)/i);
  const carbsMatch = text.match(/Carb[s]?(?:ohydrates)?\s*\|\s*~?(\d+)/i);
  const fatMatch = text.match(/Fat\s*\|\s*~?(\d+)/i);

  // Extract food name from bold text or heading
  let name = "Scanned Meal";
  const boldMatch = text.match(/\*\*(.+?)\*\*/);
  if (boldMatch) {
    name = boldMatch[1].trim();
  } else {
    const headingMatch = text.match(/^#+\s+(.+)/m);
    if (headingMatch) name = headingMatch[1].trim();
  }

  // Extract remark — text after the last table row
  let remark = "";
  const tableEnd = text.lastIndexOf("|");
  if (tableEnd > 0) {
    const afterTable = text
      .substring(tableEnd + 1)
      .trim()
      .split("\n")
      .filter((l) => l.trim() && !l.includes("|") && !l.startsWith("---") && !l.startsWith("-"))
      .join(" ")
      .trim();
    remark = afterTable;
  }

  return {
    name,
    calories: parseInt(calorieMatch?.[1] || "0"),
    protein: parseInt(proteinMatch?.[1] || "0"),
    carbs: parseInt(carbsMatch?.[1] || "0"),
    fat: parseInt(fatMatch?.[1] || "0"),
    remark,
  };
};

const AiFoodScanner: React.FC = () => {
  const navigate = useNavigate();
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [foodEntries, setFoodEntries] = useState<FoodLogEntry[]>([]);

  const loadFoodEntries = () => {
    const raw = localStorage.getItem("foodEntries");
    const allEntries: FoodLogEntry[] = raw ? JSON.parse(raw) : [];
    const todayStr = new Date().toISOString().split("T")[0];
    const todayEntries = allEntries.filter((e) =>
      e.date ? e.date.startsWith(todayStr) : true
    );
    setFoodEntries(todayEntries);
  };

  useEffect(() => {
    loadFoodEntries();
  }, []);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);

  // AI Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

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
    // Reset any previous analysis when new photo is added
    setAnalysisResult(null);
    setAnalysisError(null);
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

  // ── AI Food Analysis (with single image support + demo fallback) ──
  const analyzeFood = async () => {
    if (capturedImages.length === 0) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    // ── DEMO MODE: runs when no real API key is set ──
    const isDemoMode = (OPENAI_API_KEY as string) === "YOUR_OPENAI_API_KEY_HERE" || OPENAI_API_KEY.trim().length === 0;
    if (isDemoMode) {
      await new Promise(r => setTimeout(r, 2200)); // simulate network delay
      const demoResults: AnalysisResult[] = [
        { name: "Avocado & Spinach Bowl", calories: 412, carbs: 38, protein: 14, fat: 22, remark: "Rich in healthy monounsaturated fats and fiber. Great for sustained energy and heart health." },
        { name: "Grilled Chicken Salad", calories: 320, carbs: 18, protein: 36, fat: 11, remark: "High-protein, low-carb meal. Excellent for muscle recovery and weight management." },
        { name: "Margherita Pizza Slice", calories: 285, carbs: 36, protein: 12, fat: 10, remark: "Moderate calorie option. Enjoy in moderation as part of a balanced diet." },
        { name: "Dal Chawal", calories: 465, carbs: 72, protein: 18, fat: 9, remark: "A complete protein source when combined. Rich in fiber and essential amino acids." },
        { name: "Biryani (Chicken)", calories: 520, carbs: 58, protein: 28, fat: 19, remark: "Calorie-dense meal. Consider a smaller portion if managing calorie intake." },
      ];
      const demo = demoResults[Math.floor(Math.random() * demoResults.length)];
      setAnalysisResult(demo);
      setIsAnalyzing(false);
      return;
    }

    try {
      // Build content array — works with 1 OR multiple images
      const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
        { type: "text", text: NUTRITION_PROMPT },
      ];
      // Attach every captured image (at least 1 is guaranteed)
      capturedImages.forEach((img) => {
        content.push({ type: "image_url", image_url: { url: img } });
      });

      const apiConfig = getApiConfig();
      const response = await fetch(apiConfig.url, {
        method: "POST",
        headers: apiConfig.headers,
        body: JSON.stringify({
          model: apiConfig.model,
          messages: [{ role: "user", content }],
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData?.error?.message || `API request failed (${response.status})`
        );
      }

      const data = await response.json();
      const responseText = data.choices?.[0]?.message?.content || "";

      // Check for ERROR response (non-food image)
      if (responseText.includes("ERROR:")) {
        setAnalysisError(
          responseText.replace(/ERROR:\s*/i, "").trim() ||
          "Invalid image. Please provide a picture of food or beverages only."
        );
        return;
      }

      const result = parseNutritionResponse(responseText);

      // Validation: if all values are 0, something went wrong
      if (
        result.calories === 0 &&
        result.protein === 0 &&
        result.carbs === 0 &&
        result.fat === 0
      ) {
        setAnalysisError(
          "Could not extract nutrition data. Please try again with a clearer photo."
        );
        return;
      }

      setAnalysisResult(result);
    } catch (err: any) {
      setAnalysisError(
        err.message || "Failed to analyze image. Please check your connection and try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ── Dev helper: inject a food image from URL (used for browser testing) ──
  useEffect(() => {
    (window as any).__devInjectFoodImage = async (url: string) => {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          setCapturedImages([dataUrl]);
          setAnalysisResult(null);
          setAnalysisError(null);
          console.log("[DEV] Food image injected ✅");
        };
        reader.readAsDataURL(blob);
      } catch (e) {
        // If CORS blocks the fetch, use a bundled placeholder
        setCapturedImages(["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400"]);
        setAnalysisResult(null);
        setAnalysisError(null);
        console.log("[DEV] Fallback placeholder injected ✅");
      }
    };
  }, []);


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
                className={`${isStreaming
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
                    onClick={(e) => { e.stopPropagation(); setCapturedImages([]); setAnalysisResult(null); setAnalysisError(null); }}
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
                          setAnalysisResult(null);
                          setAnalysisError(null);
                        }
                      } else if (isLocked) {
                        setShowAuthModal(true);
                      } else {
                        alert("Tap the shutter button or open gallery above to add photo!");
                      }
                    }}
                    className={`aspect-square rounded-xl bg-[#151b2a] border-2 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 select-none cursor-pointer ${img
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

          {/* ── AI Analysis Section ── */}

          {/* Analyze Button — shown when photos exist but no analysis yet */}
          {capturedImages.length > 0 && !analysisResult && !isAnalyzing && (
            <button
              onClick={analyzeFood}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#4ade80]/15 to-[#3b82f6]/15 border border-[#4ade80]/30 text-[#4ade80] font-bold text-sm uppercase tracking-widest hover:from-[#4ade80]/25 hover:to-[#3b82f6]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined text-xl">auto_awesome</span>
              Analyze with AI
            </button>
          )}

          {/* Analyzing Loading State */}
          {isAnalyzing && (
            <div className="w-full py-10 flex flex-col items-center gap-4 bg-[#121A2B] rounded-xl border border-[#4ade80]/10">
              <div
                className="w-14 h-14 rounded-full border-[3px] border-[#4ade80]/20 border-t-[#4ade80] animate-spin"
              />
              <div className="text-center space-y-1">
                <p className="text-[#dce2f6] text-sm font-bold uppercase tracking-widest">
                  Analyzing Meal...
                </p>
                <p className="text-[#bccabb] text-[10px]">
                  Detecting food and estimating nutrition
                </p>
              </div>
            </div>
          )}

          {/* Analysis Error */}
          {analysisError && (
            <div className="bg-red-900/15 border border-red-500/25 rounded-xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-red-400 text-xl">error</span>
                </div>
                <div>
                  <p className="text-red-300 font-bold text-sm mb-1">Analysis Failed</p>
                  <p className="text-red-400/80 text-xs leading-relaxed">{analysisError}</p>
                </div>
              </div>
              <button
                onClick={analyzeFood}
                className="w-full py-2.5 bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-red-500/20 transition active:scale-[0.98]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ── AI Results Card ── */}
          {analysisResult && (
            <div className="bg-[#121A2B] rounded-2xl border border-[#4ade80]/15 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-500">
              {/* Header */}
              <div className="p-5 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3
                      className="text-2xl font-extrabold text-[#4ade80] leading-tight"
                      style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                      {analysisResult.name}
                    </h3>
                  </div>
                  <div className="bg-[#4ade80]/10 px-3 py-1.5 rounded-full border border-[#4ade80]/20 flex items-center gap-1.5 shrink-0">
                    <span className="material-symbols-outlined text-[#4ade80]" style={{ fontSize: 12 }}>auto_awesome</span>
                    <span className="text-[#4ade80] text-[9px] font-black uppercase tracking-wider">AI Detected</span>
                  </div>
                </div>

                {/* Calorie highlight */}
                <div className="flex items-end gap-2 mb-5">
                  <span
                    className="text-4xl font-black text-[#6bfb9a]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    +{analysisResult.calories}
                  </span>
                  <span className="text-[#bccabb] font-bold text-lg mb-0.5">kcal</span>
                </div>

                {/* Macro Pills */}
                <div className="flex gap-3">
                  {[
                    { label: "Carbs", value: `${analysisResult.carbs}g`, color: "#3b82f6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)" },
                    { label: "Protein", value: `${analysisResult.protein}g`, color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" },
                    { label: "Fat", value: `${analysisResult.fat}g`, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="flex-1 p-3 rounded-xl text-center"
                      style={{ background: m.bg, border: `1px solid ${m.border}` }}
                    >
                      <p className="text-[9px] uppercase tracking-widest font-black mb-1" style={{ color: m.color }}>
                        {m.label}
                      </p>
                      <p
                        className="font-extrabold text-[#dce2f6] text-lg"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                      >
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* AI Remark */}
                {analysisResult.remark && (
                  <div className="mt-4 bg-[#0c1321] rounded-xl p-3.5 border border-white/5 flex items-start gap-2.5">
                    <span className="text-sm mt-0.5">💡</span>
                    <p className="text-[#bccabb] text-xs leading-relaxed">{analysisResult.remark}</p>
                  </div>
                )}
              </div>

              {/* Re-analyze button */}
              <div className="px-5 pb-4">
                <button
                  onClick={analyzeFood}
                  className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] hover:text-[#4ade80] bg-[#0c1321]/50 rounded-lg border border-white/5 hover:border-[#4ade80]/20 transition"
                >
                  Re-analyze
                </button>
              </div>
            </div>
          )}

          {/* ── Nutrition Ring ── */}
          {(() => {
            const CALORIE_GOAL = 2000;
            const PROTEIN_GOAL = 120;
            const FAT_GOAL = 65;
            const CARBS_GOAL = 250;

            const raw = localStorage.getItem("foodEntries");
            const todayStr = new Date().toISOString().split("T")[0];
            const entries: { calories?: number; protein?: number; fat?: number; carbs?: number; date?: string }[] =
              raw ? JSON.parse(raw) : [];
            const todayEntries = entries.filter((e) =>
              e.date ? e.date.startsWith(todayStr) : true
            );

            const totalCals = todayEntries.reduce((s, e) => s + (e.calories || 0), 0);
            const totalProtein = todayEntries.reduce((s, e) => s + (e.protein || 0), 0);
            const totalFat = todayEntries.reduce((s, e) => s + (e.fat || 0), 0);
            const totalCarbs = todayEntries.reduce((s, e) => s + (e.carbs || 0), 0);

            const calsLeft = Math.max(0, CALORIE_GOAL - totalCals);
            const calsConsumed = Math.min(totalCals, CALORIE_GOAL);

            // SVG ring math — open C-shape like reference image
            const CX = 110; const CY = 110; const R = 86;
            const GAP_DEG = 60; // gap at the bottom
            const START_DEG = 90 + GAP_DEG / 2;   // e.g. 120°
            const END_DEG = 90 - GAP_DEG / 2 + 360; // e.g. 420° (= 60°)
            const FULL_ARC = 360 - GAP_DEG;          // 300°

            const toRad = (d: number) => (d * Math.PI) / 180;
            const polarX = (deg: number) => CX + R * Math.cos(toRad(deg));
            const polarY = (deg: number) => CY + R * Math.sin(toRad(deg));

            // Track arc (full C arc, gap at bottom)
            const trackD = `M ${polarX(START_DEG)} ${polarY(START_DEG)}
              A ${R} ${R} 0 1 1 ${polarX(END_DEG)} ${polarY(END_DEG)}`;

            // Filled arc based on calorie progress
            const pct = Math.min(calsConsumed / CALORIE_GOAL, 1);
            const filledArcDeg = pct * FULL_ARC;
            const filledEndDeg = START_DEG + filledArcDeg;
            const filledLargeArc = filledArcDeg > 180 ? 1 : 0;
            const filledD = pct <= 0
              ? ""
              : pct >= 1
                ? trackD
                : `M ${polarX(START_DEG)} ${polarY(START_DEG)}
                   A ${R} ${R} 0 ${filledLargeArc} 1 ${polarX(filledEndDeg)} ${polarY(filledEndDeg)}`;

            const macros = [
              { label: "Protein", current: Math.round(totalProtein), goal: PROTEIN_GOAL, color: "#ef4444" },
              { label: "Fat", current: Math.round(totalFat), goal: FAT_GOAL, color: "#f59e0b" },
              { label: "Carbs", current: Math.round(totalCarbs), goal: CARBS_GOAL, color: "#3b82f6" },
            ];

            return (
              <div className="py-3 px-1 sm:px-4">
                <p className="text-[10px] font-black tracking-widest text-[#bccabb] uppercase mb-5">
                  Today's Nutrition
                </p>
                <div className="flex flex-row items-center justify-between gap-3 sm:gap-6 w-full max-w-md mx-auto">
                  {/* Ring SVG (Responsive size) */}
                  <div className="relative shrink-0 w-[150px] h-[150px] sm:w-[220px] sm:h-[220px]">
                    <svg viewBox="0 0 220 220" className="w-full h-full">
                      <defs>
                        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#4ade80" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                      {/* Track */}
                      <path
                        d={trackD}
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="15"
                        strokeLinecap="round"
                      />
                      {/* Progress */}
                      {pct > 0 && (
                        <path
                          d={filledD}
                          fill="none"
                          stroke="url(#ringGrad)"
                          strokeWidth="15"
                          strokeLinecap="round"
                          style={{ transition: "stroke-dashoffset 0.8s ease" }}
                        />
                      )}
                      {/* Calories left */}
                      <text
                        x={CX} y={CY - 12}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="36"
                        fontWeight="800"
                        fill="#dce2f6"
                        fontFamily="Manrope, sans-serif"
                      >{calsLeft}</text>
                      <text
                        x={CX} y={CY + 18}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="9.5"
                        fill="#64748b"
                        fontFamily="Inter, sans-serif"
                        letterSpacing="0.1em"
                      >CALORIES LEFT</text>
                      <text
                        x={CX} y={CY + 44}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="13"
                        fill="#4ade80"
                        fontFamily="Inter, sans-serif"
                        fontWeight="700"
                      >🔥 +{totalCals}</text>
                    </svg>
                  </div>

                  {/* Macro progress bars (Responsive size, short bars) */}
                  <div className="flex flex-col gap-4 sm:gap-5">
                    {macros.map((m) => {
                      const barPct = Math.min((m.current / m.goal) * 100, 100);
                      return (
                        <div key={m.label} className="flex flex-col w-[110px] sm:w-[150px]">
                          <span className="text-[11px] sm:text-[14px] font-black text-[#dce2f6] uppercase tracking-wider mb-1.5 sm:mb-2">{m.label}</span>
                          <div className="w-full h-[3.5px] bg-[#1e293b] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${barPct}%`, background: m.color }}
                            />
                          </div>
                          <span className="text-[9px] sm:text-[11px] text-[#64748b] font-bold text-right mt-1 sm:mt-1.5">
                            {m.goal}g
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── Add to Today Button ── */}
          <button
            onClick={() => {
              if (!analysisResult) {
                if (capturedImages.length === 0) {
                  alert("Please scan or upload a meal photo first!");
                } else {
                  alert("Please analyze your meal with AI first!");
                }
                return;
              }
              const saved = localStorage.getItem("foodEntries");
              const entries = saved ? JSON.parse(saved) : [];
              entries.push({
                id: Date.now().toString(),
                name: analysisResult.name,
                calories: analysisResult.calories,
                carbs: analysisResult.carbs,
                protein: analysisResult.protein,
                fat: analysisResult.fat,
                date: new Date().toISOString(),
                images: capturedImages,
              });
              localStorage.setItem("foodEntries", JSON.stringify(entries));

              loadFoodEntries();

              // Reset state
              setCapturedImages([]);
              setAnalysisResult(null);
              setAnalysisError(null);

              alert("Meal logged successfully! 🥑");
            }}
            disabled={!analysisResult}
            className={`w-full py-5 rounded-xl font-extrabold text-lg uppercase tracking-widest shadow-lg transition-all mt-4 ${analysisResult
              ? "bg-gradient-to-br from-[#6bfb9a] to-[#4ade80] text-[#003919] shadow-[#6bfb9a]/20 hover:scale-[1.02] active:scale-95"
              : "bg-[#2e3544] text-[#64748b] cursor-not-allowed"
              }`}
          >
            {analysisResult ? "Add to Today" : capturedImages.length > 0 ? "Analyze First" : "Scan a Meal"}
          </button>

          {/* Food History Section */}
          <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-bold text-[#dce2f6]" style={{ fontFamily: "'Manrope', sans-serif" }}>Food History</h3>
                <button
                  onClick={() => navigate("/food-history")}
                  className="text-[#4ade80] text-xs font-semibold uppercase tracking-wider hover:underline bg-transparent border-none cursor-pointer"
                >
                  View All
                </button>
              </div>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[#6bfb9a] text-xs font-bold uppercase tracking-widest hover:underline bg-transparent border-none cursor-pointer"
              >
                + Add
              </button>
            </div>

            <div className="space-y-3">
              {foodEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 bg-[#121A2B] rounded-xl border border-white/5 gap-3 opacity-60">
                  <span className="material-symbols-outlined text-4xl text-[#4ade80]">no_meals</span>
                  <p className="text-[#bccabb] text-sm font-medium">No meals logged today</p>
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[#4ade80] text-xs font-bold uppercase tracking-widest border border-[#4ade80]/30 px-4 py-2 rounded-full hover:bg-[#4ade80]/10 transition"
                  >
                    Scan Food
                  </button>
                </div>
              ) : (
                foodEntries.map((entry) => {
                  const hasImage = entry.images && entry.images.length > 0;
                  const logTime = entry.date ? new Date(entry.date).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                  }) : "";

                  return (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-[#121A2B] rounded-xl border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-[#1a2336] border border-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                          {hasImage && entry.images ? (
                            <img src={entry.images[0]} alt={entry.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-xl text-slate-500">restaurant</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#dce2f6] text-sm leading-tight uppercase tracking-wide">{entry.name}</h4>
                          <p className="text-xs text-[#bccabb] mt-0.5">{logTime || "Today"}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-base font-extrabold text-[#dce2f6]" style={{ fontFamily: "'Manrope', sans-serif" }}>+{entry.calories}</span>
                        <span className="text-[10px] font-bold text-[#bccabb] uppercase ml-1">kcal</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
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
