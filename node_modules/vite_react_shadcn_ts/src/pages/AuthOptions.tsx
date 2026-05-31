import React from "react";
import { useNavigate } from "react-router-dom";

const AuthOptions: React.FC = () => {
  const navigate = useNavigate();

  const handleGuestMode = () => {
    // Save guest profile
    const guestAuth = {
      email: "guest@kinetic.app",
      username: "Guest Coach",
      role: "guest",
    };
    localStorage.setItem("userAuth", JSON.stringify(guestAuth));

    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        username: guestAuth.username,
        avatar: "avatar1",
      })
    );

    // Initial streak data if not started
    if (!localStorage.getItem("streakData")) {
      localStorage.setItem(
        "streakData",
        JSON.stringify({
          startTime: null,
          elapsedTime: 0,
          totalDays: 0,
          precision: null,
          customPrecision: "",
          plan: "student",
          notificationSent: false,
          preNotificationSent: false,
        })
      );
    }

    alert("Welcome! You are browsing in Guest Mode. ⚡");
    navigate("/ai-food-scanner");
  };

  return (
    <div
      className="bg-[#050b14] text-[#dce2f6] min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden grid-bg"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        .grid-bg {
          background-image: 
            linear-gradient(rgba(74, 222, 128, 0.04) 1.5px, transparent 1.5px),
            linear-gradient(90deg, rgba(74, 222, 128, 0.04) 1.5px, transparent 1.5px);
          background-size: 32px 32px;
        }
        @keyframes borderPulse {
          0%, 100% {
            border-color: rgba(74, 222, 128, 0.15);
            box-shadow: 0 0 15px rgba(74, 222, 128, 0.05);
          }
          50% {
            border-color: rgba(74, 222, 128, 0.55);
            box-shadow: 0 0 25px rgba(74, 222, 128, 0.25);
          }
        }
        .animated-box-border {
          animation: borderPulse 4s ease-in-out infinite;
        }
        .text-neon-glow {
          text-shadow: 0 0 12px rgba(74, 222, 128, 0.5);
        }
      `}</style>

      {/* Visual background glows */}
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-[#4ade80]/3 blur-[140px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-sm bg-[#0e1622] rounded-[24px] p-6 sm:p-8 border border-white/5 shadow-2xl relative z-10 space-y-6 sm:space-y-8 animate-in fade-in duration-500 animated-box-border">

        {/* Brand Header */}
        <div className="text-center space-y-2 mt-2">
          <h1
            className="font-black tracking-tighter text-4xl text-[#00FF87] uppercase text-neon-glow"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            KINETIC
          </h1>
          <p className="text-[#64748b] text-[10px] font-black uppercase tracking-[0.2em]">
            Discipline & Nutrition Catalyst
          </p>
        </div>

        {/* Separator line */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

        {/* Options CTAs */}
        <div className="space-y-3.5">
          <button
            onClick={() => navigate("/signin")}
            className="w-full py-3.5 rounded-xl bg-[#131b2e] border border-slate-800 hover:border-slate-700 text-white font-bold text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">login</span>
            Sign In
          </button>

          <button
            onClick={() => navigate("/register")}
            className="w-full py-3.5 rounded-xl bg-[#131b2e] border border-slate-800 hover:border-slate-700 text-white font-bold text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">person</span>
            Create Account
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800/60"></div>
          <span className="flex-shrink mx-4 text-[9px] font-black text-slate-500 tracking-widest uppercase">OR</span>
          <div className="flex-grow border-t border-slate-800/60"></div>
        </div>

        {/* Guest Mode Action */}
        <div className="text-center space-y-5 pb-2">
          <button
            onClick={handleGuestMode}
            className="w-full py-3.5 rounded-xl bg-[#131b2e] border border-slate-800 hover:border-slate-700 text-white font-bold text-xs tracking-wide active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-slate-400">explore</span>
            Continue as Guest
          </button>

          <p className="text-[10px] text-slate-500 max-w-[280px] mx-auto leading-relaxed font-semibold">
            *Guest users can view statistics history, customize guest accounts, and capture up to <span className="text-[#00FF87] font-bold">+1 food image</span> scan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthOptions;
