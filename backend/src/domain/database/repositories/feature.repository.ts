import type { Feature } from "@/domain/entities/feature.entity";

export interface IFeatureRepository {
  findBySlug(slug: string): Promise<Feature | null>;
}
