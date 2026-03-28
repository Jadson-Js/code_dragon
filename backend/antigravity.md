# Antigravity — Backend Architecture Catalog

> Este arquivo é o mapa completo da API. Toda IA que gerar código **deve seguir os padrões aqui definidos** sem exceção.

---

## 1. Tech Stack

| Categoria                  | Tecnologia                              |
| -------------------------- | --------------------------------------- |
| **Runtime**                | Node.js (ESM, `"type": "module"`)       |
| **Language**               | TypeScript 5                            |
| **Framework HTTP**         | Express 5                               |
| **ORM**                    | Prisma 7 (adapter pg)                   |
| **Banco de Dados**         | PostgreSQL                              |
| **Cache / Sessions**       | Redis (via ioredis)                     |
| **Filas**                  | BullMQ                                  |
| **IA / LLM**               | Google Gemini (`@google/genai`)         |
| **Injeção de Dependência** | tsyringe (decorators)                   |
| **Validação de Schema**    | Zod 4                                   |
| **Auth**                   | JWT (jsonwebtoken) com cookies httpOnly |
| **Hash**                   | bcrypt                                  |
| **Email**                  | Resend                                  |
| **Testes**                 | Jest + ts-jest                          |
| **Lint**                   | ESLint (`typescript-eslint`)            |
| **Format**                 | Prettier                                |
| **Dev Server**             | tsx watch                               |

---

## 2. Estrutura de Diretórios

```
src/
├── @types/           # Extensões de tipos globais (ex: Express Request)
├── domain/           # Núcleo do negócio — ZERO dependências de infra
│   ├── entities/         # Entidades de domínio
│   ├── database/
│   │   └── repositories/ # Interfaces dos repositórios (contratos)
│   └── providers/        # Interfaces dos providers (contratos)
├── infra/            # Implementações concretas
│   ├── container/        # Registro global de DI (providers.ts)
│   ├── database/
│   │   ├── prisma/       # Repositórios Prisma
│   │   └── redis/
│   ├── providers/        # Implementações de providers
│   └── http/
│       ├── middlewares/  # Middlewares Express
│       ├── routes.ts     # Roteador raiz (auto-gerado)
│       └── server.ts     # Bootstrap do Express
├── modules/          # Feature modules (controllers, use-cases, schemas, etc.)
│   ├── auth/
│   ├── profile/
│   └── quiz/
│       └── questions/
└── shared/           # Utilitários transversais
    ├── app.error.ts
    ├── env.ts
    └── utils.ts
```

### Estrutura padrão de um módulo

```
modules/<nome>/
├── <nome>.controller.ts       # Controller Express
├── <nome>.controller.spec.ts  # Testes do controller
├── <nome>.container.ts        # Registro de DI do módulo
├── <nome>.routes.ts           # Rotas Express
├── <nome>.schema.ts           # Schemas Zod
├── <nome>.schema.spec.ts      # Testes de schema
├── <nome>.dto.ts              # Interfaces de Input/Output
└── use-cases/
    ├── <use-case>.ts
    └── <use-case>.spec.ts
```

Se o módulo tiver um **mapper**, ele fica junto:

```
├── <nome>.mapper.ts
├── <nome>.mapper.spec.ts
```

---

## 3. Entidades de Domínio

### Padrão: `private constructor` + `static create()`

Toda entidade usa **private constructor** e um **factory method estático** `create()`. As propriedades opcionais têm defaults aplicados no `create()`.

```typescript
// domain/entities/user.entity.ts

interface ICreateUserProps {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  verifiedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class User {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly verifiedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}

  static create(props: ICreateUserProps): User {
    return new User(
      props.id ?? crypto.randomUUID(),
      props.name,
      props.email,
      props.passwordHash,
      props.verifiedAt ?? null,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
      props.deletedAt ?? null,
    );
  }

  // Métodos de negócio retornam nova instância (imutabilidade)
  markAsVerified(): User {
    return User.create({
      ...this,
      verifiedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  isVerified(): boolean {
    return this.verifiedAt !== null;
  }

  changePassword(passwordHash: string): User {
    return User.create({ ...this, passwordHash, updatedAt: new Date() });
  }
}
```

### Regras de entidades

