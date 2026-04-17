import { injectable } from "tsyringe";
import { prisma } from "../../../../prisma/client";
import { Feature } from "@/entities/feature.entity";



@injectable()
export class FeaturePrismaRepository {
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
