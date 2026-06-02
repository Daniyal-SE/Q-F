import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "@/components/TopAppBar";

const CravingDefeat = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    reason: "Unknown",
    action: "Unknown",
  });

  useEffect(() => {
    const savedRecords = localStorage.getItem("dailyRecords");
    if (savedRecords) {
      const records = JSON.parse(savedRecords);
      // Find the last craving-resistance record
      const lastRecord = records.reverse().find((r: { precision: string; reason?: string; action?: string }) => r.precision === "craving-resistance");
      if (lastRecord) {
        setStats({
          reason: lastRecord.reason || "Unknown",
          action: lastRecord.action || "Unknown",
        });
      }
    }
  }, []);

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="bg-kinetic-surface text-kinetic-on-surface min-h-screen overflow-hidden flex flex-col">
      <TopAppBar showBack showMenu showAvatar />

      <main className="flex-1 relative flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden pt-12 sm:pt-24">
        {/* Background Orbs for Kinetic Depth */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-kinetic-primary opacity-5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-kinetic-primary-container opacity-5 blur-[100px] rounded-full"></div>

        {/* Success Content Canvas */}
        <div className="relative z-10 w-full max-w-lg text-center">
          {/* Kinetic Badge / Streak Visual */}
          <div className="relative mb-8 sm:mb-12 inline-block">
            {/* Outer Ring */}
            <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full border-4 border-kinetic-surface-container-highest flex items-center justify-center relative">
              {/* Progress Arc */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-kinetic-primary border-l-kinetic-primary rotate-45"></div>

              {/* Center Badge */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-kinetic-surface-container-high flex flex-col items-center justify-center shadow-2xl">
                <span className="font-headline text-3xl sm:text-5xl font-black text-kinetic-primary tracking-tighter">
                  +1
                </span>
                <span className="font-label text-[10px] uppercase tracking-[0.2em] text-kinetic-on-surface-variant mt-1 font-semibold">
                  Streak
                </span>
              </div>
            </div>

            {/* Floating Particle Icons */}
            <div className="absolute -top-4 -right-4 bg-kinetic-secondary-container text-kinetic-on-secondary-container p-3 rounded-2xl shadow-xl">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
            </div>
          </div>

          {/* Typography Cluster */}
          <div className="space-y-3 sm:space-y-4 mb-10 sm:mb-16">
            <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-none">
              Craving{" "}
              <span className="text-kinetic-primary italic">defeated</span>{" "}
              <span className="inline-block animate-bounce">🔥</span>
            </h1>
            <p className="font-body text-kinetic-on-surface-variant text-base sm:text-lg max-w-xs mx-auto opacity-80 leading-relaxed">
              You stayed in control. Keep going. Your focus is becoming your{" "}
              <span className="text-kinetic-on-surface font-semibold">
                momentum
              </span>
              .
            </p>
          </div>

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-10 sm:mb-16">
            <div className="bg-kinetic-surface-container-low p-4 sm:p-6 rounded-xl text-left border-l-4 border-kinetic-primary/20 flex flex-col justify-between">
              <p className="font-label text-[10px] uppercase tracking-widest text-kinetic-on-surface-variant mb-2">
                Resisted Trigger
              </p>
              <p className="font-headline text-lg md:text-xl font-bold text-kinetic-on-surface capitalize">
                {stats.reason}
              </p>
            </div>
            <div className="bg-kinetic-surface-container-low p-4 sm:p-6 rounded-xl text-left border-l-4 border-kinetic-secondary/20 flex flex-col justify-between">
              <p className="font-label text-[10px] uppercase tracking-widest text-kinetic-on-surface-variant mb-2">
                Action Taken
              </p>
              <p className="font-headline text-lg md:text-xl font-bold text-kinetic-on-surface capitalize">
                {stats.action}
              </p>
            </div>
          </div>

          {/* Primary Action */}
          <button
            onClick={handleBackToDashboard}
            className="w-full bg-gradient-to-r from-kinetic-primary to-kinetic-primary-container py-4 sm:py-5 rounded-xl text-kinetic-on-primary font-headline font-bold text-base sm:text-lg shadow-[0_16px_32px_rgba(var(--kinetic-primary)/0.15)] active:scale-95 transition-all hover:shadow-[0_20px_40px_rgba(var(--kinetic-primary)/0.25)]"
          >
            Back to Dashboard
          </button>

          {/* I ATE JUNK Button */}
          <button
            onClick={() => navigate("/food-analysis")}
            className="w-full py-4 rounded-xl border-2 border-secondary/40 text-secondary font-headline font-bold text-sm uppercase tracking-widest hover:bg-secondary/10 active:scale-[0.98] transition-all"
          >
            I ATE JUNK
          </button>
        </div>
      </main>

      {/* Aesthetic Decorative Element */}
      <div className="hidden lg:block fixed right-10 top-1/2 -rotate-90 origin-right translate-y-[-50%] pointer-events-none">
        <span className="font-headline font-black text-7xl text-kinetic-surface-container-highest uppercase opacity-20 tracking-tighter">
          UNSTOPPABLE
        </span>
      </div>

      {/* Bottom padding for mobile */}
      <div className="h-32"></div>
    </div>
  );
};

export default CravingDefeat;
