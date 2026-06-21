import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  date: string;
  images?: string[];
}

const FoodHistory: React.FC = () => {
  const navigate = useNavigate();
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);

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

  useEffect(() => {
    // Load all food entries (do not filter by date only, show entire history)
    const rawFood = localStorage.getItem("foodEntries");
    const allFood: FoodEntry[] = rawFood ? JSON.parse(rawFood) : [];
    
    // Sort food entries by date descending (newest first)
    const sortedFood = allFood.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    setFoodEntries(sortedFood);
  }, []);

  const handleDeleteEntry = (id: string) => {
    if (window.confirm("Are you sure you want to delete this food log from your history? 🗑️")) {
      const rawFood = localStorage.getItem("foodEntries");
      const allFood: FoodEntry[] = rawFood ? JSON.parse(rawFood) : [];
      const updated = allFood.filter((entry) => entry.id !== id);
      localStorage.setItem("foodEntries", JSON.stringify(updated));
      setFoodEntries(updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  };

  const getFormattedDayAndDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.toLocaleDateString("en-US", { weekday: "long" });
      const formatted = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return { day, dateStr: formatted };
    } catch (e) {
      return { day: "Unknown Day", dateStr: "Invalid Date" };
    }
  };

  const getFormattedTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });
    } catch (e) {
      return "";
    }
  };

  return (
    <div
      className="bg-[#0c1321] text-[#dce2f6] min-h-screen selection:bg-[#6bfb9a] selection:text-[#003919]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <header className="w-full top-0 z-50 sticky bg-[#0c1321]/90 backdrop-blur-md flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 text-[#4ade80] hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer"
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
        <button
          onClick={() => navigate("/ai-food-scanner")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4ade80]/15 hover:bg-[#4ade80]/25 text-[#4ade80] text-xs font-bold uppercase tracking-wider border border-[#4ade80]/20 cursor-pointer active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-base">photo_camera</span>
          Scan Meal
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 pb-28 sm:pb-36">
        {/* Title */}
        <div className="mb-6">
          <h2
            className="text-3xl font-extrabold tracking-tight text-[#dce2f6]"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Food History
          </h2>
          <p className="text-[#bccabb] text-sm mt-1">
            Browse and manage all your logged meal logs and macro details
          </p>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {foodEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-[#121a2b] rounded-2xl border border-white/5 gap-4">
              <div className="w-16 h-16 bg-[#4ade80]/10 rounded-full flex items-center justify-center text-[#4ade80]">
                <span className="material-symbols-outlined text-3xl">no_meals</span>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[#dce2f6] font-bold text-lg">No Food Logged Yet</p>
                <p className="text-[#64748b] text-xs max-w-xs px-4">
                  Capture food images using our AI scanner to automatically track your intake and macros.
                </p>
              </div>
              <button
                onClick={() => navigate("/ai-food-scanner")}
                className="mt-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#6bfb9a] to-[#4ade80] text-[#003919] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#4ade80]/10 active:scale-95 cursor-pointer transition-transform"
              >
                Scan A Meal
              </button>
            </div>
          ) : (
            foodEntries.map((entry) => {
              const { day, dateStr } = getFormattedDayAndDate(entry.date);
              const logTime = getFormattedTime(entry.date);
              const hasImage = entry.images && entry.images.length > 0;

              return (
                <div
                  key={entry.id}
                  className="bg-[#121a2b] border border-white/5 hover:border-white/10 transition-all p-4 rounded-xl flex items-start gap-4 relative"
                >
                  {/* Food Image Container */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-[#1a2336] border border-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                    {hasImage ? (
                      <img
                        src={entry.images![0]}
                        alt={entry.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-3xl text-slate-500">restaurant</span>
                    )}
                  </div>

                  {/* Meal Content Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-extrabold text-[#dce2f6] text-sm sm:text-base truncate uppercase tracking-wide">
                        {entry.name}
                      </h4>
                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-1 text-[#64748b] hover:text-red-400 bg-transparent border-none cursor-pointer transition-colors"
                        title="Delete log"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#bccabb] mt-0.5 font-medium">
                      <span className="text-[#4ade80] font-bold">{day}</span>
                      <span className="text-slate-600">•</span>
                      <span>{dateStr}</span>
                      {logTime && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span>{logTime}</span>
                        </>
                      )}
                    </div>

                    {/* Nutrition Macros Grid */}
                    <div className="mt-3.5 grid grid-cols-4 gap-1.5 sm:gap-2">
                      <div className="bg-[#192235] p-2 rounded-lg text-center flex flex-col justify-center">
                        <span className="text-[10px] uppercase font-black text-rose-400 tracking-wider">Cals</span>
                        <span className="font-extrabold text-[#dce2f6] text-xs sm:text-sm mt-0.5">
                          {entry.calories}
                        </span>
                      </div>
                      <div className="bg-[#192235] p-2 rounded-lg text-center flex flex-col justify-center">
                        <span className="text-[10px] uppercase font-black text-emerald-400 tracking-wider">Prot</span>
                        <span className="font-extrabold text-[#dce2f6] text-xs sm:text-sm mt-0.5">
                          {entry.protein || 0}g
                        </span>
                      </div>
                      <div className="bg-[#192235] p-2 rounded-lg text-center flex flex-col justify-center">
                        <span className="text-[10px] uppercase font-black text-amber-400 tracking-wider">Fat</span>
                        <span className="font-extrabold text-[#dce2f6] text-xs sm:text-sm mt-0.5">
                          {entry.fat || 0}g
                        </span>
                      </div>
                      <div className="bg-[#192235] p-2 rounded-lg text-center flex flex-col justify-center">
                        <span className="text-[10px] uppercase font-black text-sky-400 tracking-wider">Carb</span>
                        <span className="font-extrabold text-[#dce2f6] text-xs sm:text-sm mt-0.5">
                          {entry.carbs || 0}g
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <BottomNav active="stats" />
    </div>
  );
};

export default FoodHistory;
