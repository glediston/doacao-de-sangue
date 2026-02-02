/*
  Warnings:

  - Added the required column `bloodType` to the `RequestBlood` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RequestBlood" ADD COLUMN     "bloodType" "BloodType" NOT NULL;
