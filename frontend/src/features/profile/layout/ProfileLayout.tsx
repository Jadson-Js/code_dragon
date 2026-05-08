import type { ReactNode } from "react";

export function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-1 flex flex-col items-center justify-center p-4 container mx-auto max-w-2xl">
      {/* Logo */}
      <div className="h-12 mb-12">
        <img src="/logo.svg" alt="logo" className="img" />
      </div>

      {children}
    </div>
  );
}
