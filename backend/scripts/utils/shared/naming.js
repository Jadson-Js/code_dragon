/**
 * Shared Naming Utilities
 * Provides consistent naming conventions across all generators.
 */

/**
 * Converts PascalCase/camelCase to kebab-case.
 * @param {string} str - Input string (e.g., "UserProfile")
 * @returns {string} - Kebab-case string (e.g., "user-profile")
 */
export function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Converts string to camelCase.
 * @param {string} str - Input string (e.g., "UserProfile")
 * @returns {string} - camelCase string (e.g., "userProfile")
 */
export function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * Converts string to PascalCase (first letter uppercase).
 * @param {string} str - Input string
 * @returns {string} - PascalCase string
 */
export function toPascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates common naming conventions for a model.
 * @param {string} modelName - Model name in PascalCase (e.g., "User")
 * @returns {Object} - Object with all naming variants
 */
export function getModelNames(modelName) {
  const kebab = toKebabCase(modelName);
  const camel = toCamelCase(modelName);
  const pascal = toPascalCase(modelName);

  return {
    // Base names
    kebab, // "user-profile"
    camel, // "userProfile"
    pascal, // "UserProfile"

    // Class names
    entityClass: pascal, // "User"
    controllerClass: `${pascal}Controller`, // "UserController"
    repoInterface: `I${pascal}Repository`, // "IUserRepository"
    repoClass: `${pascal}PrismaRepository`, // "UserPrismaRepository"

    // File names (without extension)
    entityFile: `${kebab}.entity`,
    controllerFile: `${kebab}.controller`,
    routesFile: `${kebab}.routes`,
    schemaFile: `${kebab}.schema`,
    dtoFile: `${kebab}.dto`,
    presenterFile: `${kebab}.presenter`,
    containerFile: `${kebab}.container`,
    repoFile: `${kebab}.repository`,
    prismaRepoFile: `${kebab}.prisma.repository`,

    // Use case class names
    createUseCase: `Create${pascal}UseCase`,
    findAllUseCase: `FindAll${pascal}UseCase`,
    findByIdUseCase: `FindById${pascal}UseCase`,
    updateUseCase: `Update${pascal}UseCase`,
    deleteUseCase: `Delete${pascal}UseCase`,

    // DI tokens
    repoToken: `${pascal}Repository`,
    createUseCaseToken: `Create${pascal}UseCase`,
    findAllUseCaseToken: `FindAll${pascal}UseCase`,
    findByIdUseCaseToken: `FindById${pascal}UseCase`,
    updateUseCaseToken: `Update${pascal}UseCase`,
    deleteUseCaseToken: `Delete${pascal}UseCase`,

    // DTO names
    createDto: `Create${pascal}DTO`,
    responseDto: `${pascal}ResponseDTO`,

    // Presenter function
    presenterFn: `${camel}ToHTTP`,

    // Mapper functions
    prismaToDomain: `${camel}PrismaToDomain`,
    domainToPrisma: `${camel}DomainToPrisma`,
  };
}
