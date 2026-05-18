import { useState } from "react";
import toast from "react-hot-toast";
import { MapPin, Search, Sparkles, Target } from "lucide-react";
import { api } from "../lib/api";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { useApiData } from "../hooks/useApiData";
import { formatValue, toList } from "../utils/formatValue";

const fallback = [
  { name: "Sprouts chaat", macros: "18g protein", nutrients: { fiber: "high", iron: "moderate", vitaminC: "from lemon" }, benefits: "high satiety", suitability: "diabetes-friendly" },
  { name: "Idli sambar", macros: "balanced carbs", nutrients: "protein, minerals", benefits: "light meal", suitability: "heart-friendly" },
  { name: "Paneer tikka", macros: "28g protein", nutrients: "calcium", benefits: "muscle support", suitability: "low sugar" }
];

const goalRecommendations = [
  {
    goal: "Weight loss",
    foods: ["Sprouts chaat", "Grilled paneer or tofu salad", "Millet khichdi", "Dal soup with vegetables"],
    guidance: "Prioritize high-protein meals, high-fiber carbs, low-oil cooking, and 300-500 kcal deficit."
  },
  {
    goal: "Weight gain",
    foods: ["Peanut banana smoothie", "Paneer rice bowl", "Egg bhurji with roti", "Curd, nuts, and fruit bowl"],
    guidance: "Add calorie-dense healthy foods, keep protein high, and increase portions around workouts."
  },
  {
    goal: "Muscle gain",
    foods: ["Chicken or tofu bowl", "Paneer tikka wrap", "Greek yogurt with seeds", "Rajma rice with salad"],
    guidance: "Hit protein consistently and pair strength training with carbs before and after workouts."
  }
];

export const FoodRecommendationsPage = () => {
  const { data, setData } = useApiData<any>("/ai/foods/latest", { foodRecommendation: null });
  const [query, setQuery] = useState("");
  const [generating, setGenerating] = useState(false);
  const items = data.foodRecommendation?.items?.length ? data.foodRecommendation.items : fallback;
  const filtered = items.filter((item: any) => JSON.stringify(item).toLowerCase().includes(query.toLowerCase()));

  const generate = async () => {
    setGenerating(true);
    try {
      const response = await api.post("/ai/foods/generate");
      setData(response.data);
      toast.success("Local foods generated");
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Could not generate foods");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <PageHeader eyebrow="Healthy city foods" title="Local food recommendations with real nutrition context" subtitle="Search healthy dishes by macros, nutrients, benefits, and disease suitability." />
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-4 top-3.5 text-black/40 dark:text-white/40" size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search foods, nutrients, or conditions" className="w-full rounded-xl border border-black/10 bg-white/70 py-3 pl-11 pr-4 dark:border-white/10 dark:bg-white/10" /></div>
        <Button onClick={generate} disabled={generating}><Sparkles size={18} />{generating ? "Generating..." : "Generate foods"}</Button>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        {goalRecommendations.map((item) => (
          <Card key={item.goal}>
            <div className="flex items-center gap-3"><Target className="text-mint" /><h2 className="text-xl font-black">{item.goal}</h2></div>
            <p className="mt-3 text-sm font-semibold text-black/60 dark:text-white/60">{item.guidance}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.foods.map((food) => <span key={food} className="rounded-full bg-mint/10 px-3 py-1 text-xs font-black text-mint">{food}</span>)}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item: any, index: number) => (
          <Card key={item.name ?? index}>
            <div className="flex items-start justify-between gap-4"><h2 className="text-xl font-black">{formatValue(item.name ?? "Healthy local food")}</h2><MapPin className="text-coral" /></div>
            <div className="mt-5 space-y-4 text-sm font-semibold text-black/65 dark:text-white/65">
              <div><span className="font-black text-ink dark:text-white">Macros:</span> {formatValue(item.macros ?? item.macroDetails ?? "balanced macros")}</div>
              <div><span className="font-black text-ink dark:text-white">Nutrients:</span><div className="mt-2 flex flex-wrap gap-2">{toList(item.nutrients ?? "fiber, vitamins, minerals").map((value) => <span key={value} className="rounded-full bg-black/5 px-3 py-1 text-xs dark:bg-white/10">{value}</span>)}</div></div>
              <div><span className="font-black text-ink dark:text-white">Benefits:</span> {formatValue(item.benefits ?? item.healthBenefits ?? "supports energy and satiety")}</div>
              <div><span className="font-black text-ink dark:text-white">Suitability:</span> {formatValue(item.suitability ?? item.diseaseSuitability ?? "profile-aware")}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
