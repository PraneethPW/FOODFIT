import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bot,
  ClipboardCheck,
  Dumbbell,
  Home,
  LogOut,
  Moon,
  Salad,
  Settings,
  Sun,
  UserRound,
  Utensils
} from "lucide-react";
import clsx from "clsx";
import { Logo } from "../components/Logo";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";

const nav = [
  { to: "/dashboard", label: "Overview", icon: Home },
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/diet-plan", label: "Diet", icon: Utensils },
  { to: "/workout-plan", label: "Workout", icon: Dumbbell },
  { to: "/food-recommendations", label: "Foods", icon: Salad },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/checklist", label: "Checklist", icon: ClipboardCheck },
  { to: "/assistant", label: "Assistant", icon: Bot },
  { to: "/settings", label: "Settings", icon: Settings }
];

export const DashboardLayout = () => {
  const { logout, user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6faf8] text-ink dark:bg-ink dark:text-white">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 border-r border-black/10 bg-white/70 p-5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5 lg:block">
        <Logo />
        <div className="mt-8 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition duration-200",
                  isActive ? "bg-ink text-white dark:bg-white dark:text-ink" : "hover:bg-black/5 dark:hover:bg-white/10"
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </div>
        <div className="absolute bottom-5 left-5 right-5 space-y-3">
          <button onClick={toggleTheme} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition hover:bg-black/5 dark:hover:bg-white/10">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-coral transition hover:bg-coral/10"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/90 px-4 py-3 backdrop-blur-2xl dark:border-white/10 dark:bg-ink/90 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Logo />
          <span className="max-w-[42vw] truncate text-right text-xs font-bold text-black/60 dark:text-white/60">{user?.name}</span>
        </div>
      </header>

      <main className="pb-28 lg:ml-72 lg:pb-0">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-white/95 px-2 py-2 pb-[calc(.5rem+env(safe-area-inset-bottom))] backdrop-blur-2xl dark:border-white/10 dark:bg-ink/95 lg:hidden">
        <div className="mobile-nav-scroll flex gap-2 overflow-x-auto px-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  "mobile-nav-item grid min-w-[72px] shrink-0 justify-items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-semibold transition duration-200",
                  isActive && "bg-ink text-white dark:bg-white dark:text-ink"
                )
              }
            >
              <Icon size={17} />
              <span className="leading-none">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
