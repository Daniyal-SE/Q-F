import { useNavigate } from "react-router-dom";
import BackgroundGlow from "@/components/BackgroundGlow";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-kinetic-surface text-kinetic-on-surface min-h-screen flex flex-col overflow-x-hidden">
      <header className="w-full top-0 z-50 sticky bg-[#0c1321] flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="hover:opacity-80 transition-opacity flex items-center justify-center p-1 rounded-full cursor-pointer text-[#4ade80]"
          >
            <span className="material-symbols-outlined text-2xl font-bold">
              arrow_back
            </span>
          </button>
          
          <h1
            className="font-black tracking-tighter text-2xl text-[#4ade80] uppercase"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            KINETIC
          </h1>
        </div>
        <span className="material-symbols-outlined hover:text-[#4ade80] text-xl transition-colors cursor-pointer text-[#dce2f6]">
          help
        </span>
      </header>

      <main className="flex-1 flex flex-col relative">
        {/* Hero */}
        <div className="w-full pt-16 pb-20 overflow-hidden bg-gradient-to-b from-kinetic-surface-container to-kinetic-surface">
          <div className="px-6 md:px-12 max-w-xl">
            <span className="text-kinetic-primary font-black tracking-widest text-xs uppercase bg-kinetic-primary/10 px-3 py-1 rounded-full w-fit inline-block mb-3">
              SYSTEM READY
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-kinetic-on-surface tracking-tighter leading-[0.9]">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-kinetic-primary to-kinetic-primary-container">
                Kinetic
              </span>
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 md:px-12 pb-12 -mt-6 relative z-20 bg-kinetic-surface rounded-t-[32px]">
          <div className="max-w-xl mt-12 space-y-8">
            <p className="text-kinetic-on-surface-variant text-lg md:text-xl leading-relaxed font-medium">
              Master your habits with editorial precision. Our AI-driven engine
              tracks your nutrition and movement, turning raw data into a
              disciplined lifestyle.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-kinetic-surface-container-low p-5 rounded-xl flex items-start gap-4 border-l-4 border-kinetic-primary">
                <span className="material-symbols-outlined text-kinetic-primary">
                  bolt
                </span>
                <div>
                  <p className="text-kinetic-on-surface font-bold text-sm tracking-wide">
                    ELITE TRACKING
                  </p>
                  <p className="text-kinetic-on-surface-variant text-xs mt-1">
                    Millisecond precision for every ritual.
                  </p>
                </div>
              </div>
              <div className="bg-kinetic-surface-container-low p-5 rounded-xl flex items-start gap-4">
                <span className="material-symbols-outlined text-kinetic-on-surface-variant">
                  psychiatry
                </span>
                <div>
                  <p className="text-kinetic-on-surface font-bold text-sm tracking-wide">
                    NEURAL INSIGHTS
                  </p>
                  <p className="text-kinetic-on-surface-variant text-xs mt-1">
                    Understand the patterns behind the pulse.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-6">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-5 rounded-xl bg-gradient-to-br from-kinetic-primary to-kinetic-primary-container text-kinetic-on-primary font-black text-lg tracking-wider uppercase transition-transform active:scale-95 shadow-2xl shadow-kinetic-primary/20 flex justify-center items-center gap-3"
              >
                Get Started
                <span className="material-symbols-outlined font-bold">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="h-1 bg-gradient-to-r from-transparent via-kinetic-primary/30 to-transparent w-full opacity-50" />
      <BackgroundGlow />
    </div>
  );
};

export default WelcomeScreen;
