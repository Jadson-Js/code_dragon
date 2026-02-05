# 🐉 DragonAi - Mentor de Carreira Inteligente para Desenvolvedores

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Main Stack](https://img.shields.io/badge/Main%20Stack-React%20%2F%20Node.js%20%2F%20IA-blue)

**DragonAi** é uma plataforma SaaS completa projetada para transformar a jornada de desenvolvedores juniores, estudantes e autodidatas. Através de Inteligência Artificial, a plataforma identifica lacunas técnicas, simula desafios reais e otimiza a presença digital do candidato para acelerar a conquista da primeira vaga.

## 🎯 Objetivo do Projeto

- **Monetização:** Estabelecer uma receita recorrente através de um modelo SaaS.
- **Impacto Social:** Democratizar o acesso à mentoria técnica de alta qualidade.
- **Mentoria Automatizada:** Substituir o feedback humano caro por um sistema de IA que guia o aprendizado de forma assertiva.

---

## 🚀 Proposta de Valor e Funcionalidades

### 🧠 Diagnóstico e Aprendizado

- **Diagnóstico de Competências:** Quiz técnico adaptativo (básico ao avançado) para mapear o nível real do candidato.
- **Roadmap Inteligente:** Trilhas de estudo personalizadas baseadas nos gaps identificados.
- **Dashboard Analítico:** Insights detalhados e benchmarking comparativo com a comunidade.

### 💼 Ferramentas de Empregabilidade

- **Simulador de Entrevistas com IA:** Prática de entrevistas técnicas e comportamentais (PT/EN) com feedback imediato via áudio/texto.
- **Auditoria 360:** Análise automatizada de Currículo, Portfólio, GitHub e LinkedIn com relatórios de criticidade.
- **Gerador de CV para ATS:** Criação de currículos personalizados com base nas palavras-chave de vagas específicas do LinkedIn.
- **Gerador de Posts LinkedIn:** IA para criação de conteúdo técnico (texto + imagem + hashtags) para aumentar a visibilidade do profissional.

### 🛠️ Gestão e Comunidade

- **Caixa de Sugestões Gamificada:** Sistema de feedback onde usuários ganham pontos e conquistas por contribuir com a plataforma.
- **Dashboard Administrativo:** Monitoramento completo de métricas (CAC, LTV, taxa de conversão Premium, senioridade média, stacks principais).

---

## 🛣️ Jornada do Usuário

1.  **Onboarding:** Cadastro via Email ou Google OAuth.
2.  **Setup de Perfil:** Definição de senioridade, área de atuação (Front, Back, FullStack, etc) e objetivos de carreira.
3.  **Diagnóstico:** Realização do primeiro teste técnico para gerar a "Avaliação Geral 0-100".
4.  **Evolução:** Acesso ao Roadmap de estudos e ferramentas de simulação.
5.  **Conversão:** Acesso a feedbacks profundos (nível Tech Lead) através do Pack de Aceleração.

---

## 💰 Estratégia de Negócio

- **Modelo Principal:** "Pack Aceleração Júnior" (Pagamento único/Créditos).
- **Afiliados (Hotmart/Udemy):** Recomendação contextual de cursos baseada nos erros cometidos pelo usuário no quiz.
- **Growth Viral:** Sistema "Indique e Ganhe" (Member-Get-Member) que recompensa usuários com créditos de IA.
- **Prova Social:** Geração de certificados "Top 10%" em formato vertical para compartilhamento em redes sociais.

---

## 🛠️ Stack Técnica (Prevista)

- **Frontend:** React / Next.js (Landing Page focada em conversão).
- **Estilização:** Tailwind CSS.
- **Inteligência Artificial:** Integração com APIs de LLM (OpenAI/Gemini) para análises e simulações.
- **Análise de Dados:** Web Scraping para auditoria de perfis.

---

## 🔮 Roadmap de Features Futuras (Pós-MVP)

- [ ] **Material Sugerido:** Links diretos para vídeos e artigos integrados ao Roadmap.
- [ ] **Comunidade:** Sistema de perfis sociais, desafios e conquistas compartilhadas.
- [ ] **Prática de Algoritmos:** Desafios estilo LeetCode com feedback por IA.
- [ ] **Desafios de Empresas:** Projetos reais propostos por empresas parceiras ou gerados por IA com tempo limite.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🏗️ Arquitetura Backend (Clean Architecture)

```
src/
├── modules/
│ └── user/                       # Módulo de usuários
│   ├── user.controller.ts        # Recebe requests HTTP
│   ├── user.routes.ts            # Define endpoints e middlewares
│   ├── user.schema.ts            # Validação Zod dos inputs
│   ├── user.dto.ts               # Tipagem de entrada/saída
│   └── use-cases/
│     ├── create-user.ts          # Caso de uso: criar usuário
│     └── authenticate-user.ts    # Caso de uso: autenticar
│
├── domain/
│ ├── entities/
  │ │ └── user.entity.ts            # Modelo de domínio
│ ├── repositories/
│ │ └── user.repository.ts        # Interface do repositório
│ └── services/
│   └── email.service.ts          # Interface de email
│
├── infra/
│ ├── database/
│ │ └── prisma/
│ │   └── user.prisma-repository.ts   # Implementação Prisma
│ ├── providers/
│ │ └── sendgrid.provider.ts          # Implementação SendGrid
│ └── http/
│   ├── middlewares/
│   │ ├── auth.middleware.ts          # Validação JWT
│   │ └── error.middleware.ts         # Handler de erros
│   ├── container.ts                  # Injeção de dependências
│   └── server.ts                     # Configuração Express
│
└── shared/
  ├── errors/
  │ └── app.error.ts              # Erros customizados
  ├── env.ts                      # Variáveis de ambiente
  └── utils.ts                    # Funções utilitárias
└── tests/
```
