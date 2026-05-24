import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "@/components/TopAppBar";

const goals = [
  {
    id: "lose-weight",
    icon: "monitor_weight",
    title: "Lose Weight",
    desc: "Optimize caloric deficit and track daily metabolic burn.",
  },
  {
    id: "quit-sugar",
    icon: "water_drop",
    title: "Quit Sugar",
    desc: "Eliminate refined glucose spikes and regain natural energy.",
  },
  {
    id: "avoid-fast-food",
    icon: "no_food",
    title: "Avoid Fast Food",
    desc: "Cut out processed oils and ultra-processed sodium levels.",
  },
  {
    id: "healthy-eating",
    icon: "restaurant",
    title: "Healthy Eating",
    desc: "Adopt a whole-food, nutrient-dense protocol for longevity.",
  },
];

const GoalSelection = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>("quit-sugar");

  return (
    <div className="bg-kinetic-surface text-kinetic-on-surface min-h-screen flex flex-col">
      <TopAppBar showBack showMenu showAvatar />
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 max-w-4xl mx-auto w-full">
        <div className="w-full mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-kinetic-on-surface mb-4 tracking-tight leading-none">
            DEFINE YOUR <br />
            <span className="text-kinetic-primary">PRECISION.</span>
          </h2>
          <p className="text-kinetic-on-surface-variant text-base sm:text-lg max-w-md font-medium">
            Choose the primary habit you want to master. We will calibrate your
            experience accordingly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => setSelected(goal.id)}
              className={`group relative flex flex-col items-start p-6 rounded-xl transition-all duration-300 text-left border-2 ${
                selected === goal.id
                  ? "bg-kinetic-surface-container border-kinetic-primary shadow-[0_0_20px_hsla(var(--kinetic-primary)/0.1)]"
                  : "bg-kinetic-surface-container-low border-transparent hover:bg-kinetic-surface-container hover:border-kinetic-primary/20"
              }`}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl mb-4 transition-transform group-hover:scale-110 ${
                  selected === goal.id
                    ? "bg-kinetic-primary-container text-white"
                    : "bg-kinetic-surface-container-highest text-kinetic-primary"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-3xl ${selected === goal.id ? "material-filled" : ""}`}
                >
                  {goal.icon}
                </span>
              </div>
              <h3 className="text-xl font-bold text-kinetic-on-surface mb-1">
                {goal.title}
              </h3>
              <p className="text-kinetic-on-surface-variant text-sm">
                {goal.desc}
              </p>
              {selected === goal.id && (
                <div className="absolute top-4 right-4">
                  <span className="material-symbols-outlined text-kinetic-primary text-2xl material-filled">
                    check_circle
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-12 w-full flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-kinetic-on-surface-variant text-sm font-medium">
            Step 1 of 3: Core Objective
          </p>
          <button
            onClick={() => navigate("/onboarding/stats")}
            className="w-full sm:w-auto px-12 py-4 bg-gradient-to-br from-kinetic-primary to-kinetic-primary-container text-kinetic-on-primary font-black rounded-xl tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-kinetic-primary/10"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default GoalSelection;
