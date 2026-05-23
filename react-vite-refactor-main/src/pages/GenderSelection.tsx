import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundGlow from "@/components/BackgroundGlow";

type Gender = "male" | "female" | "other";

const genderOptions = [
  { id: "male" as Gender, icon: "male", label: "MALE", sub: "Biological" },
  {
    id: "female" as Gender,
    icon: "female",
    label: "FEMALE",
    sub: "Biological",
  },
  {
    id: "other" as Gender,
    icon: "diversity_3",
    label: "OTHER",
    sub: "Prefer not to say",
  },
];

const GenderSelection = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Gender | null>(null);

  return (
    <div className="bg-kinetic-surface text-kinetic-on-surface min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col justify-center my-auto min-h-0">
        <header className="mb-10 sm:mb-12">
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-kinetic-on-surface tracking-tight leading-tight">
              TELL US ABOUT
              <br />
              <span className="text-kinetic-primary">YOURSELF</span>
            </h1>
          </div>
          <p className="text-kinetic-on-surface-variant text-base sm:text-lg leading-relaxed">
            To tailor your nutritional plan and habit tracking, we need to know
            your biological baseline.
          </p>
        </header>

        <main className="flex-grow space-y-4">
          {genderOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`w-full relative p-6 rounded-xl border-2 transition-all duration-300 flex items-center justify-between overflow-hidden ${
                selected === option.id
                  ? "bg-kinetic-surface-container border-kinetic-primary shadow-[0_0_20px_hsla(var(--kinetic-primary)/0.15)]"
                  : "bg-kinetic-surface-container-low border-transparent hover:bg-kinetic-surface-container"
              }`}
            >
              <div className="flex items-center gap-5">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    selected === option.id
                      ? "bg-kinetic-primary-container text-white"
                      : "bg-kinetic-surface-container-highest text-kinetic-primary"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-3xl ${selected === option.id ? "material-filled" : ""}`}
                  >
                    {option.icon}
                  </span>
                </div>
                <div className="text-left">
                  <span className="block text-xl font-bold tracking-tight text-kinetic-on-surface">
                    {option.label}
                  </span>
                  <span className="text-sm text-kinetic-on-surface-variant uppercase tracking-widest font-medium">
                    {option.sub}
                  </span>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selected === option.id
                    ? "border-kinetic-primary"
                    : "border-kinetic-outline-variant"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full transition-colors ${selected === option.id ? "bg-kinetic-primary" : "bg-transparent"}`}
                />
              </div>
              {selected === option.id && (
                <div className="absolute inset-0 bg-kinetic-primary/5 pointer-events-none" />
              )}
            </button>
          ))}
        </main>

        <footer className="mt-12 pb-8">
          <button
            onClick={() => {
              if (selected) navigate("/onboarding/stats");
            }}
            disabled={!selected}
            className={`w-full py-5 rounded-xl font-black text-lg tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-200 ${
              selected
                ? "bg-gradient-to-br from-kinetic-primary to-kinetic-primary-container text-kinetic-on-primary active:scale-[0.98] shadow-lg shadow-kinetic-primary/20"
                : "bg-kinetic-surface-container-high text-kinetic-on-surface-variant cursor-not-allowed opacity-50"
            }`}
          >
            Next{" "}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <p className="text-center text-kinetic-on-surface-variant text-xs mt-6 px-8 leading-relaxed">
            Kinetic uses this data to calculate your Basal Metabolic Rate and
            nutrient thresholds.
          </p>
        </footer>
      </div>
      <BackgroundGlow />
    </div>
  );
};

export default GenderSelection;
