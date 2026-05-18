export const PageHeader = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) => (
  <div className="mb-6 sm:mb-8">
    <p className="text-xs font-black uppercase tracking-[0.2em] text-coral">{eyebrow}</p>
    <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight sm:text-5xl">{title}</h1>
    <p className="mt-3 max-w-2xl text-black/60 dark:text-white/60">{subtitle}</p>
  </div>
);

