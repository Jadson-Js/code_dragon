import fs from "node:fs";
import path from "node:path";

function parseModel(modelDefinition) {
  const lines = modelDefinition.split("\n");
  const fields = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      !trimmed ||
      trimmed.startsWith("model") ||
      trimmed.startsWith("}") ||
      trimmed.startsWith("//") ||
      trimmed.startsWith("@@")
    ) {
      continue;
    }

    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) continue;

    const name = parts[0];
    fields.push({ name });
  }
  return fields;
}

export function generatePrismaRepository(modelName, modelDefinition) {
  const fields = parseModel(modelDefinition);
  const kebabCaseName = modelName
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();

  const className = modelName;
  const repoInterfaceName = `I${className}Repository`;
  const repoImplementationName = `${className}PrismaRepository`;
  const mapperName = `${className.charAt(0).toLowerCase() + className.slice(1)}PrismaToDomain`;
  const prismaModelName =
    className.charAt(0).toLowerCase() + className.slice(1); // user, post

  let content = `import { ${className} } from "@/domain/entities/${kebabCaseName}.entity";
import type { ${repoInterfaceName} } from "@/domain/repositories/${kebabCaseName}.repository";
import { prisma } from "../../../../prisma/client";
import { injectable } from "tsyringe";

function ${mapperName}(raw: any): ${className} {
  return ${className}.create({
`;

  fields.forEach((field) => {
    content += `    ${field.name}: raw.${field.name},\n`;
  });

  content += `  });
}

@injectable()
export class ${repoImplementationName} implements ${repoInterfaceName} {
  async create(data: ${className}): Promise<${className}> {
    const response = await prisma.${prismaModelName}.create({
      data: data,
    });

    return ${mapperName}(response);
  }

  async update(data: ${className}): Promise<${className}> {
    const response = await prisma.${prismaModelName}.update({
      where: {
        id: data.id,
      },
      data: data,
    });

    return ${mapperName}(response);
  }

  async delete(id: string): Promise<void> {
    await prisma.${prismaModelName}.delete({
      where: {
        id,
      },
    });
  }

  async findById(id: string): Promise<${className} | null> {
    const response = await prisma.${prismaModelName}.findUnique({
      where: {
        id,
      },
    });

    return response ? ${mapperName}(response) : null;
  }

  async findAll(): Promise<${className}[]> {
    const response = await prisma.${prismaModelName}.findMany();

    return response.map(${mapperName});
  }
}
`;

  const repoPath = path.join(
    process.cwd(),
    "src",
    "infra",
    "database",
    "prisma",
    `${kebabCaseName}.prisma.repository.ts`,
  );
  const dir = path.dirname(repoPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(repoPath, content);
  console.log(`Arquivo gerado: ${repoPath}`);
}
