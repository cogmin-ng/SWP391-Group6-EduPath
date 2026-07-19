-- AddColumn
ALTER TABLE "Enrollment"
ADD COLUMN "lastActivityAt" TIMESTAMP(3);

-- Backfill the latest meaningful learning activity for existing enrollments.
UPDATE "Enrollment" AS enrollment
SET "lastActivityAt" = GREATEST(
    enrollment."enrolledAt",
    COALESCE((
        SELECT MAX(progress."completedAt")
        FROM "ChecklistProgress" AS progress
        JOIN "Checklist" AS checklist ON checklist."id" = progress."checklistId"
        JOIN "Node" AS node ON node."id" = checklist."nodeId"
        WHERE progress."userId" = enrollment."userId"
          AND node."learningPathId" = enrollment."learningPathId"
          AND progress."isDeleted" = false
    ), enrollment."enrolledAt"),
    COALESCE((
        SELECT MAX(progress."completedAt")
        FROM "NodeProgress" AS progress
        JOIN "Node" AS node ON node."id" = progress."nodeId"
        WHERE progress."userId" = enrollment."userId"
          AND node."learningPathId" = enrollment."learningPathId"
          AND progress."isDeleted" = false
    ), enrollment."enrolledAt"),
    COALESCE((
        SELECT MAX(attempt."createdAt")
        FROM "QuizAttempt" AS attempt
        JOIN "Quiz" AS quiz ON quiz."id" = attempt."quizId"
        JOIN "Node" AS node ON node."id" = quiz."nodeId"
        WHERE attempt."userId" = enrollment."userId"
          AND node."learningPathId" = enrollment."learningPathId"
          AND attempt."isDeleted" = false
    ), enrollment."enrolledAt"),
    COALESCE((
        SELECT MAX(note."updatedAt")
        FROM "PersonalLearningNote" AS note
        JOIN "Node" AS node ON node."id" = note."nodeId"
        WHERE note."userId" = enrollment."userId"
          AND node."learningPathId" = enrollment."learningPathId"
          AND note."isDeleted" = false
    ), enrollment."enrolledAt")
);

ALTER TABLE "Enrollment"
ALTER COLUMN "lastActivityAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "lastActivityAt" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Enrollment_learningPathId_status_lastActivityAt_idx"
ON "Enrollment"("learningPathId", "status", "lastActivityAt");
