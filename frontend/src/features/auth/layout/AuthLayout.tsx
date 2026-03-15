import AuthSidebar from "@/features/auth/components/AuthSidebar";
import { type ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <AuthSidebar />

      <div className="px-4 md:px-8 w-full max-w-xl m-auto">{children}</div>
    </div>
  );
}