- `id` é sempre **opcional** no props (gerado por `crypto.randomUUID()` se omitido)
- `createdAt` e `updatedAt` são **opcionais** com `new Date()` como padrão
- Campos imutáveis: `public readonly`
- Campos mutáveis (ex: `Profile.update()`): `public` sem `readonly`
- Métodos de negócio que **alteram estado imutável** retornam nova instância
- Métodos de negócio que **alteram campos mutáveis** modificam `this` diretamente
- A interface `ICreateXxxProps` é declarada no mesmo arquivo, **não exportada**

### Entidades existentes

| Entidade       | Arquivo                                   | Notas                                 |
| -------------- | ----------------------------------------- | ------------------------------------- |
| `User`         | `domain/entities/user.entity.ts`          | UUID, soft delete                     |
| `Profile`      | `domain/entities/profile.entity.ts`       | UUID, campos mutáveis via `.update()` |
| `Token`        | `domain/entities/token.entity.ts`         | UUID, `TokenType` do Prisma enum      |
| `QuizQuestion` | `domain/entities/quiz-question.entity.ts` | ID numérico (auto-increment DB)       |

---

## 4. Repositórios de Domínio (Contratos)

Ficam em `domain/database/repositories/`. São apenas **interfaces TypeScript** — nenhum código de banco aqui.

```typescript
// domain/database/repositories/user.repository.ts

import type { User } from "@/domain/entities/user.entity";

export interface IUserRepository {
  create(data: User): Promise<User>;
  update(data: User): Promise<User>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}
```

### Convenções de nomenclatura

- Interface: `I{Entity}Repository` para operações CRUD simples
- Interface de transação/complexa: `I{Ação}{Entity}Repository` (ex: `ICreateUserWithEmailTokenRepository`)
- Métodos complexos que não cabem em CRUD simples ganham **repositório próprio**

### Repositórios de domínio existentes

| Interface                             | Arquivo                                                              |
| ------------------------------------- | -------------------------------------------------------------------- |
| `IUserRepository`                     | `repositories/user.repository.ts`                                    |
| `ITokenRepository`                    | `repositories/token.repository.ts`                                   |
| `IProfileRepository`                  | `repositories/profile.repository.ts`                                 |
| `IQuizQuestionRepository`             | `repositories/quiz-question.repository.ts`                           |
| `ICreateUserWithEmailTokenRepository` | `repositories/auth/auth-transaction.repository.ts`                   |
| `IResetPasswordRepository`            | `repositories/auth/reset-password.repository.ts`                     |
| `IGetMeRepository`                    | `repositories/auth/get-me.repository.ts`                             |
| `ICreateProfileWithStacksRepository`  | `repositories/profile/create-profile-with-stacks.repository.ts`      |
| `IUpdateProfileWithStacksRepository`  | `repositories/profile/update-profile-with-stacks.repository.ts`      |
| `IGetProfileByUserIdRepository`       | `repositories/profile/get-profile-by-user-id.repository.ts`          |
| `IGetOnboardingOptionsRepository`     | `repositories/profile/get-onboarding-options.repository.ts`          |
| `IGetQuizQuestionContextRepository`   | `repositories/quiz/question/get-quiz-question-context.repository.ts` |
| `IGetQuizOptionsRepository`           | `repositories/quiz/options/get-quiz-options.repository.ts`           |

---

### ⚠️ Regra de Ouro: Contratos no Domínio

Toda e qualquer **interface de contrato** (Repositórios, Providers, etc.) **DEVE** obrigatoriamente ficar dentro da pasta `domain/`. 

- ❌ **ERRADO:** `src/modules/quiz/options/repositories/get-options.repository.ts`
- ✅ **CORRETO:** `src/domain/database/repositories/quiz/get-options.repository.ts`

Essa regra garante o desacoplamento total da lógica de negócio de implementações de terceiros ou detalhes de infraestrutura.

---

## 5. Providers de Domínio (Contratos)

Ficam em `domain/providers/`. Apenas interfaces — sem implementação.

