-- AlterTable
ALTER TABLE "public"."FAQ" ADD COLUMN     "medicationId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."FAQ" ADD CONSTRAINT "FAQ_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "public"."Medications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
