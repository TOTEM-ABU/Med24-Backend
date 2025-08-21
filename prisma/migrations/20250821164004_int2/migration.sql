/*
  Warnings:

  - You are about to drop the column `duration_minutes` on the `ClinicServices` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `ClinicServices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ClinicServices" DROP COLUMN "duration_minutes",
DROP COLUMN "price";
