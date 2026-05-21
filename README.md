# 🐉 CodeDragon - Mentor de Carreira Inteligente para Desenvolvedores

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Main Stack](https://img.shields.io/badge/Main%20Stack-React%20%2F%20Node.js%20%2F%20Clean%20Arch-blue)
![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange)

**CodeDragon** é uma plataforma SaaS projetada para acelerar a evolução de desenvolvedores. Através de Inteligência Artificial, o sistema identifica lacunas de conhecimento, gera simulados técnicos personalizados e cria trilhas de estudo (roadmaps) baseadas na performance em tempo real.

---

## 🎬 Demonstração em Vídeo

Assista ao vídeo abaixo para visualizar o funcionamento do **CodeDragon** em tempo real sem precisar executar o projeto localmente:

<div align="center">
  <video src="./video.mp4" width="100%" style="max-width: 800px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" controls autoplay loop muted></video>
  
  <p><i>Caso o player acima não carregue, você também pode baixar ou visualizar o arquivo diretamente: <a href="./video.mp4"><b>video.mp4</b></a></i></p>
</div>

---

## 🚀 Funcionalidades Principais

- **Simulados Técnicos Dinâmicos**: Quizzes gerados por IA com base na sua stack, senioridade e objetivos de carreira.
- **Análise de Performance**: Insights detalhados sobre pontos fortes e fracos em temas específicos (ex: React, Node.js, Algoritmos).
- **Roadmap Personalizado**: Trilhas de estudo geradas automaticamente após cada simulado para guiar sua evolução.
- **Feedback Loop**: Avaliação constante das questões para melhorar a precisão da IA.
- **Gamificação e Progresso**: Acompanhamento de pontuação, percentis e ranking em relação à comunidade.

---

## 🏗️ Arquitetura do Sistema

O projeto utiliza uma abordagem moderna de **Mono-repositório** com separação clara entre as camadas.

### Backend (Modular Clean Architecture)

O backend segue os princípios da **Clean Architecture**, isolando as regras de negócio das tecnologias externas.

- **Entities**: Regras de negócio essenciais e objetos de domínio.
- **Use Cases**: Fluxos de execução da aplicação (ex: `GenerateQuestions`, `SubmitReport`).
- **Repositories**: Contratos de persistência implementados via Prisma.
- **Providers**: Integrações externas (Google Gemini AI, BullMQ, Resend).
- **Controllers**: Adaptadores de entrada para as rotas HTTP (Express).
- **Injeção de Dependências**: Gerenciada via `tsyringe`.

### Frontend (Feature-based Architecture)

O frontend é construído com React e organizado por funcionalidades (**features**), facilitando a escalabilidade.

- **Features**: Cada módulo (auth, quiz, profile) contém seus próprios componentes, hooks e estados.
- **Shared**: Componentes de UI genéricos (Shadcn/UI), utilitários e constantes.
- **State Management**: Utiliza TanStack Query (React Query) para cache de dados assíncronos e sincronização com o servidor.

---

## 🛠️ Stack Tecnológica

### Backend

- **Runtime**: Node.js (TypeScript)
- **Framework**: Express.js
- **ORM**: Prisma (PostgreSQL)
- **Processamento Assíncrono**: BullMQ + Redis
- **IA**: Google Gemini Pro & OpenAI GPT-4
- **Segurança**: JWT (Access/Refresh Tokens), Bcrypt, Rate Limiting
- **Validação**: Zod
- **Email**: Resend / Nodemailer

### Frontend

- **Core**: React 19 + Vite
- **Styling**: Tailwind CSS 4 + Radix UI
- **Data Fetching**: TanStack Query (v5)
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Visualização**: Recharts (Gráficos de performance)
- **Relatórios**: jspdf / react-pdf (Exportação de resultados)

---

## 🧠 Algoritmos e IA

### 1. Geração Híbrida de Simulados

Para mitigar a latência das LLMs e proporcionar uma experiência fluida, utilizamos um algoritmo de geração em lotes:

1. **Batch Síncrono**: Ao iniciar, a IA gera as primeiras 5 questões imediatamente para o usuário começar.
2. **Batch Assíncrono**: O restante das questões é enviado para uma fila no **BullMQ**, processado em background e persistido conforme a IA responde.

### 2. Análise de Lacunas e Roadmap

Após a submissão, um algoritmo de análise processa os acertos e erros cruzando dados de **Senioridade** e **Stack**. A IA (Gemini) então:

- Identifica padrões de erro em assuntos específicos.
- Sugere tópicos de estudo priorizados (Baixa, Média, Alta, Urgente).
- Calcula o **Percentil** e **Ranking** comparando a performance do usuário com a média da comunidade para o mesmo nível técnico.

---

## 📡 Endpoints Principais (API)

| Método   | Endpoint                     | Descrição                                     |
| :------- | :--------------------------- | :-------------------------------------------- |
| **POST** | `/auth/signup`               | Cadastro de novo usuário                      |
| **POST** | `/auth/login`                | Autenticação e geração de tokens              |
| **GET**  | `/profile/me`                | Retorna o perfil completo do desenvolvedor    |
| **POST** | `/quiz/questions/generate`   | Inicia a geração de um novo simulado          |
| **GET**  | `/quiz/questions/stream/:id` | Recupera as questões geradas (Polling/Stream) |
| **POST** | `/quiz/report/submit`        | Finaliza o quiz e gera os insights de IA      |
| **GET**  | `/quiz/report/latest`        | Recupera o último relatório de performance    |

---

## 📱 Telas do Aplicativo

- **Dashboard**: Visão geral de progresso, últimos simulados e acesso rápido a novas trilhas.
- **Onboarding/Profile**: Configuração de stack tecnológica (ex: React, Go, Docker) e senioridade.
- **Quiz Interface**: Experiência de simulado focada, com suporte a blocos de código e timer.
- **Insights & Performance**: Gráficos radiais e de barras detalhando o conhecimento por tecnologia.
- **Roadmap View**: Lista interativa de tópicos de estudo sugeridos pela IA.
- **Suggestion Box**: Canal direto para feedback de usuários e report de bugs.

---

## 🗄️ Modelo de Dados (Resumo)

O banco de dados PostgreSQL gerencia uma estrutura complexa que inclui:

- `user_setups`: Preferências de carreira e tecnologias.
- `quiz_sessions`: Histórico de simulados e tempos de resposta.
- `quiz_questions`: Banco de questões geradas dinamicamente.
- `quiz_session_roadmaps`: Recomendações personalizadas por sessão.
- `user_packs`: Sistema de créditos e limites de uso das funcionalidades.

---

## 🛠️ Como Executar

### Pré-requisitos

- Node.js 20+
- Docker & Docker Compose
- Chaves de API (Google Gemini / OpenAI)

### Passos

1. Clone o repositório.
2. No `/backend`, copie o `.env.example` para `.env` e configure as variáveis.
3. No `/frontend`, faça o mesmo para o `.env`.
4. Suba a infraestrutura: `docker-compose up -d`.
5. Instale as dependências: `npm install` (em ambas as pastas).
6. Inicie o backend: `npm run start`.
7. Inicie o frontend: `npm run dev`.

---

Desenvolvido por [Jadson-Js](https://github.com/Jadson-Js)
