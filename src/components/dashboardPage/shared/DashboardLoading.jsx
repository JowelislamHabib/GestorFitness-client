import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-border">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-lg font-semibold text-foreground">Loading dashboard...</h3>
        <p className="text-sm text-muted-foreground">Please wait while we fetch your data.</p>
      </div>
    </div>
  );
}
