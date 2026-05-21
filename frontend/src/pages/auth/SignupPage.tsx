import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";
import { api } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/Button";
import { AuthShell } from "./AuthShell";

export const SignupPage = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errorText, setErrorText] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorText("");
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      };
      const { data } = await api.post("/auth/signup", payload);
      setSession(data.user, data.accessToken, data.refreshToken);
      toast.success("Account created");
      navigate("/profile");
    } catch (error: any) {
      const fieldErrors = error.response?.data?.errors?.fieldErrors;
      const details = fieldErrors
        ? Object.entries(fieldErrors).flatMap(([field, messages]) => (messages as string[]).map((message) => `${field}: ${message}`)).join(" ")
        : "";
      const message = details || error.response?.data?.message || "Signup failed. Check your details and try again.";
      setErrorText(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Set up your secure NutriCue account and build your personalized health profile.">
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Full name<input required minLength={2} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-white/10" placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Email<input required className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-white/10" placeholder="you@example.com" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Password<input required minLength={8} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-white/10" placeholder="At least 8 characters" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Password must be at least 8 characters.</p>
        {errorText && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">{errorText}</div>}
        <Button disabled={loading} className="w-full"><UserPlus size={18} />{loading ? "Creating..." : "Sign up"}</Button>
        <p className="text-center text-sm font-semibold text-slate-600 dark:text-slate-300">Already have an account? <Link to="/login" className="text-blue-700 dark:text-blue-300">Login</Link></p>
      </form>
    </AuthShell>
  );
};
