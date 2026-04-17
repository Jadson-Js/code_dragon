import { injectable } from "tsyringe";
import { prisma } from "../../../../prisma/client";
import { Feature } from "@/entities/feature.entity";

export interface IFeatureRepository {
  findBySlug(slug: string): Promise<Feature | null>;
}

@injectable()
export class FeaturePrismaRepository implements IFeatureRepository {
  async findBySlug(slug: string): Promise<Feature | null> {
    const feature = await prisma.feature.findUnique({
      where: { slug },
    });

    if (!feature) {
      return null;
    }

    return feature.toDomain;
  }
}
