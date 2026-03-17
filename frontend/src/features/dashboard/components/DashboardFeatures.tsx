import DashboardFeatureCard from "./DashboardFeatureCard";
import DashboardCreditsAlert from "./DashboardCreditsAlert";

export default function DashboardFeatures() {
  return (
    <div className="">
      <div className="flex items-center gap-4 mb-4">
        <DashboardFeatureCard className="flex-1" />
        <DashboardFeatureCard className="flex-1" />
        <DashboardFeatureCard className="flex-1" />
      </div>

      <DashboardCreditsAlert />
    </div>
  );
}
