import toast from "react-hot-toast";
import { Bell, Moon, Shield, Sun } from "lucide-react";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/Button";
import { useThemeStore } from "../store/themeStore";

export const SettingsPage = () => {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <div className="p-4 sm:p-8">
      <PageHeader eyebrow="Settings" title="Tune your NutriCue experience" subtitle="Theme, reminders, privacy preferences, and account controls for production deployment." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card><Moon className="text-mint" /><h2 className="mt-4 text-xl font-black">Theme</h2><p className="mt-2 text-sm text-black/60 dark:text-white/60">Switch between cinematic dark and bright workspace modes.</p><Button className="mt-5" onClick={toggleTheme}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}Toggle theme</Button></Card>
        <Card><Bell className="text-coral" /><h2 className="mt-4 text-xl font-black">Reminders</h2><p className="mt-2 text-sm text-black/60 dark:text-white/60">Hydration, workouts, and meal prep reminder UI is ready.</p><Button className="mt-5" variant="secondary" onClick={() => toast.success("Reminder preference saved")}>Enable reminders</Button></Card>
        <Card><Shield className="text-ocean" /><h2 className="mt-4 text-xl font-black">Privacy</h2><p className="mt-2 text-sm text-black/60 dark:text-white/60">JWT auth, hashed passwords, environment secrets, and protected API routes.</p><Button className="mt-5" variant="secondary">Manage data</Button></Card>
      </div>
    </div>
  );
};
