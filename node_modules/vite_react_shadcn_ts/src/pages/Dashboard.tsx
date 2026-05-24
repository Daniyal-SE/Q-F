import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

type PrecisionMode = "sugar" | "junk-food" | "cold-drink" | "custom" | null;

interface StreakData {
  startTime: number | null;
  elapsedTime: number;
  totalDays: number;
  precision: PrecisionMode;
  customPrecision?: string;
  plan?: "student" | "work" | "flexible";
  notificationSent: boolean;
  preNotificationSent: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [streakData, setStreakData] = useState<StreakData>(() => {
    const saved = localStorage.getItem("streakData");
    return saved
      ? JSON.parse(saved)
      : {
        startTime: null,
        elapsedTime: 0,
        totalDays: 0,
        precision: null,
        customPrecision: "",
        plan: "student",
        notificationSent: false,
        preNotificationSent: false,
      };
  });
  const [customInput, setCustomInput] = useState("");
  const [timerKey, setTimerKey] = useState(0); // Force re-render for timer updates
  const [isPrecisionExpanded, setIsPrecisionExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    if (touchEndY - touchStartY > 30) {
      setIsPrecisionExpanded(true); // Swipe down
    } else if (touchStartY - touchEndY > 30) {
      setIsPrecisionExpanded(false); // Swipe up
    }
    setTouchStartY(null);
  };

  // Calculate remaining time and daily discipline based on current time
  const getTimerValues = () => {
    if (!streakData.startTime) {
      return {
        remainingTime: "24:00:00",
        dailyDiscipline: 0,
        secondsElapsed: 0,
      };
    }

    const now = Date.now();
    const elapsed = now - streakData.startTime;
    const totalDuration = 24 * 60 * 60 * 1000; // 24 hours

    if (elapsed >= totalDuration) {
      return {
        remainingTime: "00:00:00",
        dailyDiscipline: 100,
        secondsElapsed: 60,
      };
    }

    const remaining = totalDuration - elapsed;
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    const percentage = (elapsed / totalDuration) * 100;
    const secondsInCycle = Math.floor((elapsed % 60000) / 1000); // 0-60 seconds for outer ring

    return {
      remainingTime: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      dailyDiscipline: Math.min(Math.round(percentage), 100),
      secondsElapsed: secondsInCycle,
    };
  };

  const { remainingTime, dailyDiscipline } = getTimerValues();

  // Save to localStorage whenever streakData changes
  useEffect(() => {
    localStorage.setItem("streakData", JSON.stringify(streakData));
  }, [streakData]);

  // Timer tick effect - just for triggering re-renders
  useEffect(() => {
    if (!streakData.startTime) return;

    const interval = setInterval(() => {
      setTimerKey((prev) => prev + 1); // Trigger re-render
    }, 1000);

    return () => clearInterval(interval);
  }, [streakData.startTime]);

  // Handle timer completion and notifications
  useEffect(() => {
    if (!streakData.startTime) return;

    const now = Date.now();
    const elapsed = now - streakData.startTime;
    const totalDuration = 24 * 60 * 60 * 1000;

    // Timer completed
    if (elapsed >= totalDuration) {
      if (!streakData.notificationSent) {
        showNotification(
          "24-Hour Challenge Complete! 🎉",
          "You've completed a full day of discipline!",
        );
      }

      // Save completed session to history
      const currentDate = new Date();
      const dateStr = currentDate.toISOString().split("T")[0];
      const savedRecords = localStorage.getItem("dailyRecords");
      const records = savedRecords ? JSON.parse(savedRecords) : [];

      const existingIndex = records.findIndex((r: { date: string }) => r.date === dateStr);
      if (existingIndex >= 0) {
        records[existingIndex].completed = true;
        records[existingIndex].duration = 24;
      } else {
        records.push({
          date: dateStr,
          completed: true,
          precision: streakData.precision,
          duration: 24,
        });
      }
      localStorage.setItem("dailyRecords", JSON.stringify(records));

      const daysPassed = Math.floor(elapsed / totalDuration);
      const newStartTime = streakData.startTime + (daysPassed * totalDuration);

      setStreakData((prev) => ({
        ...prev,
        totalDays: prev.totalDays + daysPassed,
        startTime: newStartTime,
        notificationSent: false,
        preNotificationSent: false,
      }));
    }
    // Pre-completion notification (after 20 hours)
    else if (
      !streakData.preNotificationSent &&
      elapsed >= 20 * 60 * 60 * 1000
    ) {
      showNotification(
        "Almost There! 💪",
        "You're 2-3 hours away from completing your 24-hour streak!",
      );
      setStreakData((prev) => ({
        ...prev,
        preNotificationSent: true,
      }));
    }
  }, [
    streakData.startTime,
    streakData.notificationSent,
    streakData.preNotificationSent,
    streakData.precision,
    timerKey,
  ]);

