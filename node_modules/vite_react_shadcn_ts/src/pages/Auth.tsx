import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password || (activeTab === "register" && !username)) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    // Save user details to localStorage as a Registered User
    const userAuth = {
      email,
      username: activeTab === "register" ? username : "Disciplined User",
      role: "user",
    };
    localStorage.setItem("userAuth", JSON.stringify(userAuth));

    // Also populate default profile
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        username: userAuth.username,
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

    alert(
      activeTab === "register"
        ? "Account registered successfully! Welcome to KINETIC! 🎉"
        : "Signed in successfully! 💪"
    );
    navigate("/dashboard");
  };

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

        {/* Dynamic Glassmorphic Tab Bar */}
        <div className="bg-[#1b253b] p-1 rounded-xl flex gap-1 border border-white/5">
          <button
            onClick={() => { setActiveTab("signin"); setErrorMsg(""); }}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
              activeTab === "signin"
                ? "bg-[#4ade80] text-[#003919] shadow-lg shadow-[#4ade80]/10"
                : "text-[#94a3b8] hover:text-[#dce2f6]"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab("register"); setErrorMsg(""); }}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
              activeTab === "register"
                ? "bg-[#4ade80] text-[#003919] shadow-lg shadow-[#4ade80]/10"
                : "text-[#94a3b8] hover:text-[#dce2f6]"
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="flex items-start gap-3 bg-red-950/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-xs">
            <span className="material-symbols-outlined text-red-400 mt-0.5 shrink-0 text-base">warning</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleAuth} className="space-y-5">
          {activeTab === "register" && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] block">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-[#1b253b] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-[#dce2f6] placeholder-slate-500 focus:outline-none focus:border-[#4ade80] transition-colors"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-[#1b253b] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-[#dce2f6] placeholder-slate-500 focus:outline-none focus:border-[#4ade80] transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1b253b] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-[#dce2f6] placeholder-slate-500 focus:outline-none focus:border-[#4ade80] transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#6bfb9a] to-[#4ade80] text-[#003919] font-black text-sm uppercase tracking-widest shadow-lg shadow-[#4ade80]/10 hover:scale-[1.01] active:scale-95 transition-all pt-4 block"
          >
            {activeTab === "signin" ? "Sign In" : "Register Account"}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-[10px] font-black text-[#94a3b8] tracking-widest uppercase">OR</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        {/* Guest Mode Action */}
        <div className="text-center space-y-4">
          <button
            onClick={handleGuestMode}
            className="w-full py-4 rounded-xl border border-[#4ade80]/30 hover:bg-[#4ade80]/5 text-[#4ade80] font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
          >
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

export default Auth;
