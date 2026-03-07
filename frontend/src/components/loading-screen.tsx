import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
        <div className="relative flex items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute w-16 h-16 border-4 border-primary/20 rounded-full"></div>
          {/* Spinning Ring */}
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            Code Dragon
          </h2>
          <p className="text-sm text-muted-foreground animate-pulse">
            Verificando sua conta...
          </p>
        </div>
      </div>
    </div>
  );
}
