import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CravingDefeated2 = () => {
  const navigate = useNavigate();
  const [streakDays, setStreakDays] = useState(0);
  const [consistency, setConsistency] = useState(100);

  useEffect(() => {
    // Fetch real-time streak total
    const savedStreak = localStorage.getItem("streakData");
    if (savedStreak) {
      try {
        const parsed = JSON.parse(savedStreak);
        setStreakDays(parsed.totalDays || 0);
      } catch (e) {
        // Ignore parsing errors
      }
    }

    // Calculate real-time consistency
    const savedRecords = localStorage.getItem("dailyRecords");
    if (savedRecords) {
      try {
        const records = JSON.parse(savedRecords);
        if (records.length > 0) {
          const completed = records.filter((r: { completed?: boolean }) => r.completed).length;
          setConsistency(Math.round((completed / records.length) * 100));
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }, []);

  return (
    <div className="bg-[#0c1321] text-kinetic-on-surface min-h-screen flex flex-col relative overflow-hidden font-body">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 bg-[radial-gradient(circle,_#4ade80_0%,_transparent_70%)] blur-[120px]"></div>
      </div>

      <header className="bg-transparent top-0 flex justify-between items-center w-full px-6 py-4 fixed z-50">
        <div className="flex items-center gap-2">
          <span className="font-headline font-black uppercase tracking-widest text-kinetic-on-surface text-lg leading-tight">
            KINETIC
          </span>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-slate-400 hover:bg-white/10 transition-colors p-2 rounded-full flex items-center justify-center"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 relative mt-8 pb-32">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-3 text-center">
            <h1 className="font-headline font-bold text-4xl md:text-5xl tracking-tight text-kinetic-on-surface leading-tight">
              You stayed in control.
            </h1>
            <p className="font-body text-slate-500 text-sm md:text-base tracking-wide">
              That's discipline.
            </p>
          </div>

          <div className="space-y-6 pt-4">
            <div className="w-full h-px bg-kinetic-surface-container-highest relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-kinetic-primary-container w-2/3"></div>
            </div>

            <div className="flex justify-between items-center px-1">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">Momentum</span>
                <div className="flex items-center gap-2">
                  <span className="font-headline font-bold text-kinetic-primary text-lg">Streak: {streakDays} days</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">Consistency</span>
                <p className="font-headline font-bold text-kinetic-on-surface text-lg">{consistency}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-28 w-full max-w-xs px-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 bg-kinetic-primary-container text-kinetic-on-primary-container font-headline font-bold rounded-xl transition-all active:scale-95 hover:brightness-105"
          >
            Continue
          </button>
        </div>
      </main>

      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#151b2a]/80 backdrop-blur-xl rounded-t-3xl shadow-[0px_16px_32px_rgba(74,222,128,0.06)] md:hidden">
        <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center justify-center bg-[#232a39] text-[#4ADE80] rounded-2xl p-2 transition-all">
          <span className="material-symbols-outlined">event_note</span>
          <span className="text-[10px] font-medium mt-1 font-body">Journal</span>
        </button>
        <button onClick={() => navigate('/history')} className="flex flex-col items-center justify-center text-slate-500 p-2 hover:text-white transition-all">
          <span className="material-symbols-outlined">bolt</span>
          <span className="text-[10px] font-medium mt-1 font-body">Habits</span>
        </button>
        <button onClick={() => navigate('/analytics')} className="flex flex-col items-center justify-center text-slate-500 p-2 hover:text-white transition-all">
          <span className="material-symbols-outlined">query_stats</span>
          <span className="text-[10px] font-medium mt-1 font-body">Growth</span>
        </button>
        <button onClick={() => navigate('/settings')} className="flex flex-col items-center justify-center text-slate-500 p-2 hover:text-white transition-all">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-medium mt-1 font-body">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default CravingDefeated2;
