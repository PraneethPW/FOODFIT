import { useMemo, useState } from "react";
import { Check, ClipboardCheck, RotateCcw, X } from "lucide-react";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/Button";
import { sampleDays, workoutSeed } from "../data/mock";

type Status = "done" | "missed" | null;
type StatusMap = Record<string, Status>;

const storageKey = "foodfit-adherence-v1";

const buildTasks = () => sampleDays.flatMap((day, index) => [
  { id: `${day.day}-breakfast`, day: day.day, type: "Diet", label: `Breakfast: ${day.breakfast}` },
  { id: `${day.day}-lunch`, day: day.day, type: "Diet", label: `Lunch: ${day.lunch}` },
  { id: `${day.day}-snack`, day: day.day, type: "Diet", label: `Snack: ${day.snack}` },
  { id: `${day.day}-dinner`, day: day.day, type: "Diet", label: `Dinner: ${day.dinner}` },
  { id: `${day.day}-workout`, day: day.day, type: "Workout", label: `${workoutSeed[index]?.focus ?? "Workout"}: ${workoutSeed[index]?.workout ?? "Planned training"}` }
]);

export const ChecklistDashboardPage = () => {
  const tasks = useMemo(buildTasks, []);
  const [status, setStatus] = useState<StatusMap>(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) ?? "{}") as StatusMap;
    } catch {
      return {};
    }
  });

  const setTask = (id: string, value: Status) => {
    const next = { ...status, [id]: value };
    setStatus(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const reset = () => {
    setStatus({});
    localStorage.removeItem(storageKey);
  };

  const done = tasks.filter((task) => status[task.id] === "done");
  const missed = tasks.filter((task) => status[task.id] === "missed");
  const dietTasks = tasks.filter((task) => task.type === "Diet");
  const workoutTasks = tasks.filter((task) => task.type === "Workout");
  const dietDone = dietTasks.filter((task) => status[task.id] === "done").length;
  const workoutDone = workoutTasks.filter((task) => status[task.id] === "done").length;
  const completion = Math.round((done.length / tasks.length) * 100);
  const dietCompletion = Math.round((dietDone / dietTasks.length) * 100);
  const workoutCompletion = Math.round((workoutDone / workoutTasks.length) * 100);

  const recommendations = [
    dietCompletion < 70 ? "Simplify meals: repeat two reliable breakfasts and prep protein in advance for 3 days." : "Diet adherence is strong. Keep portions consistent and rotate vegetables for micronutrients.",
    workoutCompletion < 70 ? "Reduce friction: schedule shorter 25-30 minute sessions on busy days instead of skipping workouts." : "Workout consistency is strong. Progress next week by adding one set or slightly increasing load.",
    missed.length > 6 ? "The plan may be too aggressive. Reduce calories slightly less or lower workout volume for the next week." : "Current plan looks sustainable. Keep tracking and adjust only if energy or recovery drops."
  ];

  return (
    <div className="p-3 sm:p-6 lg:p-8">
      <PageHeader eyebrow="Checklist dashboard" title="Track what you actually completed" subtitle="Mark each planned meal and workout as done or missed. NutriCue uses this adherence report to suggest realistic diet and workout changes." />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card><p className="text-sm font-bold text-black/55 dark:text-white/55">Overall</p><p className="mt-2 text-3xl font-black sm:text-4xl text-mint">{completion}%</p></Card>
        <Card><p className="text-sm font-bold text-black/55 dark:text-white/55">Diet</p><p className="mt-2 text-3xl font-black sm:text-4xl">{dietCompletion}%</p></Card>
        <Card><p className="text-sm font-bold text-black/55 dark:text-white/55">Workout</p><p className="mt-2 text-3xl font-black sm:text-4xl">{workoutCompletion}%</p></Card>
        <Card><p className="text-sm font-bold text-black/55 dark:text-white/55">Missed</p><p className="mt-2 text-3xl font-black sm:text-4xl text-coral">{missed.length}</p></Card>
      </div>

      <div className="mb-6 flex justify-start sm:justify-end">
        <Button variant="secondary" onClick={reset}><RotateCcw size={18} />Reset week</Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
        <div className="space-y-4">
          {sampleDays.map((day) => (
            <Card key={day.day}>
              <h2 className="text-xl font-black">{day.day}</h2>
              <div className="mt-4 space-y-3">
                {tasks.filter((task) => task.day === day.day).map((task) => (
                  <div key={task.id} className="flex flex-col gap-3 rounded-2xl bg-black/5 p-3 transition dark:bg-white/10 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0"><p className="text-xs font-black uppercase text-black/45 dark:text-white/45">{task.type}</p><p className="break-words font-semibold leading-6">{task.label}</p></div>
                    <div className="flex shrink-0 gap-2">
                      <button onClick={() => setTask(task.id, "done")} className={`grid h-11 w-11 place-items-center rounded-xl border transition active:scale-95 ${status[task.id] === "done" ? "border-emerald-500 bg-emerald-500 text-white" : "border-black/10 bg-white dark:border-white/10 dark:bg-white/10"}`} aria-label="Mark done"><Check size={18} /></button>
                      <button onClick={() => setTask(task.id, "missed")} className={`grid h-11 w-11 place-items-center rounded-xl border transition active:scale-95 ${status[task.id] === "missed" ? "border-red-500 bg-red-500 text-white" : "border-black/10 bg-white dark:border-white/10 dark:bg-white/10"}`} aria-label="Mark missed"><X size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-3"><ClipboardCheck className="text-mint" /><h2 className="text-xl font-black">End report</h2></div>
            <p className="mt-4 leading-7 text-black/65 dark:text-white/65">You completed {done.length} of {tasks.length} planned actions this week. Diet adherence is {dietCompletion}% and workout adherence is {workoutCompletion}%.</p>
          </Card>
          <Card>
            <h2 className="text-xl font-black">Recommended changes</h2>
            <div className="mt-4 space-y-3">
              {recommendations.map((item) => <div key={item} className="rounded-2xl bg-mint/10 p-3 text-sm font-semibold text-black/70 dark:text-white/75">{item}</div>)}
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-black">Missed items</h2>
            <div className="mt-4 space-y-2 text-sm font-semibold text-black/60 dark:text-white/60">
              {missed.length ? missed.slice(0, 8).map((item) => <p key={item.id}>{item.day}: {item.label}</p>) : <p>No missed items marked yet.</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
