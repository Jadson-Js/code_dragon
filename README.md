# 🐉 CodeDragon - Mentor de Carreira Inteligente para Desenvolvedores

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Main Stack](https://img.shields.io/badge/Main%20Stack-React%20%2F%20Node.js%20%2F%20Clean%20Arch-blue)
![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange)

**DragonAi** é uma plataforma SaaS técnica projetada para acelerar a evolução de desenvolvedores. O sistema utiliza Inteligência Artificial e análise de dados para identificar lacunas de competência, realizar auditorias de perfil (GitHub/LinkedIn) e simular cenários de entrevistas técnicas.

---

## 🛠️ Stack Tecnológica

O projeto foi construído sobre uma arquitetura moderna e escalável, visando alta performance e manutenibilidade.

### Core

- **Runtime:** Node.js (LTS)
- **Linguagem:** TypeScript (Strict Mode)
- **Frontend:** Next.js (App Router) + React
- **Estilização:** Tailwind CSS

### Infraestrutura & Dados

- **Database:** PostgreSQL
- **ORM:** Prisma
- **Caching/Queues:** Redis (BullMQ para processamento assíncrono de IA)
- **Containerização:** Docker & Docker Compose

### Inteligência & Integrações

- **LLMs:** Integração agnóstica (OpenAI GPT-4 / Google Gemini)
- **Scraping:** Puppeteer/Playwright (para auditoria de perfis públicos)
- **Validação:** Zod

---

## 🏗️ Arquitetura do Sistema (Clean Architecture)

O backend segue os princípios da **Clean Architecture**, isolando regras de negócio de detalhes de infraestrutura e frameworks. A estrutura modular permite escalabilidade horizontal das features.

```text
src/
├── modules/
│   └── user/                       # Domínio: Usuários (Vertical Slice)
│       ├── user.controller.ts      # Adapters: Entrada HTTP
│       ├── user.routes.ts          # Definição de rotas e middlewares
│       ├── user.schema.ts          # Validação (Zod)
│       ├── user.dto.ts             # Transfer Objects
│       └── use-cases/              # Application Business Rules
│           ├── create-user.ts
│           └── authenticate-user.ts
│
├── domain/                         # Enterprise Business Rules
│   ├── entities/
│   │   └── user.entity.ts          # Entidades puras do domínio
│   ├── repositories/
│   │   └── user.repository.ts      # Contratos (Interfaces) de persistência
│   └── services/
│       └── email.service.ts        # Contratos de serviços externos
│
├── infra/                          # Frameworks & Drivers
│   ├── database/
│   │   └── prisma/
│   │       └── user.prisma-repository.ts   # Implementação concreta
│   ├── providers/
│   │   ├── sendgrid.provider.ts            # Implementação de Email
│   │   └── ai/                             # Implementação de LLMs
│   └── http/
│       ├── middlewares/
│       │   ├── auth.middleware.ts
│       │   └── error.middleware.ts
│       ├── container.ts            # Injeção de Dependências
│       └── server.ts               # Setup do Express/Fastify
│
└── shared/
    ├── errors/                     # Tratamento de erros centralizado
    ├── env.ts                      # Configuração de ambiente
    └── utils.ts                    # Helpers globais
```
