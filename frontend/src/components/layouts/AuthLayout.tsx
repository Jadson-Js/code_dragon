import AuthSidebar from "@/features/auth/components/AuthSidebar";
import { type ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <AuthSidebar />

      {children}
    </div>
  );
}
