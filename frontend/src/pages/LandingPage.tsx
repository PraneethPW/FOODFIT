import { motion } from "framer-motion";
import {
  BarChart3,
  Bot,
  Check,
  ChevronDown,
  Dumbbell,
  MapPin,
  Moon,
  Salad,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Utensils
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { FoodBowlScene } from "../components/FoodBowlScene";
import { Logo } from "../components/Logo";
import { useThemeStore } from "../store/themeStore";

const features: [string, string, LucideIcon][] = [
  ["Weekly AI diet plans", "Seven-day meal plans with macros, calories, nutrients, allergies, and cultural foods.", Utensils],
  ["Disease-aware nutrition", "Nutrition prompts consider diabetes, BP, thyroid, cholesterol, kidney concerns, and obesity.", ShieldCheck],
  ["Workout recommendations", "Home, gym, yoga, cardio, fat-loss, endurance, and muscle-gain routines.", Dumbbell],
  ["Local healthy foods", "City-aware food ideas with macro details, benefits, and disease suitability.", MapPin],
  ["Progress analytics", "Weight, calories, protein, hydration, and workout consistency in clean charts.", BarChart3],
  ["AI fitness assistant", "Ask for dinner ideas, protein options, workout swaps, and lifestyle guidance.", Bot]
];

const steps = ["Create profile", "Add health context", "Generate plans", "Track progress"];

const testimonials = [
  {
    name: "Ananya Rao",
    role: "Product Manager, Hyderabad",
    quote: "FOODFIT finally made meal planning feel realistic. The local food suggestions are practical, not generic.",
    result: "Lost 3.8 kg in 8 weeks"
  },
  {
    name: "Rahul Mehta",
    role: "Founder, Bengaluru",
    quote: "I wanted a clean dashboard, not another noisy fitness app. The plans, charts, and assistant feel focused.",
    result: "5 workouts per week"
  },
  {
    name: "Maya Singh",
    role: "Consultant, Mumbai",
    quote: "The disease-aware meal swaps helped me plan around family health concerns without overthinking every meal.",
    result: "Protein target hit 82% more often"
  }
];

const faqs = [
  ["Why does FOODFIT ask for health conditions?", "So recommendations can avoid obvious risks and include safer swaps. It is guidance, not a replacement for medical care."],
  ["How does FOODFIT personalize plans?", "FOODFIT uses your profile, goals, allergies, city, and health conditions to generate nutrition and workout recommendations."],
  ["Does it work for Indian cities and foods?", "Yes. City is part of the profile and is included when generating local food and weekly meal suggestions."]
];

export const LandingPage = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="mesh-bg min-h-screen overflow-hidden text-slate-950 dark:text-white">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/70 bg-white/85 px-4 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
        <div className="container-xl flex items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-white">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/login"><Button variant="secondary">Sign in</Button></Link>
            <Link to="/signup" className="hidden sm:block"><Button>Get started</Button></Link>
          </div>
        </div>
      </header>

      <section className="section pb-12 pt-32">
        <div className="container-xl grid items-center gap-12 lg:grid-cols-[1.02fr_.98fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200">
              <Sparkles size={16} />
              AI plans for food, fitness, and lifestyle
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-slate-950 dark:text-white sm:text-7xl">
              Clean health planning for real life.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              FOODFIT turns your profile, city, goals, and health context into practical diet plans, workouts, local food recommendations, and progress analytics.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/signup"><Button className="w-full sm:w-auto">Create my plan</Button></Link>
              <a href="#features"><Button variant="secondary" className="w-full sm:w-auto">View features</Button></a>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ["7 days", "AI meal plan"],
                ["24/7", "fitness assistant"],
                ["City", "local food picks"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <div className="text-2xl font-black text-blue-700 dark:text-blue-300">{value}</div>
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-blue-950/10 dark:border-white/10 dark:bg-white/5">
              <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">Today</p>
                    <h2 className="mt-1 text-2xl font-black">Nutrition overview</h2>
                  </div>
                  <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-black">On track</span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {["2,120 kcal", "128g protein", "3.0L water"].map((item) => (
                    <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm font-bold">{item}</div>
                  ))}
                </div>
                <div className="mt-5 h-[300px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-sky-400/10">
                  <FoodBowlScene />
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
                  <p className="text-xs font-black uppercase text-slate-400">Dinner</p>
                  <p className="mt-1 font-black">Paneer tikka bowl</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
                  <p className="text-xs font-black uppercase text-slate-400">Workout</p>
                  <p className="mt-1 font-black">35 min strength</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-14">
        <div className="container-xl">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="grid items-center gap-4 text-center md:grid-cols-[.7fr_1.3fr] md:text-left">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">Built like modern health software</p>
              <div className="grid gap-3 text-sm font-black text-slate-500 dark:text-slate-300 sm:grid-cols-4">
                {["AI Nutrition", "Macro Intelligence", "Local Foods", "Workout Analytics"].map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/10">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="container-xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">Platform</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Everything stays practical, personal, and measurable.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map(([title, text, Icon]) => (
              <Card key={title} className="rounded-3xl border-slate-200 bg-white p-6 shadow-sm dark:bg-white/5">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300"><Icon /></span>
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white/70 dark:bg-white/[0.03]">
        <div className="container-xl grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">3D AI wellness console</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">A visual planning system for meals, macros, and movement.</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              The interactive 3D health bowl represents the FOODFIT engine: nutrition signals, workout context, local foods, and progress data converging into one weekly plan.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Protein", "Calories", "Recovery"].map((metric, index) => (
                <div key={metric} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
                  <p className="text-3xl font-black text-blue-700 dark:text-blue-300">{[126, 2080, 92][index]}{index === 0 ? "g" : index === 1 ? "" : "%"}</p>
                  <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">{metric}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-[2rem] border border-slate-200 bg-slate-950 p-4 shadow-2xl shadow-blue-950/20 dark:border-white/10">
            <div className="absolute left-8 top-8 z-10 rounded-full bg-white/10 px-4 py-2 text-xs font-black text-blue-100 backdrop-blur">LIVE 3D PLAN</div>
            <div className="h-[460px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,.24),transparent_40%),linear-gradient(180deg,#0f172a,#020617)]">
              <FoodBowlScene />
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="section bg-white/70 dark:bg-white/[0.03]">
        <div className="container-xl">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">Workflow</p>
              <h2 className="mt-3 text-4xl font-black sm:text-5xl">A simple path from profile to plan.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {steps.map((step, index) => (
                <div key={step} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
                  <span className="text-sm font-black text-blue-700 dark:text-blue-300">0{index + 1}</span>
                  <h3 className="mt-3 text-xl font-black">{step}</h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">Designed to be fast, readable, and useful on mobile or desktop.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">Testimonials</p>
            <h2 className="mt-3 text-4xl font-black sm:text-5xl">Trusted by people who need health systems that fit busy lives.</h2>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.name} className="rounded-3xl bg-white p-6 dark:bg-white/5">
                <div className="flex gap-1 text-amber-500">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
                <p className="mt-5 text-lg font-bold leading-8">"{item.quote}"</p>
                <div className="mt-6 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-black text-blue-700 dark:bg-blue-400/10 dark:text-blue-200">{item.result}</div>
                <p className="mt-5 font-black">{item.name}</p>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{item.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="section bg-slate-950 text-white">
        <div className="container-xl">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">Pricing</p>
            <h2 className="mt-3 text-4xl font-black sm:text-5xl">Start free. Upgrade when you need deeper planning.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {["Starter", "Pro", "Coach"].map((tier, index) => (
              <div key={tier} className={`rounded-3xl border p-6 ${index === 1 ? "border-blue-400 bg-blue-500/10" : "border-white/10 bg-white/5"}`}>
                <h3 className="text-2xl font-black">{tier}</h3>
                <p className="mt-4 text-4xl font-black">{index === 0 ? "Free" : `Rs ${index === 1 ? "499" : "999"}`}<span className="text-sm text-slate-400">/mo</span></p>
                <div className="mt-6 space-y-3">
                  {["AI diet plans", "Workout generator", "Analytics", index > 0 ? "Advanced assistant" : "Core planning"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm font-semibold"><Check size={16} className="text-blue-300" />{item}</div>
                  ))}
                </div>
                <Link to="/signup"><Button className="mt-8 w-full">{index === 0 ? "Try free" : "Choose plan"}</Button></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="section">
        <div className="container-xl max-w-3xl">
          <h2 className="text-4xl font-black">Questions</h2>
          <div className="mt-8 space-y-3">
            {faqs.map(([question, answer]) => (
              <details key={question} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-black">{question}<ChevronDown /></summary>
                <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-10 dark:border-white/10 dark:bg-slate-950">
        <div className="container-xl flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Logo />
          <div className="flex flex-wrap gap-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a><a href="#">LinkedIn</a><a href="#">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

