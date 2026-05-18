import { useState } from "react";
import toast from "react-hot-toast";
import { Dumbbell, Sparkles, Target } from "lucide-react";
import { api } from "../lib/api";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { useApiData } from "../hooks/useApiData";
import { workoutSeed } from "../data/mock";
import { formatValue, toList } from "../utils/formatValue";

const goalTraining = [
  { goal: "Weight loss", plan: "3 strength days, 2 cardio days, 1 interval day, 1 recovery day." },
  { goal: "Weight gain", plan: "4 hypertrophy days, lower cardio volume, progressive overload, more recovery." },
  { goal: "Endurance", plan: "3 zone-2 sessions, 1 tempo day, 2 strength-support sessions, 1 mobility day." }
];

export const WorkoutPlanPage = () => {
  const { data, setData } = useApiData<any>("/ai/workout-plan/latest", { workoutPlan: null });
  const [generating, setGenerating] = useState(false);
  const schedule = data.workoutPlan?.plan?.schedule?.length ? data.workoutPlan.plan.schedule : workoutSeed;

  const generate = async () => {
    setGenerating(true);
    try {
      const response = await api.post("/ai/workout-plan/generate");
      setData(response.data);
      toast.success("Workout generated");
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Could not generate workout");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <PageHeader eyebrow="AI workout" title="Training matched to your goal and body" subtitle="Home workouts, gym sessions, yoga, cardio, fat loss, muscle gain, endurance, and health-aware precautions." />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button onClick={generate} disabled={generating}><Sparkles size={18} />{generating ? "Generating..." : "Generate workout"}</Button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {goalTraining.map((item) => (
          <Card key={item.goal}>
            <div className="flex items-center gap-3"><Target className="text-mint" /><h2 className="text-xl font-black">{item.goal}</h2></div>
            <p className="mt-3 text-sm font-semibold text-black/60 dark:text-white/60">{item.plan}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {schedule.map((item: any, index: number) => (
          <Card key={item.day ?? index}>
            <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-coral/15 text-coral"><Dumbbell /></span><div><h2 className="text-xl font-black">{formatValue(item.day ?? `Day ${index + 1}`)}</h2><p className="font-bold text-mint">{formatValue(item.focus ?? item.type ?? "Functional strength")}</p></div></div>
            <p className="mt-5 leading-7 text-black/65 dark:text-white/65">{formatValue(item.workout ?? item.exercises ?? "Warmup, full-body circuit, cooldown, and mobility.")}</p>
            <div className="mt-4 rounded-xl bg-black/5 p-3 text-sm font-black dark:bg-white/10">{formatValue(item.duration ?? "35-45 min")}</div>
          </Card>
        ))}
      </div>
      {data.workoutPlan?.precautions && (
        <Card className="mt-6">
          <h2 className="font-black">Precautions</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold text-black/65 dark:text-white/65">
            {toList(data.workoutPlan.precautions).map((item) => <span key={item} className="rounded-full bg-black/5 px-3 py-1 dark:bg-white/10">{item}</span>)}
          </div>
        </Card>
      )}
    </div>
  );
};
