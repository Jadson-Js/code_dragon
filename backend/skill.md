### 1. Estrutura de Pastas e Arquivos

A arquitetura segue princípios de **DDD (Domain-Driven Design)**, sendo organizada da seguinte forma:

- **`src/`**: Pasta raiz do código fonte.
  - **`entities/`**: Representam as tabelas do banco de dados e as regras de domínio (ex: `user.entity.ts`). Elas só devem ser criadas como classes se possuírem métodos de manipulação ou lógica de negócio (ex: `User.isVerified()`). Caso contrário, deixamos a responsabilidade de tipagem para o Prisma e usamos o método `toDomain` no repositório.
  - **`infra/`**: Camada de infraestrutura que lida com tecnologias externas.
    - **`container/`**: Configurações de Injeção de Dependência usando o `tsyringe` (ex: `providers.ts`).
    - **`database/`**: Implementações de persistência (ex: `prisma/client.ts`, `prisma/user.prisma.repository.ts`).
    - **`middlewares/`**: Filtros de requisições (ex: `auth.middleware.ts`, `error.middleware.ts`).
    - **`providers/`**: Serviços externos (ex: `gemini.provider.ts`, `mail.provider.ts`).
    - **`server.ts`**: Configuração principal do Express, middlewares globais e agregação de rotas.
  - **`modules/`**: Organização por domínios/funcionalidades.
    - **`module/`**: (ex: `auth/`, `quiz/`)
      - `module.routes.ts`: Definição de rotas.
      - `module.controller.ts`: Orquestração da requisição.
      - `module.schema.ts`: Validações de entrada (Zod).
      - `use-cases/`: Lógica de negócio (ex: `signup.ts`, `login.ts`).
  - **`shared/`**: Recursos compartilhados (ex: `app.error.ts`, `env.ts`, `utils.ts`).
- **`prisma/`**: Contém o `schema.prisma` (definição do banco de dados) e scripts de seed.

---

### 2. Linguagens e Frameworks

- **Linguagem**: [TypeScript]
- **Web Framework**: [Express]
- **ORM**: [Prisma]
- **Dependency Injection**: [Tsyringe]
- **Validation**: [Zod]
- **Background Jobs**: [BullMQ]
- **AI Integration**: Google GenAI (Gemini).
- **Testes**: [Jest]

---

### 3. Fluxo Completo de uma Requisição

O caminho que um endpoint percorre é padronizado:

1.  **`server.ts`**: Recebe a requisição HTTP e a direciona para o arquivo de rotas do módulo correspondente (ex: `/api/quiz/questions` -> `questions.routes.ts`).
2.  **`Routes` (`.routes.ts`)**: Define o método HTTP e o endpoint, **declara os middlewares** (autenticação, validação de schema, rate limit) e chama o método específico do Controller.
3.  **`Controller` (`.controller.ts`)**: Extrai dados da requisição (`body`, `params`, `user.id`), valida se necessário e invoca o **Use Case** correspondente.
4.  **`Use Case` (`.ts`)**: Onde reside a **regra de negócio**. Ele orquestra a lógica, chamando repositórios para banco de dados ou providers para serviços externos.
5.  **`Repository` (`.prisma.repository.ts`)**:
    - **CRUD Comum**: Se for uma manipulação simples de uma entidade (ex: buscar usuário), existirá um arquivo como `UserPrismaRepository` com métodos como `findById()`, `create()`.
    - **Operações Atômicas/Transações**: Se a operação envolver mais de uma tabela (ex: criar User e Profile simultaneamente), ela deve ser feita em um arquivo separado dentro da pasta do módulo correspondente, com um nome descritivo da transação atômica (ex: `create-user-with-profile.prisma.repository.ts`).
6.  **`Response`**: O Controller recebe o resultado do Use Case e envia a resposta HTTP de volta ao cliente.

---

### 4. Padrões de Nomenclatura

