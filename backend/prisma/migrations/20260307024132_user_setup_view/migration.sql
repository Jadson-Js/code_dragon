/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3),
    "verified_at" TIMESTAMP(3),
    "linkedin_url" TEXT,
    "github_url" TEXT,
    "portfolio_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_setups" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "seniority_id" INTEGER NOT NULL,
    "speciality_id" INTEGER NOT NULL,
    "career_objective_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_setups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seniorities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seniorities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_objectives" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "career_objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "specialities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_setup_stacks" (
    "id" TEXT NOT NULL,
    "user_setup_id" TEXT NOT NULL,
    "stack_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_setup_stacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stacks" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_hash_key" ON "tokens"("token_hash");

-- CreateIndex
CREATE UNIQUE INDEX "user_setups_user_id_key" ON "user_setups"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "seniorities_slug_key" ON "seniorities"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "career_objectives_slug_key" ON "career_objectives"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "specialities_slug_key" ON "specialities"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "stacks_slug_key" ON "stacks"("slug");

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_setups" ADD CONSTRAINT "user_setups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_setups" ADD CONSTRAINT "user_setups_seniority_id_fkey" FOREIGN KEY ("seniority_id") REFERENCES "seniorities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_setups" ADD CONSTRAINT "user_setups_speciality_id_fkey" FOREIGN KEY ("speciality_id") REFERENCES "specialities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_setups" ADD CONSTRAINT "user_setups_career_objective_id_fkey" FOREIGN KEY ("career_objective_id") REFERENCES "career_objectives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_setup_stacks" ADD CONSTRAINT "user_setup_stacks_user_setup_id_fkey" FOREIGN KEY ("user_setup_id") REFERENCES "user_setups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_setup_stacks" ADD CONSTRAINT "user_setup_stacks_stack_id_fkey" FOREIGN KEY ("stack_id") REFERENCES "stacks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE VIEW user_setup_view AS
SELECT 
    u.id AS user_id,
    us.id AS user_setup_id,
    se.name AS seniority_name,
    sp.name AS speciality_name,
    ca.name AS career_objective_name,
    ARRAY_AGG(DISTINCT s.name) AS stack_names
FROM
    users u
    JOIN user_setups us ON u.id = us.user_id
    JOIN seniorities se ON us.seniority_id = se.id
    JOIN specialities sp ON us.speciality_id = sp.id
    JOIN career_objectives ca ON us.career_objective_id = ca.id
    JOIN user_setup_stacks uss ON us.id = uss.user_setup_id
    JOIN stacks s ON uss.stack_id = s.id
GROUP BY
    u.id, us.id, se.name, sp.name, ca.name;



