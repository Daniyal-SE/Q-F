import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { localSignIn } from "@/lib/localAuth";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setLoading(true);

    // Small delay for UX feedback
    setTimeout(() => {
      const { error, user } = localSignIn(email.trim(), password);

      if (error || !user) {
        setErrorMsg(error || "Invalid credentials.");
        setLoading(false);
        return;
      }

      // Save user session to localStorage
      const userAuth = {
        email: user.email,
        username: user.username,
        role: user.role,
      };
      localStorage.setItem("userAuth", JSON.stringify(userAuth));

      // Populate default profile if not exists
      if (!localStorage.getItem("userProfile")) {
        localStorage.setItem(
          "userProfile",
          JSON.stringify({
            username: user.username,
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

      setLoading(false);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }, 500);
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

        {/* Back navigation button */}
        <button
          onClick={() => navigate("/auth")}
          className="flex items-center gap-1 text-[#4ade80] hover:opacity-80 transition-opacity text-xs font-bold uppercase tracking-wider bg-transparent border-none cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
          Back
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <h1
            className="font-black tracking-tighter text-4xl text-[#00FF87] uppercase text-neon-glow"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            SIGN IN
          </h1>
          <p className="text-[#64748b] text-[10px] font-black uppercase tracking-[0.2em]">
            Welcome back to KINETIC
          </p>
        </div>

        {/* Separator line */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

        {/* Error Banner */}
        {errorMsg && (
          <div className="flex items-start gap-3 bg-red-950/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-xs">
            <span className="material-symbols-outlined text-red-400 mt-0.5 shrink-0 text-base">warning</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSignIn} className="space-y-5">
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6bfb9a] to-[#4ade80] text-[#003919] font-black text-xs uppercase tracking-widest shadow-lg shadow-[#4ade80]/10 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-[#94a3b8]">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-[#4ade80] font-bold hover:underline bg-transparent border-none cursor-pointer"
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
