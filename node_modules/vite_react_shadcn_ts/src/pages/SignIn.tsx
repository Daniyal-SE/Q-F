import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    // Save user details to localStorage as a Registered User
    const userAuth = {
      email,
      username: "Disciplined User",
      role: "user",
    };
    localStorage.setItem("userAuth", JSON.stringify(userAuth));

    // Also populate default profile if not exists
    if (!localStorage.getItem("userProfile")) {
      localStorage.setItem(
        "userProfile",
        JSON.stringify({
          username: userAuth.username,
          avatar: "avatar1",
        })
      );
    }

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

    alert("Signed in successfully! 💪");
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

      <div className="w-full max-w-md bg-[#121A2B] rounded-3xl p-6 sm:p-10 border border-white/5 shadow-2xl relative z-10 space-y-6 animate-in fade-in duration-500">
        
        {/* Back navigation button */}
        <button
          onClick={() => navigate("/auth")}
          className="flex items-center gap-1 text-[#4ade80] hover:opacity-80 transition-opacity text-xs font-bold uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
          Back
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1">
          <h1
            className="font-black tracking-tighter text-2xl sm:text-3xl text-[#dce2f6] uppercase"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            SIGN IN
          </h1>
          <p className="text-[#bccabb] text-xs font-bold uppercase tracking-widest">
            Welcome back to KINETIC
          </p>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="flex items-start gap-3 bg-red-950/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-xs">
            <span className="material-symbols-outlined text-red-400 mt-0.5 shrink-0 text-base">warning</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
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
            Sign In
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-[#94a3b8]">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-[#4ade80] font-bold hover:underline"
            >
              Register Here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
