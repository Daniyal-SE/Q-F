import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

type Activity = "running" | "walking" | "cycling";

interface SessionData {
  distance: number;       // meters
  steps: number;
  calories: number;
  duration: number;       // seconds
  avgSpeed: number;       // km/h
}

// MET (Metabolic Equivalent) values per activity
const MET: Record<Activity, number> = {
  walking: 3.5,
  running: 9.8,
  cycling: 7.5,
};

// Average weight fallback
const WEIGHT_KG = 70;

// Calorie formula: (MET × weight_kg × duration_hours) × 1000 → kcal
const calcCalories = (activity: Activity, durationSeconds: number): number =>
  Math.round((MET[activity] * WEIGHT_KG * (durationSeconds / 3600)));

// Step-based distance for walking/running (avg stride ~0.75m)
const stepsToMeters = (steps: number, activity: Activity): number => {
  const stride = activity === "running" ? 1.2 : 0.75;
  return steps * stride;
};

const formatTime = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const formatDist = (m: number) =>
  m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`;

const ACTIVITIES: { id: Activity; label: string; icon: string; color: string; bg: string; desc: string }[] = [
  {
    id: "cycling",
    label: "Cycling",
    icon: "directions_bike",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
    desc: "Track your ride distance & calories",
  },
  {
    id: "running",
    label: "Running",
    icon: "directions_run",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    desc: "Step-based run tracking via sensor",
  },
  {
    id: "walking",
    label: "Walking",
    icon: "directions_walk",
    color: "#4ade80",
    bg: "rgba(74,222,128,0.12)",
    desc: "Pedometer-powered walk tracker",
  },
];

const ExerciseTracker: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("userAuth");
    if (!auth) { navigate("/auth"); return; }
    const parsed = JSON.parse(auth);
    if (parsed.role === "guest") { navigate("/ai-food-scanner"); }
  }, [navigate]);

  const [selected, setSelected] = useState<Activity | null>(null);
  const [phase, setPhase] = useState<"select" | "active" | "done">("select");

  // Timer
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sensor data
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);       // meters
  const [gpsSpeed, setGpsSpeed] = useState(0);       // km/h (for cycling via GPS)
  const [sensorError, setSensorError] = useState<string | null>(null);
  const [sensorMode, setSensorMode] = useState<"accelerometer" | "gps" | "timer">("timer");

  // Refs for sensor cleanup
  const watchIdRef = useRef<number | null>(null);
  const accelListenerRef = useRef<((e: DeviceMotionEvent) => void) | null>(null);
  const lastStepTimeRef = useRef(0);
  const stepThresholdRef = useRef(0);

  const session: SessionData = {
    distance,
    steps,
    calories: selected ? calcCalories(selected, duration) : 0,
    duration,
    avgSpeed: duration > 0 ? (distance / 1000) / (duration / 3600) : 0,
  };

  // ── Start timer ──
  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  // ── GPS tracking (for cycling) ──
  const startGPS = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setSensorError("GPS not available on this device.");
      setSensorMode("timer");
      return;
    }
    let lastPos: GeolocationPosition | null = null;
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        if (pos.coords.speed !== null) {
          setGpsSpeed(pos.coords.speed * 3.6); // m/s → km/h
        }
        if (lastPos) {
          // Haversine distance
          const R = 6371000;
          const φ1 = (lastPos.coords.latitude * Math.PI) / 180;
          const φ2 = (pos.coords.latitude * Math.PI) / 180;
          const Δφ = ((pos.coords.latitude - lastPos.coords.latitude) * Math.PI) / 180;
          const Δλ = ((pos.coords.longitude - lastPos.coords.longitude) * Math.PI) / 180;
          const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
          const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          if (d > 1 && d < 200) setDistance(prev => prev + d); // filter noise
        }
        lastPos = pos;
        setSensorMode("gps");
      },
      (err) => {
        setSensorError(`GPS error: ${err.message}. Using timer mode.`);
        setSensorMode("timer");
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    );
  }, []);

  // ── Accelerometer step detection (for walking/running) ──
  const startAccelerometer = useCallback(() => {
    if (!("DeviceMotionEvent" in window)) {
      setSensorError("Accelerometer not available. Using time estimate.");
      setSensorMode("timer");
      return;
    }

    const requestPermission = async () => {
      // iOS 13+ requires permission
      if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
        try {
          const perm = await (DeviceMotionEvent as any).requestPermission();
          if (perm !== "granted") {
            setSensorError("Motion sensor permission denied. Using time estimate.");
            setSensorMode("timer");
            return;
          }
        } catch {
          setSensorError("Could not request sensor permission.");
          setSensorMode("timer");
          return;
        }
      }

      setSensorMode("accelerometer");
      const threshold = 12; // m/s² peak threshold for step detection
      let lastMag = 0;
      let rising = false;

      const handler = (e: DeviceMotionEvent) => {
        const acc = e.accelerationIncludingGravity;
        if (!acc) return;
        const mag = Math.sqrt((acc.x ?? 0) ** 2 + (acc.y ?? 0) ** 2 + (acc.z ?? 0) ** 2);
        const now = Date.now();

        // Peak detection: mag crosses threshold & min 250ms between steps
        if (!rising && mag > threshold && now - lastStepTimeRef.current > 250) {
          rising = true;
        } else if (rising && mag < threshold - 2) {
          rising = false;
          lastStepTimeRef.current = now;
          setSteps(s => {
            const newSteps = s + 1;
            setDistance(stepsToMeters(newSteps, selected!));
            return newSteps;
          });
        }
        lastMag = mag;
      };

      accelListenerRef.current = handler;
      window.addEventListener("devicemotion", handler);
    };

    requestPermission();
  }, [selected]);

  // ── Stop all sensors ──
  const stopSensors = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (accelListenerRef.current) {
      window.removeEventListener("devicemotion", accelListenerRef.current);
      accelListenerRef.current = null;
    }
  }, []);

  // ── Start session ──
  const handleStart = useCallback(() => {
    if (!selected) return;
    setDuration(0);
    setSteps(0);
    setDistance(0);
    setGpsSpeed(0);
    setSensorError(null);
    setPhase("active");
    startTimer();

    if (selected === "cycling") {
      startGPS();
    } else {
      startAccelerometer();
    }
  }, [selected, startTimer, startGPS, startAccelerometer]);

  // ── End session ──
  const handleStop = useCallback(() => {
    stopTimer();
    stopSensors();
    setPhase("done");
  }, [stopTimer, stopSensors]);

  // ── Save & exit ──
  const handleSave = () => {
    if (!selected || duration < 5) {
      alert("Activity too short to save!");
      return;
    }
    const saved = localStorage.getItem("exerciseEntries");
    const entries = saved ? JSON.parse(saved) : [];
    entries.push({
      id: Date.now().toString(),
      activity: selected,
      duration,
      calories: session.calories,
      distance: Math.round(distance),
      steps,
      date: new Date().toISOString(),
    });
    localStorage.setItem("exerciseEntries", JSON.stringify(entries));
    alert(`${selected.charAt(0).toUpperCase() + selected.slice(1)} session saved! 💪`);
    navigate("/dashboard");
  };

  // cleanup on unmount
  useEffect(() => () => { stopTimer(); stopSensors(); }, [stopTimer, stopSensors]);

  const act = selected ? ACTIVITIES.find(a => a.id === selected)! : null;

  // ── SELECTION SCREEN ──
  if (phase === "select") {
    return (
      <div className="bg-[#0c1321] text-[#dce2f6] min-h-screen pb-28" style={{ fontFamily: "'Inter', sans-serif" }}>
        <header className="w-full top-0 z-50 sticky bg-[#0c1321]/95 backdrop-blur-sm flex justify-between items-center px-5 py-4 border-b border-white/5">
          <h1 className="font-black tracking-tighter text-xl text-[#4ade80] uppercase" style={{ fontFamily: "'Manrope', sans-serif" }}>
            KINETIC
          </h1>
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#3d4a3e]">
            <img alt="Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4i7RlbQ4l304ud1zxmMU7fqKzh9QV1LSi39NPeIyQ8_bISd9ncovJOraB9kBs3BDUmXSxDXUbd3oc0_yQsLQqKNMVyr8Vf4QrUVXEPXy8HkaD4AuOn_-QmExGXamINh6zo5pOZKf5mdDdIWs6rJiNT70EBOgBXj6ohUK0gC_8pQM5Vzq0q7H_EcaKwvRL1VV3v_2kb_J3h3u0JhcJ3jTjtpQobvH0VP45-pMoGRspcknfrc0ZxtYx3PyYw6_9S9jJLzNFOO4gBdRi" />
          </div>
        </header>

        <main className="px-5 pt-6 max-w-lg mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#dce2f6]" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Start Activity
            </h2>
            <p className="text-[#94a3b8] text-sm mt-1">Choose an activity. Your phone sensors will track it live.</p>
          </div>
          {/* 3-Column Symmetrical Grid */}
          <div className="grid grid-cols-3 gap-3">
            {ACTIVITIES.map((act) => {
              const isSelected = selected === act.id;
              return (
                <button
                  key={act.id}
                  onClick={() => setSelected(act.id)}
                  className={`relative rounded-2xl flex flex-col items-center justify-center py-6 px-2 transition-all duration-300 active:scale-95 border-2 ${
                    isSelected
                      ? "border-opacity-100 shadow-lg"
                      : "border-white/5 hover:border-white/15"
                  }`}
                  style={{
                    background: isSelected ? act.bg : "rgba(21,27,42,0.9)",
                    borderColor: isSelected ? act.color : undefined,
                    boxShadow: isSelected ? `0 8px 24px ${act.color}25` : undefined,
                  }}
                >
                  {/* Selected checkmark badge */}
                  {isSelected && (
                    <div
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in fade-in zoom-in duration-200"
                      style={{ background: act.color }}
                    >
                      <span className="material-symbols-outlined text-white text-[10px] font-black">check</span>
                    </div>
                  )}
                  {/* Glowing icon container */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300"
                    style={{
                      background: isSelected
                        ? `linear-gradient(135deg, ${act.color}33, ${act.color}11)`
                        : "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                      boxShadow: isSelected
                        ? `0 4px 12px ${act.color}40`
                        : "none",
                      border: isSelected
                        ? `1px solid ${act.color}50`
                        : "1px solid rgba(255,255,255,0.05)"
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-2xl"
                      style={{
                        color: isSelected ? act.color : "#94a3b8",
                        fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0"
                      }}
                    >
                      {act.icon}
                    </span>
                  </div>
                  <span
                    className="font-black text-[10px] uppercase tracking-widest text-center"
                    style={{ color: isSelected ? act.color : "#dce2f6", fontFamily: "'Manrope', sans-serif" }}
                  >
                    {act.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sensor info */}
          <div className="bg-[#121a2b] rounded-xl p-4 border border-white/5 space-y-2">
            <p className="text-[10px] font-black tracking-widest text-[#4ade80] uppercase">How it tracks</p>
            <div className="space-y-1.5 text-xs text-[#64748b]">
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-base text-[#3b82f6]">directions_bike</span>Cycling → GPS speed & distance tracking</div>
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-base text-[#ef4444]">directions_run</span>Running → Accelerometer step counting</div>
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-base text-[#4ade80]">directions_walk</span>Walking → Pedometer via motion sensor</div>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={!selected}
            className={`w-full py-5 rounded-2xl font-extrabold text-lg uppercase tracking-widest transition-all active:scale-[0.98] ${
              selected
                ? "shadow-lg"
                : "bg-[#1e293b] text-[#475569] cursor-not-allowed"
            }`}
            style={
              selected && act
                ? {
                    background: `linear-gradient(135deg, ${act.color}dd, ${act.color}99)`,
                    color: "#0c1321",
                    boxShadow: `0 8px 32px ${act.color}44`,
                    fontFamily: "'Manrope', sans-serif",
                  }
                : { fontFamily: "'Manrope', sans-serif" }
            }
          >
            {selected ? `Start ${act!.label}` : "Select an Activity"}
          </button>
        </main>
        <BottomNav active="exercise" />
      </div>
    );
  }

  // ── ACTIVE / DONE SCREEN ──
  return (
    <div className="bg-[#0c1321] text-[#dce2f6] min-h-screen pb-28" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="w-full top-0 z-50 sticky bg-[#0c1321]/95 backdrop-blur-sm flex justify-between items-center px-5 py-4 border-b border-white/5">
        <button
          onClick={() => { stopTimer(); stopSensors(); setPhase("select"); setSelected(null); }}
          className="flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-black tracking-tighter text-xl uppercase" style={{ fontFamily: "'Manrope', sans-serif", color: act?.color }}>
          {act?.label ?? "Activity"}
        </h1>
        <div className="w-9 h-9" />
      </header>

      <main className="px-5 pt-6 max-w-lg mx-auto space-y-6">
        {/* Sensor mode badge */}
        <div className="flex items-center justify-center gap-2">
          <div
            className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"
            style={{ background: `${act?.color}18`, color: act?.color, border: `1px solid ${act?.color}33` }}
          >
            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
              {sensorMode === "gps" ? "gps_fixed" : sensorMode === "accelerometer" ? "sensors" : "timer"}
            </span>
            {sensorMode === "gps" ? "GPS Active" : sensorMode === "accelerometer" ? "Sensor Active" : "Timer Mode"}
          </div>
          {phase === "active" && (
            <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
          )}
        </div>

        {sensorError && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl px-4 py-2 text-yellow-300 text-xs">
            ⚠️ {sensorError}
          </div>
        )}

        {/* Big Timer */}
        <div className="flex flex-col items-center py-6">
          <span
            className="text-7xl font-black tracking-tighter tabular-nums"
            style={{ fontFamily: "'Manrope', sans-serif", color: phase === "done" ? act?.color : "#dce2f6" }}
          >
            {formatTime(duration)}
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-[#475569] mt-2">
            {phase === "active" ? "Elapsed Time" : "Total Time"}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Calories Burned",
              value: `-${session.calories}`,
              unit: "kcal",
              icon: "local_fire_department",
              color: "#ef4444",
            },
            {
              label: "Distance",
              value: distance >= 1000 ? (distance / 1000).toFixed(2) : Math.round(distance).toString(),
              unit: distance >= 1000 ? "km" : "m",
              icon: "straighten",
              color: "#3b82f6",
            },
            ...(selected !== "cycling"
              ? [{ label: "Steps", value: steps.toLocaleString(), unit: "steps", icon: "footprint", color: "#4ade80" }]
              : [{ label: "Speed", value: gpsSpeed.toFixed(1), unit: "km/h", icon: "speed", color: "#4ade80" }]),
            {
              label: "Avg Speed",
              value: session.avgSpeed > 0 ? session.avgSpeed.toFixed(1) : "—",
              unit: session.avgSpeed > 0 ? "km/h" : "",
              icon: "trending_up",
              color: act?.color ?? "#94a3b8",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#121a2b] rounded-2xl p-4 border border-white/5 flex flex-col gap-1"
            >
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base" style={{ color: stat.color, fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#475569]">{stat.label}</span>
              </div>
              <div className="flex items-end gap-1 mt-1">
                <span className="text-2xl font-extrabold" style={{ fontFamily: "'Manrope', sans-serif", color: stat.color }}>
                  {stat.value}
                </span>
                {stat.unit && <span className="text-xs font-bold text-[#475569] mb-0.5">{stat.unit}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        {phase === "active" ? (
          <button
            onClick={handleStop}
            className="w-full py-5 rounded-2xl font-extrabold text-lg uppercase tracking-widest text-white transition-all active:scale-[0.98] bg-gradient-to-br from-red-600 to-red-500 shadow-lg shadow-red-500/20"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            <span className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stop_circle</span>
              Stop Activity
            </span>
          </button>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleSave}
              className="w-full py-5 rounded-2xl font-extrabold text-lg uppercase tracking-widest transition-all active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${act?.color}dd, ${act?.color}99)`,
                color: "#0c1321",
                boxShadow: `0 8px 32px ${act?.color}44`,
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              Save Activity
            </button>
            <button
              onClick={() => { setPhase("select"); setSelected(null); setDuration(0); setSteps(0); setDistance(0); }}
              className="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-widest text-[#64748b] hover:text-white transition-colors bg-[#121a2b] border border-white/5"
            >
              Discard & Try Again
            </button>
          </div>
        )}
      </main>
      <BottomNav active="exercise" />
    </div>
  );
};

export default ExerciseTracker;
