/*
  Warnings:

  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserRoles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "_UserRoles" DROP CONSTRAINT "_UserRoles_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserRoles" DROP CONSTRAINT "_UserRoles_B_fkey";

-- DropTable
DROP TABLE "RefreshToken";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_UserRoles";

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100),
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "roleId" UUID,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advisor_application" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "experience" TEXT,
    "portfolio_link" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "reviewed_by" UUID,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "advisor_application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_path" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "difficulty" VARCHAR(20),
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "advisor_id" UUID,
    "category_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_path_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "node" (
    "id" UUID NOT NULL,
    "learning_path_id" UUID NOT NULL,
    "title" VARCHAR(200),
    "description" TEXT,
    "order_index" INTEGER,

    CONSTRAINT "node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist" (
    "id" UUID NOT NULL,
    "node_id" UUID NOT NULL,
    "title" VARCHAR(200),
    "description" TEXT,
    "order_index" INTEGER,

    CONSTRAINT "checklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material" (
    "id" UUID NOT NULL,
    "node_id" UUID NOT NULL,
    "title" VARCHAR(200),
    "url" TEXT,
    "type" VARCHAR(20),

    CONSTRAINT "material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tip" (
    "id" UUID NOT NULL,
    "node_id" UUID NOT NULL,
    "created_by" UUID NOT NULL,
    "content" TEXT,
    "is_approved" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_question" (
    "id" UUID NOT NULL,
    "node_id" UUID NOT NULL,
    "question" TEXT,
    "explanation" TEXT,
    "difficulty" VARCHAR(20),

    CONSTRAINT "practice_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz" (
    "id" UUID NOT NULL,
    "node_id" UUID NOT NULL,
    "title" VARCHAR(200),
    "passing_score" INTEGER,

    CONSTRAINT "quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_question" (
    "id" UUID NOT NULL,
    "quiz_id" UUID NOT NULL,
    "question" TEXT,
    "explanation" TEXT,

    CONSTRAINT "quiz_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_option" (
    "id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "content" TEXT,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "quiz_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollment" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "learning_path_id" UUID NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "node_progress" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "node_id" UUID NOT NULL,
    "status" VARCHAR(20),
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "node_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_progress" (
    "id" UUID NOT NULL,
    "checklist_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "checklist_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_attempt" (
    "id" UUID NOT NULL,
    "quiz_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "score" INTEGER,
    "passed" BOOLEAN,
    "attempted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "learning_path_id" UUID NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_user_id_learning_path_id_key" ON "enrollment"("user_id", "learning_path_id");

-- CreateIndex
CREATE UNIQUE INDEX "node_progress_user_id_node_id_key" ON "node_progress"("user_id", "node_id");

-- CreateIndex
CREATE UNIQUE INDEX "checklist_progress_checklist_id_user_id_key" ON "checklist_progress"("checklist_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "certificate_user_id_learning_path_id_key" ON "certificate"("user_id", "learning_path_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advisor_application" ADD CONSTRAINT "advisor_application_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_path" ADD CONSTRAINT "learning_path_advisor_id_fkey" FOREIGN KEY ("advisor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_path" ADD CONSTRAINT "learning_path_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node" ADD CONSTRAINT "node_learning_path_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "learning_path"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist" ADD CONSTRAINT "checklist_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tip" ADD CONSTRAINT "tip_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tip" ADD CONSTRAINT "tip_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_question" ADD CONSTRAINT "practice_question_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_question" ADD CONSTRAINT "quiz_question_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_option" ADD CONSTRAINT "quiz_option_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "quiz_question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_learning_path_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "learning_path"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node_progress" ADD CONSTRAINT "node_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node_progress" ADD CONSTRAINT "node_progress_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_progress" ADD CONSTRAINT "checklist_progress_checklist_id_fkey" FOREIGN KEY ("checklist_id") REFERENCES "checklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_progress" ADD CONSTRAINT "checklist_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempt" ADD CONSTRAINT "quiz_attempt_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempt" ADD CONSTRAINT "quiz_attempt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_learning_path_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "learning_path"("id") ON DELETE CASCADE ON UPDATE CASCADE;
