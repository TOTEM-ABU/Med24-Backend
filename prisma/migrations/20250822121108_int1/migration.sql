-- CreateEnum
CREATE TYPE "public"."Clinics_Type" AS ENUM ('PUBLIC', 'PRIVATE', 'VETERINARY');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "public"."Services_Category" AS ENUM ('DIAGNOSTICS', 'TREATMENT', 'ANALYSIS');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."Position" AS ENUM ('TOP', 'SIDEBAR', 'FOOTER');

-- CreateTable
CREATE TABLE "public"."Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "regionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Clinics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "opening_hours" JSONB NOT NULL,
    "logo_url" TEXT NOT NULL,
    "rating" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "type" "public"."Clinics_Type" NOT NULL,
    "regionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clinics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Specialties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Doctors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "experience_years" INTEGER NOT NULL,
    "rating" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "image_url" TEXT NOT NULL,
    "clinicsId" TEXT,
    "specialtiesId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "public"."Services_Category" NOT NULL,
    "image_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ClinicServices" (
    "id" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "clinicsId" TEXT,
    "servicesId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicServices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Appointments" (
    "id" TEXT NOT NULL,
    "appointment_date" TIMESTAMP(3) NOT NULL,
    "status" "public"."Status" NOT NULL,
    "notes" TEXT NOT NULL,
    "userId" TEXT,
    "clinicsId" TEXT,
    "doctorsId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reviews" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "userId" TEXT,
    "clinicsId" TEXT,
    "doctorsId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Promotions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "discount_percent" INTEGER NOT NULL,
    "clinicsId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Banners" (
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "link_url" TEXT NOT NULL,
    "position" "public"."Position" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Medications" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "composition" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "prescription_required" BOOLEAN NOT NULL DEFAULT true,
    "medicationCategoriesId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MedicationCategories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicationCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MedicationPrices" (
    "id" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "medicationsId" TEXT,
    "pharmaciesId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicationPrices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pharmacies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "opening_hours" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pharmacies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "public"."Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Clinics" ADD CONSTRAINT "Clinics_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "public"."Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Doctors" ADD CONSTRAINT "Doctors_clinicsId_fkey" FOREIGN KEY ("clinicsId") REFERENCES "public"."Clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Doctors" ADD CONSTRAINT "Doctors_specialtiesId_fkey" FOREIGN KEY ("specialtiesId") REFERENCES "public"."Specialties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClinicServices" ADD CONSTRAINT "ClinicServices_clinicsId_fkey" FOREIGN KEY ("clinicsId") REFERENCES "public"."Clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClinicServices" ADD CONSTRAINT "ClinicServices_servicesId_fkey" FOREIGN KEY ("servicesId") REFERENCES "public"."Services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointments" ADD CONSTRAINT "Appointments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointments" ADD CONSTRAINT "Appointments_clinicsId_fkey" FOREIGN KEY ("clinicsId") REFERENCES "public"."Clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointments" ADD CONSTRAINT "Appointments_doctorsId_fkey" FOREIGN KEY ("doctorsId") REFERENCES "public"."Doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reviews" ADD CONSTRAINT "Reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reviews" ADD CONSTRAINT "Reviews_clinicsId_fkey" FOREIGN KEY ("clinicsId") REFERENCES "public"."Clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reviews" ADD CONSTRAINT "Reviews_doctorsId_fkey" FOREIGN KEY ("doctorsId") REFERENCES "public"."Doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Articles" ADD CONSTRAINT "Articles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Promotions" ADD CONSTRAINT "Promotions_clinicsId_fkey" FOREIGN KEY ("clinicsId") REFERENCES "public"."Clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Medications" ADD CONSTRAINT "Medications_medicationCategoriesId_fkey" FOREIGN KEY ("medicationCategoriesId") REFERENCES "public"."MedicationCategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicationPrices" ADD CONSTRAINT "MedicationPrices_medicationsId_fkey" FOREIGN KEY ("medicationsId") REFERENCES "public"."Medications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicationPrices" ADD CONSTRAINT "MedicationPrices_pharmaciesId_fkey" FOREIGN KEY ("pharmaciesId") REFERENCES "public"."Pharmacies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
