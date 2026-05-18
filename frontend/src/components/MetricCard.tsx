import { LucideIcon } from "lucide-react";
import { Card } from "./Card";

export const MetricCard = ({ icon: Icon, label, value, hint }: { icon: LucideIcon; label: string; value: string; hint: string }) => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-black/55 dark:text-white/55">{label}</p>
        <div className="mt-2 text-3xl font-black">{value}</div>
      </div>
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint/20 text-mint"><Icon /></span>
    </div>
    <p className="mt-4 text-xs font-semibold text-black/50 dark:text-white/50">{hint}</p>
  </Card>
);
