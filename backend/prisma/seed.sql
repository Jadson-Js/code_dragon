-- Age Ranges
INSERT INTO "age_ranges" ("name", "slug", "order", "created_at", "updated_at") VALUES
('Menos de 18', 'under-18', 1, NOW(), NOW()),
('18 a 24', '18-24', 2, NOW(), NOW()),
('25 a 34', '25-34', 3, NOW(), NOW()),
('35 a 44', '35-44', 4, NOW(), NOW()),
('45 ou mais', '45-plus', 5, NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;

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
INSERT INTO "users" ("created_at", "deleted_at", "email", "id", "name", "password_hash", "updated_at", "verified_at") VALUES 
(NOW(), NULL, 'admin@admin.com', '8f9e610e-ae40-4bd4-9438-959a256f2719', 'admin', '$2b$10$sJLoQq.iVpBdGAZCALVZCejyytZQ9jA2l4Js7rdrTbMVMEgGyncQG', NOW(), NOW())
ON CONFLICT ("email") DO NOTHING;
