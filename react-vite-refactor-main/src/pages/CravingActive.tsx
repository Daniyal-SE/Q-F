import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "@/components/TopAppBar";
import walkGif from "../gifs/walk-transparent.gif";
import walkStatic from "../gifs/walk-static.png";

interface CravingReason {
  id: string;
  label: string;
  selected: boolean;
}

const CravingActive = () => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [cravingReasons, setCravingReasons] = useState<CravingReason[]>([
    { id: "stress", label: "Stress", selected: false },
    { id: "boredom", label: "Boredom", selected: false },
    { id: "habit", label: "Habit", selected: false },
    { id: "social", label: "Social", selected: false },
  ]);

  const distractionActions = [
    { id: "water", icon: "water_drop", label: "Drink Water", animClass: "hover-anim-water" },
    { id: "walk", icon: "directions_walk", label: "Take a Walk", animClass: "hover-anim-walk" },
    { id: "breathing", icon: "air", label: "Breathing Exercise", animClass: "hover-anim-breathing" },
    { id: "snack", icon: "restaurant", label: "Healthy Snack", animClass: "hover-anim-snack" },
  ];

  // Start countdown only after selecting an action
  useEffect(() => {
    if (timeRemaining <= 0 || !selectedAction) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, selectedAction]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const toggleReason = (id: string) => {
    setCravingReasons((prev) =>
      prev.map((reason) =>
        reason.id === id ? { ...reason, selected: !reason.selected } : reason,
      ),
    );
  };

  const handleOvercameIt = () => {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];

    const savedRecords = localStorage.getItem("dailyRecords");
    const records = savedRecords ? JSON.parse(savedRecords) : [];

    records.push({
      date: dateStr,
      completed: true,
      precision: "craving-resistance",
      duration: 300,
      reason: cravingReasons.find((r) => r.selected)?.label || "unknown",
      action: selectedAction,
    });

    localStorage.setItem("dailyRecords", JSON.stringify(records));
    navigate("/craving-defeat");
  };

  const handleAteJunk = () => {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];

    const savedRecords = localStorage.getItem("dailyRecords");
    const records = savedRecords ? JSON.parse(savedRecords) : [];

    records.push({
      date: dateStr,
      completed: false,
      precision: "craving-failure",
      duration: 0,
      reason: cravingReasons.find((r) => r.selected)?.label || "unknown",
    });

    localStorage.setItem("dailyRecords", JSON.stringify(records));
    navigate("/food-analysis");
  };

  const progress = ((300 - timeRemaining) / 300) * 100;
  const circumference = 2 * Math.PI * 112;

  return (
    <div className="bg-kinetic-surface text-kinetic-on-surface min-h-screen flex flex-col pb-24 sm:pb-32">
      <style>{`
        .group:hover .hover-anim-water { animation: drop 1.5s ease-in-out infinite; }
        @keyframes drop {
          0% { transform: scale(1.1) translateY(-8px); opacity: 0; }
          30% { transform: scale(1.1) translateY(0); opacity: 1; }
          70% { transform: scale(1.1) translateY(0); opacity: 1; }
          100% { transform: scale(1.1) translateY(8px); opacity: 0; }
        }

        .group:hover .hover-anim-walk { animation: walk 0.8s linear infinite; }
        @keyframes walk {
          0%, 100% { transform: scale(1.1) translateY(0) rotate(0deg); }
          25% { transform: scale(1.1) translateY(-2px) rotate(-15deg); }
          50% { transform: scale(1.1) translateY(0) rotate(0deg); }
          75% { transform: scale(1.1) translateY(-2px) rotate(15deg); }
        }

        .group:hover .hover-anim-breathing { animation: breathe-icon 2s ease-in-out infinite; }
        @keyframes breathe-icon {
          0%, 100% { transform: scale(1.1); opacity: 0.7; }
          50% { transform: scale(1.3); opacity: 1; }
        }

        .group:hover .hover-anim-snack { animation: snack-chomp 1.2s ease-in-out infinite; }
        @keyframes snack-chomp {
          0% { transform: scale(1.1) rotate(0deg); }
          15% { transform: scale(1.2) rotate(-10deg); }
          30% { transform: scale(1.2) rotate(10deg); }
          45% { transform: scale(1.2) rotate(-10deg); }
          60%, 100% { transform: scale(1.1) rotate(0deg); }
        }
      `}</style>
      <TopAppBar showBack showAvatar />

      <main className="flex-1 pt-4 sm:pt-8 pb-24 sm:pb-32 px-4 sm:px-6 max-w-2xl mx-auto flex flex-col gap-5 sm:gap-8 overflow-y-auto">
        {/* Header */}
        <section className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-4xl font-headline font-black tracking-tight text-kinetic-on-surface">
              Craving Detected
            </h2>
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-kinetic-primary opacity-20 animate-pulse"></span>
              <span
                className="material-symbols-outlined text-kinetic-primary text-2xl sm:text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                pulse_alert
              </span>
            </div>
          </div>
          <p className="text-kinetic-on-surface-variant font-medium tracking-wide">
            Hold on. The urge will pass.
          </p>
        </section>

        {/* Timer Display */}
        <section className="flex flex-col items-center justify-center py-2">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 256 256"
            >
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4BE677" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              {/* Dark background circle */}
              <circle
                cx="128" cy="128" r="118"
                fill="#0F172A"
              />
              {/* Background track */}
              <circle
                cx="128" cy="128" r="112"
                fill="none"
                stroke="#1E293B"
                strokeWidth="10"
              />
              {/* Gradient progress arc */}
              <circle
                cx="128" cy="128" r="112"
                fill="none"
                stroke="url(#timerGradient)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (progress / 100)}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>

            {/* Text inside circle */}
            <div className="flex flex-col items-center text-center z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2 text-center max-w-[120px]">
                {selectedAction ? "URGE WILL PASS IN" : "SELECT ACTION TO START"}
              </span>
              <span
                className="text-3xl sm:text-5xl font-black"
                style={{
                  fontVariantNumeric: "tabular-nums",
                  fontFamily: "Inter, sans-serif",
                  background: "linear-gradient(135deg, #4BE677 0%, #3B82F6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {formatTime(timeRemaining)}
              </span>
              {timeRemaining === 0 && (
                <span className="text-xs font-bold text-kinetic-primary mt-2 uppercase tracking-widest">
                  Done! 🎉
                </span>
              )}
            </div>
          </div>
        </section>



        {/* Choose Distraction Action */}
        <section className="space-y-4">
          <h3 className="text-kinetic-on-surface font-black uppercase tracking-widest text-sm">
            What Will You Do Instead?
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {distractionActions.map((action) => (
              <button
                key={action.id}
                onClick={() => setSelectedAction(action.id)}
                className={`group flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-xl transition-all active:scale-95 ${selectedAction === action.id
                  ? "bg-kinetic-primary text-kinetic-on-primary shadow-lg shadow-kinetic-primary/30"
                  : "bg-kinetic-surface-container-low hover:bg-kinetic-surface-container border-2 border-transparent hover:border-kinetic-primary/30 text-kinetic-on-surface"
                  }`}
              >
                {action.id === "walk" ? (
                  <div className={`relative w-8 h-8 transition-transform group-hover:scale-110 ${action.animClass}`}>
                    <div
                      className="absolute inset-0 bg-current transition-opacity duration-200 opacity-100 group-hover:opacity-0"
                      style={{
                        WebkitMaskImage: `url(${walkStatic})`,
                        WebkitMaskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskImage: `url(${walkStatic})`,
                        maskSize: "contain",
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                      }}
                    />
                    <div
                      className="absolute inset-0 bg-current transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                      style={{
                        WebkitMaskImage: `url(${walkGif})`,
                        WebkitMaskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskImage: `url(${walkGif})`,
                        maskSize: "contain",
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                      }}
                    />
                  </div>
                ) : (
                  <span
                    className={`material-symbols-outlined text-3xl transition-transform group-hover:scale-110 ${action.animClass}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {action.icon}
                  </span>
                )}
                <span className="text-sm font-semibold text-center">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* What Triggered This? */}
        <section className="flex flex-col gap-3 sm:gap-4 bg-kinetic-surface-container-lowest/50 p-4 sm:p-6 rounded-2xl">
          <h3 className="text-center font-bold text-kinetic-on-surface-variant uppercase tracking-widest text-xs">
            What Triggered This?
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {cravingReasons.map((reason) => (
              <button
                key={reason.id}
                onClick={() => toggleReason(reason.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${reason.selected
                  ? "bg-kinetic-primary text-kinetic-on-primary border border-kinetic-primary"
                  : "bg-kinetic-surface-container-high border border-kinetic-outline-variant/20 hover:border-kinetic-primary/50 text-kinetic-on-surface"
                  }`}
              >
                {reason.label}
              </button>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <button
          onClick={handleOvercameIt}
          className="w-full py-4 sm:py-5 rounded-xl bg-gradient-to-r from-kinetic-primary to-kinetic-primary-container text-kinetic-on-primary font-headline font-bold text-base sm:text-lg uppercase tracking-wider shadow-[0_12px_24px_-8px_rgba(var(--kinetic-primary)/0.4)] active:scale-[0.98] transition-all"
        >
          I OVERCAME IT
        </button>

        <button
          onClick={handleAteJunk}
          className="w-full py-4 rounded-xl border-2 border-secondary/40 text-secondary font-headline font-bold text-sm uppercase tracking-widest hover:bg-secondary/10 active:scale-[0.98] transition-all"
        >
          I ATE JUNK
        </button>
      </main>
    </div>
  );
};

export default CravingActive;
