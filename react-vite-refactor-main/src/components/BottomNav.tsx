import { useNavigate } from "react-router-dom";

interface BottomNavProps {
  active?: "dashboard" | "scan" | "exercise" | "stats" | "settings" | "analytics" | "history";
}

const navItems = [
  {
    id: "dashboard" as const,
    icon: "speed",
    label: "FOCUS",
    path: "/dashboard",
  },
  {
    id: "scan" as const,
    icon: "photo_camera",
    label: "SCAN",
    path: "/ai-food-scanner",
  },
  {
    id: "exercise" as const,
    icon: "fitness_center",
    label: "TRAIN",
    path: "/exercise-tracker",
  },
  {
    id: "stats" as const,
    icon: "analytics",
    label: "STATS",
    path: "/calorie-detail-breakdown",
  },
  {
    id: "settings" as const,
    icon: "settings",
    label: "SETTINGS",
    path: "/settings",
  },
];

const BottomNav = ({ active = "dashboard" }: BottomNavProps) => {
  const navigate = useNavigate();

  const authSaved = localStorage.getItem("userAuth");
  const isGuest = authSaved ? JSON.parse(authSaved).role === "guest" : false;

  const currentNavItems = isGuest
    ? [
        {
          id: "scan" as const,
          icon: "photo_camera",
          label: "SCAN",
          path: "/ai-food-scanner",
        },
        {
          id: "history" as const,
          icon: "history",
          label: "HISTORY",
          path: "/history",
        },
        {
          id: "settings" as const,
          icon: "settings",
          label: "SETTINGS",
          path: "/settings",
        },
      ]
    : navItems;

  return (
    <nav 
      className="fixed bottom-0 left-0 w-full flex justify-around items-center px-1 sm:px-4 pb-3 sm:pb-6 pt-2 sm:pt-3 bg-[#111827]/90 backdrop-blur-xl z-50 rounded-t-[20px] sm:rounded-t-[24px] shadow-[0_-10px_35px_rgba(0,0,0,0.5)] border-t border-[#1e293b]" 
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      {currentNavItems.map((item) => {
        const isActive = active === item.id || (item.id === "stats" && (active === "analytics" || active === "history"));
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center flex-1 px-1 py-1 transition-all duration-300 min-w-0 active:scale-95 ${isActive
              ? "text-[#4ade80]"
              : "text-[#94a3b8] hover:text-[#dce2f6]"
              }`}
          >
            <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? "bg-[#4ade80]/15 scale-110" : "bg-transparent"}`}>
              <span
                className={`material-symbols-outlined text-[20px] sm:text-[24px] transition-all block ${isActive ? "material-filled text-[#4ade80]" : ""}`}
              >
                {item.icon}
              </span>
            </div>
            <span className={`font-body font-black text-[8px] sm:text-[9.5px] tracking-widest mt-1.5 truncate w-full text-center transition-all ${isActive ? "text-[#4ade80]" : "text-[#94a3b8]"}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