- **Arquivos**: `kebab-case` (ex: `generate-questions.ts`, `auth.routes.ts`).
- **Classes**: `PascalCase` (ex: `QuizQuestionsController`, `UserPrismaRepository`).
- **Interfaces/Tipos**: Geralmente iniciam com `I` em `PascalCase` (ex: `IGeminiProvider`, `IQuizQuestionGenerateInputDTO`).
- **Métodos e Funções**: `camelCase` (ex: `execute()`, `findById()`).
- **Variáveis**: `camelCase`.

---

### 5. Estrutura Detalhada dos Arquivos

#### **Use Case**

- **Estrutura**: Uma classe anotada com `@injectable()`.
- **Responsabilidade**: Executa uma única ação de negócio.
- **Método Principal**: Sempre possui um método `async execute()`.
- **Dependências**: São injetadas via `constructor` usando o decorator `@inject()`. Ele nunca acessa o Prisma diretamente; ele usa o Repository.

#### **Controller**

- **Estrutura**: Classe anotada com `@injectable()`.
- **Responsabilidade**: Interface entre o protocolo HTTP e o Use Case.
- **Métodos**: Geralmente seguem nomes das ações (ex: `generateQuestions`, `listAll`). Recebem `Request` e `Response` do Express.

#### **Repository**

- **Estrutura**: Implementa métodos de persistência.
- **Responsabilidade**: Esconder a complexidade do banco de dados.
- **Mapeamento**: Frequentemente possui um método ou getter (ex: `toDomain`) para transformar o objeto retornado pelo Prisma em uma `Entity` de domínio, garantindo que o resto da aplicação não dependa da estrutura da tabela.

#### **Entity**

- **Estrutura**: Classe pura com atributos e um método estático `create()`.
- **Responsabilidade**: Validar se o objeto de negócio é válido antes de ser processado ou salvo.

#### **Providers**

- **Estrutura**: Classes que abstraem serviços de terceiros.
- **Exemplo**: O `GeminiProvider` encapsula toda a lógica de prompt e comunicação com a API do Google, entregando para o Use Case apenas o dado já formatado.

Esta estrutura garante que seu código seja altamente testável e fácil de manter, permitindo, por exemplo, trocar o banco de dados ou o provedor de IA sem afetar as regras de negócio centrais.

### 6. Simplicidade e Nomenclatura

A arquitetura preza pela **simplicidade**. O objetivo é ser direto ao ponto:

- **Nomenclatura**: Nomes de arquivos e classes devem dizer exatamente o que fazem. Evite nomes genéricos.
- **Menos é Mais**: Só crie abstrações (como Entities ou Providers complexos) se houver real necessidade de lógica. Se for apenas um repasse de dados, mantenha o fluxo o mais simples possível.
- **Responsabilidade Única**: Cada Use Case deve fazer apenas uma coisa.

---

### 7. Exemplos de Código

#### **Schema (Zod)**

```typescript
import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export type ISignupInputDTO = z.infer<typeof signupSchema>["body"];
```

#### **Controller**

```typescript
@injectable()
export class AuthController {
  constructor(
    @inject(SignupUseCase)
    private signupUseCase: SignupUseCase,
  ) {}

  async signup(request: Request, response: Response): Promise<Response> {
    const { email, password, name } = request.body;

    await this.signupUseCase.execute({ email, password, name });

    return response.status(201).json({ message: "User created" });
  }
}
```

#### **Route**

```typescript
router.post(
  "/signup",
  simpleRateLimitMiddleware.handle({
    max: 5,
    windowInMs: 60000,
  }),
  validate(signupSchema), // Middleware de validação do Zod
  authController.signup.bind(authController),
);
```

#### **Use Case**

