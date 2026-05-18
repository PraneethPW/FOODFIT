import { useState } from "react";
import toast from "react-hot-toast";
import { Sparkles } from "lucide-react";
import { api } from "../lib/api";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { Skeleton } from "../components/Skeleton";
import { sampleDays } from "../data/mock";
import { useApiData } from "../hooks/useApiData";

export const DietPlanPage = () => {
  const { data, setData, loading } = useApiData<any>("/ai/diet-plan/latest", { dietPlan: null });
  const [generating, setGenerating] = useState(false);
  const plan = data.dietPlan?.plan;
  const days = plan?.days?.length ? plan.days : sampleDays;

  const generate = async () => {
    setGenerating(true);
    try {
      const response = await api.post("/ai/diet-plan/generate");
      setData(response.data);
      toast.success("Weekly diet generated");
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Could not generate diet");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <PageHeader eyebrow="AI weekly diet" title="Seven days of food that fits your life" subtitle="The generator considers city, disease risks, age, goals, allergies, cultural foods, macros, and nutrients." />
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {["calories", "proteinGrams", "carbsGrams", "fatGrams"].map((key) => <Card key={key} className="p-4"><div className="text-xs font-black uppercase text-black/45 dark:text-white/45">{key.replace("Grams", "")}</div><div className="mt-1 text-2xl font-black">{data.dietPlan?.[key] ?? "--"}</div></Card>)}
        </div>
        <Button onClick={generate} disabled={generating}><Sparkles size={18} />{generating ? "Generating..." : "Generate plan"}</Button>
      </div>
      {loading ? <Skeleton className="h-96" /> : (
        <div className="grid gap-4 lg:grid-cols-2">
          {days.map((day: any, index: number) => (
            <Card key={day.day ?? index}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black">{day.day ?? `Day ${index + 1}`}</h2>
                <span className="rounded-full bg-mint/15 px-3 py-1 text-sm font-black text-mint">{day.calories ?? 2100} kcal</span>
              </div>
              <div className="mt-5 grid gap-3 text-sm">
                {["breakfast", "lunch", "snack", "dinner"].map((meal) => <div key={meal} className="rounded-xl bg-black/5 p-3 dark:bg-white/10"><span className="font-black capitalize">{meal}: </span>{day[meal] ?? "Balanced meal with local seasonal foods"}</div>)}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

