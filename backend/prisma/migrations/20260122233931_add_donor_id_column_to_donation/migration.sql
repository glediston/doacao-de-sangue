/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Donation` table. All the data in the column will be lost.
  - Added the required column `donorId` to the `Donation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Donation" DROP CONSTRAINT "Donation_userId_fkey";

-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "createdAt",
DROP COLUMN "userId",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "donorId" INTEGER NOT NULL,
ADD COLUMN     "recipient" TEXT,
ALTER COLUMN "quantity" DROP NOT NULL,
ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
