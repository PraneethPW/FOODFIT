import { Line, LineChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { useApiData } from "../hooks/useApiData";
import { progressSeed } from "../data/mock";

export const AnalyticsPage = () => {
  const { data } = useApiData<any>("/progress", { progress: progressSeed });
  const chartData = data.progress?.length ? data.progress.map((p: any) => ({ ...p, date: new Date(p.date).toLocaleDateString("en", { month: "short", day: "numeric" }) })) : progressSeed;

  return (
    <div className="p-4 sm:p-8">
      <PageHeader eyebrow="Analytics" title="Weekly improvement, made visible" subtitle="Track weight, calories, protein intake, workout consistency, hydration, and trend quality." />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="h-96">
          <h2 className="mb-4 text-xl font-black">Weight progress</h2>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="date" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="weightKg" stroke="#35f0a4" strokeWidth={3} /></LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="h-96">
          <h2 className="mb-4 text-xl font-black">Protein and workouts</h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="date" /><YAxis /><Tooltip /><Legend /><Bar dataKey="proteinGrams" fill="#0ea5e9" radius={[8, 8, 0, 0]} /><Bar dataKey="workoutMinutes" fill="#ff6f61" radius={[8, 8, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
