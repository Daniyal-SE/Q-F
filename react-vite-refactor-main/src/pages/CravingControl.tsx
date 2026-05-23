import React from "react";
import { useNavigate } from "react-router-dom";

const CravingControl = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-kinetic-surface text-kinetic-on-surface font-body overflow-x-hidden">
      <style>{`
        .breathing-circle {
          animation: breathe 8s ease-in-out infinite;
        }
        @keyframes breathe {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>

      {/* TopAppBar */}
      <header className="w-full top-0 z-50 sticky bg-[#0c1321] flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="hover:opacity-80 transition-opacity flex items-center justify-center p-1 rounded-full cursor-pointer text-[#4ade80]"
          >
            <span className="material-symbols-outlined text-xl sm:text-2xl font-bold">
              arrow_back
            </span>
          </button>
          
          <h1
            className="font-black tracking-tighter text-lg sm:text-2xl text-[#4ade80] uppercase"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            KINETIC
          </h1>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#3d4a3e] hover:opacity-80 transition-opacity cursor-pointer">
          <img
            alt="User profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuZvZrO6Upr-jcoracNvMQMkdStsNWp8fXFjNbpkYPXbLZ9v-CHmw0Brx9vsUGucKf2lxC8eZpasrXrt-uMEI2qd-5IznVk-eX0k_oQwdP188mpSIRzeLoov8kg2fCbMvtTYH01GT4KWqo6nQi5_x-vyFimMRxGrhga2BzUOiTeAispP5g0f4XCR-WYOwixxsFeeTCDsajeZcNgcvGYl6HABaL7KJ-62yvpE86NodF7M-50p6t2etVpj-BVM--_FZkLUHzq7T1M3T_"
          />
        </div>
      </header>

      <main className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center px-4 sm:px-6 pb-24 sm:pb-32 pt-6 sm:pt-10">
        {/* Focused Breathing Section */}
        <section className="flex flex-col items-center text-center max-w-md w-full">
          <div className="relative w-48 h-48 sm:w-72 sm:h-72 flex items-center justify-center mb-10 sm:mb-16 mt-4 sm:mt-8">
            {/* Outer Glow */}
            <div className="breathing-circle absolute inset-0 rounded-full bg-gradient-to-br from-kinetic-primary-container/20 to-kinetic-primary/20 blur-3xl"></div>

            {/* Main Breathing Ring */}
            <div className="breathing-circle absolute inset-4 rounded-full border-[8px] sm:border-[12px] border-kinetic-primary shadow-[0_0_40px_rgba(75,226,119,0.3)] flex items-center justify-center bg-kinetic-surface-container/40 backdrop-blur-md">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-kinetic-primary-container/30 to-kinetic-primary/30"></div>
            </div>

            {/* Inner Core */}
            <div className="absolute inset-14 sm:inset-20 rounded-full bg-kinetic-surface-container flex items-center justify-center border border-kinetic-outline-variant/20 shadow-inner z-10">
              <span
                className="material-symbols-outlined text-kinetic-primary text-2xl sm:text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                air
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-kinetic-on-surface mb-3 sm:mb-4 tracking-tight leading-tight">
            Breathe. Stay in control.
          </h1>
          <p className="text-kinetic-on-surface-variant text-sm sm:text-base md:text-lg max-w-[280px] mb-8 sm:mb-12">
            The feeling will pass. Focus on the expansion of your lungs.
          </p>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full relative z-20">
            {/* Action Card 1 */}
            <button className="flex flex-col items-start p-4 sm:p-6 bg-kinetic-surface-container rounded-xl transition-all hover:bg-kinetic-surface-container-high active:scale-95 text-left group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-kinetic-primary-container/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-kinetic-primary-container/20 transition-colors">
                <span className="material-symbols-outlined text-kinetic-primary-container">
                  water_drop
                </span>
              </div>
              <span className="text-[10px] font-bold tracking-wider text-kinetic-on-surface-variant uppercase mb-1">
                CRAVING CRUSHER
              </span>
              <span className="text-base sm:text-lg font-bold text-kinetic-on-surface">
                Drink water
              </span>
            </button>

            {/* Action Card 2 */}
            <button className="flex flex-col items-start p-4 sm:p-6 bg-kinetic-surface-container rounded-xl transition-all hover:bg-kinetic-surface-container-high active:scale-95 text-left group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-kinetic-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-kinetic-primary/20 transition-colors">
                <span className="material-symbols-outlined text-kinetic-primary">
                  directions_walk
                </span>
              </div>
              <span className="text-[10px] font-bold tracking-wider text-kinetic-on-surface-variant uppercase mb-1">
                MIND SHIFT
              </span>
              <span className="text-base sm:text-lg font-bold text-kinetic-on-surface">
                Take a walk
              </span>
            </button>
          </div>

          <button className="mt-8 text-kinetic-on-surface-variant font-medium text-sm hover:text-kinetic-on-surface transition-colors py-2 px-4 relative z-20">
            I need something else
          </button>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-2 sm:px-4 pb-3 sm:pb-6 pt-2 sm:pt-3 bg-kinetic-surface-container/60 backdrop-blur-xl z-50 rounded-t-[20px] sm:rounded-t-[24px] shadow-[0_0_40px_rgba(11,19,38,0.06)]" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        {/* DASHBOARD */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex flex-col items-center justify-center text-kinetic-on-surface-variant flex-1 px-1 sm:px-5 py-1.5 sm:py-2.5 hover:text-kinetic-on-surface transition-all"
        >
          <span className="material-symbols-outlined mb-0.5 text-[18px] sm:text-[24px]">speed</span>
          <span className="font-['Inter'] font-bold text-[7px] sm:text-[10px] tracking-tight sm:tracking-wider uppercase">
            DASHBOARD
          </span>
        </button>
        {/* ANALYTICS */}
        <button
          onClick={() => navigate("/analytics")}
          className="flex flex-col items-center justify-center text-kinetic-on-surface-variant flex-1 px-1 sm:px-5 py-1.5 sm:py-2.5 hover:text-kinetic-on-surface transition-all"
        >
          <span className="material-symbols-outlined mb-0.5 text-[18px] sm:text-[24px]">leaderboard</span>
          <span className="font-['Inter'] font-bold text-[7px] sm:text-[10px] tracking-tight sm:tracking-wider uppercase">
            ANALYTICS
          </span>
        </button>
        {/* BREATHING ROOM (ACTIVE) */}
        <button
          onClick={() => navigate("/craving-control")}
          className="flex flex-col items-center justify-center bg-gradient-to-br from-kinetic-primary to-kinetic-primary-container text-kinetic-on-primary rounded-[18px] sm:rounded-[24px] flex-1 px-1 sm:px-5 py-1.5 sm:py-2.5 mx-0.5"
        >
          <span
            className="material-symbols-outlined mb-1"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            air
          </span>
          <span className="font-['Inter'] font-bold text-[7px] sm:text-[10px] tracking-tight sm:tracking-wider uppercase">
            BREATHE
          </span>
        </button>
        {/* HISTORY */}
        <button
          onClick={() => navigate("/history")}
          className="flex flex-col items-center justify-center text-kinetic-on-surface-variant flex-1 px-1 sm:px-5 py-1.5 sm:py-2.5 hover:text-kinetic-on-surface transition-all"
        >
          <span className="material-symbols-outlined mb-0.5 text-[18px] sm:text-[24px]">history</span>
          <span className="font-['Inter'] font-bold text-[7px] sm:text-[10px] tracking-tight sm:tracking-wider uppercase">
            HISTORY
          </span>
        </button>
        {/* SETTINGS */}
        <button
          onClick={() => navigate("/settings")}
          className="flex flex-col items-center justify-center text-kinetic-on-surface-variant flex-1 px-1 sm:px-5 py-1.5 sm:py-2.5 hover:text-kinetic-on-surface transition-all"
        >
          <span className="material-symbols-outlined mb-0.5 text-[18px] sm:text-[24px]">settings</span>
          <span className="font-['Inter'] font-bold text-[7px] sm:text-[10px] tracking-tight sm:tracking-wider uppercase">
            SETTINGS
          </span>
        </button>
      </nav>
    </div>
  );
};

export default CravingControl;
