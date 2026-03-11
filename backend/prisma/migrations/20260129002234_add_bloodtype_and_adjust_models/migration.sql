/*
  Warnings:

  - You are about to drop the column `bloodType` on the `RequestBlood` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG');

-- AlterTable
ALTER TABLE "RequestBlood" DROP COLUMN "bloodType";
