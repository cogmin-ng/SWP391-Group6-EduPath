/*
  Warnings:

  - A unique constraint covering the columns `[tokenId]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "tokenId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenId_key" ON "RefreshToken"("tokenId");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_revoked_expiresAt_idx" ON "RefreshToken"("userId", "revoked", "expiresAt");
