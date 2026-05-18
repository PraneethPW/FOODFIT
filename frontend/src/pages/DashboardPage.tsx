import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, Droplets, Flame, Scale, Utensils } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { MetricCard } from "../components/MetricCard";
import { Card } from "../components/Card";
import { useApiData } from "../hooks/useApiData";
import { progressSeed } from "../data/mock";

export const DashboardPage = () => {
  const { data } = useApiData<any>("/overview", { targets: { calories: 2100, protein: 110, carbs: 230, fat: 65, water: 2.7 }, bmi: 23.8, progress: progressSeed });
  const progress = data.progress?.length ? data.progress.map((p: any) => ({ ...p, date: new Date(p.date).toLocaleDateString("en", { weekday: "short" }) })) : progressSeed;

  return (
    <div className="p-4 sm:p-8">
      <PageHeader eyebrow="Dashboard" title="Your daily health cockpit" subtitle="Calories, macros, hydration, BMI, and progress are gathered into one calm operating view." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Flame} label="Calories" value={`${data.targets?.calories ?? 2100}`} hint="Daily energy target" />
        <MetricCard icon={Utensils} label="Protein" value={`${data.targets?.protein ?? 110}g`} hint="Muscle and satiety target" />
        <MetricCard icon={Droplets} label="Hydration" value={`${data.targets?.water ?? 2.7}L`} hint="Suggested water intake" />
        <MetricCard icon={Scale} label="BMI" value={`${data.bmi ?? 23.8}`} hint="Updated from your profile" />
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
        <Card className="h-96">
          <h2 className="mb-4 text-xl font-black">Calorie trend</h2>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={progress}>
              <defs><linearGradient id="calories" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#35f0a4" stopOpacity={0.55} /><stop offset="95%" stopColor="#35f0a4" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" /><YAxis /><Tooltip />
              <Area type="monotone" dataKey="calories" stroke="#35f0a4" fill="url(#calories)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="h-96">
          <h2 className="mb-4 text-xl font-black">Macro split</h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={[{ name: "Protein", value: data.targets?.protein ?? 110 }, { name: "Carbs", value: data.targets?.carbs ?? 230 }, { name: "Fat", value: data.targets?.fat ?? 65 }]}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="name" /><YAxis /><Tooltip />
              <Bar dataKey="value" fill="#0ea5e9" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-xl font-black">Today’s focus</h2><p className="text-black/60 dark:text-white/60">Stay within calories, finish protein, and log one workout.</p></div>
        <div className="flex items-center gap-2 rounded-2xl bg-mint/15 px-4 py-3 font-black text-mint"><Activity />On track</div>
      </Card>
    </div>
  );
};
