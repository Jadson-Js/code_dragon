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
('Frontend', 'Desenvolvimento de interfaces Web modernas, performance e experiência do usuário.', 'frontend', 1, NOW(), NOW()),
('Backend', 'Engenharia de APIs, lógica de servidor, bancos de dados e performance sistêmica.', 'backend', 2, NOW(), NOW()),
('Full Stack', 'Visão técnica completa que transita entre o frontend e backend com facilidade.', 'fullstack', 3, NOW(), NOW()),
('Mobile', 'Desenvolvimento mobile de alto nível para ecossistemas Android e iOS.', 'mobile', 4, NOW(), NOW()),
('DevOps', 'Foco em CI/CD, infraestrutura em nuvem, automação e alta disponibilidade.', 'devops', 5, NOW(), NOW()) 
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
('Python', 'python', 0, NOW(), NOW()),
('Java', 'java', 0, NOW(), NOW()),
('Go', 'go', 0, NOW(), NOW()),
('Rust', 'rust', 0, NOW(), NOW()),
('SQL', 'sql', 0, NOW(), NOW()),
('Docker', 'docker', 0, NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;

-- User
INSERT INTO "users" ("created_at", "deleted_at", "email", "id", "name", "password_hash", "updated_at", "verified_at") VALUES 
(NOW(), NULL, 'admin@admin.com', '8f9e610e-ae40-4bd4-9438-959a256f2719', 'admin', '$2b$10$sJLoQq.iVpBdGAZCALVZCejyytZQ9jA2l4Js7rdrTbMVMEgGyncQG', NOW(), NOW())
ON CONFLICT ("email") DO NOTHING;
