import { Mail } from "lucide-react";
import { Button } from "../../components/Button";
import { AuthShell } from "./AuthShell";

export const ForgotPasswordPage = () => (
  <AuthShell title="Reset password" subtitle="UI-ready password recovery flow for production email integration.">
    <div className="mt-6 space-y-4">
      <input className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/10" placeholder="Email address" type="email" />
      <Button className="w-full"><Mail size={18} />Send reset link</Button>
    </div>
  </AuthShell>
);
