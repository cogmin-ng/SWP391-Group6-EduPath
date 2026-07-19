-- CreateTable
CREATE TABLE "PersonalLearningNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalLearningNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonalLearningNote_userId_nodeId_key" ON "PersonalLearningNote"("userId", "nodeId");

-- CreateIndex
CREATE INDEX "PersonalLearningNote_userId_isDeleted_idx" ON "PersonalLearningNote"("userId", "isDeleted");

-- CreateIndex
CREATE INDEX "PersonalLearningNote_nodeId_isDeleted_idx" ON "PersonalLearningNote"("nodeId", "isDeleted");

-- AddForeignKey
ALTER TABLE "PersonalLearningNote" ADD CONSTRAINT "PersonalLearningNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalLearningNote" ADD CONSTRAINT "PersonalLearningNote_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;
