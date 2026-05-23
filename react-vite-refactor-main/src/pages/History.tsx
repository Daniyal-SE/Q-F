import { useEffect, useState } from "react";
import TopAppBar from "@/components/TopAppBar";
import BottomNav from "@/components/BottomNav";

interface DailyRecord {
  date: string;
  completed: boolean;
  precision: string;
  duration: number;
}

interface StreakData {
  startTime: number | null;
  elapsedTime: number;
  totalDays: number;
  precision: string | null;
  customPrecision?: string;
  plan?: "student" | "work" | "flexible";
  notificationSent: boolean;
  preNotificationSent: boolean;
}

const History = () => {
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [stats, setStats] = useState({
    currentStreak: 0,
    totalCompleted: 0,
    totalSessions: 0,
    successRate: 0,
    missedLogs: 0,
  });

  // Load data from localStorage
  useEffect(() => {
    const savedRecords = localStorage.getItem("dailyRecords");
    const saved_records = savedRecords ? JSON.parse(savedRecords) : [];
    setRecords(saved_records);

    let streak: StreakData | null = null;
    const savedStreak = localStorage.getItem("streakData");
    if (savedStreak) {
      streak = JSON.parse(savedStreak);
      setStreakData(streak);
    }

    // Calculate statistics
    const completed = saved_records.filter(
      (r: DailyRecord) => r.completed,
    ).length;
    const total = saved_records.length;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const missedLogs = Math.max(0, total - completed);

    setStats({
      currentStreak: streak?.totalDays || 0,
      totalCompleted: completed,
      totalSessions: total,
      successRate,
      missedLogs,
    });
  }, []);

  const getPrecisionIcon = (precision: string) => {
    switch (precision) {
      case "sugar":
        return "water_drop";
      case "junk-food":
        return "no_food";
      case "cold-drink":
        return "local_drink";
      default:
        return "edit";
    }
  };

  const getPrecisionLabel = (precision: string) => {
    switch (precision) {
      case "sugar":
        return "Quit Sugar";
      case "junk-food":
        return "Avoid Junk Food";
      case "cold-drink":
        return "Cold Drink";
      case "custom":
        return "Custom Challenge";
      default:
        return "Challenge";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options).toUpperCase();
  };

  const getTimelineItems = () => {
    return records
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((record, index) => ({
        status: record.completed ? "success" : "failure",
        tag: index === 0 ? "TODAY" : index === 1 ? "YESTERDAY" : "HISTORY",
        tagColor: record.completed ? "text-kinetic-primary" : "text-secondary",
        title: getPrecisionLabel(record.precision),
        date: formatDate(record.date),
        icon: getPrecisionIcon(record.precision),
        desc: record.completed
          ? `Completed 24-hour challenge for ${getPrecisionLabel(record.precision)}.`
          : `Challenge incomplete for ${getPrecisionLabel(record.precision)}.`,
        glow: index === 0,
      }));
  };

  return (
    <div className="bg-kinetic-surface text-kinetic-on-surface min-h-screen pb-24 sm:pb-32 flex flex-col">
      <TopAppBar showBack showMenu showAvatar />

      <main className="flex-1 px-4 sm:px-6 pt-4 pb-24 sm:pb-32 overflow-y-auto min-h-[calc(100vh-200px)]">
        <section className="mb-10">
          <h2 className="font-headline text-2xl sm:text-3xl md:text-5xl font-black text-kinetic-on-surface mb-2 leading-none uppercase tracking-tighter">
            {stats.currentStreak} DAY <br />
            <span className="text-kinetic-primary">VELOCITY</span>
          </h2>
          <p className="text-kinetic-on-surface-variant text-base sm:text-lg font-medium max-w-md">
            Your discipline streak is currently{" "}
            <span className="text-kinetic-primary font-bold">
              {stats.currentStreak} Days
            </span>
            . Great work maintaining your commitment!
          </p>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-10">
          <div className="bg-kinetic-surface-container-low p-3 sm:p-5 rounded-xl border-l-4 border-kinetic-primary">
            <p className="text-[10px] font-black tracking-widest text-kinetic-on-surface-variant uppercase mb-1">
              Success Rate
            </p>
            <p className="text-xl sm:text-2xl font-black text-kinetic-on-surface">
              {stats.successRate}%
            </p>
            <p className="text-[10px] text-kinetic-on-surface-variant mt-1">
              {stats.totalCompleted} of {stats.totalSessions} completed
            </p>
          </div>
          <div className="bg-kinetic-surface-container-low p-3 sm:p-5 rounded-xl border-l-4 border-secondary">
            <p className="text-[10px] font-black tracking-widest text-kinetic-on-surface-variant uppercase mb-1">
              Total Sessions
            </p>
            <p className="text-xl sm:text-2xl font-black text-kinetic-on-surface">
              {stats.totalSessions}
            </p>
            <p className="text-[10px] text-kinetic-on-surface-variant mt-1">
              Challenges started
            </p>
          </div>
        </div>

        {/* Timeline */}
        {records.length > 0 ? (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-kinetic-surface-container-highest" />
            <div className="space-y-8 relative">
              {getTimelineItems().map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="relative z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.status === "success"
                          ? `bg-kinetic-primary-container ${
                              item.glow
                                ? "shadow-[0_0_15px_hsla(var(--kinetic-primary)/0.4)]"
                                : ""
                            }`
                          : `bg-kinetic-secondary-container ${
                              item.glow
                                ? "shadow-[0_0_15px_hsla(0,100%,64%,0.4)]"
                                : ""
                            }`
                      }`}
                    >
                      <span className="material-symbols-outlined text-white text-sm material-filled">
                        {item.status === "success" ? "check_circle" : "cancel"}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 bg-kinetic-surface-container p-5 rounded-xl transition-all duration-200 active:scale-[0.98] hover:bg-kinetic-surface-container-high cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-sm`}>
                            {item.icon}
                          </span>
                          <p
                            className={`text-[10px] font-black tracking-widest uppercase ${item.tagColor}`}
                          >
                            {item.tag}
                          </p>
                        </div>
                        <h3 className="font-bold text-lg text-kinetic-on-surface mt-1">
                          {item.title}
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold text-kinetic-on-surface-variant bg-kinetic-surface-container-highest px-2 py-1 rounded">
                        {item.date}
                      </span>
                    </div>
                    <p className="text-sm text-kinetic-on-surface-variant leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}

              <div className="py-4 text-center">
                <p className="text-kinetic-on-surface-variant text-sm font-medium">
                  Showing all {records.length} recorded sessions
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-kinetic-on-surface-variant opacity-50 mb-4 inline-block">
              history
            </span>
            <p className="text-kinetic-on-surface-variant text-lg font-medium">
              No history yet
            </p>
            <p className="text-kinetic-on-surface-variant text-sm">
              Start your first 24-hour challenge to see your history!
            </p>
          </div>
        )}
      </main>

      <BottomNav active="history" />
    </div>
  );
};

export default History;
