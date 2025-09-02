/*
  Warnings:

  - Added the required column `updatedAt` to the `Medications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Medications" ADD COLUMN     "contraindications" TEXT,
ADD COLUMN     "dosage" TEXT,
ADD COLUMN     "expiration_date" TEXT,
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "interactions" TEXT,
ADD COLUMN     "pediatric_use" TEXT,
ADD COLUMN     "pharmacodynamics" TEXT,
ADD COLUMN     "pregnancy_lactation" TEXT,
ADD COLUMN     "side_effects" TEXT,
ADD COLUMN     "storage_conditions" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
