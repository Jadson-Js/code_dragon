-- Seniorities
INSERT INTO "seniorities" ("name", "slug", "order", "created_at", "updated_at") VALUES
('Estagiário', 'intern', 1, NOW(), NOW()),
('Júnior', 'junior', 2, NOW(), NOW()),
('Pleno', 'mid-level', 3, NOW(), NOW()),
('Sênior', 'senior', 4, NOW(), NOW()),
('Especialista', 'specialist', 5, NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;

-- Specialties
INSERT INTO "specialties" ("name", "slug", "order", "created_at", "updated_at") VALUES
('Frontend', 'frontend', 1, NOW(), NOW()),
('Backend', 'backend', 2, NOW(), NOW()),
('Full Stack', 'fullstack', 3, NOW(), NOW()),
('Mobile', 'mobile', 4, NOW(), NOW()),
('DevOps', 'devops', 5, NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;

-- Career Objectives
INSERT INTO "career_objectives" ("name", "slug", "order", "created_at", "updated_at") VALUES
('Primeiro Emprego', 'first-job', 1, NOW(), NOW()),
('Transição de Carreira', 'career-transition', 2, NOW(), NOW()),
('Evolução Profissional', 'professional-evolution', 3, NOW(), NOW()),
('Liderança', 'leadership', 4, NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;

-- Stacks
INSERT INTO "stacks" ("name", "slug", "created_at", "updated_at") VALUES
('React', 'react', NOW(), NOW()),
('React Native', 'react-native', NOW(), NOW()),
('Node.js', 'nodejs', NOW(), NOW()),
('TypeScript', 'typescript', NOW(), NOW()),
('Python', 'python', NOW(), NOW()),
('Java', 'java', NOW(), NOW()),
('Go', 'go', NOW(), NOW()),
('Rust', 'rust', NOW(), NOW()),
('SQL', 'sql', NOW(), NOW()),
('Docker', 'docker', NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;

-- User
INSERT INTO "users" ("birth_date", "created_at", "deleted_at", "email", "github_url", "id", "linkedin_url", "name", "password_hash", "portfolio_url", "updated_at", "verified_at") VALUES 
('2005-03-08 00:00:00', NOW(), NULL, 'admin@admin.com', NULL, '8f9e610e-ae40-4bd4-9438-959a256f2719', NULL, 'admin', '$2b$10$sJLoQq.iVpBdGAZCALVZCejyytZQ9jA2l4Js7rdrTbMVMEgGyncQG', NULL, NOW(), NOW())
ON CONFLICT ("email") DO NOTHING;
