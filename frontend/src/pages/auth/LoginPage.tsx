import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, LogIn } from "lucide-react";
import { api } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/Button";
import { AuthShell } from "./AuthShell";

export const LoginPage = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorText, setErrorText] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorText("");
    try {
      const { data } = await api.post("/auth/login", { email: form.email.trim().toLowerCase(), password: form.password });
      setSession(data.user, data.accessToken, data.refreshToken);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (error: any) {
      const message = error.response?.data?.message ?? "Login failed. Check your email and password.";
      setErrorText(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in securely to access your FOODFIT dashboard.">
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input required className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-white/10" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <div className="relative">
          <input required minLength={8} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-11 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-white/10" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Eye className="absolute right-4 top-3.5 text-slate-400" size={18} />
        </div>
        {errorText && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">{errorText}</div>}
        <div className="flex items-center justify-between text-sm font-semibold">
          <Link to="/forgot-password" className="text-blue-700 dark:text-blue-300">Forgot password?</Link>
          <Link to="/signup">Create account</Link>
        </div>
        <Button disabled={loading} className="w-full"><LogIn size={18} />{loading ? "Signing in..." : "Login"}</Button>
      </form>
    </AuthShell>
  );
};
