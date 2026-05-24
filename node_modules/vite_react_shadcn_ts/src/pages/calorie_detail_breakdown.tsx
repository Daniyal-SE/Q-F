import React from "react";
import { useNavigate } from "react-router-dom";

const CalorieDetailBreakdown: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-[#0c1321] text-[#dce2f6] selection:bg-[#6bfb9a] selection:text-[#003919]"
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-24 sm:pb-32">
        {/* Title Section */}
        <div className="mb-10">
          <h2
            className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-[#dce2f6] mb-2"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Daily Breakdown
          </h2>
          <p className="text-[#bccabb] font-medium tracking-wide">
            TUESDAY, OCTOBER 24
          </p>
        </div>

        {/* Big Metrics Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
          {/* Intake */}
          <div className="bg-[#151b2a] p-4 sm:p-8 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span
                className="material-symbols-outlined text-6xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                restaurant
              </span>
            </div>
            <p className="text-[#bccabb] text-xs uppercase tracking-widest mb-4">
              Intake
            </p>
            <div className="flex items-baseline gap-2">
              <span
                className="text-2xl sm:text-4xl font-extrabold text-[#dce2f6]"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                +320
              </span>
              <span
                className="text-[#6bfb9a] font-bold text-xl uppercase tracking-tighter"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                kcal
              </span>
            </div>
            <div className="mt-6 w-full h-1 bg-[#2e3544] rounded-full overflow-hidden">
              <div
                className="h-full w-[65%]"
                style={{
                  background: "linear-gradient(135deg, #6bfb9a 0%, #4ade80 100%)",
                }}
              ></div>
            </div>
          </div>

          {/* Burned */}
          <div className="bg-[#151b2a] p-4 sm:p-8 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span
                className="material-symbols-outlined text-6xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
            </div>
            <p className="text-[#bccabb] text-xs uppercase tracking-widest mb-4 text-[#a4c9ff]">
              -Burned
            </p>
            <div className="flex items-baseline gap-2">
              <span
                className="text-2xl sm:text-4xl font-extrabold text-[#dce2f6]"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                -180
              </span>
              <span
                className="text-[#a4c9ff] font-bold text-xl uppercase tracking-tighter"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                kcal
              </span>
            </div>
            <div className="mt-6 w-full h-1 bg-[#2e3544] rounded-full overflow-hidden">
              <div className="h-full bg-[#a4c9ff] w-[40%]"></div>
            </div>
          </div>

          {/* Net Balance */}
          <div className="bg-[#232a39] p-4 sm:p-8 rounded-xl relative overflow-hidden border border-[#6bfb9a]/10">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-[#6bfb9a]">
              <span
                className="material-symbols-outlined text-6xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                analytics
              </span>
            </div>
            <p className="text-[#6bfb9a] text-xs uppercase tracking-widest mb-4">
              Net Balance
            </p>
            <div className="flex items-baseline gap-2">
              <span
                className="text-3xl sm:text-5xl font-extrabold text-[#dce2f6]"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                +140
              </span>
              <span
                className="text-[#6bfb9a] font-bold text-xl uppercase tracking-tighter"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                kcal
              </span>
            </div>
            <p className="text-[#bccabb] text-sm mt-4">
              Safe surplus for muscle growth
            </p>
          </div>
        </div>

        {/* Trend Chart Section */}
        <div className="bg-[#151b2a] rounded-xl p-4 sm:p-8 mb-6 sm:mb-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h3
                className="text-xl font-bold text-[#dce2f6]"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Weekly Velocity
              </h3>
              <p className="text-[#bccabb] text-sm">
                Consistent daily surplus maintained
              </p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#19202e] rounded-full border border-[#3d4a3e]/10">
                <span className="w-2 h-2 rounded-full bg-[#6bfb9a]"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Intake
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-[#19202e] rounded-full border border-[#3d4a3e]/10">
                <span className="w-2 h-2 rounded-full bg-[#a4c9ff]"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Burn
                </span>
              </div>
            </div>
          </div>

          {/* Asymmetric Trend Visualization */}
          <div className="relative h-40 sm:h-64 w-full flex items-end justify-between gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full flex items-end gap-1 h-full">
                <div className="bg-[#6bfb9a]/20 w-1/2 rounded-t-lg h-[40%]"></div>
                <div className="bg-[#a4c9ff]/20 w-1/2 rounded-t-lg h-[25%]"></div>
              </div>
              <span className="text-[10px] font-bold text-[#bccabb]">MON</span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full flex items-end gap-1 h-full">
                <div
                  className="w-1/2 rounded-t-lg h-[85%] shadow-[0_0_20px_rgba(74,222,128,0.2)]"
                  style={{
                    background:
                      "linear-gradient(135deg, #6bfb9a 0%, #4ade80 100%)",
                  }}
                ></div>
                <div className="bg-[#a4c9ff] w-1/2 rounded-t-lg h-[60%]"></div>
              </div>
              <span className="text-[10px] font-bold text-[#6bfb9a]">TUE</span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1 opacity-40">
              <div className="w-full flex items-end gap-1 h-full">
                <div className="bg-[#2e3544] w-1/2 rounded-t-lg h-[10%]"></div>
                <div className="bg-[#2e3544] w-1/2 rounded-t-lg h-[10%]"></div>
              </div>
              <span className="text-[10px] font-bold text-[#bccabb]">WED</span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1 opacity-40">
              <div className="w-full flex items-end gap-1 h-full">
                <div className="bg-[#2e3544] w-1/2 rounded-t-lg h-[10%]"></div>
                <div className="bg-[#2e3544] w-1/2 rounded-t-lg h-[10%]"></div>
              </div>
              <span className="text-[10px] font-bold text-[#bccabb]">THU</span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1 opacity-40">
              <div className="w-full flex items-end gap-1 h-full">
                <div className="bg-[#2e3544] w-1/2 rounded-t-lg h-[10%]"></div>
                <div className="bg-[#2e3544] w-1/2 rounded-t-lg h-[10%]"></div>
              </div>
              <span className="text-[10px] font-bold text-[#bccabb]">FRI</span>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Food Entries */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3
                className="text-xl font-bold text-[#dce2f6]"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Food History
              </h3>
              <button className="text-[#6bfb9a] text-xs font-bold uppercase tracking-widest hover:underline">
                Add Entry
              </button>
            </div>
            <div className="space-y-4">
              {/* Entry Card */}
              <div className="flex items-center justify-between p-5 bg-[#19202e] rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#2e3544] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#6bfb9a]">
                      lunch_dining
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#dce2f6]">
                      Avocado Toast &amp; Egg
                    </h4>
                    <p className="text-xs text-[#bccabb]">
                      Breakfast • 08:30 AM
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="text-lg font-extrabold text-[#dce2f6]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    420
                  </span>
                  <span className="text-[10px] font-bold text-[#bccabb] uppercase ml-1">
                    kcal
                  </span>
                </div>
              </div>
              {/* Entry Card */}
              <div className="flex items-center justify-between p-5 bg-[#19202e] rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#2e3544] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#6bfb9a]">
                      coffee
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#dce2f6]">Flat White</h4>
                    <p className="text-xs text-[#bccabb]">
                      Mid-Morning • 10:15 AM
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="text-lg font-extrabold text-[#dce2f6]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    110
                  </span>
                  <span className="text-[10px] font-bold text-[#bccabb] uppercase ml-1">
                    kcal
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Exercise Entries */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3
                className="text-xl font-bold text-[#dce2f6]"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Exercise Activity
              </h3>
              <button className="text-[#a4c9ff] text-xs font-bold uppercase tracking-widest hover:underline">
                Log Workout
              </button>
            </div>
            <div className="space-y-4">
              {/* Exercise Card */}
              <div className="flex items-center justify-between p-5 bg-[#19202e] rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#2e3544] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#a4c9ff]">
                      fitness_center
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#dce2f6]">
                      Hypertrophy Chest
                    </h4>
                    <p className="text-xs text-[#bccabb]">
                      Strength • 45 mins
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="text-lg font-extrabold text-[#a4c9ff]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    280
                  </span>
                  <span className="text-[10px] font-bold text-[#bccabb] uppercase ml-1">
                    kcal
                  </span>
                </div>
              </div>
              {/* Exercise Card */}
              <div className="flex items-center justify-between p-5 bg-[#19202e] rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#2e3544] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#a4c9ff]">
                      directions_run
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#dce2f6]">
                      Daily Commute Walk
                    </h4>
                    <p className="text-xs text-[#bccabb]">
                      Cardio • 15 mins
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="text-lg font-extrabold text-[#a4c9ff]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    65
                  </span>
                  <span className="text-[10px] font-bold text-[#bccabb] uppercase ml-1">
                    kcal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar */}
      <nav
        className="fixed bottom-0 left-0 w-full flex justify-around items-center px-2 sm:px-6 pb-3 sm:pb-8 pt-2 sm:pt-4 bg-[#151b2a]/80 backdrop-blur-xl z-50 rounded-t-[20px] sm:rounded-t-[1.5rem] shadow-[0_-16px_32px_rgba(74,222,128,0.06)]"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div
          onClick={() => navigate("/dashboard")}
          className="flex flex-col items-center justify-center text-slate-500 py-2 hover:text-[#4ADE80] transition-colors active:scale-90 duration-300 cursor-pointer"
        >
          <span className="material-symbols-outlined mb-1">timer</span>
          <span className="font-medium text-[10px] uppercase tracking-widest">
            Focus
          </span>
        </div>
        <div
          onClick={() => navigate("/food-analysis")}
          className="flex flex-col items-center justify-center text-slate-500 py-2 hover:text-[#4ADE80] transition-colors active:scale-90 duration-300 cursor-pointer"
        >
          <span className="material-symbols-outlined mb-1">install_mobile</span>
          <span className="font-medium text-[10px] uppercase tracking-widest">
            Scan
          </span>
        </div>
        <div
          onClick={() => navigate("/exercise-tracker")}
          className="flex flex-col items-center justify-center text-slate-500 py-2 hover:text-[#4ADE80] transition-colors active:scale-90 duration-300 cursor-pointer"
        >
          <span className="material-symbols-outlined mb-1">fitness_center</span>
          <span className="font-medium text-[10px] uppercase tracking-widest">
            Train
          </span>
        </div>
        <div
          onClick={() => navigate("/calorie-detail-breakdown")}
          className="flex flex-col items-center justify-center bg-gradient-to-br from-[#6bfb9a] to-[#4ade80] text-[#0c1321] rounded-[1.5rem] px-5 py-2 active:scale-90 transition-all duration-300 cursor-pointer"
        >
          <span className="material-symbols-outlined mb-1">analytics</span>
          <span className="font-medium text-[10px] uppercase tracking-widest">
            Stats
          </span>
        </div>
      </nav>
    </div>
  );
};

export default CalorieDetailBreakdown;
