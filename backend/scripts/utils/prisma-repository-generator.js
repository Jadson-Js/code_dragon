/**
 * Prisma Repository Implementation Generator
 * Generates concrete Prisma-based repository implementations.
 */

import path from "node:path";
import { parseModel } from "./shared/prisma-parser.js";
import { getModelNames, toCamelCase } from "./shared/naming.js";
import { getModulePaths, writeFile } from "./shared/paths.js";

export function generatePrismaRepository(modelName, modelDefinition) {
  const fields = parseModel(modelDefinition);
  const names = getModelNames(modelName);
  const paths = getModulePaths(names.kebab);
  const prismaModel = toCamelCase(modelName); // For prisma.user, prisma.post, etc.

  let content = `import { ${names.pascal} } from "@/domain/entities/${names.entityFile}";
import type { ${names.repoInterface} } from "@/domain/repositories/${names.repoFile}";
import { prisma } from "../../../../prisma/client";
import { injectable } from "tsyringe";

function ${names.prismaToDomain}(raw: any): ${names.pascal} {
  return ${names.pascal}.create({
`;

  for (const field of fields) {
    content += `    ${field.name}: raw.${field.name},\n`;
  }

  content += `  });
}

function ${names.domainToPrisma}(domain: ${names.pascal}): any {
  return {
`;

  for (const field of fields) {
    content += `    ${field.name}: domain.${field.name},\n`;
  }

  content += `  };
}

@injectable()
export class ${names.repoClass} implements ${names.repoInterface} {
  async create(data: ${names.pascal}): Promise<${names.pascal}> {
    const raw = ${names.domainToPrisma}(data);
    const response = await prisma.${prismaModel}.create({
      data: raw,
    });

    return ${names.prismaToDomain}(response);
  }

  async update(data: ${names.pascal}): Promise<${names.pascal}> {
    const raw = ${names.domainToPrisma}(data);
    const response = await prisma.${prismaModel}.update({
      where: {
        id: raw.id,
      },
      data: raw,
    });

    return ${names.prismaToDomain}(response);
  }

  async delete(id: string): Promise<void> {
    await prisma.${prismaModel}.delete({
      where: {
        id,
      },
    });
  }

  async findById(id: string): Promise<${names.pascal} | null> {
    const response = await prisma.${prismaModel}.findUnique({
      where: {
        id,
      },
    });

    return response ? ${names.prismaToDomain}(response) : null;
  }

  async findAll(): Promise<${names.pascal}[]> {
    const response = await prisma.${prismaModel}.findMany();

    return response.map(${names.prismaToDomain});
  }
}
`;

  // Write file
  const filePath = path.join(paths.prismaRepo, `${names.prismaRepoFile}.ts`);
  writeFile(filePath, content);
}
