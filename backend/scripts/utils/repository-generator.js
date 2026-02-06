import fs from "node:fs";
import path from "node:path";

export function generateRepository(modelName) {
  const kebabCaseName = modelName
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();

  const className = modelName;
  const interfaceName = `I${className}Repository`;

  const content = `import type { ${className} } from "@/domain/entities/${kebabCaseName}.entity";

export interface ${interfaceName} {
  create(data: ${className}): Promise<${className}>;
  update(data: ${className}): Promise<${className}>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<${className} | null>;
  findAll(): Promise<${className}[]>;
}
`;

  const repoPath = path.join(
    process.cwd(),
    "src",
    "domain",
    "repositories",
    `${kebabCaseName}.repository.ts`,
  );
  const dir = path.dirname(repoPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(repoPath, content);
  console.log(`Arquivo gerado: ${repoPath}`);
}
