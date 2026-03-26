-- User
INSERT INTO "users" ("created_at", "deleted_at", "email", "id", "name", "password_hash", "updated_at", "verified_at") VALUES 
(NOW(), NULL, 'admin@admin.com', '8f9e610e-ae40-4bd4-9438-959a256f2719', 'admin', '$2b$10$sJLoQq.iVpBdGAZCALVZCejyytZQ9jA2l4Js7rdrTbMVMEgGyncQG', NOW(), NOW())
ON CONFLICT ("email") DO NOTHING;

-- Quiz Objectives
INSERT INTO "quiz_objectives" ("name", "description", "slug", "created_at", "updated_at") VALUES
('Treinamento', 'Perguntas focadas em aprendizado e prática de conceitos.', 'training', NOW(), NOW()),
('Entrevista Técnica', 'Simulação de questões comuns em processos seletivos.', 'technical-interview', NOW(), NOW()),
('Certificação', 'Preparação para exames de certificação profissional.', 'certification', NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;

-- Quiz Subjects
INSERT INTO "quiz_subjects" ("name", "description", "slug", "created_at", "updated_at") VALUES
-- Frontend
('React & Hooks', 'Estado, Ciclo de vida e performance no React.', 'react-hooks', NOW(), NOW()),
('CSS Avançado', 'Flexbox, Grid, Animações e Responsive Design.', 'advanced-css', NOW(), NOW()),
('Next.js', 'SSR, SSG e roteamento no Next.', 'nextjs-subjects', NOW(), NOW()),

-- Backend
('Node.js Event Loop', 'Arquitetura assíncrona e gestão de memória.', 'nodejs-event-loop', NOW(), NOW()),
('SQL & Bancos Relationais', 'Queries complexas, Indexação e ACID.', 'sql-databases', NOW(), NOW()),
('Arquitetura de Microserviços', 'Comunicação entre serviços, Gateways e Mensageria.', 'microservices', NOW(), NOW()),

-- Mobile
('React Native', 'Pontes nativas, Gestos e Performance Mobile.', 'react-native-subjects', NOW(), NOW()),
('Flutter & Dart', 'Widgets, State Management e Renderização.', 'flutter-dart', NOW(), NOW()),

-- DevOps & Cloud
('Docker & Containers', 'Orquestração, Imagens e Redes.', 'docker-containers', NOW(), NOW()),
('CI/CD Pipelines', 'Automação de testes e deploy contínuo.', 'cicd-pipelines', NOW(), NOW()),
('Kubernetes', 'Pods, Services e Ingress controllers.', 'kubernetes-subjects', NOW(), NOW()),

-- Security
('OWASP Top 10', 'Vulnerabilidades comuns e como mitigá-las.', 'owasp-top-10', NOW(), NOW()),
('Criptografia', 'Algoritmos simétricos, assimétricos e Hashing.', 'cryptography', NOW(), NOW())
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

