import { type ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 p-8 w-full">{children}</div>
    </div>
  );
}
