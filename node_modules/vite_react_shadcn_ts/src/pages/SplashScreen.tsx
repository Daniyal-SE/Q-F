import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    const timer = setTimeout(() => navigate("/onboarding/gender"), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center bg-kinetic-surface overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div
          className="animate-splash-glow w-[600px] h-[600px] rounded-full opacity-60"
          style={{
            filter: "blur(80px)",
            background:
              "radial-gradient(circle, hsla(var(--kinetic-primary) / 0.15) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-8 mb-16">
          <div className="relative group">
            <div className="absolute -inset-6 bg-kinetic-primary/20 blur-2xl rounded-full opacity-30 animate-splash-glow" />
            <div
              className={`relative flex items-center justify-center w-24 h-24 rounded-3xl bg-kinetic-surface-container-highest shadow-2xl border border-kinetic-outline-variant/10 ${loaded ? "animate-splash-logo" : "opacity-0"}`}
            >
              <span className="material-symbols-outlined text-6xl text-kinetic-primary material-filled">
                bolt
              </span>
            </div>
          </div>
          <h1
            className={`font-headline font-black text-5xl md:text-6xl tracking-[0.2em] text-kinetic-on-surface uppercase ${loaded ? "animate-splash-text" : "opacity-0"}`}
          >
            KINETIC
          </h1>
        </div>

        {/* Tagline */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-sm">
          <p
            className={`font-headline font-medium text-lg md:text-xl text-kinetic-on-surface tracking-tight ${loaded ? "animate-splash-tagline" : "opacity-0"}`}
          >
            Control your cravings.{" "}
            <span className="text-kinetic-primary">Control your life.</span>
          </p>
          {/* Loading Bar */}
          <div className="flex items-center gap-2 mt-8">
            <div className="h-1 w-12 rounded-full bg-kinetic-primary/20 overflow-hidden">
              <div
                className={`h-full bg-kinetic-primary rounded-full ${loaded ? "animate-splash-loader" : "w-0"}`}
              />
            </div>
          </div>
        </div>

        {/* Bottom Brand */}
        <div
          className={`absolute bottom-12 flex flex-col items-center gap-6 ${loaded ? "animate-splash-bottom" : "opacity-0"}`}
        >
          <p className="font-label text-[10px] tracking-[0.3em] text-kinetic-on-surface-variant uppercase">
            The Disciplined Pulse
          </p>
        </div>
      </div>
    </main>
  );
};

export default SplashScreen;
