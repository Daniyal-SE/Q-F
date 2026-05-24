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
  const [motivators] = useState<{ id: string; text: string; emoji: string }[]>(() => {
    const saved = localStorage.getItem("motivators");
    return saved ? JSON.parse(saved) : [
      { id: "1", text: "My Family", emoji: "👨‍👩‍👧" },
      { id: "2", text: "Feel Energetic", emoji: "⚡" },
      { id: "3", text: "Save Money", emoji: "💰" },
    ];
  });

  const [totalIntake, setTotalIntake] = useState(0);
  const [totalBurned, setTotalBurned] = useState(0);

  // Load today's stats on mount / timer tick
  useEffect(() => {
    const rawFood = localStorage.getItem("foodEntries");
    const allFood = rawFood ? JSON.parse(rawFood) : [];
    const todayStr = new Date().toISOString().split("T")[0];
    const todayFood = allFood.filter((e: any) =>
      e.date ? e.date.startsWith(todayStr) : true
    );
    const sumIntake = todayFood.reduce((s: number, e: any) => s + (e.calories || 0), 0);
    setTotalIntake(sumIntake);

    const rawEx = localStorage.getItem("exerciseEntries");
    const allEx = rawEx ? JSON.parse(rawEx) : [];
    const todayEx = allEx.filter((e: any) =>
      e.date ? e.date.startsWith(todayStr) : true
    );
    const sumBurned = todayEx.reduce((s: number, e: any) => s + (e.calories || 0), 0);
    setTotalBurned(sumBurned);
  }, [timerKey]);

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

  // Redirect to auth options page if not authenticated
  useEffect(() => {
    const auth = localStorage.getItem("userAuth");
    if (!auth) {
      navigate("/auth");
    }
  }, [navigate]);

  // Calculate remaining time and daily discipline based on current time
  const getTimerValues = () => {
    if (!streakData.startTime) {
      return {
        remainingTime: "24:00:00",
        dailyDiscipline: 0,
        secondsElapsed: 0,
        daysPassed: 0,
      };
    }

    const now = Date.now();
    const elapsed = now - streakData.startTime;
    const totalDuration = 24 * 60 * 60 * 1000; // 24 hours

    const daysPassed = Math.floor(elapsed / totalDuration);
    const currentDayElapsed = elapsed % totalDuration;
    const remaining = totalDuration - currentDayElapsed;

    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    const percentage = (currentDayElapsed / totalDuration) * 100;
    const secondsInCycle = Math.floor((currentDayElapsed % 60000) / 1000);

    return {
      remainingTime: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      dailyDiscipline: Math.min(Math.round(percentage), 100),
      secondsElapsed: secondsInCycle,
      daysPassed,
    };
  };

  const { remainingTime, dailyDiscipline, daysPassed } = getTimerValues();
  const netBalance = totalIntake - totalBurned;
  const intakePercentage = Math.min(Math.round((totalIntake / 2000) * 100), 100);

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

  // Handle streak calculations, records writing, and updating totalDays without shifting startTime
  useEffect(() => {
    if (!streakData.startTime) return;

    const now = Date.now();
    const elapsed = now - streakData.startTime;
    const totalDuration = 24 * 60 * 60 * 1000;
    const daysPassedComputed = Math.floor(elapsed / totalDuration);

    // Save completed sessions to history
    if (daysPassedComputed > 0) {
      const savedRecords = localStorage.getItem("dailyRecords");
      const records = savedRecords ? JSON.parse(savedRecords) : [];
      let updated = false;

      for (let i = 0; i < daysPassedComputed; i++) {
        // Calculate the actual calendar date for each completed day of the streak
        const dayTime = streakData.startTime + (i * totalDuration);
        const dateStr = new Date(dayTime).toISOString().split("T")[0];
        const exists = records.some((r: any) => r.date === dateStr);
        if (!exists) {
          records.push({
            date: dateStr,
            completed: true,
            precision: streakData.precision || "custom",
            duration: 24,
          });
          updated = true;
        }
      }

      if (updated) {
        localStorage.setItem("dailyRecords", JSON.stringify(records));
      }
    }

    if (daysPassedComputed !== streakData.totalDays) {
      setStreakData((prev) => ({
        ...prev,
        totalDays: daysPassedComputed,
      }));
    }
  }, [streakData.startTime, streakData.totalDays, streakData.precision]);

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
        {/* 7-Day Liquid Circular Tracker — replaces STAY STRONG */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black tracking-[0.25em] text-[#94a3b8] uppercase">Weekly Discipline</h2>
            <span className="text-[#4ade80] text-[10px] font-black uppercase tracking-widest">
              Day {Math.max(1, streakData.startTime ? streakData.totalDays + 1 : streakData.totalDays)} Active
            </span>
          </div>
          <div className="flex gap-2 sm:gap-3 justify-between">
            {Array.from({ length: 7 }, (_, i) => {
              const dayNum = i + 1;
              const isCompleted = dayNum <= streakData.totalDays;
              const isActive = dayNum === Math.max(1, streakData.startTime ? streakData.totalDays + 1 : streakData.totalDays) && !!streakData.startTime;
              const fillPct = isActive ? dailyDiscipline : isCompleted ? 100 : 0;
              const waveOffset = (Date.now() / 1000) * 30; // animated wave offset
              const circleR = 28;
              const cx = 32; const cy = 32;
              // Water level y (top=4, bottom=60): fillPct 0→100 maps bottom to top
              const waterY = cy + circleR - (fillPct / 100) * (circleR * 2);
              // Clip water to circle
              const clipId = `wave-clip-${i}`;
              return (
                <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                  <svg width="100%" viewBox="0 0 64 64" className="overflow-visible">
                    <defs>
                      <clipPath id={clipId}>
                        <circle cx={cx} cy={cy} r={circleR - 1} />
                      </clipPath>
                    </defs>
                    {/* Background circle */}
                    <circle cx={cx} cy={cy} r={circleR} fill="#1e293b" />
                    {/* Liquid water fill */}
                    {fillPct > 0 && (
                      <g clipPath={`url(#${clipId})`}>
                        <rect
                          x={0} y={waterY} width={64} height={64}
                          fill={isCompleted && !isActive ? "#22c55e" : isActive ? "#4ade80" : "#334155"}
                          opacity="0.85"
                        />
                        {/* Wave ripple on top of water */}
                        {isActive && fillPct < 100 && (
                          <path
                            d={`M0,${waterY} Q8,${waterY - 4} 16,${waterY} Q24,${waterY + 4} 32,${waterY} Q40,${waterY - 4} 48,${waterY} Q56,${waterY + 4} 64,${waterY} L64,64 L0,64 Z`}
                            fill="#4ade80"
                            opacity="0.9"
                          >
                            <animateTransform attributeName="transform" type="translate" from="-32 0" to="0 0" dur="2s" repeatCount="indefinite" />
                          </path>
                        )}
                      </g>
                    )}
                    {/* Border ring */}
                    <circle
                      cx={cx} cy={cy} r={circleR - 1}
                      fill="none"
                      stroke={isActive ? "#4ade80" : isCompleted ? "#22c55e" : "#334155"}
                      strokeWidth={isActive ? 2.5 : 1.5}
                      opacity={isActive ? 1 : 0.6}
                    />
                    {/* Day number or check */}
                    <text
                      x={cx} y={cy}
                      textAnchor="middle" dominantBaseline="central"
                      fontSize={isCompleted && !isActive ? "14" : "13"}
                      fontWeight="700"
                      fill={isCompleted ? "#fff" : isActive ? (fillPct > 50 ? "#0f2a15" : "#dce2f6") : "#475569"}
                      fontFamily="Inter, sans-serif"
                    >
                      {isCompleted && !isActive ? "✓" : dayNum}
                    </text>
                  </svg>
                  <span className={`text-[8px] font-black uppercase tracking-wider ${
                    isActive ? "text-[#4ade80]" : isCompleted ? "text-[#22c55e]" : "text-[#475569]"
                  }`}>D{dayNum}</span>
                </div>
              );
            })}
          </div>
          {/* Precision Focus card */}
          <div
            className="bg-[#121a2b] p-3 sm:p-4 rounded-xl hover:bg-[#1a2540] transition-colors relative border border-white/5"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-[10px] font-bold uppercase tracking-widest mb-0.5">Precision Focus</p>
                <p className="text-base sm:text-xl font-black text-[#dce2f6]">{getPrecisionLabel()}</p>
              </div>
              <div className="p-2 bg-[#4ade80]/10 rounded-full">
                <span className="material-symbols-outlined text-[#4ade80] text-xl">
                  {streakData.precision === "sugar" ? "water_drop" : streakData.precision === "junk-food" ? "no_food" : streakData.precision === "cold-drink" ? "local_drink" : "edit"}
                </span>
              </div>
            </div>
            {isPrecisionExpanded && streakData.startTime && (
              <div className="mt-4 pt-3 border-t border-white/5 animate-in slide-in-from-top-2">
                <p className="text-[#94a3b8] text-[10px] font-bold uppercase tracking-widest mb-2">Choose Plan Mode</p>
                <div className="grid grid-cols-3 gap-2">
                  {([{ id: "student", label: "Student", sub: "Balanced" }, { id: "work", label: "Work", sub: "Focused" }, { id: "flexible", label: "Flex", sub: "Intense" }] as const).map((plan) => (
                    <button key={plan.id} onClick={() => setStreakData((s: StreakData) => ({ ...s, plan: plan.id }))} className={`p-2 rounded-lg border-2 transition-all text-left ${ streakData.plan === plan.id ? "bg-[#4ade80]/10 border-[#4ade80]" : "bg-transparent border-white/10 hover:border-[#4ade80]/40" }`}>
                      <p className={`font-bold text-xs ${streakData.plan === plan.id ? "text-[#4ade80]" : "text-[#dce2f6]"}`}>{plan.label}</p>
                      <p className="text-[#94a3b8] text-[9px] mt-0.5">{plan.sub}</p>
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

        {/* Motivators Carousel */}
        {motivators.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black tracking-[0.25em] text-[#94a3b8] uppercase">Why You're Doing This</h3>
              <button onClick={() => navigate("/settings")} className="text-[#4ade80] text-[10px] font-bold uppercase tracking-widest hover:opacity-70 transition">Edit</button>
            </div>
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: "none" }}>
              {motivators.map((m, i) => (
                <div
                  key={m.id}
                  className="flex-shrink-0 flex flex-col items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-[#4ade80]/20 bg-[#0f1e12] min-w-[80px] hover:bg-[#162b1a] hover:border-[#4ade80]/50 transition-all duration-300"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span className="text-2xl leading-none">{m.emoji}</span>
                  <span className="text-[9px] font-bold text-[#4ade80] text-center leading-tight uppercase tracking-wide max-w-[70px] truncate">{m.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
                        Burned: <span className="text-[#F1F5F9]">{totalBurned} kcal</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FB7185]"></div>
                      <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider">
                        Consumed: <span className="text-[#F1F5F9]">{totalIntake} kcal</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">
                      Net Balance
                    </p>
                    <p className="text-2xl font-extrabold text-[#4ADE80] tracking-tight">
                      {netBalance >= 0 ? "+" : ""}{netBalance} <span className="text-xs uppercase">kcal</span>
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                    <span>Calorie Goal</span>
                    <span className="text-[#4ADE80]">{intakePercentage}% Achieved</span>
                  </div>
                  <div className="relative w-full h-2 bg-[#1E293B] rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-[#4ADE80] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${intakePercentage}%` }}
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
