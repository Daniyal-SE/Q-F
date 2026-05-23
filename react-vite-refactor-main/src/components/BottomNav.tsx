import { useNavigate, useLocation } from "react-router-dom";

interface BottomNavProps {
  active?: "dashboard" | "analytics" | "history" | "settings";
}

const navItems = [
  {
    id: "dashboard" as const,
    icon: "speed",
    label: "DASHBOARD",
    path: "/dashboard",
  },
  {
    id: "analytics" as const,
    icon: "leaderboard",
    label: "ANALYTICS",
    path: "/analytics",
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
];

const BottomNav = ({ active = "dashboard" }: BottomNavProps) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-2 sm:px-4 pb-3 sm:pb-6 pt-2 sm:pt-3 bg-kinetic-surface-container/60 backdrop-blur-xl z-50 rounded-t-[20px] sm:rounded-t-[24px] shadow-[0_0_40px_rgba(11,19,38,0.06)]" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center justify-center flex-1 px-1 sm:px-4 py-1.5 sm:py-2.5 transition-all duration-200 min-w-0 ${active === item.id
            ? "bg-gradient-to-br from-kinetic-primary to-kinetic-primary-container text-white rounded-[18px] sm:rounded-[24px] mx-0.5"
            : "text-kinetic-on-surface-variant hover:text-kinetic-on-surface"
            }`}
        >
          <span
            className={`material-symbols-outlined mb-0.5 text-[18px] sm:text-[22px] ${active === item.id ? "material-filled" : ""}`}
          >
            {item.icon}
          </span>
          <span className="font-body font-bold text-[7px] sm:text-[9px] tracking-tight sm:tracking-wider truncate w-full text-center">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
