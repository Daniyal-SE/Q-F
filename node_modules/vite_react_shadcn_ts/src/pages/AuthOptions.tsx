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
    navigate("/dashboard");
  };

  return (
    <div
      className="bg-[#0c1321] text-[#dce2f6] min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Visual background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4ade80]/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3B82F6]/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-md bg-[#121A2B] rounded-3xl p-6 sm:p-10 border border-white/5 shadow-2xl relative z-10 space-y-8 animate-in fade-in duration-500">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <h1
            className="font-black tracking-tighter text-3xl sm:text-4xl text-[#4ade80] uppercase"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            KINETIC
          </h1>
          <p className="text-[#bccabb] text-xs font-bold uppercase tracking-widest">
            Discipline & Nutrition Catalyst
          </p>
        </div>

        {/* Options CTAs */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/signin")}
            className="w-full py-4.5 rounded-xl bg-gradient-to-r from-[#6bfb9a] to-[#4ade80] text-[#003919] font-black text-sm uppercase tracking-widest shadow-lg shadow-[#4ade80]/10 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">login</span>
            Sign In
          </button>

          <button
            onClick={() => navigate("/register")}
            className="w-full py-4.5 rounded-xl border-2 border-[#4ade80]/50 hover:bg-[#4ade80]/5 text-[#4ade80] font-black text-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Create Account
          </button>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-[10px] font-black text-[#94a3b8] tracking-widest uppercase">OR</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        {/* Guest Mode Action */}
        <div className="text-center space-y-4">
          <button
            onClick={handleGuestMode}
            className="w-full py-4.5 rounded-xl bg-[#1d263b] hover:bg-[#25324e] border border-white/5 text-[#dce2f6] font-bold text-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg text-[#94a3b8]">explore</span>
            Continue as Guest
          </button>
          <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">
            *Guest users can view statistics history, customize guest accounts, and capture up to **1 food image** scan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthOptions;
