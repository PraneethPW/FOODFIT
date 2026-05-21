import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = () => (
  <Link to="/" className="flex items-center gap-2 font-black tracking-tight">
    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-700 text-white shadow-glow dark:bg-blue-500">
      <Activity size={22} />
    </span>
    <span className="text-xl">NutriCue</span>
  </Link>
);