```typescript
@injectable()
export class SignupUseCase {
  constructor(
    @inject(UserPrismaRepository)
    private userRepository: UserPrismaRepository,
    @inject(CreateUserWithTokenRepository)
    private transactionRepository: CreateUserWithTokenRepository,
    @inject("IHashProvider")
    private hashProvider: IHashProvider,
  ) {}

  async execute(data: ISignupInputDTO) {
    const userExists = await this.userRepository.findByEmail(data.email);
    if (userExists) throw new AppError("User already exists");

    const passwordHash = await this.hashProvider.hash(data.password);
    const user = User.create({ ...data, passwordHash });

    await this.transactionRepository.execute(user);
  }
}
```

#### **Common Repository**

```typescript
@injectable()
export class UserPrismaRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? user.toDomain : null;
  }
}
```

#### **Transaction Repository (Atômico)**

```typescript
@injectable()
export class CreateUserWithTokenRepository {
  async execute(user: User) {
    return await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({ data: user });
      await tx.token.create({ data: { userId: user.id, ... } });
      return createdUser.toDomain;
    });
  }
}
```

#### **Provider**

```typescript
@injectable()
export class GeminiProvider implements IGeminiProvider {
  async generate(prompt: string) {
    const response = await this.ai.generateContent(prompt);
    return response.text();
  }
}
```

#### **Testes (Jest)**

```typescript
describe("SignupUseCase", () => {
  it("should create user and enqueue verification email", async () => {
    // Mocks das dependências
    const userRepository = { findByEmail: jest.fn().mockResolvedValue(null) };
    const hashProvider = { hash: jest.fn().mockResolvedValue("hashed") };
    const transactionRepository = { execute: jest.fn() };

    const useCase = new SignupUseCase(
      userRepository,
      transactionRepository,
      hashProvider,
    );

    await useCase.execute({
      name: "John",
      email: "john@example.com",
      password: "123",
    });

    expect(transactionRepository.execute).toHaveBeenCalledTimes(1);
  });
});
```

---

### 8. Testes e TDD

O projeto segue rigorosamente o **TDD (Test-Driven Development)**:

1.  **Red**: Escreva um teste que falha para uma nova funcionalidade.
2.  **Green**: Implemente o código mínimo necessário para fazer o teste passar.
3.  **Refactor**: Melhore o código mantendo os testes passando.

**Destaques**:

- **Cobertura**: As camadas de **Use Cases**, **Repositories** e **Providers** possuem testes unitários rigorosos.
- **Unitários**: Focados especialmente em Use Cases, garantindo que a lógica de negócio esteja correta isoladamente.
- **Mocks**: Utilizamos mocks para isolar os componentes de suas dependências externas (ex: mockar o Prisma no repositório ou a API de IA no provider).
- **Localização**: Arquivos de teste ficam junto ao código (`.spec.ts`), facilitando a manutenção e a visibilidade da cobertura.

---

name: endpoint-creator
description: Use this skill to create new endpoints in the Express/TypeScript/Prisma/DDD application. Triggers whenever the user wants to add a route, controller, use case, repository, schema, or any part of a new feature. Also triggers for phrases like "quero criar um endpoint", "adicionar rota", "novo use case", "nova feature", "implementar X", or any request to extend the API with new functionality. Always follow the TDD workflow: interview first, write tests, get approval, then implement.

---

# Endpoint Creator

Skill para criação de novos endpoints seguindo a arquitetura DDD da aplicação (Express + TypeScript + Prisma + Tsyringe).

O processo sempre segue esta ordem:

1. **Entrevista** → entender completamente o endpoint
2. **Testes** → escrever toda a suíte de testes unitários (TDD Red)
3. **Aprovação** → aguardar confirmação do usuário
4. **Implementação** → escrever o código de produção (TDD Green)

---

## Fase 1 — Entrevista

Antes de escrever qualquer linha de código, faça as perguntas abaixo. Agrupe-as em blocos temáticos para não sobrecarregar o usuário. Adapte quais perguntas fazer com base no que o usuário já explicou — nunca pergunte o que já foi respondido.

### Bloco 1 — Contrato HTTP

