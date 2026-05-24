import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  mealType?: string;
  time?: string;
  date?: string;
  icon?: string;
}

interface ExerciseEntry {
  id: string;
  activity: string;
  calories: number;
  duration?: number;
  date?: string;
  icon?: string;
}

interface DayStats {
  label: string;
  intake: number;
  burned: number;
  isToday: boolean;
}

const ACTIVITY_ICONS: Record<string, string> = {
  Running: "directions_run",
  Walking: "directions_walk",
  Workout: "fitness_center",
  Cycling: "pedal_bike",
};

const MEAL_ICONS: Record<string, string> = {
  breakfast: "breakfast_dining",
  lunch: "lunch_dining",
  dinner: "dinner_dining",
  snack: "restaurant",
  default: "restaurant",
};

const CalorieDetailBreakdown: React.FC = () => {
  const navigate = useNavigate();
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([]);
  const [weekStats, setWeekStats] = useState<DayStats[]>([]);

  useEffect(() => {
    // Load today's food entries
    const rawFood = localStorage.getItem("foodEntries");
    const allFood: FoodEntry[] = rawFood ? JSON.parse(rawFood) : [];
    const todayStr = new Date().toISOString().split("T")[0];
    const todayFood = allFood.filter((e) =>
      e.date ? e.date.startsWith(todayStr) : true
    );
    setFoodEntries(todayFood);

    // Load today's exercise entries
    const rawEx = localStorage.getItem("exerciseEntries");
    const allEx: ExerciseEntry[] = rawEx ? JSON.parse(rawEx) : [];
    const todayEx = allEx.filter((e) =>
      e.date ? e.date.startsWith(todayStr) : true
    );
    setExerciseEntries(todayEx);

    // Build weekly stats (last 5 days)
    const days: DayStats[] = [];
    const dayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split("T")[0];
      const label = dayLabels[d.getDay() === 0 ? 6 : d.getDay() - 1];
      const intake = allFood
        .filter((e) => e.date?.startsWith(dStr))
        .reduce((sum, e) => sum + (e.calories || 0), 0);
      const burned = allEx
        .filter((e) => e.date?.startsWith(dStr))
        .reduce((sum, e) => sum + (e.calories || 0), 0);
      days.push({ label, intake, burned, isToday: i === 0 });
    }
    setWeekStats(days);
  }, []);

  const totalIntake = foodEntries.reduce((s, e) => s + (e.calories || 0), 0);
  const totalBurned = exerciseEntries.reduce((s, e) => s + (e.calories || 0), 0);
  const netBalance = totalIntake - totalBurned;
  const maxWeekVal = Math.max(...weekStats.map((d) => Math.max(d.intake, d.burned)), 1);

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).toUpperCase();

  return (
    <div
      className="bg-[#0c1321] text-[#dce2f6] selection:bg-[#6bfb9a] selection:text-[#003919]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <header className="w-full top-0 z-50 sticky bg-[#0c1321] flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 text-[#4ade80] hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <h1
            className="font-black tracking-tighter text-lg sm:text-2xl text-[#4ade80] uppercase"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            KINETIC
          </h1>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#3d4a3e]">
          <img
            alt="User Profile"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4i7RlbQ4l304ud1zxmMU7fqKzh9QV1LSi39NPeIyQ8_bISd9ncovJOraB9kBs3BDUmXSxDXUbd3oc0_yQsLQqKNMVyr8Vf4QrUVXEPXy8HkaD4AuOn_-QmExGXamINh6zo5pOZKf5mdDdIWs6rJiNT70EBOgBXj6ohUK0gC_8pQM5Vzq0q7H_EcaKwvRL1VV3v_2kb_J3h3u0JhcJ3jTjtpQobvH0VP45-pMoGRspcknfrc0ZxtYx3PyYw6_9S9jJLzNFOO4gBdRi"
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-28 sm:pb-36">
        {/* Title Section */}
        <div className="mb-8">
          <h2
            className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-[#dce2f6] mb-1"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Daily Breakdown
          </h2>
          <p className="text-[#bccabb] font-medium tracking-wide text-sm">{todayLabel}</p>
        </div>

        {/* Big Metrics Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
          {/* Intake */}
          <div className="bg-[#151b2a] p-4 sm:p-8 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
            </div>
            <p className="text-[#bccabb] text-xs uppercase tracking-widest mb-4">Intake</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-4xl font-extrabold text-[#dce2f6]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                +{totalIntake}
              </span>
              <span className="text-[#6bfb9a] font-bold text-xl uppercase tracking-tighter" style={{ fontFamily: "'Manrope', sans-serif" }}>kcal</span>
            </div>
            <div className="mt-6 w-full h-1 bg-[#2e3544] rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-700"
                style={{
                  width: `${Math.min((totalIntake / 2000) * 100, 100)}%`,
                  background: "linear-gradient(135deg, #6bfb9a 0%, #4ade80 100%)",
                }}
              />
            </div>
            <p className="text-[#4ade80] text-[10px] mt-2 font-bold">{Math.round((totalIntake / 2000) * 100)}% of 2000 kcal daily goal</p>
          </div>

          {/* Burned */}
          <div className="bg-[#151b2a] p-4 sm:p-8 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <p className="text-[#a4c9ff] text-xs uppercase tracking-widest mb-4">Burned</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-4xl font-extrabold text-[#dce2f6]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                -{totalBurned}
              </span>
              <span className="text-[#a4c9ff] font-bold text-xl uppercase tracking-tighter" style={{ fontFamily: "'Manrope', sans-serif" }}>kcal</span>
            </div>
            <div className="mt-6 w-full h-1 bg-[#2e3544] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#a4c9ff] transition-all duration-700"
                style={{ width: `${Math.min((totalBurned / 500) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[#a4c9ff] text-[10px] mt-2 font-bold">{exerciseEntries.length} workout{exerciseEntries.length !== 1 ? "s" : ""} logged today</p>
          </div>

          {/* Net Balance */}
          <div className="bg-[#232a39] p-4 sm:p-8 rounded-xl relative overflow-hidden border border-[#6bfb9a]/10">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-[#6bfb9a]">
              <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
            </div>
            <p className="text-[#6bfb9a] text-xs uppercase tracking-widest mb-4">Net Balance</p>
            <div className="flex items-baseline gap-2">
              <span
                className="text-3xl sm:text-5xl font-extrabold"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  color: netBalance > 300 ? "#f87171" : netBalance < 0 ? "#a4c9ff" : "#dce2f6",
                }}
              >
                {netBalance >= 0 ? "+" : ""}{netBalance}
              </span>
              <span className="text-[#6bfb9a] font-bold text-xl uppercase tracking-tighter" style={{ fontFamily: "'Manrope', sans-serif" }}>kcal</span>
            </div>
            <p className="text-[#bccabb] text-sm mt-4">
              {netBalance > 300 ? "⚠️ High surplus — watch intake" : netBalance < 0 ? "✅ Calorie deficit — great burn!" : "✅ Balanced day"}
            </p>
          </div>
        </div>

        {/* Weekly Velocity Chart */}
        <div className="bg-[#151b2a] rounded-xl p-4 sm:p-8 mb-6 sm:mb-10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-xl font-bold text-[#dce2f6]" style={{ fontFamily: "'Manrope', sans-serif" }}>Weekly Velocity</h3>
              <p className="text-[#bccabb] text-sm">Real-time intake vs burn</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#19202e] rounded-full border border-[#3d4a3e]/10">
                <span className="w-2 h-2 rounded-full bg-[#6bfb9a]" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Intake</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-[#19202e] rounded-full border border-[#3d4a3e]/10">
                <span className="w-2 h-2 rounded-full bg-[#a4c9ff]" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Burn</span>
              </div>
            </div>
          </div>
          <div className="relative h-40 sm:h-52 w-full flex items-end justify-between gap-2 sm:gap-4">
            {weekStats.map((day, i) => (
              <div key={i} className={`flex flex-col items-center gap-2 flex-1 ${!day.isToday && day.intake === 0 && day.burned === 0 ? "opacity-30" : ""}`}>
                <div className="w-full flex items-end gap-1 h-full" style={{ height: "100%" }}>
                  <div
                    className="w-1/2 rounded-t-lg transition-all duration-700"
                    style={{
                      height: `${Math.max((day.intake / maxWeekVal) * 100, day.isToday && day.intake === 0 ? 0 : 4)}%`,
                      background: day.isToday ? "linear-gradient(135deg, #6bfb9a 0%, #4ade80 100%)" : "rgba(107,251,154,0.2)",
                    }}
                  />
                  <div
                    className="w-1/2 rounded-t-lg transition-all duration-700"
                    style={{
                      height: `${Math.max((day.burned / maxWeekVal) * 100, day.isToday && day.burned === 0 ? 0 : 4)}%`,
                      background: day.isToday ? "#a4c9ff" : "rgba(164,201,255,0.2)",
                    }}
                  />
                </div>
                <span className={`text-[10px] font-bold ${day.isToday ? "text-[#6bfb9a]" : "text-[#bccabb]"}`}>{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* History Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {/* Food History */}
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-[#dce2f6]" style={{ fontFamily: "'Manrope', sans-serif" }}>Food History</h3>
              <button
                onClick={() => navigate("/food-analysis")}
                className="text-[#6bfb9a] text-xs font-bold uppercase tracking-widest hover:underline"
              >
                + Add
              </button>
            </div>
            <div className="space-y-3">
              {foodEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 bg-[#19202e] rounded-xl gap-3 opacity-60">
                  <span className="material-symbols-outlined text-4xl text-[#4ade80]">no_meals</span>
                  <p className="text-[#bccabb] text-sm font-medium">No meals logged today</p>
                  <button onClick={() => navigate("/food-analysis")} className="text-[#4ade80] text-xs font-bold uppercase tracking-widest border border-[#4ade80]/30 px-4 py-2 rounded-full hover:bg-[#4ade80]/10 transition">
                    Scan Food
                  </button>
                </div>
              ) : (
                foodEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 bg-[#19202e] rounded-xl hover:bg-[#1e2639] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#2e3544] flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-[#6bfb9a] text-lg">
                          {MEAL_ICONS[entry.mealType?.toLowerCase() || "default"] || "restaurant"}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#dce2f6] text-sm leading-tight">{entry.name}</h4>
                        <p className="text-xs text-[#bccabb] capitalize">{entry.mealType || "Meal"}{entry.time ? ` • ${entry.time}` : ""}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-base font-extrabold text-[#dce2f6]" style={{ fontFamily: "'Manrope', sans-serif" }}>{entry.calories}</span>
                      <span className="text-[10px] font-bold text-[#bccabb] uppercase ml-1">kcal</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Exercise Activity */}
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-[#dce2f6]" style={{ fontFamily: "'Manrope', sans-serif" }}>Exercise Activity</h3>
              <button
                onClick={() => navigate("/exercise-tracker")}
                className="text-[#a4c9ff] text-xs font-bold uppercase tracking-widest hover:underline"
              >
                + Log
              </button>
            </div>
            <div className="space-y-3">
              {exerciseEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 bg-[#19202e] rounded-xl gap-3 opacity-60">
                  <span className="material-symbols-outlined text-4xl text-[#a4c9ff]">fitness_center</span>
                  <p className="text-[#bccabb] text-sm font-medium">No workouts logged today</p>
                  <button onClick={() => navigate("/exercise-tracker")} className="text-[#a4c9ff] text-xs font-bold uppercase tracking-widest border border-[#a4c9ff]/30 px-4 py-2 rounded-full hover:bg-[#a4c9ff]/10 transition">
                    Log Exercise
                  </button>
                </div>
              ) : (
                exerciseEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 bg-[#19202e] rounded-xl hover:bg-[#1e2639] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#2e3544] flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-[#a4c9ff] text-lg">
                          {ACTIVITY_ICONS[entry.activity] || "fitness_center"}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#dce2f6] text-sm leading-tight">{entry.activity}</h4>
                        <p className="text-xs text-[#bccabb]">{entry.duration ? `${entry.duration} mins` : "Workout"}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-base font-extrabold text-[#a4c9ff]" style={{ fontFamily: "'Manrope', sans-serif" }}>{entry.calories}</span>
                      <span className="text-[10px] font-bold text-[#bccabb] uppercase ml-1">kcal</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <BottomNav active="stats" />
    </div>
  );
};

export default CalorieDetailBreakdown;
