-- User
INSERT INTO "users" ("created_at", "deleted_at", "email", "id", "name", "password_hash", "updated_at", "verified_at") VALUES 
(NOW(), NULL, 'admin@admin.com', '8f9e610e-ae40-4bd4-9438-959a256f2719', 'admin', '$2b$10$sJLoQq.iVpBdGAZCALVZCejyytZQ9jA2l4Js7rdrTbMVMEgGyncQG', NOW(), NOW())
ON CONFLICT ("email") DO NOTHING;

-- Features
INSERT INTO "features" ("name", "description", "slug", "created_at", "updated_at") VALUES
('Quiz', 'Gerador de questões para estudo e prática.', 'quiz', NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;

-- Seniorities
INSERT INTO "seniorities" ("name", "description", "slug", "order", "created_at", "updated_at") VALUES
('Sem Experiência', 'Iniciando estudos na área de tecnologia e ainda sem vivência profissional.', 'no-experience', 1, NOW(), NOW()),
('Estagiário', 'Estudantes ativos em busca de aprendizado e desenvolvimento prático profissional.', 'intern', 2, NOW(), NOW()),
('Júnior', 'Até 2 anos de experiência, realizando tarefas sob supervisão e apoio técnico.', 'junior', 3, NOW(), NOW()),
('Pleno', 'Autonomia técnica comprovada para execução de tarefas e apoio a iniciantes.', 'mid-level', 4, NOW(), NOW()),
('Sênior', 'Especialista em soluções técnicas, visão estratégica e mentoria para o time.', 'senior', 5, NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;

-- Specialties
INSERT INTO "specialties" ("name", "description", "slug", "order", "created_at", "updated_at") VALUES
('Frontend', 'Interfaces Web, UI/UX e performance no navegador.', 'frontend', 1, NOW(), NOW()),
('Backend', 'APIs, bancos de dados e lógica complexa de servidor.', 'backend', 2, NOW(), NOW()),
('Full Stack', 'Domínio completo de ponta a ponta (Web e Server).', 'fullstack', 3, NOW(), NOW()),
('Mobile', 'Criação de Apps nativos para Android e iOS.', 'mobile', 4, NOW(), NOW()),
('DevOps', 'Infraestrutura, Cloud, Automação e Pipelines CI/CD.', 'devops', 5, NOW(), NOW()),
('Security', 'Cibersegurança, proteção de dados e hacking ético.', 'security', 6, NOW(), NOW()) 
ON CONFLICT ("slug") DO NOTHING;

-- Career Objectives
INSERT INTO "career_objectives" ("name", "description", "slug", "order", "created_at", "updated_at") VALUES
('Primeiro Emprego', 'Busca inicial de oportunidades no mercado de trabalho para ganhar experiência.', 'first-job', 1, NOW(), NOW()),
('Transição de Carreira', 'Profissionais migrando de outras áreas em busca da primeira chance em tecnologia.', 'career-transition', 2, NOW(), NOW()),
('Evolução Profissional', 'Foco no crescimento técnico e progressão salarial dentro do ecossistema de TI.', 'professional-evolution', 3, NOW(), NOW()),
('Liderança', 'Transição técnica para gestão de projetos ou coordenação de equipes de engenharia.', 'leadership', 4, NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;

-- Age Ranges
INSERT INTO "age_ranges" ("name", "start_age", "end_age", "slug", "order", "created_at", "updated_at") VALUES
('Menos de 18', 0, 17, 'under-18', 1, NOW(), NOW()),
('18 a 24', 18, 24, '18-24', 2, NOW(), NOW()),
('25 a 34', 25, 34, '25-34', 3, NOW(), NOW()),
('35 a 44', 35, 44, '35-44', 4, NOW(), NOW()),
('45 ou mais', 45, 120, '45-plus', 5, NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;

-- Stacks
INSERT INTO "stacks" ("name", "slug", "usage_count", "created_at", "updated_at") VALUES
('React', 'react', 0, NOW(), NOW()),
('React Native', 'react-native', 0, NOW(), NOW()),
('Node.js', 'nodejs', 0, NOW(), NOW()),
('TypeScript', 'typescript', 0, NOW(), NOW()),
('JavaScript', 'javascript', 0, NOW(), NOW()),
('Python', 'python', 0, NOW(), NOW()),
('Java', 'java', 0, NOW(), NOW()),
('Go', 'go', 0, NOW(), NOW()),
('Rust', 'rust', 0, NOW(), NOW()),
('C#', 'csharp', 0, NOW(), NOW()),
('C++', 'cpp', 0, NOW(), NOW()),
('PHP', 'php', 0, NOW(), NOW()),
('Ruby', 'ruby', 0, NOW(), NOW()),
('Swift', 'swift', 0, NOW(), NOW()),
('Kotlin', 'kotlin', 0, NOW(), NOW()),
('Dart', 'dart', 0, NOW(), NOW()),
('HTML5', 'html5', 0, NOW(), NOW()),
('CSS3', 'css3', 0, NOW(), NOW()),
('Sass', 'sass', 0, NOW(), NOW()),
('Tailwind CSS', 'tailwindcss', 0, NOW(), NOW()),
('Bootstrap', 'bootstrap', 0, NOW(), NOW()),
('Material UI', 'material-ui', 0, NOW(), NOW()),
('Angular', 'angular', 0, NOW(), NOW()),
('Vue.js', 'vuejs', 0, NOW(), NOW()),
('Svelte', 'svelte', 0, NOW(), NOW()),
('Next.js', 'nextjs', 0, NOW(), NOW()),
('Nuxt.js', 'nuxtjs', 0, NOW(), NOW()),
('Express.js', 'expressjs', 0, NOW(), NOW()),
('NestJS', 'nestjs', 0, NOW(), NOW()),
('Spring Boot', 'spring-boot', 0, NOW(), NOW()),
('Django', 'django', 0, NOW(), NOW()),
('Flask', 'flask', 0, NOW(), NOW()),
('FastAPI', 'fastapi', 0, NOW(), NOW()),
('Laravel', 'laravel', 0, NOW(), NOW()),
('Ruby on Rails', 'ruby-on-rails', 0, NOW(), NOW()),
('ASP.NET Core', 'aspnet-core', 0, NOW(), NOW()),
('SQL', 'sql', 0, NOW(), NOW()),
('PostgreSQL', 'postgresql', 0, NOW(), NOW()),
('MySQL', 'mysql', 0, NOW(), NOW()),
('SQL Server', 'sql-server', 0, NOW(), NOW()),
('MongoDB', 'mongodb', 0, NOW(), NOW()),
('Redis', 'redis', 0, NOW(), NOW()),
('Elasticsearch', 'elasticsearch', 0, NOW(), NOW()),
('GraphQL', 'graphql', 0, NOW(), NOW()),
('Apollo', 'apollo', 0, NOW(), NOW()),
('Docker', 'docker', 0, NOW(), NOW()),
('Kubernetes', 'kubernetes', 0, NOW(), NOW()),
('AWS', 'aws', 0, NOW(), NOW()),
('Google Cloud', 'gcp', 0, NOW(), NOW()),
('Azure', 'azure', 0, NOW(), NOW()),
('Firebase', 'firebase', 0, NOW(), NOW()),
('Supabase', 'supabase', 0, NOW(), NOW()),
('Vercel', 'vercel', 0, NOW(), NOW()),
('Netlify', 'netlify', 0, NOW(), NOW()),
('Git', 'git', 0, NOW(), NOW()),
('GitHub Actions', 'github-actions', 0, NOW(), NOW()),
('GitLab CI', 'gitlab-ci', 0, NOW(), NOW()),
('Jenkins', 'jenkins', 0, NOW(), NOW()),
('Linux', 'linux', 0, NOW(), NOW()),
('Bash', 'bash', 0, NOW(), NOW()),
('Figma', 'figma', 0, NOW(), NOW()),
('Jest', 'jest', 0, NOW(), NOW()),
('Cypress', 'cypress', 0, NOW(), NOW()),
('Playwright', 'playwright', 0, NOW(), NOW()),
('Mocha', 'mocha', 0, NOW(), NOW()),
('RxJS', 'rxjs', 0, NOW(), NOW()),
('Redux', 'redux', 0, NOW(), NOW()),
('Zustand', 'zustand', 0, NOW(), NOW()),
('Prisma', 'prisma', 0, NOW(), NOW()),
('TypeORM', 'typeorm', 0, NOW(), NOW()),
('Sequelize', 'sequelize', 0, NOW(), NOW()),
('Mongoose', 'mongoose', 0, NOW(), NOW()),
('RabbitMQ', 'rabbitmq', 0, NOW(), NOW()),
('Kafka', 'kafka', 0, NOW(), NOW()),
('Terraform', 'terraform', 0, NOW(), NOW()),
('Ansible', 'ansible', 0, NOW(), NOW()),
('Flutter', 'flutter', 0, NOW(), NOW()),
('Expo', 'expo', 0, NOW(), NOW()),
('iOS', 'ios', 0, NOW(), NOW()),
('Android', 'android', 0, NOW(), NOW()),
('Unity', 'unity', 0, NOW(), NOW()),
('Unreal Engine', 'unreal-engine', 0, NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;

-- ==========================================
-- 1. QUIZ OBJECTIVES
-- A descrição aqui dita o 'tom' e a 'dificuldade' da pergunta para a LLM.
-- ==========================================
insert into "public"."quiz_objectives" ("created_at", "description", "id", "name", "slug", "updated_at") values ('2026-04-25 13:06:48.41', 'Crie perguntas com foco educativo. Aborde fundamentos, sintaxe, boas práticas e o funcionamento interno da tecnologia. O objetivo é validar se o usuário compreende os conceitos base antes de aplicá-los.', 1, 'Treinamento e Fixação', 'training', '2026-04-25 13:06:48.41'), ('2026-04-25 13:06:48.41', 'Crie perguntas focadas em resolução de problemas reais, trade-offs (vantagens e desvantagens), edge cases (casos extremos) e arquitetura. Simule cenários práticos que testam a experiência real do candidato, não apenas teoria.', 2, 'Entrevista Técnica', 'technical-interview', '2026-04-25 13:06:48.41') ON CONFLICT ("id") DO NOTHING;


-- ==========================================
-- 2. QUIZ SUBJECTS
-- A description instrui a LLM sobre quais conceitos, termos e cenários explorar ao gerar questões para este assunto.
-- ==========================================
INSERT INTO "quiz_subjects" ("name", "description", "slug", "created_at", "updated_at") VALUES

-- Fundamentos universais (relevantes a toda especialidade técnica)
(
  'Estruturas de Dados e Algoritmos',
  'Gere questões sobre escolha e trade-offs de estruturas de dados (arrays, listas encadeadas, árvores binárias, heaps, grafos, tabelas hash) e algoritmos clássicos (ordenação, busca binária, BFS/DFS). Exija raciocínio sobre complexidade de tempo e espaço com notação Big-O. Prefira cenários práticos: "qual estrutura você usaria para X e por quê?". Evite perguntas puramente decorativas de sintaxe.',
  'data-structures-algorithms', NOW(), NOW()
),
(
  'Redes e Protocolos',
  'Gere questões sobre o funcionamento da pilha de rede: modelo OSI/TCP-IP, diferenças entre TCP e UDP, handshake TLS, ciclo de vida de uma requisição HTTP (DNS → TCP → TLS → Request → Response). Explore HTTP/1.1 vs HTTP/2 vs HTTP/3, WebSockets, long-polling, CDNs, latência vs throughput e conceitos de balanceamento de carga. Foque em como o protocolo escolhido impacta a arquitetura e a performance da aplicação.',
  'networks-protocols', NOW(), NOW()
),

-- Frontend & Clientes
(
  'Arquitetura de Interface e Renderização',
  'Gere questões sobre as diferenças, vantagens e custos de CSR (Client-Side Rendering), SSR (Server-Side Rendering), SSG (Static Site Generation) e ISR. Explore o DOM virtual, reconciliação, Shadow DOM, Web Components, estratégias de hidratação e acessibilidade (ARIA, semântica HTML5, WCAG). Exija que o candidato justifique a escolha de uma estratégia de renderização para um cenário específico (e-commerce, dashboard, blog).',
  'ui-architecture-rendering', NOW(), NOW()
),
(
  'Gerenciamento de Estado e Reatividade',
  'Gere questões sobre os padrões de gerenciamento de estado em aplicações de interface: Flux, Redux (ações, reducers, seletores), Context API, signals e reatividade fina. Explore imutabilidade, derivação de estado, lifting state up, prop drilling e quando usar estado local vs global. Questione sobre ciclos de vida de componentes, efeitos colaterais e o problema de stale closures em hooks.',
  'state-management-reactivity', NOW(), NOW()
),

-- Backend & Servidores
(
  'Design de APIs e Comunicação',
  'Gere questões sobre a escolha e design de contratos de API: REST (métodos HTTP, códigos de status, HATEOAS), GraphQL (queries, mutations, N+1 problem, DataLoader), gRPC (Protocol Buffers, streaming), webhooks e event-driven communication. Aborde idempotência, paginação (offset vs cursor-based), versionamento de API e estratégias de backward compatibility. O candidato deve saber quando cada abordagem é a mais adequada.',
  'api-design-communication', NOW(), NOW()
),
(
  'Concorrência e Execução',
  'Gere questões sobre os modelos de concorrência: threads vs processos, event loop (Node.js, libuv), coroutines, async/await, Promises e como evitar deadlocks e race conditions. Explore o modelo de atores, filas de mensagens, backpressure e a diferença entre concorrência e paralelismo. Exija que o candidato identifique e resolva problemas de sincronização em cenários de múltiplos workers acessando um recurso compartilhado.',
  'concurrency-execution', NOW(), NOW()
),
(
  'Persistência e Banco de Dados',
  'Gere questões sobre modelagem relacional (normalização, formas normais, chaves estrangeiras) vs NoSQL (documento, chave-valor, grafo, coluna). Explore as propriedades ACID, isolamento de transações (Read Uncommitted → Serializable), índices (B-Tree, Hash, GIN/GiST), query planning e os padrões de cache (Cache-Aside, Write-Through, Read-Through). Inclua cenários de escala: sharding, replicação e consistência eventual.',
  'persistence-databases', NOW(), NOW()
),

-- Arquitetura & Engenharia de Software
(
  'Arquitetura de Software e Design Patterns',
  'Gere questões sobre os padrões de projeto GoF (criacionais, estruturais e comportamentais) aplicados a problemas reais. Explore os princípios SOLID com exemplos de violação e correção. Questione sobre escolhas arquiteturais: Monólito vs Microserviços (quando cada um faz sentido), CQRS, Event Sourcing, Saga e DDD (Entidades, Agregados, Bounded Contexts). O candidato deve justificar a escolha de um padrão para um requisito de negócio específico.',
  'software-architecture-patterns', NOW(), NOW()
),
(
  'Segurança da Informação',
  'Gere questões sobre os fundamentos de segurança ofensiva e defensiva: vulnerabilidades do OWASP Top 10 (SQLi, XSS, CSRF, IDOR, SSRF), criptografia simétrica vs assimétrica, hashing seguro de senhas (bcrypt, Argon2), fluxos de autenticação (OAuth 2.0, OpenID Connect, JWT vs Sessions) e segurança em APIs (rate limiting, validação de entrada, CORS). Para especialistas em Security, inclua questões sobre threat modeling, pentest, análise de CVEs e segurança em nível de rede (firewalls, WAF, TLS).',
  'information-security', NOW(), NOW()
),

-- Operações & Qualidade
(
  'DevOps, CI/CD e Infraestrutura',
  'Gere questões sobre o ciclo de vida de entrega de software: pipelines de CI/CD (build, test, deploy), estratégias de deploy (Blue/Green, Canary, Rolling Update) e rollback. Explore conteinerização (Docker: camadas de imagem, volumes, redes), orquestração (Kubernetes: Pods, Deployments, Services, Ingress), IaC (Terraform), observabilidade (métricas, logs, tracing distribuído) e os fundamentos de Cloud (regiões, zonas, IAM, managed services). O candidato deve conhecer o trade-off entre custo, disponibilidade e complexidade operacional.',
  'devops-cicd-infra', NOW(), NOW()
),
(
  'Engenharia de Qualidade e Testes',
  'Gere questões sobre a pirâmide de testes (Unitários, Integração, Contrato, E2E) e o custo/benefício de cada nível. Explore TDD (ciclo Red-Green-Refactor), BDD (Gherkin), o uso correto de mocks, stubs, spies e fakes, cobertura de código (o que mede e o que não mede) e testes de performance/carga. Questione sobre como testar código assíncrono, módulos com efeitos colaterais e como estruturar uma suíte de testes sustentável em projetos grandes.',
  'quality-engineering-testing', NOW(), NOW()
)

ON CONFLICT ("slug") DO NOTHING;

-- ==========================================
-- 3. MAPEAMENTO: SPECIALTY <-> QUIZ SUBJECT
-- Define quais assuntos são relevantes para cada especialidade.
-- Lógica: um dev de Security não recebe questões de UI/Estado;
--         um dev de Frontend não é bombardeado com tópicos pesados de DevOps.
-- ==========================================
INSERT INTO "quiz_specialty_subject" ("specialty_id", "quiz_subject_id", "created_at")
SELECT s.id, qs.id, NOW()
FROM "specialties" s
CROSS JOIN "quiz_subjects" qs
WHERE
  -- FRONTEND: UI, estado, APIs, algoritmos, redes, qualidade, arquitetura
  (s.slug = 'frontend' AND qs.slug IN (
    'ui-architecture-rendering',
    'state-management-reactivity',
    'api-design-communication',
    'data-structures-algorithms',
    'networks-protocols',
    'software-architecture-patterns',
    'quality-engineering-testing',
    'information-security'
  ))
  OR
  -- BACKEND: APIs, banco, concorrência, algoritmos, redes, arquitetura, qualidade, segurança
  (s.slug = 'backend' AND qs.slug IN (
    'api-design-communication',
    'persistence-databases',
    'concurrency-execution',
    'data-structures-algorithms',
    'networks-protocols',
    'software-architecture-patterns',
    'quality-engineering-testing',
    'information-security'
  ))
  OR
  -- FULL STACK: tudo (é o generalista por excelência)
  (s.slug = 'fullstack' AND qs.slug IN (
    'ui-architecture-rendering',
    'state-management-reactivity',
    'api-design-communication',
    'persistence-databases',
    'concurrency-execution',
    'data-structures-algorithms',
    'networks-protocols',
    'software-architecture-patterns',
    'quality-engineering-testing',
    'information-security',
    'devops-cicd-infra'
  ))
  OR
  -- MOBILE: UI/estado (adaptados para mobile), APIs, algoritmos, qualidade, arquitetura
  (s.slug = 'mobile' AND qs.slug IN (
    'ui-architecture-rendering',
    'state-management-reactivity',
    'api-design-communication',
    'data-structures-algorithms',
    'networks-protocols',
    'software-architecture-patterns',
    'quality-engineering-testing',
    'information-security'
  ))
  OR
  -- DEVOPS: infra/CI-CD, redes, segurança, banco (operacional), algoritmos, arquitetura
  (s.slug = 'devops' AND qs.slug IN (
    'devops-cicd-infra',
    'networks-protocols',
    'information-security',
    'persistence-databases',
    'data-structures-algorithms',
    'software-architecture-patterns',
    'concurrency-execution'
  ))
  OR
  -- SECURITY: segurança é o core; redes, algoritmos (criptografia), APIs, banco e devops como contexto necessário
  (s.slug = 'security' AND qs.slug IN (
    'information-security',
    'networks-protocols',
    'api-design-communication',
    'persistence-databases',
    'data-structures-algorithms',
    'devops-cicd-infra',
    'software-architecture-patterns'
  ))
ON CONFLICT ("specialty_id", "quiz_subject_id") DO NOTHING;

-- ==========================================
-- 4. DUMMY DATA RECORDS
-- ==========================================

insert into "public"."profiles" ("age_range_id", "career_objective_id", "created_at", "github_url", "id", "linkedin_url", "portfolio_url", "seniority_id", "specialty_id", "updated_at", "user_id") values (1, 1, '2026-04-25 13:13:58.424', NULL, '7428510b-bd15-49a4-a013-c0bdcf76afb4', NULL, NULL, 3, 2, '2026-04-25 13:14:14.834', '8f9e610e-ae40-4bd4-9438-959a256f2719') ON CONFLICT ("id") DO NOTHING;

insert into "public"."profile_stacks" ("created_at", "id", "profile_id", "stack_id", "updated_at") values ('2026-04-25 13:14:14.84', '6049e89b-3696-4bb2-b61e-16fb7267c7c2', '7428510b-bd15-49a4-a013-c0bdcf76afb4', 3, '2026-04-25 13:14:14.84'), ('2026-04-25 13:14:14.84', '7857e681-eb9a-4580-8915-21c006c8624f', '7428510b-bd15-49a4-a013-c0bdcf76afb4', 4, '2026-04-25 13:14:14.84') ON CONFLICT ("id") DO NOTHING;