- Qual o **verbo HTTP** do endpoint? (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`)
- Qual o **path** da rota? (ex: `/api/quiz/questions`, `/api/users/:id/profile`)
- Esse endpoint precisa de **autenticação** (JWT / middleware de auth)?
- Terá **rate limit**? Se sim, qual janela e quantas requisições?

### Bloco 2 — Entrada de dados

- Quais dados chegam no **body** da requisição? (nome, tipo, obrigatório/opcional)
- Quais **params** de rota são usados? (ex: `:id`, `:slug`)
- Quais **query params** são usados? (ex: `?page=1&limit=10`)
- Há dados que vêm do **token do usuário autenticado**? (ex: `req.user.id`)

### Bloco 3 — Resposta

- Qual o **status HTTP** de sucesso? (200, 201, 204…)
- O que é retornado no **body da resposta**? (estrutura do JSON ou apenas mensagem)
- Quais os possíveis **erros esperados** e seus status? (ex: 404 se não encontrar, 409 se já existir)

### Bloco 4 — Banco de dados

- Quais **tabelas do Prisma** são envolvidas?
- A operação é **simples** (um único modelo) ou **atômica/transacional** (múltiplos modelos ao mesmo tempo)?
  - Se atômica: quais tabelas são escritas/lidas dentro da mesma transação?
- A operação é de **leitura**, **escrita**, ou **ambas**?
- Haverá **paginação**? Se sim, `cursor` ou `offset`?

### Bloco 5 — Regras de negócio e validações

- Há **pré-condições** que o usuário deve satisfazer antes da operação? (ex: ter perfil cadastrado, e-mail verificado, ser dono do recurso)
- Há **unicidade** a validar? (ex: e-mail único, slug único por usuário)
- Há **limites** a aplicar? (ex: máximo de 5 itens por usuário)
- A operação depende de algum **provider externo**? (ex: Gemini para IA, e-mail, storage)
- Haverá **background jobs** (BullMQ)? Se sim, qual fila e qual payload?

### Bloco 6 — Módulo e localização

- Esse endpoint pertence a um **módulo existente** (ex: `auth`, `quiz`) ou cria um **novo módulo**?
- Se novo módulo: qual o nome? Isso impacta a criação de `routes`, `controller` e `schema`.

---

## Fase 2 — Mapeamento de arquivos

Com base nas respostas, monte mentalmente (e mostre ao usuário) a lista de **arquivos que serão criados ou modificados**:

```
src/
  modules/<module>/
    <module>.routes.ts              ← criar ou modificar
    <module>.controller.ts          ← criar ou modificar
    <module>.schema.ts              ← criar ou modificar
    use-cases/
      <action>.ts                   ← criar
      <action>.spec.ts              ← criar (PRIMEIRO)
  infra/
    database/prisma/
      <entity>.prisma.repository.ts          ← criar ou modificar
      <atomic-action>.prisma.repository.ts   ← criar se transacional
```

Se houver provider novo, adicione também:

```
src/infra/providers/<name>.provider.ts
```

Confirme esse mapeamento com o usuário antes de escrever os testes.

---

## Fase 3 — Testes Unitários (TDD Red)

Escreva **toda a suíte de testes** antes de qualquer código de produção.

### Onde ficam os testes

O arquivo `.spec.ts` fica **junto ao use case**: `src/modules/<module>/use-cases/<action>.spec.ts`

### Estrutura padrão do arquivo de teste

```typescript
import { <ActionUseCase> } from "./<action>";
import { AppError } from "../../../shared/app.error";

// ─── Mocks ───────────────────────────────────────────────────────────────────
const make<Dependency> = (overrides = {}) => ({
  <method>: jest.fn(),
  ...overrides,
});

// ─── Factory ─────────────────────────────────────────────────────────────────
const makeSut = (overrides: { [key: string]: any } = {}) => {
  const dep1 = overrides.dep1 ?? make<Dep1>();
  const dep2 = overrides.dep2 ?? make<Dep2>();

  const sut = new <ActionUseCase>(dep1, dep2);
  return { sut, dep1, dep2 };
};

// ─── Suite ───────────────────────────────────────────────────────────────────
describe("<ActionUseCase>", () => {
  // Caminho feliz
  it("should <expected behavior on success>", async () => { });

  // Erros de negócio (um describe por pré-condição)
  describe("when <pre-condition fails>", () => {
    it("should throw AppError with '<message>'", async () => { });
  });
});
```

### Casos a cobrir obrigatoriamente

Cubra **todos** os cenários levantados na entrevista:

| Categoria             | O que testar                                                                        |
| --------------------- | ----------------------------------------------------------------------------------- |
| **Caminho feliz**     | Execução completa com sucesso, retorno esperado, métodos chamados com args corretos |
| **Pré-condições**     | Cada validação de negócio lança `AppError` com a mensagem certa                     |
| **Unicidade**         | Lança erro se registro já existir (quando aplicável)                                |
| **Chamadas externas** | Provider / fila é chamado com payload correto                                       |
| **Transações**        | Repository transacional é chamado (e não o simples) quando aplicável                |
| **Isolamento**        | Quando uma etapa falha, as etapas seguintes não são executadas                      |

### Padrão de mock

Sempre use **factory functions** para os mocks, nunca instâncias únicas globais — isso garante que cada teste comece limpo.

```typescript
// ✅ Correto
const makeUserRepository = (overrides = {}) => ({
  findByEmail: jest.fn().mockResolvedValue(null),
  create: jest.fn(),
  ...overrides,
});

// ❌ Evitar — estado compartilhado entre testes
const userRepository = { findByEmail: jest.fn() };
```

### Verificação de chamadas

```typescript
// Verificar que foi chamado com os argumentos corretos
expect(repository.create).toHaveBeenCalledWith(
  expect.objectContaining({ email: "john@example.com" }),
);

// Verificar que NÃO foi chamado
expect(emailQueue.add).not.toHaveBeenCalled();

// Verificar AppError
await expect(sut.execute(input)).rejects.toThrow(
  new AppError("User already exists"),
);
```

### Aguardar aprovação

Após apresentar toda a suíte de testes, **pare** e pergunte:

> "Os testes cobrem todos os cenários esperados? Posso prosseguir para a implementação?"

Só avance para a Fase 4 após confirmação explícita.

---

## Fase 4 — Implementação (TDD Green)

Com os testes aprovados, implemente na seguinte ordem:

### 1. Schema Zod (`<module>.schema.ts`)

```typescript
import { z } from "zod";

export const <actionName>Schema = z.object({
  body: z.object({ ... }),   // se tiver body
  params: z.object({ ... }), // se tiver params
  query: z.object({ ... }),  // se tiver query
});

export type I<ActionName>InputDTO = z.infer<typeof <actionName>Schema>["body"];
```

### 2. Use Case (`use-cases/<action>.ts`)

```typescript
@injectable()
export class <ActionName>UseCase {
  constructor(
    @inject(<Repository>)
    private <repo>: <Repository>,
    // demais dependências
  ) {}

  async execute(data: I<ActionName>InputDTO): Promise<I<ActionName>OutputDTO> {
    // 1. Validações de negócio (pré-condições)
    // 2. Lógica principal
    // 3. Persistência
    // 4. Side effects (filas, providers)
    // 5. Retorno
  }
}
```

**Regras do Use Case:**

- Nunca acessa o Prisma diretamente — sempre via repository
- Nunca importa `Request`/`Response` do Express
- Lança `AppError` para erros de negócio esperados
- Um Use Case = uma única responsabilidade

### 3. Repository (`<entity>.prisma.repository.ts` ou `<action>.prisma.repository.ts`)

Escolha o tipo correto:

**Simples** (uma tabela, sem transação):

```typescript
@injectable()
export class <Entity>PrismaRepository {
  async <method>(arg: type): Promise<Entity | null> {
    const result = await prisma.<model>.<operation>({ ... });
    return result ? this.toDomain(result) : null;
  }

  private toDomain(raw: Prisma<Entity>): Entity {
    // mapear campos do banco → domínio
  }
}
```

**Atômico** (múltiplas tabelas, com `$transaction`):

```typescript
@injectable()
export class <ActionName>PrismaRepository {
  async execute(data: ...) {
    return await prisma.$transaction(async (tx) => {
      const a = await tx.<model1>.create({ ... });
      await tx.<model2>.create({ ... });
      return a;
    });
  }
}
```

### 4. Controller (`<module>.controller.ts`)

```typescript
@injectable()
export class <Module>Controller {
  constructor(
    @inject(<ActionName>UseCase)
    private <actionName>UseCase: <ActionName>UseCase,
  ) {}

  async <methodName>(request: Request, response: Response): Promise<Response> {
    const { field1, field2 } = request.body;
    const { id } = request.params;
    const userId = request.user.id; // se autenticado

    const result = await this.<actionName>UseCase.execute({ ... });

    return response.status(<code>).json(result);
  }
}
```

### 5. Rota (`<module>.routes.ts`)

```typescript
router.<verb>(
  "<path>",
  authMiddleware.handle(),          // se autenticado
  simpleRateLimitMiddleware.handle({ max: N, windowInMs: M }), // se rate limit
  validate(<actionName>Schema),     // validação Zod
  <controller>.<method>.bind(<controller>),
);
```

### 6. Container DI (`infra/container/providers.ts`)

Se criou novos Use Cases, Repositories ou Providers, registre-os no container do `tsyringe`.

### 7. Rodar os testes

Após implementar, rode mentalmente (ou instrua o usuário a rodar):

```bash
npx jest src/modules/<module>/use-cases/<action>.spec.ts --verbose
```

Todos os testes da Fase 3 devem passar (TDD Green). Se algum falhar, corrija a implementação — não os testes.

---

## Checklist Final

Antes de declarar o endpoint pronto, verifique:

- [ ] Schema Zod valida todos os campos de entrada
- [ ] Use Case não acessa Prisma diretamente
- [ ] Use Case lança `AppError` (não `Error` genérico) para erros de negócio
- [ ] Repository tem método `toDomain` se retorna entidade de domínio
- [ ] Transação usada quando há escrita em múltiplas tabelas
- [ ] Rota tem os middlewares corretos (auth, rate limit, validação)
- [ ] Todos os testes passam
- [ ] Nenhum `console.log` deixado no código
- [ ] Novos tokens DI registrados no container

---

## Referência rápida de padrões

### AppError

```typescript
// Sempre use AppError para erros de negócio
throw new AppError("Mensagem clara do erro", statusCode); // default 400
```

### Nomenclatura de arquivos

| Tipo               | Padrão                        | Exemplo                                         |
| ------------------ | ----------------------------- | ----------------------------------------------- |
| Use Case           | `kebab-case.ts`               | `create-quiz.ts`                                |
| Use Case Test      | `kebab-case.spec.ts`          | `create-quiz.spec.ts`                           |
| Controller         | `module.controller.ts`        | `quiz.controller.ts`                            |
| Route              | `module.routes.ts`            | `quiz.routes.ts`                                |
| Schema             | `module.schema.ts`            | `quiz.schema.ts`                                |
| Repository simples | `entity.prisma.repository.ts` | `user.prisma.repository.ts`                     |
| Repository atômico | `action.prisma.repository.ts` | `create-user-with-profile.prisma.repository.ts` |

### DTO de entrada

```typescript
// Sempre extraído do schema Zod — nunca criado manualmente
export type ICreateQuizInputDTO = z.infer<typeof createQuizSchema>["body"];
```
