import DashboardFeatureCard from "./DashboardFeatureCard";
import DashboardCreditsAlert from "./DashboardCreditsAlert";
import type { IconType } from "react-icons/lib";
import { Activity, Mic, UserSearch } from "lucide-react";

export interface IFeature {
  id: number;
  title: string;
  description: string;
  used: number;
  total: number;
  icon: IconType;
}

export default function DashboardFeatures() {
  const features: IFeature[] = [
    {
      id: 1,
      title: "Quiz",
      description: "Realize quizzes para avaliar seus conhecimentos.",
      used: 1,
      total: 10,
      icon: Activity,
    },
    {
      id: 2,
      title: "Análise de entrevistas",
      description: "Análise de entrevistas",
      used: 2,
      total: 10,
      icon: Mic,
    },
    {
      id: 3,
      title: "Roadmap",
      description: "Crie um roadmap para alcançar seus objetivos.",
      used: 3,
      total: 10,
      icon: UserSearch,
    },
  ];

  return (
    <div className="">
      <div className="flex items-center gap-4 mb-4">
        <DashboardFeatureCard className="flex-1" feature={features[0]} />
        <DashboardFeatureCard className="flex-1" feature={features[1]} />
        <DashboardFeatureCard className="flex-1" feature={features[2]} />
      </div>

      <DashboardCreditsAlert />
    </div>
  );
}
