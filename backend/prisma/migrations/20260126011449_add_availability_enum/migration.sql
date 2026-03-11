/*
  Warnings:

  - You are about to drop the column `isAvailable` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('INDISPONIVEL', 'DISPONIVEL', 'PRECISANDO_DOAR');

-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "location" TEXT,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isAvailable",
ADD COLUMN     "availability" "Availability" NOT NULL DEFAULT 'INDISPONIVEL';

-- CreateTable
CREATE TABLE "RequestBlood" (
    "id" SERIAL NOT NULL,
    "requester" TEXT NOT NULL,
    "bloodType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestBlood_pkey" PRIMARY KEY ("id")
);
