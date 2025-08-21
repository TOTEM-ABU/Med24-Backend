/*
  Warnings:

  - Added the required column `duration_minutes` to the `ClinicServices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `ClinicServices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ClinicServices" ADD COLUMN     "duration_minutes" INTEGER NOT NULL,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;
