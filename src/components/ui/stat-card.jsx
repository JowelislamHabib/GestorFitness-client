import { AnimatedCounter } from "@/components/ui/animated-counter";
import Link from "next/link";
import { cn } from "@/lib/utils";

const colorStyles = {
  blue: {
    bg: "from-red-500/10",
    iconBg: "from-red-500/20 to-red-500/5",
    text: "text-red-500",
    borderText: "text-red-700 dark:text-red-400",
    linkBg: "bg-red-50/80 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 border-red-100 dark:border-red-900"
  },
  emerald: {
    bg: "from-emerald-500/10",
    iconBg: "from-emerald-500/20 to-emerald-500/5",
    text: "text-emerald-500",
    borderText: "text-emerald-700 dark:text-emerald-400",
    linkBg: "bg-emerald-50/80 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 border-emerald-100 dark:border-emerald-900"
  },
  rose: {
    bg: "from-rose-500/10",
    iconBg: "from-rose-500/20 to-rose-500/5",
    text: "text-rose-500",
    borderText: "text-rose-700 dark:text-rose-400",
    linkBg: "bg-rose-50/80 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 border-rose-100 dark:border-rose-900"
  },
  purple: {
    bg: "from-purple-500/10",
    iconBg: "from-purple-500/20 to-purple-500/5",
    text: "text-purple-500",
    borderText: "text-purple-700 dark:text-purple-400",
    linkBg: "bg-purple-50/80 hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-900/40 border-purple-100 dark:border-purple-900"
  },
  orange: {
    bg: "from-orange-500/10",
    iconBg: "from-orange-500/20 to-orange-500/5",
    text: "text-orange-500",
    borderText: "text-orange-700 dark:text-orange-400",
    linkBg: "bg-orange-50/80 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-900/40 border-orange-100 dark:border-orange-900"
  },
  indigo: {
    bg: "from-indigo-500/10",
    iconBg: "from-indigo-500/20 to-indigo-500/5",
    text: "text-indigo-500",
    borderText: "text-indigo-700 dark:text-indigo-400",
    linkBg: "bg-indigo-50/80 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 border-indigo-100 dark:border-indigo-900"
  },
  red: {
    bg: "from-red-500/10",
    iconBg: "from-red-500/20 to-red-500/5",
    text: "text-red-500",
    borderText: "text-red-700 dark:text-red-400",
    linkBg: "bg-red-50/80 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 border-red-100 dark:border-red-900"
  },
  cyan: {
    bg: "from-cyan-500/10",
    iconBg: "from-cyan-500/20 to-cyan-500/5",
    text: "text-cyan-500",
    borderText: "text-cyan-700 dark:text-cyan-400",
    linkBg: "bg-cyan-50/80 hover:bg-cyan-100 dark:bg-cyan-950/30 dark:hover:bg-cyan-900/40 border-cyan-100 dark:border-cyan-900"
  }
};

export function StatCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  description,
  prefix = "",
  link,
  variant = "default", // default | horizontal
  className
}) {
  const styles = colorStyles[color] || colorStyles.blue;
  const isHorizontal = variant === "horizontal";

  if (isHorizontal) {
    return (
      <article className={cn("min-w-0 flex flex-col rounded-3xl border border-border/50 to-card/50 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] p-6 transition-all hover:bg-muted/20 bg-gradient-to-br", styles.bg, className)}>
        <div className={cn("flex items-center gap-3 mb-4", styles.borderText)}>
          <div className={cn("flex size-10 items-center justify-center rounded-xl bg-gradient-to-br", styles.iconBg)}>
            <Icon className="size-5" />
          </div>
          <span className="font-semibold">{title}</span>
        </div>
        <div className="text-3xl font-bold text-foreground">
          {typeof value === 'number' ? (
            <>{prefix}<AnimatedCounter value={value} /></>
          ) : (
            <>{prefix}{value}</>
          )}
        </div>
        {description && (
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">
            {description}
          </p>
        )}
      </article>
    );
  }

  // Default variant
  return (
    <article className={cn("min-w-0 group relative overflow-hidden border border-border/50 to-card/50 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] transition-all flex flex-col bg-gradient-to-br", styles.bg, link ? "rounded-2xl" : "rounded-xl items-center justify-center text-center p-6", className)}>
      <div className={cn("flex flex-col items-center justify-center text-center", link && "p-6")}>
        <div className={cn("flex size-14 items-center justify-center rounded-full mb-3 group-hover:scale-110 transition-transform bg-gradient-to-br", styles.iconBg, styles.text)}>
          <Icon className="size-6" />
        </div>
        <div className="text-4xl font-heading font-bold text-foreground flex items-center justify-center h-10">
          {typeof value === 'number' ? (
            <>{prefix}<AnimatedCounter value={value} /></>
          ) : (
            <>{prefix}{value}</>
          )}
        </div>
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-1">
          {title}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground mt-2">
            {description}
          </p>
        )}
      </div>
      {link && (
        <Link href={link.href} className={cn("mt-auto flex items-center justify-center w-full py-3 font-semibold text-sm transition-colors border-t", styles.linkBg, styles.borderText)}>
          {link.text}
        </Link>
      )}
    </article>
  );
}
