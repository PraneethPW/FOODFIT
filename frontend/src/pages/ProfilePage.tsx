import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Save } from "lucide-react";
import { api } from "../lib/api";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";

const diseaseOptions = ["diabetes", "blood pressure", "thyroid", "obesity", "cholesterol", "kidney issues"];

export const ProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({
    age: 28, gender: "MALE", heightCm: 175, weightKg: 78, city: "Hyderabad", foodPreference: "VEGETARIAN", allergies: [], diseases: [], goal: "WEIGHT_LOSS", activityLevel: "moderate"
  });

  useEffect(() => {
    api.get("/profile").then(({ data }) => data.profile && setForm((current: any) => ({ ...current, ...data.profile }))).catch(() => null);
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.put("/profile", { ...form, age: Number(form.age), heightCm: Number(form.heightCm), weightKg: Number(form.weightKg) });
      toast.success("Profile saved");
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Could not save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <PageHeader eyebrow="Profile setup" title="Tell NutriCue what your body needs" subtitle="Your city, health conditions, allergies, goals, and preferences shape every AI recommendation." />
      <form onSubmit={submit} className="grid gap-4 xl:grid-cols-[1fr_.8fr]">
        <Card className="grid gap-4 sm:grid-cols-2">
          {[
            ["age", "Age", "number"],
            ["heightCm", "Height (cm)", "number"],
            ["weightKg", "Weight (kg)", "number"],
            ["city", "City", "text"]
          ].map(([key, label, type]) => (
            <label key={key} className="text-sm font-bold">{label}<input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-2 w-full rounded-xl border border-black/10 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/10" /></label>
          ))}
          <label className="text-sm font-bold">Gender<select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="mt-2 w-full rounded-xl border border-black/10 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/10"><option value="MALE">Male</option><option value="FEMALE">Female</option><option value="NON_BINARY">Non-binary</option><option value="PREFER_NOT_TO_SAY">Prefer not to say</option></select></label>
          <label className="text-sm font-bold">Food preference<select value={form.foodPreference} onChange={(e) => setForm({ ...form, foodPreference: e.target.value })} className="mt-2 w-full rounded-xl border border-black/10 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/10"><option value="VEGETARIAN">Vegetarian</option><option value="NON_VEGETARIAN">Non vegetarian</option><option value="VEGAN">Vegan</option><option value="EGGETARIAN">Eggetarian</option><option value="JAIN">Jain</option></select></label>
          <label className="text-sm font-bold">Goal<select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} className="mt-2 w-full rounded-xl border border-black/10 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/10"><option value="WEIGHT_LOSS">Weight loss</option><option value="WEIGHT_GAIN">Weight gain</option><option value="MAINTENANCE">Maintenance</option><option value="MUSCLE_GAIN">Muscle gain</option><option value="ENDURANCE">Endurance</option></select></label>
          <label className="text-sm font-bold">Allergies<input value={form.allergies?.join(", ")} onChange={(e) => setForm({ ...form, allergies: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} className="mt-2 w-full rounded-xl border border-black/10 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/10" placeholder="peanuts, lactose" /></label>
        </Card>
        <Card>
          <h2 className="text-xl font-black">Health conditions</h2>
          <div className="mt-5 grid gap-3">
            {diseaseOptions.map((disease) => (
              <label key={disease} className="flex items-center gap-3 rounded-xl bg-black/5 p-3 font-semibold dark:bg-white/10">
                <input type="checkbox" checked={form.diseases?.includes(disease)} onChange={(e) => setForm({ ...form, diseases: e.target.checked ? [...form.diseases, disease] : form.diseases.filter((item: string) => item !== disease) })} />
                {disease}
              </label>
            ))}
          </div>
          <Button disabled={loading} className="mt-6 w-full"><Save size={18} />{loading ? "Saving..." : "Save profile"}</Button>
        </Card>
      </form>
    </div>
  );
};

