import DashboardFeatures from "@/features/dashboard/components/DashboardFeatures";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import DashboardLayout from "@/features/dashboard/layout/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardHeader className="mb-8" />

      <DashboardFeatures />
    </DashboardLayout>
  );
}
