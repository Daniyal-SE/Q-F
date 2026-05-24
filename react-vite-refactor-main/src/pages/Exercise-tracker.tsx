import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const ExerciseTracker: React.FC = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<"running" | "walking" | "workout" | "cycling">("running");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive]);

  const toggleTimer = () => setIsActive(!isActive);
  const stopTimer = () => {
    setIsActive(false);
    setSeconds(0);
  };
  const restartTimer = () => {
    setIsActive(true);
    setSeconds(0);
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatFullTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getCaloriesBurned = () => {
    let factor = 0.08; // walking default
    if (selectedActivity === "running") factor = 0.2;
    else if (selectedActivity === "workout") factor = 0.13;
    else if (selectedActivity === "cycling") factor = 0.11;
    return Math.round(seconds * factor);
  };

  const handleSaveActivity = () => {
    if (seconds < 5) {
      alert("Activity duration is too short to save! Try exercising a bit longer.");
      return;
    }

    const saved = localStorage.getItem("exerciseEntries");
    const entries = saved ? JSON.parse(saved) : [];
    
    const newEntry = {
      id: Date.now().toString(),
      activity: selectedActivity,
      duration: seconds,
      calories: getCaloriesBurned(),
      date: new Date().toISOString(),
    };

    entries.push(newEntry);
    localStorage.setItem("exerciseEntries", JSON.stringify(entries));

    // Also add to dailyRecords for historical tracking
    const todayStr = new Date().toISOString().split("T")[0];
    const savedRecords = localStorage.getItem("dailyRecords");
    const records = savedRecords ? JSON.parse(savedRecords) : [];
    
    records.push({
      date: todayStr,
      completed: true,
      precision: selectedActivity,
      duration: Math.round(seconds / 60), // minutes
    });
    localStorage.setItem("dailyRecords", JSON.stringify(records));

    alert(`Activity "${selectedActivity.toUpperCase()}" saved successfully! 💪`);
    navigate("/dashboard");
  };

  return (
    <div
      className="bg-[#0c1321] text-[#dce2f6] min-h-screen pb-24 sm:pb-32"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <header className="w-full top-0 z-50 sticky bg-[#0c1321] flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-4">
          <h1
            className="font-black tracking-tighter text-lg sm:text-2xl text-[#4ade80] uppercase"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            KINETIC
          </h1>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#3d4a3e] hover:opacity-80 transition-opacity cursor-pointer">
          <img
            alt="User Profile"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4i7RlbQ4l304ud1zxmMU7fqKzh9QV1LSi39NPeIyQ8_bISd9ncovJOraB9kBs3BDUmXSxDXUbd3oc0_yQsLQqKNMVyr8Vf4QrUVXEPXy8HkaD4AuOn_-QmExGXamINh6zo5pOZKf5mdDdIWs6rJiNT70EBOgBXj6ohUK0gC_8pQM5Vzq0q7H_EcaKwvRL1VV3v_2kb_J3h3u0JhcJ3jTjtpQobvH0VP45-pMoGRspcknfrc0ZxtYx3PyYw6_9S9jJLzNFOO4gBdRi"
          />
        </div>
      </header>

      <main className="px-4 sm:px-6 pt-4 max-w-2xl mx-auto space-y-5 sm:space-y-8">
        {/* Section: Title */}
        <section>
          <h2
            className="text-2xl sm:text-4xl font-extrabold tracking-tighter text-[#dce2f6]"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Start Activity
          </h2>
          <p className="text-[#bccabb] font-medium mt-1">
            Select your catalyst and begin your flow.
          </p>
        </section>

        {/* Activity Grid (Symmetric Grid) */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { id: "running" as const, icon: "directions_run", label: "Running" },
            { id: "walking" as const, icon: "directions_walk", label: "Walking" },
            { id: "workout" as const, icon: "fitness_center", label: "Workout" },
            { id: "cycling" as const, icon: "directions_bike", label: "Cycling" },
          ].map((act) => {
            const isSelected = selectedActivity === act.id;
            return (
              <button
                key={act.id}
                onClick={() => setSelectedActivity(act.id)}
                className={`p-4 sm:p-5 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-3 aspect-square active:scale-95 duration-200 ${
                  isSelected
                    ? "bg-[#4ade80]/15 border-[#4ade80] text-[#4ade80] shadow-[0_0_20px_rgba(74,222,128,0.2)]"
                    : "bg-[#151b2a] border-transparent text-[#94a3b8] hover:border-[#2e3544] hover:text-[#dce2f6]"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-3xl sm:text-4xl transition-transform ${isSelected ? "scale-110 material-filled" : "scale-100"}`}
                >
                  {act.icon}
                </span>
                <span
                  className="font-bold text-sm sm:text-base uppercase tracking-wider block"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {act.label}
                </span>
              </button>
            );
          })}
        </section>

        {/* Center: Kinetic Timer */}
        <section className="flex flex-col items-center py-4 sm:py-8">
          <div className="flex flex-col items-center justify-center">
            {/* Timer Display */}
            <div className="z-10 text-center mb-6">
              <span
                className="block text-6xl sm:text-8xl font-black tracking-tighter text-[#dce2f6]"
                style={{ fontFamily: "'Manrope', sans-serif", fontVariantNumeric: "tabular-nums" }}
              >
                {formatTime(seconds)}
              </span>
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#6bfb9a] mt-2 block">
                Current Pace
              </span>
            </div>
          </div>
          {/* Controls */}
          <div className="flex items-center gap-5 sm:gap-8 mt-2">
            <button onClick={stopTimer} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#2e3544] flex items-center justify-center text-[#dce2f6] active:scale-90 transition-all">
              <span className="material-symbols-outlined text-2xl sm:text-3xl">stop</span>
            </button>
            <button onClick={toggleTimer} className="w-18 h-18 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#6bfb9a] to-[#4ade80] shadow-[0_0_40px_rgba(74,222,128,0.3)] flex items-center justify-center text-[#003919] active:scale-95 transition-all">
              <span
                className="material-symbols-outlined text-3xl sm:text-5xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isActive ? "pause" : "play_arrow"}
              </span>
            </button>
            <button onClick={restartTimer} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#2e3544] flex items-center justify-center text-[#dce2f6] active:scale-90 transition-all">
              <span className="material-symbols-outlined text-2xl sm:text-3xl">
                refresh
              </span>
            </button>
          </div>
        </section>

        {/* Stats Result */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-[#151b2a] rounded-xl p-4 sm:p-6 text-center">
            <span className="text-[#bccabb] text-xs font-bold uppercase tracking-widest block mb-2">
              Duration
            </span>
            <span
              className="text-2xl font-bold text-[#dce2f6]"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              {formatFullTime(seconds)}
            </span>
          </div>
          <div className="bg-[#151b2a] rounded-xl p-4 sm:p-6 text-center">
            <span className="text-[#bccabb] text-xs font-bold uppercase tracking-widest block mb-2">
              Calories
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[#6bfb9a] text-xl">
                local_fire_department
              </span>
              <span
                className="text-2xl font-bold text-[#6bfb9a]"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                -{getCaloriesBurned()} kcal
              </span>
            </div>
          </div>
        </section>

        {/* Action Button */}
        <section className="pt-4">
          <button
            onClick={handleSaveActivity}
            className="w-full py-4 sm:py-5 rounded-xl bg-gradient-to-br from-[#6bfb9a] to-[#4ade80] text-[#003919] font-extrabold text-base sm:text-lg uppercase tracking-widest shadow-[0_16px_32px_rgba(74,222,128,0.15)] active:scale-[0.98] transition-all"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Save Activity
          </button>
        </section>
      </main>

      {/* BottomNavBar */}
      <BottomNav active="exercise" />
    </div>
  );
};

export default ExerciseTracker;
