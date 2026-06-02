import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "@/components/TopAppBar";
import BackgroundGlow from "@/components/BackgroundGlow";

const PhysicalStats = () => {
  const navigate = useNavigate();
  const [age, setAge] = useState(28);
  const [height, setHeight] = useState(182);
  const [weight, setWeight] = useState(74.5);
  const [unit, setUnit] = useState<"cm" | "ft">("cm");

  const handleUnitChange = (newUnit: "cm" | "ft") => {
    if (unit === newUnit) return;
    if (newUnit === "ft") {
      // Convert cm to ft (1 cm = ~0.0328 ft)
      setHeight(+(height * 0.0328084).toFixed(1));
    } else {
      // Convert ft to cm (1 ft = 30.48 cm)
      setHeight(Math.round(height * 30.48));
    }
    setUnit(newUnit);
  };

  return (
    <div className="bg-kinetic-surface text-kinetic-on-surface min-h-screen flex flex-col items-center justify-start overflow-x-hidden">
      <TopAppBar showBack showAvatar />

      <main className="w-full max-w-md px-6 pt-8 pb-24 flex flex-col gap-10">
        <div className="space-y-2">
          <span className="font-body font-bold text-[10px] tracking-wider text-kinetic-primary uppercase">
            Step 02 of 05
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-kinetic-on-surface tracking-tight leading-none">
            BODY
            <br />
            METRICS
          </h2>
          <p className="text-kinetic-on-surface-variant text-base sm:text-lg max-w-[280px]">
            Precise data drives precise results. Tell us your current stats.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Age */}
          <section className="bg-kinetic-surface-container-low rounded-xl p-6 transition-all hover:bg-kinetic-surface-container">
            <div className="flex justify-between items-end mb-6">
              <label className="font-body font-bold text-[10px] tracking-wider text-kinetic-on-surface-variant uppercase">
                Your Age
              </label>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-kinetic-primary leading-none">
                  {age}
                </span>
                <span className="text-kinetic-on-surface-variant font-bold text-xs uppercase tracking-widest">
                  Yrs
                </span>
              </div>
            </div>
            <input
              type="range"
              min="18"
              max="80"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-[10px] font-bold text-kinetic-outline uppercase tracking-tighter">
              <span>18</span>
              <span>35</span>
              <span>55</span>
              <span>80</span>
            </div>
          </section>

          {/* Height */}
          <section className="grid grid-cols-2 gap-4">
            <div className="bg-kinetic-surface-container-low rounded-xl p-6 flex flex-col justify-between aspect-square">
              <label className="font-body font-bold text-[10px] tracking-wider text-kinetic-on-surface-variant uppercase">
                Height
              </label>
              <div className="flex flex-col">
                <span className="text-4xl font-black text-kinetic-on-surface">
                  {height}
                </span>
                <span className="text-kinetic-primary font-bold text-xs uppercase tracking-widest">
                  {unit === "cm" ? "Centimeters" : "Feet"}
                </span>
              </div>
              <input
                type="range"
                min={unit === "cm" ? "140" : "4.5"}
                max={unit === "cm" ? "220" : "7.2"}
                step={unit === "cm" ? "1" : "0.1"}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="bg-kinetic-surface-container-highest rounded-xl p-6 flex flex-col justify-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-6xl material-filled">
                  straighten
                </span>
              </div>
              <button
                onClick={() => handleUnitChange("cm")}
                className={`font-bold text-[10px] tracking-widest py-2 rounded-lg uppercase ${unit === "cm" ? "bg-kinetic-surface-container text-kinetic-primary border border-kinetic-primary/20" : "text-kinetic-on-surface-variant"}`}
              >
                CM
              </button>
              <button
                onClick={() => handleUnitChange("ft")}
                className={`font-bold text-[10px] tracking-widest py-2 rounded-lg uppercase ${unit === "ft" ? "bg-kinetic-surface-container text-kinetic-primary border border-kinetic-primary/20" : "text-kinetic-on-surface-variant"}`}
              >
                FT/IN
              </button>
            </div>
          </section>

          {/* Weight */}
          <section className="bg-kinetic-surface-container-low rounded-xl p-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col">
                <label className="font-body font-bold text-[10px] tracking-wider text-kinetic-on-surface-variant uppercase">
                  Current Weight
                </label>
                <span className="text-5xl font-black text-kinetic-on-surface leading-none mt-2">
                  {weight}
                </span>
              </div>
              <div className="bg-kinetic-primary/10 px-3 py-1 rounded-full border border-kinetic-primary/20">
                <span className="text-kinetic-primary font-black text-xs uppercase tracking-widest">
                  KG
                </span>
              </div>
            </div>
            <div className="relative mt-12 mb-4">
              {/* Ruler visual */}
              <div className="absolute inset-x-0 -top-8 flex justify-between px-[6px] pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-0.5 rounded-full ${i % 2 === 0 ? "h-4 bg-kinetic-on-surface-variant" : "h-2 bg-kinetic-outline-variant"}`}></div>
                    {i % 2 === 0 && (
                      <span className="text-[10px] font-bold text-kinetic-on-surface-variant mt-2 opacity-50">
                        {40 + i * 10}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <input
                type="range"
                min="40"
                max="150"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full relative z-10"
              />
            </div>
          </section>
        </div>

        <div className="border-l-2 border-kinetic-primary-container pl-6 py-2 italic opacity-80">
          <p className="text-kinetic-on-surface-variant font-medium tracking-tight">
            "Discipline is the bridge between goals and accomplishment."
          </p>
        </div>
      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 w-full px-6 pb-10 pt-6 bg-gradient-to-t from-kinetic-surface via-kinetic-surface/90 to-transparent z-40">
        <button
          onClick={() => navigate("/welcome")}
          className="w-full h-16 bg-gradient-to-br from-kinetic-primary to-kinetic-primary-container text-kinetic-on-primary font-black text-lg tracking-[0.1em] rounded-xl shadow-[0_20px_40px_-10px_hsla(var(--kinetic-primary)/0.3)] flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          CONTINUE{" "}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>

      <BackgroundGlow />
    </div>
  );
};

export default PhysicalStats;
