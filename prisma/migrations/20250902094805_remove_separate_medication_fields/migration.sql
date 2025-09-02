/*
  Warnings:

  - You are about to drop the column `contraindications` on the `Medications` table. All the data in the column will be lost.
  - You are about to drop the column `dosage` on the `Medications` table. All the data in the column will be lost.
  - You are about to drop the column `expiration_date` on the `Medications` table. All the data in the column will be lost.
  - You are about to drop the column `instructions` on the `Medications` table. All the data in the column will be lost.
  - You are about to drop the column `interactions` on the `Medications` table. All the data in the column will be lost.
  - You are about to drop the column `pediatric_use` on the `Medications` table. All the data in the column will be lost.
  - You are about to drop the column `pharmacodynamics` on the `Medications` table. All the data in the column will be lost.
  - You are about to drop the column `pregnancy_lactation` on the `Medications` table. All the data in the column will be lost.
  - You are about to drop the column `side_effects` on the `Medications` table. All the data in the column will be lost.
  - You are about to drop the column `storage_conditions` on the `Medications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Medications" DROP COLUMN "contraindications",
DROP COLUMN "dosage",
DROP COLUMN "expiration_date",
DROP COLUMN "instructions",
DROP COLUMN "interactions",
DROP COLUMN "pediatric_use",
DROP COLUMN "pharmacodynamics",
DROP COLUMN "pregnancy_lactation",
DROP COLUMN "side_effects",
DROP COLUMN "storage_conditions";
