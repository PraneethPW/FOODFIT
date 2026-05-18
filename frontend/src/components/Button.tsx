import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = ({ className, variant = "primary", ...props }: Props) => (
  <button
    className={clsx(
      "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60",
      variant === "primary" && "bg-blue-700 text-white shadow-glow hover:-translate-y-0.5 hover:bg-blue-800 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400",
      variant === "secondary" && "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-white",
      variant === "ghost" && "text-ink hover:bg-black/5 dark:text-white dark:hover:bg-white/10",
      className
    )}
    {...props}
  />
);
