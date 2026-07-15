-- CreateTable
CREATE TABLE "NodeComment" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NodeComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NodeComment_nodeId_idx" ON "NodeComment"("nodeId");

-- CreateIndex
CREATE INDEX "NodeComment_userId_idx" ON "NodeComment"("userId");

-- CreateIndex
CREATE INDEX "NodeComment_parentId_idx" ON "NodeComment"("parentId");

-- AddForeignKey
ALTER TABLE "NodeComment" ADD CONSTRAINT "NodeComment_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeComment" ADD CONSTRAINT "NodeComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeComment" ADD CONSTRAINT "NodeComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NodeComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