```typescript
// domain/providers/jwt.provider.ts
export interface IJWTProvider {
  generateRefreshToken(userId: string): Promise<string>;
  generateAccessToken(userId: string): Promise<string>;
  generateEmailVerificationToken(userId: string): Promise<string>;
  generatePasswordResetToken(userId: string): Promise<string>;
  verifyRefreshToken(token: string): Promise<boolean>;
  verifyAccessToken(token: string): Promise<boolean>;
  verifyEmailVerificationToken(token: string): Promise<boolean>;
  verifyPasswordResetToken(token: string): Promise<boolean>;
  decodeToken(token: string): Promise<{ sub: string; [key: string]: unknown }>;
}
```

### Providers de domínio existentes

| Interface               | Token DI                | Arquivo                                   |
| ----------------------- | ----------------------- | ----------------------------------------- |
| `IJWTProvider`          | `"IJWTProvider"`        | `providers/jwt.provider.ts`               |
| `IHashProvider`         | `"IHashProvider"`       | `providers/hash.provider.ts`              |
| `IRedisProvider`        | `"IRedisProvider"`      | `providers/redis.provider.ts`             |
| `IGeminiProvider`       | `"IGeminiProvider"`     | `providers/gemini.provider.ts`            |
| `IEmailProvider`        | `"IEmailProvider"`      | `providers/email/email.provider.ts`       |
| `IEmailQueueProvider`   | `"IEmailQueueProvider"` | `providers/email/email-queue.provider.ts` |
| `IBaseQueueProvider<T>` | (genérico)              | `providers/queue/base.provider.ts`        |

---

## 6. DTOs (Data Transfer Objects)

Ficam no arquivo `<modulo>.dto.ts` do módulo. São apenas **interfaces TypeScript**.

### Convenções de nomenclatura

- Input: `I{Ação}{Modulo}InputDTO` (ex: `ISignupInputDTO`)
- Output: `I{Ação}{Modulo}OutputDTO` (ex: `ILoginOutputDTO`)
- O prefix `I` é **obrigatório**

```typescript
// modules/auth/auth.dto.ts

export interface ISignupInputDTO {
  name: string;
  email: string;
  password: string;
}

export interface ILoginInputDTO {
  email: string;
  password: string;
}

export interface ILoginOutputDTO {
  id: string;
}

export interface IGetMeOutputDTO {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  hasProfile: boolean;
}
```

---

## 7. Schemas de Validação (Zod)

Ficam no arquivo `<modulo>.schema.ts`. O schema **sempre envolve `body`** dentro de `z.object({...})`.

```typescript
// modules/auth/auth.schema.ts
import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.email(),
    password: z.string().min(8),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
  }),
});
```

O middleware `validate(schema)` extrai `body`, `query` e `params` e sobrescreve `request.body` com o valor parseado.

---

## 8. Controllers

`@injectable()` no topo. Injetam **apenas Use Cases** via `@inject("TokenDI")`. Não acessam repositórios diretamente.

```typescript
// modules/auth/auth.controller.ts
import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { SignupUseCase } from "./use-cases/signup";
import type { IGetMeOutputDTO } from "./auth.dto";

@injectable()
export class AuthController {
  constructor(
    @inject("SignupUseCase")
    private readonly signupUseCase: SignupUseCase,
  ) {}

  async signup(
    request: Request,
    response: Response,
  ): Promise<Response<string>> {
    await this.signupUseCase.execute(request.body);
    return response.status(200).json("Mensagem de confirmação ambígua.");
  }

  async me(
    request: Request,
    response: Response,
  ): Promise<Response<IGetMeOutputDTO>> {
    const userId = request.user.id;
    const result = await this.getMeUseCase.execute(userId);

    const httpResponse: IGetMeOutputDTO = {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      isVerified: result.user.isVerified(),
      hasProfile: !!result.profile,
    };

    return response.status(200).json(httpResponse);
  }
}
```

### Regras de controllers

- Retorno tipado: `Promise<Response<OutputDTO>>`
- `userId` vem de `request.user.id` (injetado pelo middleware `ensureAuthenticated`)
- O mapping para `httpResponse` acontece no controller, não no use case
- Controllers **não lançam** erros de negócio — apenas delegam ao use case
- Respostas sem body: `response.status(204).send()`
- Cookies JWT: `httpOnly: true, secure: true, sameSite: "strict"`

