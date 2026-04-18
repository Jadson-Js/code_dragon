import { injectable } from "tsyringe";
import { prisma } from "../../../../prisma/client";
import type { Feature } from "generated/prisma/client";

@injectable()
export class FeaturePrismaRepository {
  async findBySlug(slug: string): Promise<Feature | null> {
    const feature = await prisma.feature.findUnique({
      where: { slug },
    });

    if (!feature) {
      return null;
    }

    return feature;
  }
}
