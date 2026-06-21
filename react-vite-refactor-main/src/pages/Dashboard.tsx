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


  const [totalIntake, setTotalIntake] = useState(0);
  const [totalBurned, setTotalBurned] = useState(0);

  // Anchor states
  const [activeAnchorType, setActiveAnchorType] = useState<"wajah" | "sehat" | "mustaqbil">("wajah");
  const [anchorName, setAnchorName] = useState("Sara");
  const [anchorReason, setAnchorReason] = useState(
    "Woh abhi mujhse door hai — magar jis din woh wapas mile, mein wo banda hona chahta hoon jis ka khaab usne mere liye dekha tha. Har craving pe, mein iss naam ko yaad rakhunga."
  );
  const [anchorQuote, setAnchorQuote] = useState(
    "Uska intezaar, meri sabse badi wajah hai."
  );
  const [anchorSubtitle, setAnchorSubtitle] = useState(
    "Vo banda jis ke khaab ke liye tum khud ko badal rahe ho"
  );
  const [healthData, setHealthData] = useState({
    bp: "148/95",
    sugar: "186 mg/dL",
    targetWeight: "78 kg",
  });
  const [futureGoal, setFutureGoal] = useState(
    "30 din baad tum woh insaan hoge jo discipline, sehat aur apni wajah ke liye har din lara. Bas ruko aur dekhte jao."
  );
  const [reminderEnabled, setReminderEnabled] = useState(true);

  // Saved Money tracking
  const [savedMoneyTotal, setSavedMoneyTotal] = useState(0); // total Rs saved
  const [savedMoneyGoal, setSavedMoneyGoal] = useState(5000); // monthly goal
  const [dailySavingRate, setDailySavingRate] = useState(100); // Rs saved per day
  const [showSavedMoneyModal, setShowSavedMoneyModal] = useState(false);
  const [editingSavedField, setEditingSavedField] = useState<"total" | "goal" | "daily" | null>(null);
  const [savedMoneyInput, setSavedMoneyInput] = useState("");

  // Custom health vitals and future goals states
  const [customVitals, setCustomVitals] = useState<{ id: string; label: string; value: string }[]>([]);
  const [customGoals, setCustomGoals] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [showAddVitalModal, setShowAddVitalModal] = useState(false);
  const [newVitalName, setNewVitalName] = useState("");
  const [newVitalValue, setNewVitalValue] = useState("");
  const [newVitalPurpose, setNewVitalPurpose] = useState("");
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoalText, setNewGoalText] = useState("");
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  // Tab select-delete mode
  const [isTabSelectMode, setIsTabSelectMode] = useState(false);
  const [selectedTabsForDelete, setSelectedTabsForDelete] = useState<string[]>([]);

  // Tabs visibility state
  const [visibleTabs, setVisibleTabs] = useState<string[]>([]);

  // Tab labels state
  const [tabLabels, setTabLabels] = useState<{ wajah: string; sehat: string; mustaqbil: string }>(() => {
    const saved = localStorage.getItem("tabLabels");
    return saved ? JSON.parse(saved) : { wajah: "LOVE", sehat: "HEALTH", mustaqbil: "FUTURE" };
  });
  const [editingTabId, setEditingTabId] = useState<"wajah" | "sehat" | "mustaqbil" | null>(null);
  const [editingTabValue, setEditingTabValue] = useState("");

  // Edit modals state
  const [anchorEditModal, setAnchorEditModal] = useState<string | null>(null);
  const [anchorEditValue, setAnchorEditValue] = useState("");

  // Inline editing state for name
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameTemp, setEditNameTemp] = useState("");

  // Sync anchor data from localStorage on mount
  useEffect(() => {
    const anchorSaved = localStorage.getItem("anchorData");
    if (anchorSaved) {
      const data = JSON.parse(anchorSaved);
      if (data.name) setAnchorName(data.name);
      if (data.reason) setAnchorReason(data.reason);
      if (data.quote) setAnchorQuote(data.quote);
      if (data.subtitle) setAnchorSubtitle(data.subtitle);
      if (data.type) setActiveAnchorType(data.type);
      if (data.healthData) setHealthData(data.healthData);
      if (data.futureGoal) setFutureGoal(data.futureGoal);
      if (data.reminderEnabled !== undefined) setReminderEnabled(data.reminderEnabled);
    }

    const savedMoneySaved = localStorage.getItem("savedMoney");
    if (savedMoneySaved) {
      const sm = JSON.parse(savedMoneySaved);
      if (sm.total !== undefined) setSavedMoneyTotal(sm.total);
      if (sm.goal !== undefined) setSavedMoneyGoal(sm.goal);
      if (sm.daily !== undefined) setDailySavingRate(sm.daily);
    }

    const vitalsSaved = localStorage.getItem("customVitals");
    if (vitalsSaved) {
      setCustomVitals(JSON.parse(vitalsSaved));
    }

    const goalsSaved = localStorage.getItem("customGoals");
    if (goalsSaved) {
      setCustomGoals(JSON.parse(goalsSaved));
    } else {
      setCustomGoals([
        { id: "1", text: "Adopt a healthier eating routine", completed: false },
        { id: "2", text: "Save money spent on junk food", completed: false },
      ]);
    }

    const tabsSaved = localStorage.getItem("visibleTabs");
    if (tabsSaved) {
      setVisibleTabs(JSON.parse(tabsSaved));
    } else {
      setVisibleTabs(["wajah", "sehat", "mustaqbil"]);
    }
  }, []);

  // Save anchor data to localStorage on changes
  useEffect(() => {
    localStorage.setItem(
      "anchorData",
      JSON.stringify({
        name: anchorName,
        reason: anchorReason,
        quote: anchorQuote,
        subtitle: anchorSubtitle,
        type: activeAnchorType,
        healthData,
        futureGoal,
        reminderEnabled,
      })
    );
  }, [anchorName, anchorReason, anchorQuote, anchorSubtitle, activeAnchorType, healthData, futureGoal, reminderEnabled]);

  // Save saved money
  useEffect(() => {
    localStorage.setItem("savedMoney", JSON.stringify({ total: savedMoneyTotal, goal: savedMoneyGoal, daily: dailySavingRate }));
  }, [savedMoneyTotal, savedMoneyGoal, dailySavingRate]);

  // Save custom vitals
  useEffect(() => {
    localStorage.setItem("customVitals", JSON.stringify(customVitals));
  }, [customVitals]);

  // Save custom goals
  useEffect(() => {
    localStorage.setItem("customGoals", JSON.stringify(customGoals));
  }, [customGoals]);

  // Save visible tabs
  useEffect(() => {
    localStorage.setItem("visibleTabs", JSON.stringify(visibleTabs));
  }, [visibleTabs]);

  // Save tab labels
  useEffect(() => {
    localStorage.setItem("tabLabels", JSON.stringify(tabLabels));
  }, [tabLabels]);

  const openAnchorEdit = (field: string, value: string) => {
    setAnchorEditModal(field);
    setAnchorEditValue(value);
  };

  const handleToggleGoal = (id: string) => {
    setCustomGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleDeleteGoal = (id: string) => {
    setCustomGoals(prev => prev.filter(g => g.id !== id));
  };

  const handleDeleteVital = (id: string) => {
    setCustomVitals(prev => prev.filter(v => v.id !== id));
  };

  const saveAnchorEdit = () => {
    if (!anchorEditModal) return;

    if (anchorEditModal.startsWith("custom_")) {
      const id = anchorEditModal.replace("custom_", "");
      if (anchorEditValue.trim()) {
        setCustomVitals(prev => prev.map(v => v.id === id ? { ...v, value: anchorEditValue.trim() } : v));
      }
      setAnchorEditModal(null);
      setAnchorEditValue("");
      return;
    }

    switch (anchorEditModal) {
      case "name":
        if (anchorEditValue.trim()) setAnchorName(anchorEditValue.trim());
        break;
      case "subtitle":
        if (anchorEditValue.trim()) setAnchorSubtitle(anchorEditValue.trim());
        break;
      case "reason":
        if (anchorEditValue.trim()) setAnchorReason(anchorEditValue.trim());
        break;
      case "quote":
        if (anchorEditValue.trim()) setAnchorQuote(anchorEditValue.trim());
        break;
      case "futureGoal":
        if (anchorEditValue.trim()) setFutureGoal(anchorEditValue.trim());
        break;
      case "health_bp":
        if (anchorEditValue.trim()) setHealthData((p) => ({ ...p, bp: anchorEditValue.trim() }));
        break;
      case "health_sugar":
        if (anchorEditValue.trim()) setHealthData((p) => ({ ...p, sugar: anchorEditValue.trim() }));
        break;
      case "health_weight":
        if (anchorEditValue.trim()) setHealthData((p) => ({ ...p, targetWeight: anchorEditValue.trim() }));
        break;
      case "edit_goal":
        if (editingGoalId && anchorEditValue.trim()) {
          setCustomGoals(prev => prev.map(g => g.id === editingGoalId ? { ...g, text: anchorEditValue.trim() } : g));
        }
        setEditingGoalId(null);
        break;
    }
    setAnchorEditModal(null);
    setAnchorEditValue("");
  };

  const getAnchorEditLabel = () => {
    if (anchorEditModal && anchorEditModal.startsWith("custom_")) {
      const id = anchorEditModal.replace("custom_", "");
      const vitalObj = customVitals.find(v => v.id === id);
      return vitalObj ? `Edit ${vitalObj.label}` : "Edit Metric";
    }
    switch (anchorEditModal) {
      case "name": return "Edit Name";
      case "subtitle": return "Edit Subtitle";
      case "reason": return "Edit Your Love";
      case "quote": return "Edit Quote";
      case "futureGoal": return "Edit Future Goal";
      case "health_bp": return "Blood Pressure";
      case "health_sugar": return "Sugar Level";
      case "health_weight": return "Target Weight";
      case "edit_goal": return "Edit Future Goal";
      default: return "Edit";
    }
  };

  const isAnchorTextArea = ["reason", "futureGoal"].includes(anchorEditModal || "");

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

  // Redirect to auth options page if not authenticated or if guest
  useEffect(() => {
    const auth = localStorage.getItem("userAuth");
    if (!auth) {
      navigate("/auth");
    } else {
      const parsed = JSON.parse(auth);
      if (parsed.role === "guest") {
        navigate("/ai-food-scanner");
      }
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
              // Rolling 7-day window: always show current week's 7 days
              const totalDays = streakData.totalDays;
              const weekStart = Math.floor(totalDays / 7) * 7; // e.g. day 8 → weekStart=7
              const dayNum = weekStart + i + 1;                 // absolute day number shown
              const isCompleted = dayNum <= totalDays;
              const currentDay = streakData.startTime ? totalDays + 1 : totalDays;
              const isActive = dayNum === currentDay && !!streakData.startTime;
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
                  <span className={`text-[8px] font-black uppercase tracking-wider ${isActive ? "text-[#4ade80]" : isCompleted ? "text-[#22c55e]" : "text-[#475569]"
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
                    <button key={plan.id} onClick={() => setStreakData((s: StreakData) => ({ ...s, plan: plan.id }))} className={`p-2 rounded-lg border-2 transition-all text-left ${streakData.plan === plan.id ? "bg-[#4ade80]/10 border-[#4ade80]" : "bg-transparent border-white/10 hover:border-[#4ade80]/40"}`}>
                      <p className={`font-bold text-xs ${streakData.plan === plan.id ? "text-[#4ade80]" : "text-[#dce2f6]"}`}>{plan.label}</p>
                      <p className="text-[#94a3b8] text-[9px] mt-0.5">{plan.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Anchor Section — below weekly circles */}
        {(() => {
          const allTabs = [
            { id: "wajah" as const, label: "LOVE", icon: "favorite" },
            { id: "sehat" as const, label: "HEALTH", icon: "monitor_heart" },
            { id: "mustaqbil" as const, label: "FUTURE", icon: "rocket_launch" },
          ];

          // Filter by visibleTabs state (fallback to all if empty initially)
          const currentVisible = visibleTabs.length > 0 ? visibleTabs : ["wajah", "sehat", "mustaqbil"];
          const tabs = allTabs.filter(t => currentVisible.includes(t.id));

          const totalDays = streakData.totalDays || 0;
          const ringCircumference = 2 * Math.PI * 64;
          const ringProgress = Math.min((totalDays / 30) * 100, 100);
          const ringDashOffset = ringCircumference - (ringProgress / 100) * ringCircumference;



          const handleRestoreTabs = () => {
            setVisibleTabs(["wajah", "sehat", "mustaqbil"]);
            setActiveAnchorType("wajah");
          };

          return (
            <div className="bg-[#121a2b] rounded-3xl border border-white/5 p-5 sm:p-6 space-y-5">
              {/* Tabs Header Row with 2 global action icons */}
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black tracking-[0.25em] text-[#94a3b8]/60 uppercase">ANCHOR SYSTEM</span>
                <div className="flex items-center gap-1.5">
                  {/* Add New Metric icon */}
                  <button
                    onClick={() => {
                      setIsTabSelectMode(false);
                      setSelectedTabsForDelete([]);
                      setShowAddVitalModal(true);
                    }}
                    className="w-7 h-7 rounded-xl bg-[#4ade80]/10 border border-[#4ade80]/20 hover:bg-[#4ade80]/20 flex items-center justify-center transition active:scale-95"
                    title="Add New Metric"
                  >
                    <span className="material-symbols-outlined text-[#4ade80]" style={{ fontSize: 14 }}>add</span>
                  </button>
                  {/* Delete tabs icon — toggles select mode */}
                  <button
                    onClick={() => {
                      setIsTabSelectMode(prev => !prev);
                      setSelectedTabsForDelete([]);
                    }}
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center transition active:scale-95 ${
                      isTabSelectMode
                        ? "bg-red-500/20 border-red-400/40 text-red-400"
                        : "bg-white/5 border-white/10 text-[#94a3b8] hover:border-red-400/30 hover:text-red-400"
                    }`}
                    title={isTabSelectMode ? "Cancel Delete" : "Delete Tabs"}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                      {isTabSelectMode ? "close" : "delete"}
                    </span>
                  </button>
                  {/* Confirm delete when in select mode */}
                  {isTabSelectMode && selectedTabsForDelete.length > 0 && (
                    <button
                      onClick={() => {
                        const nextVisible = currentVisible.filter(id => !selectedTabsForDelete.includes(id));
                        setVisibleTabs(nextVisible);
                        if (selectedTabsForDelete.includes(activeAnchorType) && nextVisible.length > 0) {
                          setActiveAnchorType(nextVisible[0] as any);
                        }
                        setIsTabSelectMode(false);
                        setSelectedTabsForDelete([]);
                      }}
                      className="px-2 h-7 rounded-xl bg-red-500/80 border border-red-400/50 text-white text-[9px] font-black tracking-wider hover:bg-red-500 flex items-center justify-center transition active:scale-95"
                    >
                      DELETE {selectedTabsForDelete.length}
                    </button>
                  )}
                </div>
              </div>

              {/* Tabs — Interactive! */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  {tabs.map((tab) => {
                    const isActive = activeAnchorType === tab.id;
                    const isSelected = selectedTabsForDelete.includes(tab.id);
                    return (
                      <div
                        key={tab.id}
                        onClick={() => {
                          if (isTabSelectMode) {
                            setSelectedTabsForDelete(prev =>
                              isSelected ? prev.filter(id => id !== tab.id) : [...prev, tab.id]
                            );
                          } else {
                            setActiveAnchorType(tab.id);
                          }
                        }}
                        className={`flex-1 relative flex flex-col items-center gap-2 py-3 px-1.5 rounded-2xl border transition-all duration-300 cursor-pointer active:scale-95 ${
                          isTabSelectMode
                            ? isSelected
                              ? "border-red-400/60 bg-red-500/10 text-red-400"
                              : "border-[#1e293b] bg-[#0c1321] text-[#94a3b8] hover:border-red-400/30"
                            : isActive
                              ? "border-[#4ade80]/40 bg-[#4ade80]/8 text-[#4ade80]"
                              : "border-[#1e293b] bg-[#0c1321] text-[#94a3b8] hover:border-[#4ade80]/20"
                        }`}
                      >
                        {/* Checkbox in select-delete mode */}
                        {isTabSelectMode && (
                          <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-red-500 border-red-400"
                              : "bg-[#0c1321] border-white/20"
                          }`}>
                            {isSelected && <span className="material-symbols-outlined text-white" style={{ fontSize: 11 }}>check</span>}
                          </div>
                        )}

                        <div className={`transition-all flex items-center justify-center ${
                          isActive && !isTabSelectMode ? "bg-[#4ade80]/15" : "bg-transparent"
                        } ${
                          tab.id === "wajah" ? "w-14 h-8 rounded-full" : "w-8 h-8 rounded-full"
                        }`}>
                          <span
                            className={`material-symbols-outlined text-lg ${
                              isActive && !isTabSelectMode ? "material-filled text-[#4ade80]" : ""
                            } ${
                              tab.id === "wajah" ? "animate-heartbeat" : ""
                            }`}
                          >
                            {tab.icon}
                          </span>
                        </div>

                        {editingTabId === tab.id ? (
                          <input
                            autoFocus
                            value={editingTabValue}
                            onChange={(e) => setEditingTabValue(e.target.value)}
                            onBlur={() => {
                              if (editingTabValue.trim()) {
                                setTabLabels(prev => ({ ...prev, [tab.id]: editingTabValue.trim().toUpperCase() }));
                              }
                              setEditingTabId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                if (editingTabValue.trim()) {
                                  setTabLabels(prev => ({ ...prev, [tab.id]: editingTabValue.trim().toUpperCase() }));
                                }
                                setEditingTabId(null);
                              }
                              if (e.key === "Escape") {
                                setEditingTabId(null);
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[9px] font-black tracking-[0.15em] text-center bg-transparent border-b border-[#4ade80]/60 focus:outline-none w-20 uppercase"
                            style={{ caretColor: "#4ade80" }}
                          />
                        ) : (
                          <span
                            onClick={(e) => {
                              if (isActive && !isTabSelectMode) {
                                e.stopPropagation();
                                setEditingTabId(tab.id);
                                setEditingTabValue(tabLabels[tab.id]);
                              }
                            }}
                            className="text-[9px] font-black tracking-[0.15em] cursor-pointer select-none hover:text-[#4ade80] transition-colors"
                            title={!isTabSelectMode ? "Click to edit name" : undefined}
                          >
                            {tabLabels[tab.id]}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Restore Tabs option if any tab is deleted */}
                {currentVisible.length < 3 && (
                  <button
                    onClick={handleRestoreTabs}
                    className="self-end text-[9px] font-black text-[#4ade80]/60 hover:text-[#4ade80] tracking-widest uppercase transition"
                  >
                    + Restore Deleted Tabs
                  </button>
                )}
              </div>

              {/* Hidden SVG Defs for ember gradient */}
              <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                  <linearGradient id="dashEmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF4D6D" />
                    <stop offset="100%" stopColor="#FFA94D" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Tab Content Display */}
              {activeAnchorType === "wajah" && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Ember Heart Ring — centered */}
                  <div className="relative flex items-center justify-center mx-auto" style={{ width: 140, height: 140 }}>
                    <svg
                      width="140"
                      height="140"
                      viewBox="0 0 148 148"
                      style={{ transform: "rotate(-90deg)", position: "absolute", inset: 0 }}
                    >
                      <circle cx="74" cy="74" r="64" strokeWidth="6" fill="none" stroke="#1e293b" />
                      <circle
                        cx="74" cy="74" r="64" strokeWidth="6" fill="none"
                        stroke="url(#dashEmberGrad)"
                        strokeLinecap="round"
                        strokeDasharray={ringCircumference}
                        strokeDashoffset={ringDashOffset}
                        style={{ filter: "drop-shadow(0 0 8px rgba(255,109,90,0.5))" }}
                      />
                    </svg>
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: 96,
                        height: 96,
                        borderRadius: "50%",
                        background: "radial-gradient(circle at 35% 30%, #3A0E1F, #15090E)",
                        border: "1px solid rgba(255,107,90,0.25)",
                      }}
                    >
                      <svg viewBox="0 0 32 29" fill="none" width={44} height={40} className="animate-heartbeat" style={{ transformOrigin: "center" }}>
                        <path
                          d="M16 27.5C16 27.5 2 19.2 2 9.5C2 5.36 5.36 2 9.5 2C11.88 2 14 3.24 15.28 5.12C15.64 4.52 16 4.04 16 4.04C16 4.04 16.36 4.52 16.72 5.12C18 3.24 20.12 2 22.5 2C26.64 2 30 5.36 30 9.5C30 19.2 16 27.5 16 27.5Z"
                          fill="#FF4D6D" opacity="0.18"
                        />
                        <path
                          d="M16 27.5C16 27.5 2 19.2 2 9.5C2 5.36 5.36 2 9.5 2C11.88 2 14 3.24 15.28 5.12C15.64 4.52 16 4.04 16 4.04C16 4.04 16.36 4.52 16.72 5.12C18 3.24 20.12 2 22.5 2C26.64 2 30 5.36 30 9.5C30 19.2 16 27.5 16 27.5Z"
                          stroke="#FF6D5A" strokeWidth="1.4" fill="none"
                        />
                        <path
                          d="M16 13C16 13 13 16.5 13 18.5A3 3 0 0 0 19 18.5C19 16.5 16 13 16 13Z"
                          fill="#FFA94D"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Tagline + Name (Centered, click-to-edit inline) */}
                  <div className="text-center">
                    <div className="text-[9px] font-black tracking-[0.3em] text-[#4ade80] uppercase mb-2">
                      DAY {Math.max(1, streakData.startTime ? totalDays + 1 : totalDays)}
                    </div>

                    {/* Inline editable name — centered exactly under circle */}
                    {isEditingName ? (
                      <input
                        autoFocus
                        value={editNameTemp}
                        onChange={(e) => setEditNameTemp(e.target.value)}
                        onBlur={() => {
                          if (editNameTemp.trim()) setAnchorName(editNameTemp.trim());
                          setIsEditingName(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (editNameTemp.trim()) setAnchorName(editNameTemp.trim());
                            setIsEditingName(false);
                          }
                          if (e.key === "Escape") setIsEditingName(false);
                        }}
                        className="text-2xl font-black text-[#4ade80] tracking-tight text-center bg-transparent border-b-2 border-[#4ade80]/60 focus:outline-none focus:border-[#4ade80] w-40 mx-auto block"
                        style={{ caretColor: "#4ade80" }}
                      />
                    ) : (
                      <h3
                        className="text-2xl font-black text-[#F1F5F9] tracking-tight cursor-pointer hover:text-[#4ade80] transition-colors text-center select-none"
                        onClick={() => { setEditNameTemp(anchorName); setIsEditingName(true); }}
                        title="Click to edit"
                      >
                        {anchorName}
                      </h3>
                    )}

                    <p
                      className="text-[11px] text-[#94a3b8] mt-1 cursor-pointer hover:text-[#dce2f6] transition-colors"
                      onClick={() => openAnchorEdit("subtitle", anchorSubtitle)}
                      title="Click to edit"
                    >
                      {anchorSubtitle}
                    </p>
                  </div>

                  {/* Quote (click to edit) */}
                  <div
                    className="relative mt-4 cursor-pointer group"
                    style={{
                      borderLeft: "3px solid #4ade80",
                      padding: "10px 14px",
                      background: "linear-gradient(90deg, rgba(74,222,128,0.06), transparent)",
                      borderRadius: "0 10px 10px 0",
                    }}
                    onClick={() => openAnchorEdit("quote", anchorQuote)}
                    title="Click to edit"
                  >
                    <p className="text-xs italic text-[#F1F5F9] pr-6">"{anchorQuote}"</p>
                    <span className="material-symbols-outlined text-[#4ade80]/30 text-xs absolute top-2 right-2 group-hover:text-[#4ade80]/70 transition-colors">edit</span>
                  </div>
                </div>
              )}

              {activeAnchorType === "sehat" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Vitals Grid (only custom vitals + ADD button beside them!) */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {customVitals.map((vital) => (
                      <div
                        key={vital.id}
                        className="bg-[#0c1321] border border-[#1e293b] rounded-2xl p-3 relative group flex flex-col justify-between min-h-[82px]"
                      >
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            onClick={() => openAnchorEdit(`custom_${vital.id}`, vital.value)}
                            className="p-0.5 rounded hover:bg-[#4ade80]/10 transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                          >
                            <span className="material-symbols-outlined text-[#4ade80]/60 text-xs">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteVital(vital.id)}
                            className="p-0.5 rounded hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                          >
                            <span className="material-symbols-outlined text-red-400/80 text-xs">delete</span>
                          </button>
                        </div>
                        <div className="text-[8px] font-black tracking-[0.15em] text-[#94a3b8] uppercase mb-0.5 truncate pr-8">
                          {vital.label}
                        </div>
                        <div className="text-base font-extrabold text-[#fb923c] truncate mt-1">
                          {vital.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeAnchorType === "mustaqbil" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Mustaqbil Goals list + Add button */}
                  <div className="space-y-2.5">
                    {customGoals.map((goal) => (
                      <div
                        key={goal.id}
                        className="flex items-center justify-between bg-[#0c1321]/60 border border-[#1e293b] rounded-xl p-3 group"
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <button
                            onClick={() => handleToggleGoal(goal.id)}
                            className={`flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${goal.completed
                              ? "bg-[#4ade80] border-[#4ade80] text-[#0c1321]"
                              : "border-[#94a3b8]/40 hover:border-[#4ade80]"
                              }`}
                          >
                            {goal.completed && (
                              <span className="material-symbols-outlined text-sm font-black">check</span>
                            )}
                          </button>
                          <span
                            className={`text-xs truncate ${goal.completed ? "text-[#94a3b8] line-through" : "text-[#dce2f6]"
                              }`}
                          >
                            {goal.text}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingGoalId(goal.id);
                              openAnchorEdit("edit_goal", goal.text);
                            }}
                            className="p-1 rounded hover:bg-[#4ade80]/10 text-[#4ade80]/60 hover:text-[#4ade80]"
                          >
                            <span className="material-symbols-outlined text-xs">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="p-1 rounded hover:bg-red-500/10 text-red-400/60 hover:text-red-400"
                          >
                            <span className="material-symbols-outlined text-xs">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add button inside the content list so it sits with them */}
                    <button
                      onClick={() => setShowAddGoalModal(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-[#0c1321]/50 border border-dashed border-[#4ade80]/30 hover:border-[#4ade80]/60 hover:bg-[#4ade80]/5 rounded-2xl text-xs font-black text-[#4ade80] transition active:scale-95"
                    >
                      <span className="material-symbols-outlined text-base">add_circle</span>
                      ADD FUTURE GOAL
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

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

      {/* Anchor Edit Modal */}
      {anchorEditModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end z-[60] animate-in fade-in">
          <div className="bg-[#121a2b] w-full rounded-t-3xl p-6 space-y-4 animate-in slide-in-from-bottom-5 max-h-[80vh] overflow-y-auto border-t border-[#4ade80]/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-[#F1F5F9]">
                {getAnchorEditLabel()}
              </h3>
              <button
                onClick={() => setAnchorEditModal(null)}
                className="p-1 rounded-lg hover:bg-white/5 transition"
              >
                <span className="material-symbols-outlined text-[#94a3b8]">close</span>
              </button>
            </div>

            {isAnchorTextArea ? (
              <textarea
                value={anchorEditValue}
                onChange={(e) => setAnchorEditValue(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 text-sm bg-[#0c1321] border border-[#1e293b] rounded-xl text-[#dce2f6] placeholder-[#94a3b8]/50 focus:outline-none focus:border-[#4ade80] resize-none"
                autoFocus
              />
            ) : (
              <input
                type="text"
                value={anchorEditValue}
                onChange={(e) => setAnchorEditValue(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-[#0c1321] border border-[#1e293b] rounded-xl text-[#dce2f6] placeholder-[#94a3b8]/50 focus:outline-none focus:border-[#4ade80]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveAnchorEdit();
                }}
              />
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setAnchorEditModal(null)}
                className="flex-1 py-3 bg-[#1e293b] text-[#dce2f6] font-bold text-sm rounded-xl hover:bg-[#334155] transition active:scale-95"
              >
                CANCEL
              </button>
              <button
                onClick={saveAnchorEdit}
                className="flex-1 py-3 bg-[#4ade80] text-[#0c1321] font-bold text-sm rounded-xl hover:bg-[#22c55e] transition active:scale-95"
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Metric Modal — with name, value, and purpose */}
      {showAddVitalModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end z-[60] animate-in fade-in">
          <div className="bg-[#121a2b] w-full rounded-t-3xl p-6 space-y-4 animate-in slide-in-from-bottom-5 border-t border-[#fb923c]/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-[#F1F5F9]">Add New Metric</h3>
                <p className="text-[10px] text-[#94a3b8] mt-0.5">Kya track karna chahte ho aur kyun?</p>
              </div>
              <button
                onClick={() => {
                  setShowAddVitalModal(false);
                  setNewVitalName("");
                  setNewVitalValue("");
                  setNewVitalPurpose("");
                }}
                className="p-1 rounded-lg hover:bg-white/5 transition"
              >
                <span className="material-symbols-outlined text-[#94a3b8]">close</span>
              </button>
            </div>

            {/* Suggested metric type chips */}
            <div>
              <div className="text-[9px] font-black tracking-widest text-[#94a3b8]/70 uppercase mb-2">Suggested Metrics</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Blood Pressure", value: "120/80 mmHg", purpose: "Heart health monitor karna" },
                  { name: "Blood Sugar", value: "90 mg/dL", purpose: "Diabetes control karna" },
                  { name: "Weight", value: "75 kg", purpose: "Weight loss progress track karna" },
                  { name: "Steps Today", value: "0 steps", purpose: "Active rehna" },
                  { name: "Water Intake", value: "0 L", purpose: "Hydration maintain karna" },
                  { name: "Sleep Hours", value: "7 hrs", purpose: "Rest aur recovery" },
                ].map((s) => (
                  <button
                    key={s.name}
                    onClick={() => { setNewVitalName(s.name); setNewVitalValue(s.value); setNewVitalPurpose(s.purpose); }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                      newVitalName === s.name
                        ? "bg-[#fb923c]/20 border-[#fb923c]/60 text-[#fb923c]"
                        : "bg-[#1e293b] border-white/10 text-[#94a3b8] hover:border-[#fb923c]/30"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-black tracking-widest text-[#94a3b8] uppercase block mb-1">Metric Name</label>
                <input
                  type="text"
                  value={newVitalName}
                  onChange={(e) => setNewVitalName(e.target.value)}
                  placeholder="e.g. Cholesterol, Blood Sugar"
                  className="w-full px-4 py-3 text-sm bg-[#0c1321] border border-[#1e293b] rounded-xl text-[#dce2f6] placeholder-[#94a3b8]/50 focus:outline-none focus:border-[#fb923c]"
                />
              </div>
              <div>
                <label className="text-[10px] font-black tracking-widest text-[#94a3b8] uppercase block mb-1">Current Value / Unit</label>
                <input
                  type="text"
                  value={newVitalValue}
                  onChange={(e) => setNewVitalValue(e.target.value)}
                  placeholder="e.g. 150 mg/dL, 72 bpm, 75 kg"
                  className="w-full px-4 py-3 text-sm bg-[#0c1321] border border-[#1e293b] rounded-xl text-[#dce2f6] placeholder-[#94a3b8]/50 focus:outline-none focus:border-[#fb923c]"
                />
              </div>
              <div>
                <label className="text-[10px] font-black tracking-widest text-[#94a3b8] uppercase block mb-1">Maqsad (Purpose)</label>
                <input
                  type="text"
                  value={newVitalPurpose}
                  onChange={(e) => setNewVitalPurpose(e.target.value)}
                  placeholder="e.g. Heart health track karna, weight kam karna"
                  className="w-full px-4 py-3 text-sm bg-[#0c1321] border border-[#1e293b] rounded-xl text-[#dce2f6] placeholder-[#94a3b8]/50 focus:outline-none focus:border-[#fb923c]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowAddVitalModal(false);
                  setNewVitalName("");
                  setNewVitalValue("");
                  setNewVitalPurpose("");
                }}
                className="flex-1 py-3 bg-[#1e293b] text-[#dce2f6] font-bold text-sm rounded-xl hover:bg-[#334155] transition active:scale-95"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  if (newVitalName.trim() && newVitalValue.trim()) {
                    const id = Date.now().toString();
                    setCustomVitals(prev => [...prev, { id, label: newVitalName.trim(), value: newVitalValue.trim() }]);
                    setShowAddVitalModal(false);
                    setNewVitalName("");
                    setNewVitalValue("");
                    setNewVitalPurpose("");
                  }
                }}
                className="flex-1 py-3 bg-[#fb923c] text-[#0c1321] font-bold text-sm rounded-xl hover:bg-[#fb923c]/80 transition active:scale-95"
              >
                ADD METRIC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Future Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end z-[60] animate-in fade-in">
          <div className="bg-[#121a2b] w-full rounded-t-3xl p-6 space-y-4 animate-in slide-in-from-bottom-5 border-t border-[#4ade80]/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-[#F1F5F9]">Add Future Goal</h3>
              <button
                onClick={() => {
                  setShowAddGoalModal(false);
                  setNewGoalText("");
                }}
                className="p-1 rounded-lg hover:bg-white/5 transition"
              >
                <span className="material-symbols-outlined text-[#94a3b8]">close</span>
              </button>
            </div>

            <div>
              <label className="text-[10px] font-black tracking-widest text-[#94a3b8] uppercase block mb-1">Goal Description</label>
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder="e.g. Drink 3L water daily, Quit late night snacks"
                className="w-full px-4 py-3 text-sm bg-[#0c1321] border border-[#1e293b] rounded-xl text-[#dce2f6] placeholder-[#94a3b8]/50 focus:outline-none focus:border-[#4ade80]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowAddGoalModal(false);
                  setNewGoalText("");
                }}
                className="flex-1 py-3 bg-[#1e293b] text-[#dce2f6] font-bold text-sm rounded-xl hover:bg-[#334155] transition active:scale-95"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  if (newGoalText.trim()) {
                    const id = Date.now().toString();
                    setCustomGoals(prev => [...prev, { id, text: newGoalText.trim(), completed: false }]);
                    setShowAddGoalModal(false);
                    setNewGoalText("");
                  }
                }}
                className="flex-1 py-3 bg-[#4ade80] text-[#0c1321] font-bold text-sm rounded-xl hover:bg-[#4ade80]/80 transition active:scale-95"
              >
                ADD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Money Modal */}
      {showSavedMoneyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end z-[60] animate-in fade-in">
          <div className="bg-[#121a2b] w-full rounded-t-3xl p-6 space-y-5 animate-in slide-in-from-bottom-5 border-t border-[#fbbf24]/20 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#fbbf24]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#fbbf24] text-base">savings</span>
                </div>
                <h3 className="text-lg font-extrabold text-[#F1F5F9]">Saved Money</h3>
              </div>
              <button
                onClick={() => { setShowSavedMoneyModal(false); setEditingSavedField(null); }}
                className="p-1 rounded-lg hover:bg-white/5 transition"
              >
                <span className="material-symbols-outlined text-[#94a3b8]">close</span>
              </button>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              {/* Total Saved */}
              <div className="bg-[#0c1321] rounded-2xl p-4 border border-[#fbbf24]/10">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-[9px] font-black tracking-widest text-[#94a3b8] uppercase">Total Saved</div>
                    <div className="text-xl font-black text-[#fbbf24]">Rs {savedMoneyTotal.toLocaleString()}</div>
                  </div>
                  <button
                    onClick={() => { setEditingSavedField(editingSavedField === "total" ? null : "total"); setSavedMoneyInput(savedMoneyTotal.toString()); }}
                    className="p-2 rounded-xl bg-[#fbbf24]/10 hover:bg-[#fbbf24]/20 transition"
                  >
                    <span className="material-symbols-outlined text-[#fbbf24] text-sm">{editingSavedField === "total" ? "check" : "edit"}</span>
                  </button>
                </div>
                {editingSavedField === "total" && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="number"
                      value={savedMoneyInput}
                      onChange={(e) => setSavedMoneyInput(e.target.value)}
                      placeholder="e.g. 1200"
                      className="flex-1 px-3 py-2 text-sm bg-[#1e293b] border border-[#fbbf24]/30 rounded-xl text-[#dce2f6] focus:outline-none focus:border-[#fbbf24]"
                      autoFocus
                    />
                    <button
                      onClick={() => { const v = parseFloat(savedMoneyInput); if (!isNaN(v) && v >= 0) setSavedMoneyTotal(v); setEditingSavedField(null); }}
                      className="px-4 py-2 bg-[#fbbf24] text-[#0c1321] font-bold text-sm rounded-xl hover:bg-[#f59e0b] transition active:scale-95"
                    >SAVE</button>
                  </div>
                )}
                <p className="text-[9px] text-[#94a3b8]/60 mt-1">Enter total amount you've saved so far</p>
              </div>

              {/* Monthly Goal */}
              <div className="bg-[#0c1321] rounded-2xl p-4 border border-[#4ade80]/10">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-[9px] font-black tracking-widest text-[#94a3b8] uppercase">Monthly Goal</div>
                    <div className="text-xl font-black text-[#4ade80]">Rs {savedMoneyGoal.toLocaleString()}</div>
                  </div>
                  <button
                    onClick={() => { setEditingSavedField(editingSavedField === "goal" ? null : "goal"); setSavedMoneyInput(savedMoneyGoal.toString()); }}
                    className="p-2 rounded-xl bg-[#4ade80]/10 hover:bg-[#4ade80]/20 transition"
                  >
                    <span className="material-symbols-outlined text-[#4ade80] text-sm">{editingSavedField === "goal" ? "check" : "edit"}</span>
                  </button>
                </div>
                {editingSavedField === "goal" && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="number"
                      value={savedMoneyInput}
                      onChange={(e) => setSavedMoneyInput(e.target.value)}
                      placeholder="e.g. 5000"
                      className="flex-1 px-3 py-2 text-sm bg-[#1e293b] border border-[#4ade80]/30 rounded-xl text-[#dce2f6] focus:outline-none focus:border-[#4ade80]"
                      autoFocus
                    />
                    <button
                      onClick={() => { const v = parseFloat(savedMoneyInput); if (!isNaN(v) && v > 0) setSavedMoneyGoal(v); setEditingSavedField(null); }}
                      className="px-4 py-2 bg-[#4ade80] text-[#0c1321] font-bold text-sm rounded-xl hover:bg-[#22c55e] transition active:scale-95"
                    >SAVE</button>
                  </div>
                )}
                <p className="text-[9px] text-[#94a3b8]/60 mt-1">Your savings target for the month</p>
              </div>

              {/* Daily Saving Rate */}
              <div className="bg-[#0c1321] rounded-2xl p-4 border border-[#fb923c]/10">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-[9px] font-black tracking-widest text-[#94a3b8] uppercase">Daily Saving Rate</div>
                    <div className="text-xl font-black text-[#fb923c]">Rs {dailySavingRate}/day</div>
                  </div>
                  <button
                    onClick={() => { setEditingSavedField(editingSavedField === "daily" ? null : "daily"); setSavedMoneyInput(dailySavingRate.toString()); }}
                    className="p-2 rounded-xl bg-[#fb923c]/10 hover:bg-[#fb923c]/20 transition"
                  >
                    <span className="material-symbols-outlined text-[#fb923c] text-sm">{editingSavedField === "daily" ? "check" : "edit"}</span>
                  </button>
                </div>
                {editingSavedField === "daily" && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="number"
                      value={savedMoneyInput}
                      onChange={(e) => setSavedMoneyInput(e.target.value)}
                      placeholder="e.g. 100"
                      className="flex-1 px-3 py-2 text-sm bg-[#1e293b] border border-[#fb923c]/30 rounded-xl text-[#dce2f6] focus:outline-none focus:border-[#fb923c]"
                      autoFocus
                    />
                    <button
                      onClick={() => { const v = parseFloat(savedMoneyInput); if (!isNaN(v) && v > 0) setDailySavingRate(v); setEditingSavedField(null); }}
                      className="px-4 py-2 bg-[#fb923c] text-[#0c1321] font-bold text-sm rounded-xl hover:bg-[#ea6c00] transition active:scale-95"
                    >SAVE</button>
                  </div>
                )}
                <p className="text-[9px] text-[#94a3b8]/60 mt-1">How much you save per day by avoiding junk</p>
              </div>

              {/* Quick add buttons */}
              <div className="pt-1">
                <div className="text-[9px] font-black tracking-widest text-[#94a3b8]/60 uppercase mb-2">Quick Add to Total</div>
                <div className="flex gap-2 flex-wrap">
                  {[50, 100, 200, 500].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setSavedMoneyTotal(prev => prev + amount)}
                      className="px-3 py-1.5 rounded-xl bg-[#fbbf24]/10 border border-[#fbbf24]/20 text-[#fbbf24] text-xs font-bold hover:bg-[#fbbf24]/20 transition active:scale-95"
                    >
                      +Rs {amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => { setShowSavedMoneyModal(false); setEditingSavedField(null); }}
              className="w-full py-3 bg-[#fbbf24] text-[#0c1321] font-bold text-sm rounded-2xl hover:bg-[#f59e0b] transition active:scale-95"
            >
              DONE
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div >
  );
};

export default Dashboard;