---

## 9. Use Cases

`@injectable()` + `@inject()`. Injeção de repositórios e providers pelo token de string.

```typescript
// modules/auth/use-cases/signup.ts
import { inject, injectable } from "tsyringe";
import type { ISignupInputDTO } from "../auth.dto";
import { User } from "@/domain/entities/user.entity";
import type { IHashProvider } from "@/domain/providers/hash.provider";
import type { IUserRepository } from "@/domain/database/repositories/user.repository";

@injectable()
export class SignupUseCase {
  constructor(
    @inject("IHashProvider")
    private readonly hashProvider: IHashProvider,

    @inject("IUserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(params: ISignupInputDTO): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(params.email);
    if (existingUser) return; // fail silently para não vazar dados

    const passwordHash = await this.hashProvider.hash(params.password);
    const user = User.create({ ...params, passwordHash });

    // ...lógica de negócio
  }
}
```

### Regras de use cases

- Método principal: `async execute(params: InputDTO): Promise<ReturnType>`
- Erros de negócio: lançar `AppError` e subclasses (`NotFoundError`, `UnauthorizedError`, etc.)
- Métodos auxiliares privados: `private async metodo()` dentro do use case
- Não conhecem Express — entrada/saída são DTOs puros
- Token DI do use case: o nome da classe (ex: `"SignupUseCase"`)
- Token DI de providers/repos: nome da interface com `I` prefix (ex: `"IHashProvider"`)

---

## 10. Repositórios Infra (Implementações Prisma)

Ficam em `infra/database/prisma/`. Implementam as interfaces de domínio.

```typescript
// infra/database/prisma/user.prisma.repository.ts
import { injectable } from "tsyringe";
import type { IUserRepository } from "@/domain/database/repositories/user.repository";
import { User } from "@/domain/entities/user.entity";
import { prisma } from "../../../../prisma/client";
import { ConflictError } from "@/shared/app.error";

@injectable()
export class UserPrismaRepository implements IUserRepository {
  async create(data: User): Promise<User> {
    try {
      const response = await prisma.user.create({ data });
      return response.toDomain; // extensão do Prisma Client
    } catch (error) {
      if ((error as { code?: string }).code === "P2002") {
        throw new ConflictError("Email already in use");
      }
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    const response = await prisma.user.findUnique({ where: { id } });
    return response ? response.toDomain : null;
  }
}
```

### Padrão `toDomain`

O Prisma Client é estendido com uma propriedade computada `toDomain` em cada model para converter o resultado do banco na entidade de domínio.

```typescript
// prisma/client.ts (extensão do Prisma via $extends)
// response.toDomain → chama Entity.create({ ...prismaModel })
```

### Naming dos arquivos de repositório

- CRUD simples: `<entidade>.prisma.repository.ts`
- Especializado: `<ação>-<escopo>.prisma.repository.ts` (ex: `create-user-with-email-token.prisma.repository.ts`)

---

## 11. Container de DI (tsyringe)

### `infra/container/providers.ts` — Providers e repositórios globais/compartilhados

```typescript
import { container } from "tsyringe";
import { HashProvider } from "@/infra/providers/hash.provider";

// Singletons (providers e repos compartilhados entre módulos)
container.registerSingleton("IHashProvider", HashProvider);
container.registerSingleton("IJWTProvider", JwtProvider);
container.registerSingleton("IRedisProvider", RedisProvider);

// Instâncias exportadas (para uso direto em routes, middlewares)
export const ensureAuthenticated = container.resolve<IEnsureAuthenticated>(
  "IEnsureAuthenticated",
);
export const rateLimitMiddleware = container.resolve(RateLimitMiddleware);
```

### `modules/<nome>/<nome>.container.ts` — Registro por módulo

```typescript
import { container } from "tsyringe";
import { AuthController } from "@/modules/auth/auth.controller";
import { SignupUseCase } from "./use-cases/signup";
import { UserPrismaRepository } from "@/infra/database/prisma/user.prisma.repository";

// Repositórios específicos do módulo
container.register("IUserRepository", { useClass: UserPrismaRepository });

// Use Cases
container.register("SignupUseCase", { useClass: SignupUseCase });

// Instância do controller exportada
export const authController = container.resolve(AuthController);
```

