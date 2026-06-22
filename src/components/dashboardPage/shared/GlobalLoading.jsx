import { Loader2 } from "lucide-react";

export function GlobalLoading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
        <Loader2 className="size-8 animate-spin" />
      </div>
      <p className="text-sm font-bold text-muted-foreground animate-pulse">Loading data, please wait...</p>
    </div>
  );
}
