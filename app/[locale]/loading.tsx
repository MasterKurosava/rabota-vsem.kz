import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        </div>
        <p className="text-sm font-medium text-foreground-secondary">
          Загрузка...
        </p>
      </div>
    </div>
  );
}

