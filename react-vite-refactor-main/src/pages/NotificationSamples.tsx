import React from "react";
import { useNavigate } from "react-router-dom";

const NotificationSamples = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-kinetic-surface text-kinetic-on-surface antialiased min-h-screen flex flex-col font-body">
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
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdNf0iqNpFbDTjxEYb2W9mrbQ9skJvKTGU2l2DjZCR0G35byFc1UovY57JrBGFLIaVygcX_RtF_7IKe8qIyv5BhYzAP3BNIouAht2MnOPi5soMOZpoWf7VBIpyMLfpDdobQo1qpJtG--9kIhtr4eTlIdQvPsHABW2PUQTB47SAKmikX6GkA6dC9xikBNeeQR1I23wfmdldWiBRBD5TE4bYr4AJaKtOnEITipOw1vnrmxn-qmH9ip20XJwoYxGYVJfVJqwPzgUg4D-S"
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-12 space-y-8 sm:space-y-12">
        {/* Header Section */}
        <section className="space-y-2">
          <span className="text-kinetic-primary font-bold tracking-widest text-xs uppercase">
            System Feedback
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-kinetic-on-surface leading-tight tracking-tighter">
            Status Protocols
          </h1>
          <p className="text-kinetic-on-surface-variant text-base sm:text-lg max-w-md">
            Real-time alerts for the disciplined user. Kinetic precision in
            every interaction.
          </p>
        </section>

        {/* Notification Stack */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Success Notification */}
          <div className="bg-kinetic-surface-container rounded-xl overflow-hidden relative group transition-all duration-300 hover:bg-kinetic-surface-container-high">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-kinetic-primary"></div>
            <div className="p-4 sm:p-6 flex items-start gap-3 sm:gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-kinetic-primary/10 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-kinetic-primary text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black tracking-[0.1em] text-kinetic-primary uppercase">
                    Confirmed
                  </span>
                  <span className="text-[10px] font-medium text-kinetic-on-surface-variant">
                    JUST NOW
                  </span>
                </div>
                <h3 className="text-xl font-bold text-kinetic-on-surface">
                  Streak Extended! Day 8 confirmed.
                </h3>
                <p className="text-kinetic-on-surface-variant text-sm leading-relaxed">
                  Your consistency is building neural pathways for long-term
                  discipline. Maintain the velocity.
                </p>
              </div>
            </div>
          </div>

          {/* Warning Notification */}
          <div className="bg-kinetic-surface-container rounded-xl overflow-hidden relative group transition-all duration-300 hover:bg-kinetic-surface-container-high">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-kinetic-primary-container"></div>
            <div className="p-4 sm:p-6 flex items-start gap-3 sm:gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-kinetic-primary-container/10 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-kinetic-primary-container text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bolt
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black tracking-[0.1em] text-kinetic-primary-container uppercase">
                    Protocol Advisory
                  </span>
                  <span className="text-[10px] font-medium text-kinetic-on-surface-variant">
                    2M AGO
                  </span>
                </div>
                <h3 className="text-xl font-bold text-kinetic-on-surface">
                  Cravings peaking? Try a breathing protocol.
                </h3>
                <p className="text-kinetic-on-surface-variant text-sm leading-relaxed">
                  Biometric data suggests elevated cortisol levels. A 4-7-8
                  breathing sequence is recommended now.
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => navigate("/craving-control")}
                    className="bg-kinetic-surface-container-high text-kinetic-primary-container text-xs font-bold py-2 px-4 rounded-lg uppercase tracking-wider hover:bg-kinetic-surface-container transition-colors"
                  >
                    Start Sequence
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Failure Notification */}
          <div className="bg-kinetic-surface-container rounded-xl overflow-hidden relative group transition-all duration-300 hover:bg-kinetic-surface-container-high">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary"></div>
            <div className="p-4 sm:p-6 flex items-start gap-3 sm:gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-secondary text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  error
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black tracking-[0.1em] text-secondary uppercase">
                    Intervention
                  </span>
                  <span className="text-[10px] font-medium text-kinetic-on-surface-variant">
                    15M AGO
                  </span>
                </div>
                <h3 className="text-xl font-bold text-kinetic-on-surface">
                  Lapse logged. Restarting protocol now.
                </h3>
                <p className="text-kinetic-on-surface-variant text-sm leading-relaxed">
                  Data indicates a deviation from the prescribed nutrient
                  intake. Initiating recovery phase and recalibrating day 9
                  goals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Image Section */}
        <div className="relative w-full h-48 rounded-2xl overflow-hidden mt-12 grayscale opacity-40 mix-blend-luminosity">
          <img
            alt="Digital fitness abstraction"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSgmQd6yNjk2AwUpJXLLijq2dPQUuCqg94Yj0k2yy4AhtegDQGYQXcPVF9mSHGWaHhy7Fh8UjaiQ4bxN9svXXzBSR-vMZTHTSnI2HS3aZjSU-5tlKyY8qQcIVhMqPMx4sA8ujlYuZsX4V70qzasdmie3ckTDkN7m2hNvn6FVrQcYupmC-osYg0VQPkTwB_HPsMNkmIZ3YRwuiGSYfy5ZGcY3-2IPrAFTXc50JXhAznet8bNW0uatvnPVVFIW0jBzLttRgIkeYk1qMm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-kinetic-surface to-transparent"></div>
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-2 sm:px-4 pb-3 sm:pb-6 pt-2 sm:pt-3 bg-kinetic-surface-container/60 backdrop-blur-xl shadow-[0_0_40px_rgba(11,19,38,0.06)] rounded-t-[20px] sm:rounded-t-[24px] z-50" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex flex-col items-center justify-center text-kinetic-on-surface-variant flex-1 px-1 sm:px-5 py-1.5 sm:py-2.5 cursor-pointer hover:text-kinetic-on-surface transition-all"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[24px]">speed</span>
          <span className="font-['Inter'] font-bold text-[7px] sm:text-[10px] tracking-tight sm:tracking-wider uppercase">
            DASHBOARD
          </span>
        </button>
        <button
          onClick={() => navigate("/analytics")}
          className="flex flex-col items-center justify-center text-kinetic-on-surface-variant flex-1 px-1 sm:px-5 py-1.5 sm:py-2.5 cursor-pointer hover:text-kinetic-on-surface transition-all"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[24px]">leaderboard</span>
          <span className="font-['Inter'] font-bold text-[7px] sm:text-[10px] tracking-tight sm:tracking-wider uppercase">
            ANALYTICS
          </span>
        </button>
        <button
          onClick={() => navigate("/history")}
          className="flex flex-col items-center justify-center bg-gradient-to-br from-kinetic-primary to-kinetic-primary-container text-kinetic-on-primary rounded-[18px] sm:rounded-[24px] flex-1 px-1 sm:px-5 py-1.5 sm:py-2.5 cursor-pointer mx-0.5 transition-transform duration-200"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[24px]">history</span>
          <span className="font-['Inter'] font-bold text-[7px] sm:text-[10px] tracking-tight sm:tracking-wider uppercase">
            HISTORY
          </span>
        </button>
        <button
          onClick={() => navigate("/settings")}
          className="flex flex-col items-center justify-center text-kinetic-on-surface-variant flex-1 px-1 sm:px-5 py-1.5 sm:py-2.5 cursor-pointer hover:text-kinetic-on-surface transition-all"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[24px]">settings</span>
          <span className="font-['Inter'] font-bold text-[7px] sm:text-[10px] tracking-tight sm:tracking-wider uppercase">
            SETTINGS
          </span>
        </button>
      </nav>
      {/* Invisible padding for nav */}
      <div className="h-24"></div>
    </div>
  );
};

export default NotificationSamples;
