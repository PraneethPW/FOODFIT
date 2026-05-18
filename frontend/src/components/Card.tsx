import { HTMLAttributes } from "react";
import clsx from "clsx";

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("glass rounded-2xl p-4 shadow-xl shadow-black/5 transition duration-200 dark:shadow-black/20 sm:p-5", className)} {...props} />
);
