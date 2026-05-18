export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-black/10 dark:bg-white/10 ${className}`} />
);
