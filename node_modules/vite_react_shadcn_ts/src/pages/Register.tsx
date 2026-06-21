import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "@/lib/apiUrl";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username || !email || !password) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(getApiUrl("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      // Save user details to localStorage as a Registered User
      const userAuth = {
        email: data.user.email,
        username: data.user.username,
        role: data.user.role,
      };
      localStorage.setItem("userAuth", JSON.stringify(userAuth));

      // Expose default profile
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

      alert("Account registered successfully! Welcome to KINETIC! 🎉");
      navigate("/dashboard");
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Failed to connect to authentication server. Make sure MongoDB and backend are running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      // Simulate registering with social account
      const username = `${provider} User`;
      const email = `user@${provider.toLowerCase()}.com`;
      const userAuth = {
        email,
        username,
        role: "user",
      };
      localStorage.setItem("userAuth", JSON.stringify(userAuth));

      // Expose default profile
      localStorage.setItem(
        "userProfile",
        JSON.stringify({
          username,
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

      setLoading(false);
      alert(`Registered successfully with ${provider}! Welcome to KINETIC! 🎉`);
      navigate("/dashboard");
    }, 1000);
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
            REGISTER
          </h1>
          <p className="text-[#64748b] text-[10px] font-black uppercase tracking-[0.2em]">
            Join the KINETIC system today
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
        <form onSubmit={handleRegister} className="space-y-4">
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
              disabled={loading}
            />
          </div>

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
            {loading ? "Registering..." : "Register Account"}
          </button>
        </form>

        {/* Social Register Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-3 text-[9px] font-black text-[#64748b] tracking-widest uppercase">OR REGISTER WITH</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        {/* Social Register Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSocialRegister("Google")}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/5 bg-[#1b253b] hover:bg-[#25324e] active:scale-95 transition-all text-xs font-bold text-[#dce2f6] cursor-pointer disabled:opacity-50"
          >
            {/* Google Icon (SVG) */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.336 0 3.328 2.673 1.341 6.555l3.925 3.21z"
              />
              <path
                fill="#FBBC05"
                d="M16.04 15.345c-1.077.732-2.436 1.164-4.04 1.164-2.927 0-5.414-1.982-6.295-4.655L1.78 15.064C3.766 18.945 7.774 21.618 12 21.618c3.155 0 6.014-1.127 8.027-3.073l-4.027-3.2z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.273c0-.818-.082-1.609-.218-2.382H12v4.545h6.473a5.554 5.554 0 0 1-2.4 3.636l4.027 3.2C22.445 19.345 23.49 16.118 23.49 12.273z"
              />
              <path
                fill="#34A853"
                d="M5.705 11.855a7.18 7.18 0 0 1 0-2.09L1.78 6.555a12.018 12.018 0 0 0 0 10.909l3.925-3.609z"
              />
            </svg>
            Google
          </button>
          <button
            onClick={() => handleSocialRegister("Facebook")}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/5 bg-[#1b253b] hover:bg-[#25324e] active:scale-95 transition-all text-xs font-bold text-[#dce2f6] cursor-pointer disabled:opacity-50"
          >
            {/* Facebook Icon (SVG) */}
            <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-[#94a3b8]">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-[#4ade80] font-bold hover:underline bg-transparent border-none cursor-pointer"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
