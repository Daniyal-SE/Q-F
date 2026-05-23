import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundGlow from "@/components/BackgroundGlow";

const difficulties = [
  {
    id: "easy",
    icon: "energy_savings_leaf",
    title: "Easy",
    desc: "Sustainable pace focusing on habit building and consistency.",
  },
  {
    id: "medium",
    icon: "bolt",
    title: "Medium",
    desc: "Balanced intensity designed for steady progress and growth.",
  },
  {
    id: "hard",
    icon: "fitness_center",
    title: "Hard",
    desc: "Peak performance mode. High volume for maximum results.",
  },
];

const DifficultySelection = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("easy");

  return (
    <div className="bg-kinetic-surface text-kinetic-on-surface min-h-screen flex flex-col items-center justify-center p-6 sm:p-12">
      <main className="w-full max-w-lg mx-auto flex flex-col space-y-12">
        <header className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="hover:bg-kinetic-surface-container p-2 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-kinetic-primary">
                arrow_back
              </span>
            </button>
            <div className="inline-flex px-3 py-1 rounded-full bg-kinetic-surface-container-highest text-kinetic-primary text-[10px] font-black tracking-[0.1em] uppercase">
              Step 03 / 04
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-kinetic-on-surface leading-tight tracking-tighter">
            CHOOSE YOUR <br />{" "}
            <span className="text-kinetic-primary">INTENSITY.</span>
          </h1>
          <p className="text-kinetic-on-surface-variant text-base sm:text-lg font-medium leading-relaxed max-w-md">
            Select a difficulty level that matches your current kinetic capacity
            and long-term discipline goals.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {difficulties.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelected(d.id)}
              className={`group relative flex items-center p-6 text-left rounded-xl transition-all duration-300 ${
                selected === d.id
                  ? "bg-kinetic-surface-container border-2 border-kinetic-primary ring-4 ring-kinetic-primary/10 scale-[1.02]"
                  : "bg-kinetic-surface-container-low border-2 border-transparent hover:bg-kinetic-surface-container hover:scale-[1.01]"
              }`}
            >
              <div
                className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${
                  selected === d.id
                    ? "bg-kinetic-primary/20 text-kinetic-primary"
                    : "bg-kinetic-surface-container-highest text-kinetic-on-surface-variant group-hover:text-kinetic-primary transition-colors"
                }`}
              >
                <span className="material-symbols-outlined">{d.icon}</span>
              </div>
              <div className="ml-6 flex-grow">
                <h3 className="text-lg font-bold text-kinetic-on-surface tracking-wide">
                  {d.title}
                </h3>
                <p className="text-kinetic-on-surface-variant text-sm mt-1">
                  {d.desc}
                </p>
              </div>
              {selected === d.id && (
                <div className="absolute top-4 right-4">
                  <span className="material-symbols-outlined text-kinetic-primary material-filled">
                    check_circle
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Decorative */}
        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-kinetic-surface-container">
          <div className="absolute inset-0 bg-gradient-to-t from-kinetic-surface to-transparent z-10" />
          <div className="absolute bottom-4 left-6 z-20">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-kinetic-primary">
              Target Metabolic Rate
            </p>
            <p className="text-2xl font-black text-kinetic-on-surface italic">
              OPTIMIZED
            </p>
          </div>
        </div>

        <footer className="pt-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-5 rounded-xl bg-gradient-to-br from-kinetic-primary to-kinetic-primary-container text-kinetic-on-primary font-black text-sm uppercase tracking-[0.15em] shadow-[0_20px_40px_hsla(var(--kinetic-primary)/0.15)] transition-all active:scale-95"
          >
            Complete Setup
          </button>
          <div className="mt-8 flex justify-center items-center space-x-2">
            <span className="w-8 h-1 rounded-full bg-kinetic-surface-container-highest" />
            <span className="w-8 h-1 rounded-full bg-kinetic-surface-container-highest" />
            <span className="w-12 h-1.5 rounded-full bg-kinetic-primary" />
            <span className="w-8 h-1 rounded-full bg-kinetic-surface-container-highest" />
          </div>
        </footer>
      </main>
      <BackgroundGlow />
    </div>
  );
};

export default DifficultySelection;
