import React from "react";
import { useNavigate } from "react-router-dom";

const FoodAnalysis: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-[#0c1321] text-[#dce2f6] font-inter min-h-screen pb-32"
      style={{
        fontFamily: "'Inter', sans-serif",
      }}
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

      <main className="px-4 sm:px-6 pt-4 sm:pt-8 max-w-2xl mx-auto">
        <section className="mb-10 text-center md:text-left">
          <h2
            className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#dce2f6] mb-2"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Scan Your Meal
          </h2>
          <p className="text-[#bccabb] text-sm sm:text-lg">
            Upload or capture your food to analyze nutrients.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-5 sm:gap-8">
          <div className="relative group">
            <div className="w-full aspect-square md:aspect-video bg-[#151b2a] rounded-xl flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(74,222,128,0.15)] cursor-pointer">
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_-xEzyFOY1TCD_56mMJu3QZp9clLCg_ZD9A0y0PujHMTNx0dsNwFrR1JTIB0k877ZYhhKuntIB_rmKfPnIq-z-wPici05KfkQHDiMuXz1l4rccv3W1VBMo8ZzdszFrYv61uR-ERsTmOoPIoNViM0gmTJNATGECs1Wvf4uaXjh7IeO0WqZlWOUKdXP6qWQIeTH74c4djypyzKwVFydoculqyvDPHzMT1bWuStNONSrajapXORUF8YDvQlHnO386NWpgTWI-VcPE_AF"
                alt="food bowl"
              />
              <div
                className="absolute top-1/2 w-full h-[2px] z-10"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #6bfb9a, transparent)",
                }}
              ></div>
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="flex gap-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#6bfb9a] flex items-center justify-center text-[#003919] shadow-lg shadow-[#6bfb9a]/20 active:scale-90 transition-transform">
                    <span
                      className="material-symbols-outlined text-2xl sm:text-3xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      photo_camera
                    </span>
                  </div>
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-[#4de082] active:scale-90 transition-transform"
                    style={{
                      background: "rgba(46, 53, 68, 0.4)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <span className="material-symbols-outlined text-2xl sm:text-3xl">
                      gallery_thumbnail
                    </span>
                  </div>
                </div>
                <p className="font-medium uppercase tracking-widest text-xs text-[#6dfe9c]">
                  Tap to scan
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-[#232a39] rounded-xl p-4 sm:p-6 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span
                    className="text-[#4ade80] text-xl sm:text-2xl font-bold"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    Avocado Toast
                  </span>
                  <p className="text-[#bccabb] font-medium">
                    Whole Grain / Poached Egg
                  </p>
                </div>
                <div className="bg-[#4ade80]/10 px-3 py-1 rounded-full border border-[#4ade80]/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs text-[#4ade80]">
                    warning
                  </span>
                  <span className="text-[#4ade80] text-[10px] font-bold uppercase tracking-wider">
                    JUNK ALERT
                  </span>
                </div>
              </div>
              <div className="flex items-end gap-2 mt-6">
                <span
                  className="text-2xl sm:text-4xl font-black text-[#6bfb9a]"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  +320
                </span>
                <span className="text-[#bccabb] font-medium mb-1">kcal</span>
              </div>
              <div className="mt-6 flex gap-4">
                <div className="flex-1 bg-[#2e3544]/50 p-3 rounded-lg text-center">
                  <p className="text-[10px] uppercase tracking-widest text-[#bccabb] mb-1">
                    Carbs
                  </p>
                  <p
                    className="font-bold text-[#dce2f6]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    24g
                  </p>
                </div>
                <div className="flex-1 bg-[#2e3544]/50 p-3 rounded-lg text-center">
                  <p className="text-[10px] uppercase tracking-widest text-[#bccabb] mb-1">
                    Protein
                  </p>
                  <p
                    className="font-bold text-[#dce2f6]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    12g
                  </p>
                </div>
                <div className="flex-1 bg-[#2e3544]/50 p-3 rounded-lg text-center">
                  <p className="text-[10px] uppercase tracking-widest text-[#bccabb] mb-1">
                    Fat
                  </p>
                  <p
                    className="font-bold text-[#dce2f6]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    18g
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-[#151b2a] rounded-xl p-5 flex items-center gap-4 hover:bg-[#232a39] transition-colors">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#2e3544]">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDB56t75EXUK6hxr9w-E5kIgUef1M0Pqwf9ebmLCmL9WB49fI77kOpgGlOTzwuc4nVuSAzCimzLopzYG5xd3GcZSPivkKOzkWxa_X3odrTwDzZZCfNYYbSs-c7E-tcAw6nw1x6KQFLcvC9wRcXeP2sQE1nfCIeKA4MyB7DizGJD3oiFcZOLQD9vVdTVsdCH_7mBlMF__kkHmN7Elll-QSGlY7Rgr0JWURpHesSi8YMFr8cblArIIinHNDLnGmBn0sgcYxiYo7_oTlpD"
                    alt="Smoothie"
                  />
                </div>
                <div className="flex-1">
                  <h4
                    className="font-bold text-[#dce2f6]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    Green Smoothie
                  </h4>
                  <p className="text-xs text-[#4de082]">Detected 2 mins ago</p>
                </div>
                <span className="material-symbols-outlined text-[#bccabb]">
                  chevron_right
                </span>
              </div>
              <div className="bg-[#151b2a] rounded-xl p-5 flex items-center gap-4 hover:bg-[#232a39] transition-colors">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#2e3544]">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuByCuiIGS09NeOdRLn3zah4BZD2rIrUifq6JAviLHulmINb6oElG5AQHIo8na3r8t5IZiCS7ibZhkjoP5PMXJw-izNyqumgqx_12QI2lIN7HAwziWZzOmwk2ygIuektxRdikXFYe-wOuyV63MJTMM-2SYPZDxkbpeZqygi7BSeJz4Q1fPl2krrvcWiN6pzhP0-lUXejnbjwzs0MFQo9TbC9jWm7xxHEj6x9wv9imfCyKFwtKY3_Z2LTccOnn3geADHQ0LsM8JjA7Ld4"
                    alt="Salad"
                  />
                </div>
                <div className="flex-1">
                  <h4
                    className="font-bold text-[#dce2f6]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    Greek Salad
                  </h4>
                  <p className="text-xs text-[#4de082]">Detected 15 mins ago</p>
                </div>
                <span className="material-symbols-outlined text-[#bccabb]">
                  chevron_right
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              // Record junk food consumption to localStorage
              const now = new Date();
              const dateStr = now.toISOString().split("T")[0];

              const savedRecords = localStorage.getItem("dailyRecords");
              const records = savedRecords ? JSON.parse(savedRecords) : [];

              records.push({
                date: dateStr,
                completed: false,
                precision: "junk-food",
                duration: 0,
                foodItem: "Avocado Toast",
                calories: 320,
              });

              localStorage.setItem("dailyRecords", JSON.stringify(records));

              // Reset streak
              const streakData = localStorage.getItem("streakData");
              if (streakData) {
                const data = JSON.parse(streakData);
                data.startTime = null;
                data.totalDays = Math.max(0, data.totalDays - 1);
                localStorage.setItem("streakData", JSON.stringify(data));
              }

              // Navigate back to dashboard
              navigate("/dashboard");
            }}
            className="w-full py-5 rounded-xl bg-gradient-to-br from-[#6bfb9a] to-[#4ade80] text-[#003919] font-extrabold text-lg uppercase tracking-widest shadow-lg shadow-[#6bfb9a]/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
          >
            Log Entry & Restart Target
          </button>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-2 sm:px-6 pb-3 sm:pb-8 pt-2 sm:pt-4 bg-[#151b2a]/80 backdrop-blur-xl z-50 rounded-t-[20px] sm:rounded-t-[1.5rem] shadow-[0_-16px_32px_rgba(74,222,128,0.06)]" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <div
          onClick={() => navigate("/dashboard")}
          className="flex flex-col items-center justify-center text-slate-500 py-2 hover:text-[#4ADE80] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined mb-1">timer</span>
          <span className="font-medium text-[10px] uppercase tracking-widest mt-1">
            Focus
          </span>
        </div>
        <div
          onClick={() => navigate("/food-analysis")}
          className="flex flex-col items-center justify-center bg-gradient-to-br from-[#6bfb9a] to-[#4ade80] text-[#0c1321] rounded-[1.5rem] px-5 py-2 active:scale-90 transition-all duration-300 ease-out cursor-pointer"
        >
          <span className="material-symbols-outlined mb-1">install_mobile</span>
          <span className="font-medium text-[10px] uppercase tracking-widest mt-1">
            Scan
          </span>
        </div>
        <div
          onClick={() => navigate("/exercise-tracker")}
          className="flex flex-col items-center justify-center text-slate-500 py-2 hover:text-[#4ADE80] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined mb-1">fitness_center</span>
          <span className="font-medium text-[10px] uppercase tracking-widest mt-1">
            Train
          </span>
        </div>
        <div
          onClick={() => navigate("/calorie-detail-breakdown")}
          className="flex flex-col items-center justify-center text-slate-500 py-2 hover:text-[#4ADE80] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined mb-1">analytics</span>
          <span className="font-medium text-[10px] uppercase tracking-widest mt-1">
            Stats
          </span>
        </div>
      </nav>
    </div>
  );
};

export default FoodAnalysis;