### Regras do container

- Providers e repos **compartilhados entre módulos**: `registerSingleton` em `providers.ts`
- Repos e use cases **exclusivos de um módulo**: `register` no `<nome>.container.ts`
- O controller é **resolvido e exportado** no container file, não instanciado manualmente

---

## 12. Rotas

```typescript
// modules/auth/auth.routes.ts
import { Router } from "express";
import { validate } from "@/infra/http/middlewares/validate.middleware";
import { authController } from "./auth.container";
import { signupSchema, loginSchema } from "./auth.schema";
import {
  ensureAuthenticated,
  rateLimitMiddleware,
  simpleRateLimitMiddleware,
} from "@/infra/container/providers";

const router = Router();

// Rota pública com rate limit por chave
router.post(
  "/signup",
  rateLimitMiddleware.handle({ max: 5, windowInMs: 60000, key: "signup" }),
  validate(signupSchema),
  authController.signup.bind(authController),
);

// Rota autenticada
router.get(
  "/me",
  simpleRateLimitMiddleware.handle({ max: 10, windowInMs: 60000 }),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  authController.me.bind(authController),
);
```

### Rate limiting

| Middleware                                                        | Quando usar                                         |
| ----------------------------------------------------------------- | --------------------------------------------------- |
| `rateLimitMiddleware.handle({ max, windowInMs, key, useEmail? })` | Rotas sensíveis por chave (signup, forgot-password) |
| `simpleRateLimitMiddleware.handle({ max, windowInMs })`           | Rotas autenticadas ou tokens únicos                 |

### Registro no roteador raiz (`infra/http/routes.ts`)

Prefixo padrão: `/api/<modulo>`. Atualizado automaticamente pelo script `create-module`.

```typescript
router.use("/api/auth", authRoutes);
router.use("/api/profiles", profileRoutes);
router.use("/api/quiz/questions", quizQuestionsRoutes);
```

---

## 13. Middlewares

| Arquivo                              | Função                                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------------------ |
| `validate.middleware.ts`             | Valida `request.body` via Zod, substitui `request.body` pelo resultado parseado            |
| `ensure-authenticated.middleware.ts` | Verifica JWT de acesso (`authAccess`) ou refresh (`authRefresh`), injeta `request.user.id` |
| `rate-limit.middleware.ts`           | Rate limit por IP + chave customizada, armazenado no Redis                                 |
| `simple-rate-limit.middleware.ts`    | Rate limit simples por IP via `express-rate-limit`                                         |
| `error.middleware.ts`                | Handler global de erros — trata `AppError` e erros do Zod                                  |

---

## 14. Erros de Aplicação

Todos em `shared/app.error.ts`. Lançar sempre uma subclasse de `AppError`.

```typescript
throw new NotFoundError("User not found"); // 404
throw new UnauthorizedError("User not verified"); // 401
throw new ForbiddenError("Access denied"); // 403
throw new BadRequestError("Invalid input"); // 400
throw new ConflictError("Email already in use"); // 409
throw new TooManyRequestsError(); // 429
throw new InternalServerError(); // 500
```

O middleware `errorHandler` captura `AppError` e responde com o `statusCode` correto.

---

## 15. Mapper

Usado quando existe transformação de dados entre camadas (ex: context do repositório → input do provider). É uma **função pura exportada**.

```typescript
// modules/quiz/questions/questions.mapper.ts
export function mapContextToGeminiInput(
  context: IGetQuizQuestionContextOutputRepository,
): IGenerateQuizQuestionByGeminiInputProvider {
  return {
    quizObjective: { id: context.quizObjective.id as number, ... },
    // ...
  };
}
```

---

## 16. Variáveis de Ambiente

Todas centralizadas em `shared/env.ts`. Importar sempre via `import { env } from "@/shared/env"`.

```typescript
export const env = {
  serverPort: process.env.SERVER_PORT || 3001,
  clientUrl: process.env.CLIENT_URL || "",
  databaseUrl: process.env.DATABASE_URL || "",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "",
  jwtAccessExpiresInMs: Number(process.env.JWT_ACCESS_EXPIRES_IN_MS) || 900000,
  redisHost: process.env.REDIS_HOST || "",
  redisPort: Number(process.env.REDIS_PORT) || 6379,
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  // ...
};
```

