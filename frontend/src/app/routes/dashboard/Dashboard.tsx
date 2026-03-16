import DashboardFeatures from "@/features/dashboard/components/DashboardFeatures";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import DashboardInterviewGraph from "@/features/dashboard/components/DashboardInterviewGraph";
import DashboardMapSkills from "@/features/dashboard/components/DashboardMapSkills";
import DashboardLayout from "@/features/dashboard/layout/DashboardLayout";
import DashboardAuditGraph from "@/features/dashboard/components/DashboardAuditGraph";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DashboardHeader />
        <DashboardFeatures />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <DashboardMapSkills />
          </div>
          <div className="col-span-8">
            <DashboardInterviewGraph />
          </div>
          <div className="col-span-4">
            <DashboardAuditGraph />
          </div>
          <div className="col-span-8">
            <DashboardMapSkills />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
