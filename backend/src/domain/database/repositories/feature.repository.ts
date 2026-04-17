import type { Feature } from "@/entities/feature.entity";

export interface IFeatureRepository {
  findBySlug(slug: string): Promise<Feature | null>;
}
