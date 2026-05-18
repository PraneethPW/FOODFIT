import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { Logo } from "../../components/Logo";

export const AuthShell = ({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) => (
  <div className="mesh-bg min-h-screen px-4 py-8 text-slate-950 dark:text-white">
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[.95fr_1.05fr]">
      <div className="hidden lg:block">
        <Logo />
        <h1 className="mt-10 max-w-lg text-5xl font-black leading-tight tracking-tight">Personal health planning, without the noise.</h1>
        <p className="mt-5 max-w-md text-lg leading-8 text-slate-600 dark:text-slate-300">
          Create a secure account, complete your health profile, and generate nutrition and training plans tailored to your real goals.
        </p>
        <div className="mt-8 grid max-w-md gap-3">
          {["AI weekly diet plans", "City-specific healthy foods", "Workout and progress analytics"].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 font-bold shadow-sm dark:border-white/10 dark:bg-white/5">{item}</div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md justify-self-center">
        <div className="mb-8 flex justify-center lg:hidden"><Logo /></div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/10 dark:border-white/10 dark:bg-slate-900">
        <h1 className="text-3xl font-black tracking-tight">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p>
        {children}
      </div>
      <Link to="/" className="mt-5 block text-center text-sm font-bold text-slate-500 dark:text-slate-400">Back to FOODFIT</Link>
      </div>
    </div>
  </div>
);
