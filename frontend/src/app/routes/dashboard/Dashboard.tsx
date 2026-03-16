import DashboardFeatures from "@/features/dashboard/components/DashboardFeatures";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import DashboardMapSkills from "@/features/dashboard/components/DashboardMapSkills";
import DashboardLayout from "@/features/dashboard/layout/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DashboardHeader />
        <DashboardFeatures />

        <div className="grid grid-cols-2 gap-4">
          <DashboardMapSkills />
          <DashboardMapSkills />
          <DashboardMapSkills />
          <DashboardMapSkills />
        </div>
      </div>
    </DashboardLayout>
  );
}
