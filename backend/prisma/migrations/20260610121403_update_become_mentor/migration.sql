/*
  Warnings:

  - You are about to drop the column `cvUrl` on the `AdvisorApplication` table. All the data in the column will be lost.
  - You are about to drop the column `portfolioUrl` on the `AdvisorApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AdvisorApplication" DROP COLUMN "cvUrl",
DROP COLUMN "portfolioUrl",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "currentSemester" TEXT,
ADD COLUMN     "rejectReason" TEXT,
ADD COLUMN     "transcriptUrl" TEXT;

-- CreateTable
CREATE TABLE "AdvisorSubject" (
    "id" TEXT NOT NULL,
    "advisorApplicationId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "AdvisorSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvisorAcademicRecord" (
    "id" TEXT NOT NULL,
    "advisorApplicationId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "grade" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AdvisorAcademicRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdvisorSubject_advisorApplicationId_subjectId_key" ON "AdvisorSubject"("advisorApplicationId", "subjectId");

-- AddForeignKey
ALTER TABLE "AdvisorSubject" ADD CONSTRAINT "AdvisorSubject_advisorApplicationId_fkey" FOREIGN KEY ("advisorApplicationId") REFERENCES "AdvisorApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvisorSubject" ADD CONSTRAINT "AdvisorSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvisorAcademicRecord" ADD CONSTRAINT "AdvisorAcademicRecord_advisorApplicationId_fkey" FOREIGN KEY ("advisorApplicationId") REFERENCES "AdvisorApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvisorAcademicRecord" ADD CONSTRAINT "AdvisorAcademicRecord_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