---

## 17. Testes

### Configuração

- Framework: Jest com ts-jest
- Rodado com: `NODE_OPTIONS=--experimental-vm-modules jest --runInBand`
- Path aliases: `@/` resolve para `src/`

### Padrão dos arquivos de test

- Controllers: `<nome>.controller.spec.ts` ao lado do controller
- Use cases: `<modulo>.use-cases.spec.ts` dentro de `use-cases/`
- Repositórios: `<nome>.prisma.repository.spec.ts` ao lado do repositório
- Providers infra: `<nome>.provider.spec.ts` ao lado do provider

### Padrão de mock (use cases como exemplo)

```typescript
// modules/auth/use-cases/auth.use-cases.spec.ts

const makeSignupUseCase = () => {
  const hashProvider: IHashProvider = {
    hash: jest.fn().mockResolvedValue("hashed"),
    compare: jest.fn(),
  };
  const userRepository: IUserRepository = {
    create: jest.fn(),
    findByEmail: jest.fn().mockResolvedValue(null),
    // ...outros métodos
  };

  const sut = new SignupUseCase(hashProvider, userRepository, ...);
  return { sut, hashProvider, userRepository };
};

describe("SignupUseCase", () => {
  it("should create user when email is not registered", async () => {
    const { sut, userRepository } = makeSignupUseCase();
    await sut.execute({ name: "Test", email: "test@test.com", password: "12345678" });
    expect(userRepository.create).toHaveBeenCalled();
  });
});
```

### Padrão de mock (controllers)

```typescript
// modules/auth/auth.controller.spec.ts

const makeController = () => {
  const signupUseCase = { execute: jest.fn() };
  const controller = new AuthController(signupUseCase as unknown as SignupUseCase, ...);

  const req = { body: {}, user: { id: "user-id" }, cookies: {} } as unknown as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  } as unknown as Response;

  return { controller, signupUseCase, req, res };
};
```

---

## 18. Path Aliases

Configurado no `tsconfig.json`. Sempre usar `@/` para importar de `src/`.

```typescript
// Correto
import { User } from "@/domain/entities/user.entity";
import { env } from "@/shared/env";
import { NotFoundError } from "@/shared/app.error";

// Errado — nunca imports relativos longos
import { User } from "../../../../domain/entities/user.entity";
```

---

## 19. Checklist ao criar um novo módulo

- [ ] Criar entidade em `domain/entities/<entidade>.entity.ts`
- [ ] Criar interface do repositório em `domain/database/repositories/`
- [ ] Criar DTOs em `modules/<nome>/<nome>.dto.ts`
- [ ] Criar schemas Zod em `modules/<nome>/<nome>.schema.ts`
- [ ] Criar use cases em `modules/<nome>/use-cases/<acao>.ts`
- [ ] Criar repositório Prisma em `infra/database/prisma/<entidade>.prisma.repository.ts`
- [ ] Registrar implementações no container (`<nome>.container.ts` ou `providers.ts`)
- [ ] Criar controller `@injectable()` em `modules/<nome>/<nome>.controller.ts`
- [ ] Criar rotas em `modules/<nome>/<nome>.routes.ts`
- [ ] Registrar rota em `infra/http/routes.ts` com prefixo `/api/<nome>`
- [ ] Criar testes para controller, use cases e repositórios

---

## 20. Anti-patterns (nunca fazer)

- ❌ Importar Prisma diretamente em um use case ou controller
- ❌ Usar `any` explícito — sempre tipar corretamente
- ❌ Lançar erros nativos `new Error()` — usar subclasses de `AppError`
- ❌ Instanciar entidades sem `Entity.create()`
- ❌ Colocar lógica de negócio no controller
- ❌ Colocar lógica de banco de dados no use case
- ❌ Importar implementações concretas de infra no domínio
- ❌ Usar `import type` para classes que precisam ser injetadas — tsyringe precisa do valor em runtime
- ❌ Esquecer o `.bind(controller)` nas rotas
- ❌ Usar `require()` — o projeto é ESM puro
