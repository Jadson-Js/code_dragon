import { type ReactNode } from "react";
import DashboardSidebar from "../components/DashboardSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <DashboardSidebar />

      <div className="ml-80 p-8 w-full">{children}</div>
    </div>
  );
}
