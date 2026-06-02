import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "@/components/TopAppBar";
import BottomNav from "@/components/BottomNav";

interface StreakData {
  startTime: number | null;
  elapsedTime: number;
  totalDays: number;
  precision: string;
  customPrecision?: string;
  notificationSent: boolean;
  preNotificationSent: boolean;
}

interface DailyRecord {
  date: string;
  completed: boolean;
  precision: string;
  duration: number;
}

const Analytics = () => {
  const navigate = useNavigate();

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

  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [remainingTime, setRemainingTime] = useState("24:00:00");
  const [dailyDiscipline, setDailyDiscipline] = useState(0);
  const [weekData, setWeekData] = useState([
    { day: "MON", height: 0, active: false },
    { day: "TUE", height: 0, active: false },
    { day: "WED", height: 0, active: false },
    { day: "THU", height: 0, active: false },
    { day: "FRI", height: 0, active: false },
    { day: "SAT", height: 0, active: false },
    { day: "SUN", height: 0, active: false },
  ]);

  // Load streak data and calculate analytics
  useEffect(() => {
    const updateAnalytics = () => {
      const saved = localStorage.getItem("streakData");
      if (saved) {
        const data = JSON.parse(saved);
        setStreakData(data);

        // Load daily records
        const saved_records = localStorage.getItem("dailyRecords");
        const records: DailyRecord[] = saved_records
          ? JSON.parse(saved_records)
          : [];
        setDailyRecords(records);

        // Calculate progress if timer is running
        if (data.startTime) {
          const now = Date.now();
          const elapsed = now - data.startTime;
          const totalDuration = 24 * 60 * 60 * 1000;

          const remaining = totalDuration - elapsed;
          const hours = Math.floor(remaining / (60 * 60 * 1000));
          const minutes = Math.floor(
            (remaining % (60 * 60 * 1000)) / (60 * 1000),
          );
          const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
          setRemainingTime(
            `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
          );

          const percentage = (elapsed / totalDuration) * 100;
          setDailyDiscipline(Math.min(Math.round(percentage), 100));
        }

        // Generate week data
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());

        const newWeekData = [
          { day: "MON", height: 0, active: false },
          { day: "TUE", height: 0, active: false },
          { day: "WED", height: 0, active: false },
          { day: "THU", height: 0, active: false },
          { day: "FRI", height: 0, active: false },
          { day: "SAT", height: 0, active: false },
          { day: "SUN", height: 0, active: false },
        ];

        records.forEach((record) => {
          const recordDate = new Date(record.date);
          const dayDiff = Math.floor(
            (recordDate.getTime() - weekStart.getTime()) /
            (1000 * 60 * 60 * 24),
          );
          if (dayDiff >= 0 && dayDiff < 7) {
            newWeekData[dayDiff].height = record.completed ? 95 : 30;
            newWeekData[dayDiff].active = record.completed;
          }
        });

        setWeekData(newWeekData);
      }
    };

    updateAnalytics();
    const interval = setInterval(updateAnalytics, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate stats
  const totalCompletedDays = dailyRecords.filter((r) => r.completed).length;
  const totalSessions = dailyRecords.length;
  const completionRate =
    totalSessions > 0
      ? Math.round((totalCompletedDays / totalSessions) * 100)
      : 0;
  const avgCaloriesSaved =
    totalCompletedDays > 0 ? Math.round(1800 * totalCompletedDays) : 0;

  const getPrecisionLabel = () => {
    if (!streakData) return "N/A";
    switch (streakData.precision) {
      case "sugar":
        return "Quit Sugar";
      case "junk-food":
        return "Avoid Junk Food";
      case "cold-drink":
        return "Cold Drink";
      case "custom":
        return streakData.customPrecision || "Custom";
      default:
        return "Not Started";
    }
  };

  const getCurrentStreak = () => {
    if (!streakData || streakData.totalDays < 1) return 0;
    return streakData.totalDays;
  };

  return (
    <div className="bg-kinetic-surface text-kinetic-on-surface min-h-screen pb-24 sm:pb-32 flex flex-col">
      <TopAppBar showBack showMenu showAvatar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 pb-8 space-y-6 sm:space-y-10 overflow-y-auto w-full min-h-[calc(100vh-200px)]">
        <section className="space-y-2">
          <p className="text-kinetic-primary font-bold tracking-[0.2em] text-[10px] uppercase">
            Real-Time Integration
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-kinetic-on-surface leading-tight tracking-tight">
            PERFORMANCE
            <br />
            <span className="text-kinetic-primary">ANALYTICS</span>
          </h2>
        </section>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-kinetic-surface-container-low rounded-xl p-4 sm:p-6 flex flex-col justify-between hover:bg-kinetic-surface-container transition-colors duration-300">
            <div className="flex justify-between items-start">
              <span className="text-kinetic-on-surface-variant text-xs font-bold tracking-widest uppercase">
                Current Streak
              </span>
              <span className="material-symbols-outlined text-kinetic-primary">
                trending_up
              </span>
            </div>
            <div className="mt-4 sm:mt-8">
              <div className="text-3xl sm:text-5xl font-black text-kinetic-on-surface">
                {getCurrentStreak()}
              </div>
              <p className="text-kinetic-on-surface-variant text-sm mt-1">
                Days in Progress
              </p>
            </div>
            <div className="mt-4 w-full h-1 bg-kinetic-surface-container-highest rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-kinetic-primary to-kinetic-primary-container transition-all duration-300"
                style={{ width: `${dailyDiscipline}%` }}
              />
            </div>
          </div>

          <div className="bg-kinetic-surface-container-low rounded-xl p-4 sm:p-6 flex flex-col justify-between hover:bg-kinetic-surface-container transition-colors duration-300">
            <div className="flex justify-between items-start">
              <span className="text-kinetic-on-surface-variant text-xs font-bold tracking-widest uppercase">
                Calories Saved
              </span>
              <span className="material-symbols-outlined text-kinetic-primary">
                local_fire_department
              </span>
            </div>
            <div className="mt-4 sm:mt-8">
              <div className="text-3xl sm:text-5xl font-black text-kinetic-on-surface">
                {Math.round(avgCaloriesSaved / 1000)}K
              </div>
              <p className="text-kinetic-on-surface-variant text-sm mt-1">
                Total Kcal Avoided
              </p>
            </div>
            <div className="mt-4 bg-kinetic-primary/10 px-2 py-1 rounded-full">
              <span className="text-[8px] font-bold text-kinetic-primary uppercase">
                {totalCompletedDays} Sessions
              </span>
            </div>
          </div>

          <div className="bg-kinetic-surface-container-low rounded-xl p-4 sm:p-6 flex flex-col justify-between hover:bg-kinetic-surface-container transition-colors duration-300">
            <div className="flex justify-between items-start">
              <span className="text-kinetic-on-surface-variant text-xs font-bold tracking-widest uppercase">
                Completion Rate
              </span>
              <span className="material-symbols-outlined text-kinetic-primary">
                bolt
              </span>
            </div>
            <div className="mt-4 sm:mt-8">
              <div className="text-3xl sm:text-5xl font-black text-kinetic-on-surface">
                {completionRate}%
              </div>
              <p className="text-kinetic-on-surface-variant text-sm mt-1">
                Consistency Score
              </p>
            </div>
            <div className="mt-4 text-kinetic-on-surface-variant text-[10px] uppercase font-bold">
              {totalCompletedDays} of {totalSessions} sessions
            </div>
          </div>

          {/* Current Session */}
          {streakData && streakData.startTime && (
            <div className="md:col-span-3 bg-kinetic-surface-container rounded-xl p-4 sm:p-8 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-kinetic-primary/5 blur-[80px] rounded-full" />
              <div className="relative z-10">
                <div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-kinetic-on-surface text-xl font-black tracking-tight mb-4">
                      ACTIVE CHALLENGE
                    </h3>
                    <div>
                      <p className="text-kinetic-on-surface-variant text-xs uppercase tracking-widest mb-2">
                        Precision Focus
                      </p>
                      <p className="text-2xl font-black text-kinetic-on-surface">
                        {getPrecisionLabel()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-8">
                  <div className="w-full h-4 bg-kinetic-surface-container-highest rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-kinetic-primary to-kinetic-primary-container rounded-full transition-all duration-300"
                      style={{ width: `${dailyDiscipline}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-kinetic-on-surface-variant tracking-widest uppercase mt-2">
                    <span>Start</span>
                    <span>{dailyDiscipline}% Complete</span>
                    <span>24:00</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Weekly Performance */}
          <div className="md:col-span-3 bg-kinetic-surface-container rounded-xl p-4 sm:p-8">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-kinetic-on-surface text-xl font-black tracking-tight">
                  WEEKLY PERFORMANCE
                </h3>
                <p className="text-kinetic-on-surface-variant text-xs uppercase tracking-widest mt-1">
                  This Week's Discipline Score
                </p>
              </div>
              <div className="bg-kinetic-surface-container-highest p-2 rounded-lg">
                <span className="material-symbols-outlined text-kinetic-primary">
                  calendar_month
                </span>
              </div>
            </div>
            <div className="flex items-end justify-between h-32 sm:h-48 px-2">
              {weekData.map((bar) => (
                <div
                  key={bar.day}
                  className="flex flex-col items-center gap-4 w-full"
                >
                  <div
                    className={`w-6 md:w-8 rounded-t-lg transition-all duration-300 ${bar.active
                      ? "bg-kinetic-primary-container"
                      : "bg-kinetic-surface-container-highest hover:bg-kinetic-primary"
                      }`}
                    style={{ height: `${bar.height}%` }}
                  />
                  <span className="text-kinetic-outline text-[10px] font-bold">
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-br from-kinetic-surface-container-low to-kinetic-surface rounded-xl p-4 sm:p-8 border border-white/5">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-kinetic-primary text-2xl sm:text-4xl">
              psychology
            </span>
            <div>
              <h4 className="text-lg sm:text-2xl font-black text-kinetic-on-surface mb-2 sm:mb-4">
                REAL-TIME INSIGHTS
              </h4>
              <p className="text-kinetic-on-surface-variant leading-relaxed">
                {streakData && streakData.startTime
                  ? `You're ${dailyDiscipline}% through today's challenge. Keep it up! Your current focus is "${getPrecisionLabel()}". You have completed ${totalCompletedDays} full days so far.`
                  : "Start your first 24-hour challenge to see real-time analytics and insights about your discipline progress."}
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav active="analytics" />
    </div>
  );
};

export default Analytics;