  const showNotification = (title: string, message: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%236366f1'/></svg>",
      });
    }
  };

  const handleStartStreak = (precision: PrecisionMode, custom?: string) => {
    if (!streakData.startTime) {
      setStreakData((prev) => ({
        ...prev,
        startTime: Date.now(),
        precision,
        customPrecision: custom || "",
        notificationSent: false,
        preNotificationSent: false,
      }));
      setShowModal(false);
      setCustomInput("");
    }
  };

  const handleCustomSubmit = () => {
    if (customInput.trim()) {
      handleStartStreak("custom", customInput);
    }
  };

  const getStreakEmoji = () => {
    if (dailyDiscipline >= 15) {
      if (dailyDiscipline >= 100) return "🏆";
      if (dailyDiscipline >= 75) return "🔥";
      if (dailyDiscipline >= 50) return "⚡";
      return "💪";
    }
    return "";
  };

  const getPrecisionLabel = () => {
    switch (streakData.precision) {
      case "sugar":
        return "Quit Sugar";
      case "junk-food":
        return "Avoid Junk Food";
      case "cold-drink":
        return "Cold Drink";
      case "custom":
        return streakData.customPrecision;
      default:
        return "Select Option";
    }
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

      <main className="px-4 sm:px-6 pt-4 sm:pt-8 max-w-2xl mx-auto space-y-5 sm:space-y-8">
        {/* Greeting */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-black tracking-tight text-kinetic-on-surface">
              STAY STRONG
            </h2>
            <span className="text-kinetic-primary text-sm sm:text-base font-bold tracking-wider">
              DAY {Math.max(1, streakData.startTime ? streakData.totalDays + 1 : streakData.totalDays)}
            </span>
          </div>
          <div
            className="bg-kinetic-surface-container-low p-4 sm:p-6 rounded-xl hover:bg-kinetic-surface-container transition-colors relative"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-kinetic-on-surface-variant text-xs sm:text-sm font-medium uppercase tracking-widest mb-1">
                  Precision Focus
                </p>
                <p className="text-lg sm:text-2xl md:text-3xl font-black text-kinetic-on-surface">
                  {getPrecisionLabel()}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-kinetic-primary/10 rounded-full">
                <span className="material-symbols-outlined text-kinetic-primary text-2xl sm:text-3xl">
                  {streakData.precision === "sugar"
                    ? "water_drop"
                    : streakData.precision === "junk-food"
                      ? "no_food"
                      : streakData.precision === "cold-drink"
                        ? "local_drink"
                        : "edit"}
                </span>
              </div>
            </div>

            {/* Expanded Plan Options via swipe */}
            {isPrecisionExpanded && streakData.startTime && (
              <div className="mt-6 pt-4 border-t border-kinetic-outline-variant/30 animate-in slide-in-from-top-2">
                <p className="text-kinetic-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-3">Choose Your Plan Mode</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {([
                    { id: "student", label: "Student", sub: "Balanced routine goals" },
                    { id: "work", label: "Work", sub: "Time-efficient focus" },
                    { id: "flexible", label: "Freelancer", sub: "Higher intensity push" }
                  ] as const).map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setStreakData((s: StreakData) => ({ ...s, plan: plan.id }))}
                      className={`text-left p-3 rounded-lg border-2 transition-all ${streakData.plan === plan.id
                        ? "bg-kinetic-primary/10 border-kinetic-primary"
                        : "bg-transparent border-kinetic-outline-variant/30 hover:border-kinetic-primary/50"
                        }`}
                    >
                      <p className={`font-bold text-sm ${streakData.plan === plan.id ? "text-kinetic-primary" : "text-kinetic-on-surface"}`}>
                        {plan.label}
                      </p>
                      <p className="text-kinetic-on-surface-variant text-[10px] mt-1">{plan.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timer / Start Button */}
        <div className="relative bg-kinetic-surface-container rounded-xl p-4 sm:p-8 overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-kinetic-primary/5 blur-[80px] rounded-full" />

          {streakData.startTime ? (
            // Timer Active - Business Triple-Ring Countdown
            <div className="flex flex-col items-center relative z-10">
              {/* Business Card Container */}
              <div
                className="flex justify-center"
                style={{
                  backgroundColor: "transparent",
                }}
              >
                {/* Triple Ring Canvas */}
                <div className="flex justify-center w-full">
                  <svg
                    className="w-full max-w-[200px] sm:max-w-[248px] h-auto"
                    viewBox="0 0 248 248"
                    style={{ display: "block" }}
                  >
                    {/* Calculate angle for each ring based on progress */}
                    {(() => {
                      const now = Date.now();
                      const elapsed = now - (streakData.startTime || 0);
                      const totalMs = 24 * 60 * 60 * 1000;

                      // Overall 24h progress: outer ring (Blue) smoothly filled
                      const hoursElapsedRaw = Math.min(elapsed / (60 * 60 * 1000), 24);
                      const hoursAngle = (hoursElapsedRaw / 24) * 360;

                      // Hours remaining for display (24:00 down to 00:00)
                      const remainingMs = Math.max(0, totalMs - elapsed);
                      const hoursRemaining = Math.floor(remainingMs / (60 * 60 * 1000));
                      const minutesRemaining = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));

                      // Minute sweep: middle ring (Green) fills 0-60 mins
                      const minutesElapsedRaw = (elapsed % (60 * 60 * 1000)) / (60 * 1000);
                      const minutesAngle = (minutesElapsedRaw / 60) * 360;

                      // Seconds sweep: inner ring (Gray) fills 0-60 secs smoothly
                      const secondsElapsedRaw = (elapsed % 60000) / 1000;
                      const secondsAngle = (secondsElapsedRaw / 60) * 360;

                      const CENTER = 124;
                      const RADIUS_OUTER = 110;
                      const RADIUS_MID = 90;
                      const RADIUS_INNER = 70;
                      const STROKE = 11;

                      // Helper function to calculate arc path perimeter only
                      const arcPath = (radius: number, angle: number) => {
                        if (angle <= 0.001) return "";
                        if (angle >= 359.99) {
                          return `M ${CENTER} ${CENTER - radius} A ${radius} ${radius} 0 1 1 ${CENTER} ${CENTER + radius} A ${radius} ${radius} 0 1 1 ${CENTER} ${CENTER - radius}`;
                        }

                        const radians = (angle * Math.PI) / 180;
                        const x =
                          CENTER + radius * Math.cos(radians - Math.PI / 2);
                        const y =
                          CENTER + radius * Math.sin(radians - Math.PI / 2);
                        const largeArc = angle > 180 ? 1 : 0;
                        return `M ${CENTER} ${CENTER - radius} A ${radius} ${radius} 0 ${largeArc} 1 ${x} ${y}`;
                      };

                      // Helper function to calculate dot position
                      const dotPosition = (radius: number, angle: number) => {
                        const radians = (angle * Math.PI) / 180;
                        return {
                          x: CENTER + radius * Math.cos(radians - Math.PI / 2),
                          y: CENTER + radius * Math.sin(radians - Math.PI / 2),
                        };
                      };

                      return (
                        <>
                          {/* OUTER RING - Blue (Hours) */}
                          {/* Background track */}
                          <circle
                            cx={CENTER}
                            cy={CENTER}
                            r={RADIUS_OUTER}
                            fill="none"
                            stroke="#0F172A"
                            strokeWidth={STROKE}
                            strokeLinecap="round"
                          />
                          {/* Arc */}
                          <path
                            d={arcPath(RADIUS_OUTER, hoursAngle)}
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth={STROKE}
                            strokeLinecap="round"
                          />
                          {/* Endpoint dot */}
                          {hoursAngle > 0 &&
                            (() => {
                              const pos = dotPosition(RADIUS_OUTER, hoursAngle);
                              return (
                                <>
                                  <circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r="4.5"
                                    fill="#3B82F6"
                                  />
                                  <circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r="2.5"
                                    fill="#1E293B"
                                  />
                                </>
                              );
                            })()}

                          {/* MIDDLE RING - Green (Tasks) */}
                          {/* Background track */}
                          <circle
                            cx={CENTER}
                            cy={CENTER}
                            r={RADIUS_MID}
                            fill="none"
                            stroke="#0F172A"
                            strokeWidth={STROKE}
                            strokeLinecap="round"
                          />
                          {/* Arc */}
                          <path
                            d={arcPath(RADIUS_MID, minutesAngle)}
                            fill="none"
                            stroke="#22C55E"
                            strokeWidth={STROKE}
                            strokeLinecap="round"
                          />
                          {/* Endpoint dot */}
                          {minutesAngle > 0 &&
                            (() => {
                              const pos = dotPosition(
                                RADIUS_MID,
                                minutesAngle,
                              );
                              return (
                                <>
                                  <circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r="4.5"
                                    fill="#22C55E"
                                  />
                                  <circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r="2.5"
                                    fill="#1E293B"
                                  />
                                </>
                              );
                            })()}

                          {/* INNER RING - Gray (Seconds) */}
                          {/* Background track */}
                          <circle
                            cx={CENTER}
                            cy={CENTER}
                            r={RADIUS_INNER}
                            fill="none"
                            stroke="#0F172A"
                            strokeWidth={STROKE}
                            strokeLinecap="round"
                          />
                          {/* Arc */}
                          <path
                            d={arcPath(RADIUS_INNER, secondsAngle)}
                            fill="none"
                            stroke="#334155"
                            strokeWidth={STROKE}
                            strokeLinecap="round"
                          />
                          {/* Endpoint dot */}
                          {secondsAngle > 0 &&
                            (() => {
                              const pos = dotPosition(
                                RADIUS_INNER,
                                secondsAngle,
                              );
                              return (
                                <>
                                  <circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r="4.5"
                                    fill="#334155"
                                  />
                                  <circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r="2.5"
                                    fill="#1E293B"
                                  />
                                </>
                              );
                            })()}

                          {/* CENTER TEXT */}
                          <text
                            x={CENTER}
                            y={CENTER - 8}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="32"
                            fontWeight="700"
                            fill="#F1F5F9"
                            fontFamily="Inter, sans-serif"
                            style={{ fontVariantNumeric: "tabular-nums" } as React.CSSProperties}
                          >
                            {String(hoursRemaining).padStart(2, "0")}:
                            {String(minutesRemaining).padStart(2, "0")}
                          </text>

                          {/* UNIT LABEL */}
                          <text
                            x={CENTER}
                            y={CENTER + 22.5}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="10"
                            fill="#475569"
                            fontFamily="Inter, sans-serif"
                            letterSpacing="0.12em"
                            style={{ textTransform: "uppercase" } as React.CSSProperties}
                          >
                            hrs remaining
                          </text>
                        </>
                      );
                    })()}
                  </svg>
                </div>

                {/* Spacer */}
              </div>
            </div>
          ) : (
            // Start Button
            <div className="flex flex-col items-center justify-center space-y-5 sm:space-y-8 relative z-10 py-4 sm:py-8">
              <div className="text-center space-y-2 sm:space-y-4">
                <p className="text-kinetic-on-surface-variant text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                  Ready for Your Challenge?
                </p>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-kinetic-on-surface leading-tight">
                  Start Your 24-Hour Streak
                </h3>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="px-6 sm:px-10 md:px-12 py-3 sm:py-5 md:py-6 bg-gradient-to-br from-[#4ADE80] to-[#16A34A] text-[#0B1220] font-black text-base sm:text-xl md:text-2xl rounded-full shadow-2xl shadow-[#4ADE80]/30 transition-transform active:scale-95 hover:shadow-3xl hover:shadow-[#4ADE80]/50 border border-[#4ADE80]/30"
              >
                START
              </button>

              <p className="text-kinetic-on-surface-variant text-sm text-center max-w-sm">
                Choose your precision focus and commit to 24 hours of discipline
              </p>
            </div>
          )}
        </div>

        {/* Daily Mission Section & Content from EM */}
        {streakData.startTime && (
          <>
            {/* Adaptive Mode Removed, Integrated Above */}

            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[#F1F5F9]">
                  Today's Mission
                </h3>
                <p className="text-[#94A3B8] text-[11px] font-bold uppercase tracking-[0.1em]">
                  Complete within 24 hours
                </p>
              </div>
              {/* Calorie Balance Card */}
              <div className="bg-[#121A2B] p-4 sm:p-6 rounded-xl border border-white/5 space-y-4 sm:space-y-5">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#60A5FA]"></div>
                      <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider">
                        Burned: <span className="text-[#F1F5F9]">320 kcal</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FB7185]"></div>
                      <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider">
                        Consumed: <span className="text-[#F1F5F9]">210 kcal</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">
                      Net Balance
                    </p>
                    <p className="text-2xl font-extrabold text-[#4ADE80] tracking-tight">
                      +110 <span className="text-xs uppercase">kcal</span>
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                    <span>Calorie Goal</span>
                    <span className="text-[#4ADE80]">85% Achieved</span>
                  </div>
                  <div className="relative w-full h-2 bg-[#1E293B] rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-[#4ADE80] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>
              </div>
              {/* Mission Tasks Card */}
              <div className="bg-[#121A2B] rounded-xl border border-white/5 divide-y divide-white/5">
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-[#4ADE80]/10 rounded-lg text-[#4ADE80]">
                      <span className="material-symbols-outlined text-xl">
                        restaurant
                      </span>
                    </div>
                    <div>
                      <p className="text-[#F1F5F9] font-extrabold text-sm tracking-wide uppercase">
                        Nutrition
                      </p>
                      <p className="text-[#94A3B8] text-[11px] font-medium">
                        Avoid sugar / junk food
                      </p>
                    </div>
                  </div>
                  <span
                    className="material-symbols-outlined text-[#4ADE80] text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-[#60A5FA]/10 rounded-lg text-[#60A5FA]">
                        <span className="material-symbols-outlined text-xl">
                          directions_walk
                        </span>
                      </div>
                      <div>
                        <p className="text-[#F1F5F9] font-extrabold text-sm tracking-wide uppercase">
                          Activity
                        </p>
                        <p className="text-[#94A3B8] text-[11px] font-medium">
                          Walk 5000 steps
                        </p>
                      </div>
                    </div>
                    <p className="text-[#60A5FA] font-extrabold text-sm">60%</p>
                  </div>
                  <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#60A5FA] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-[#1E293B] rounded-lg text-[#94A3B8]">
                      <span className="material-symbols-outlined text-xl">
                        self_improvement
                      </span>
                    </div>
                    <div>
                      <p className="text-[#F1F5F9] font-extrabold text-sm tracking-wide uppercase">
                        Discipline
                      </p>
                      <p className="text-[#94A3B8] text-[11px] font-medium">
                        Resist cravings
                      </p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-[#1E293B]"></div>
                </div>
              </div>

            </div>

            {/* Progress Bar Section */}
            <div className="bg-[#121A2B] p-4 sm:p-6 rounded-xl space-y-4 sm:space-y-5 border border-white/5">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h3 className="text-[#F1F5F9] font-bold text-lg leading-none">
                    Daily Discipline
                  </h3>
                  <p className="text-[#94A3B8] text-xs font-medium">
                    Target: 24h Clean Fast
                  </p>
                </div>
                <p className="text-[#4ADE80] font-extrabold text-2xl">{dailyDiscipline}%</p>
              </div>
              <div className="relative w-full h-2.5 bg-[#1E293B] rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#4ADE80]/80 to-[#4ADE80] rounded-full shadow-[0_0_10px_rgba(74,222,128,0.4)] transition-all duration-300"
                  style={{ width: `${dailyDiscipline}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-[#94A3B8] tracking-widest uppercase opacity-70">
                <span>00:00</span>
                <span className="text-[#F1F5F9]">In Progress</span>
                <span>24:00</span>
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => navigate("/craving-active")}
                className="group flex items-center justify-between p-4 sm:p-5 bg-[#121A2B] border border-white/5 rounded-xl hover:border-[#4ADE80]/30 transition-all active:scale-[0.98] duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#38BDF8]/10 rounded-lg text-[#38BDF8]">
                    <span className="material-symbols-outlined text-2xl">
                      psychiatry
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-[#F1F5F9] font-extrabold text-base tracking-wide uppercase">
                      I Feel Craving
                    </p>
                    <p className="text-[#94A3B8] text-[11px] font-medium">
                      Activate breathing protocols
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#94A3B8] group-hover:text-[#4ADE80] transition-colors">
                  chevron_right
                </span>
              </button>
              <button
                onClick={() => navigate("/food-analysis")}
                className="group flex items-center justify-between p-4 sm:p-5 bg-[#121A2B] border border-white/5 rounded-xl hover:border-[#FB7185]/30 transition-all active:scale-[0.98] duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#FB7185]/10 rounded-lg text-[#FB7185]">
                    <span className="material-symbols-outlined text-2xl">
                      warning
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-[#F1F5F9] font-extrabold text-base tracking-wide uppercase">
                      I Ate Junk
                    </p>
                    <p className="text-[#94A3B8] text-[11px] font-medium">
                      Log lapse and reset strategy
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#94A3B8] group-hover:text-[#FB7185] transition-colors">
                  history_edu
                </span>
              </button>
            </div>
          </>
        )}
      </main>

      {/* Modal for Starting Streak */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-kinetic-surface w-full rounded-t-3xl p-6 sm:p-8 space-y-6 animate-in slide-in-from-bottom-5 max-h-[90vh] overflow-y-auto">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-kinetic-on-surface">
                Choose Your Precision Focus
              </h3>
              <p className="text-sm sm:text-base text-kinetic-on-surface-variant">
                Select what you want to avoid for the next 24 hours
              </p>
            </div>

            {/* Precision Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                {
                  label: "Quit Sugar",
                  icon: "water_drop",
                  value: "sugar" as const,
                },
                {
                  label: "Avoid Junk Food",
                  icon: "no_food",
                  value: "junk-food" as const,
                },
                {
                  label: "Cold Drink",
                  icon: "local_drink",
                  value: "cold-drink" as const,
                },
              ].map(({ label, icon, value }) => (
                <button
                  key={value}
                  onClick={() => handleStartStreak(value)}
                  className="flex flex-col items-center justify-center gap-2 p-5 sm:p-6 rounded-lg bg-kinetic-surface-container-low hover:bg-kinetic-surface-container transition border-2 border-kinetic-outline/20 hover:border-kinetic-primary/50 active:scale-95"
                >
                  <span className="material-symbols-outlined text-kinetic-primary text-2xl sm:text-3xl">
                    {icon}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-center text-kinetic-on-surface-variant">
                    {label}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Option */}
            <div className="space-y-3 border-t border-kinetic-outline/20 pt-4">
              <p className="text-xs sm:text-sm font-bold text-kinetic-on-surface-variant uppercase tracking-widest">
                Or set a custom goal
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="E.g., Fast food, Desserts..."
                  className="flex-1 px-4 py-3 text-sm bg-kinetic-surface-container rounded-lg text-kinetic-on-surface placeholder-kinetic-on-surface-variant/50 border border-kinetic-outline/20 focus:outline-none focus:border-kinetic-primary"
                />
                <button
                  onClick={handleCustomSubmit}
                  className="px-6 py-3 bg-kinetic-primary text-kinetic-on-primary font-bold text-sm rounded-lg hover:bg-kinetic-primary-container transition active:scale-95"
                >
                  OK
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                setShowModal(false);
                setCustomInput("");
              }}
              className="w-full py-4 text-kinetic-on-surface-variant font-bold text-sm rounded-lg hover:bg-kinetic-surface-container transition"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Dashboard;
