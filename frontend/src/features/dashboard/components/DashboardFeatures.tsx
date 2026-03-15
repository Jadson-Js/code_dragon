import PageHeader from "@/components/PageHeader";
import DashboardFeatureCard from "./DashboardFeatureCard";

export default function DashboardFeatures() {
  return (
    <div className="card bg-primary-1/10">
      <PageHeader
        title="Meu Pack Aceleração"
        description="Seus recursos e progresso"
        className="mb-4"
        type="h2"
      />

      <div className="flex items-center gap-4">
        <DashboardFeatureCard className="flex-1" />
        <DashboardFeatureCard className="flex-1" />
        <DashboardFeatureCard className="flex-1" />
      </div>
    </div>
  );
}
