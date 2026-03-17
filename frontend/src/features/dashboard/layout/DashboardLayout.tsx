import { type ReactNode } from "react";
import DashboardSidebar from "../components/DashboardSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <DashboardSidebar />

      <div className="ml-64 p-8 w-full">{children}</div>
    </div>
  );
}
