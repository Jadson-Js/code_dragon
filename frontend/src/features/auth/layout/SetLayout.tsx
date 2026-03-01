import type { ReactNode } from "react";

export function SetupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-1 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-12">
        <img src="/public/logo.svg" alt="logo" className="img" />
      </div>

      {children}
    </div>
  );
}
