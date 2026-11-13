CREATE TYPE "UserRole" AS ENUM ('superadmin', 'manager');
CREATE TYPE "BookingStatus" AS ENUM ('new', 'processing', 'confirmed', 'completed', 'cancelled');
CREATE TYPE "IntegrationKind" AS ENUM ('telegram', 'email_admin', 'email_client', 'amocrm', 'cloudinary_cleanup');
CREATE TYPE "IntegrationStatus" AS ENUM ('pending', 'processing', 'succeeded', 'failed');

CREATE TABLE "Doctor" (
  "id" SERIAL NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "position" TEXT NOT NULL,
  "specialties" TEXT[],
  "experience" INTEGER NOT NULL,
  "photoUrl" TEXT NOT NULL,
  "photoPublicId" TEXT,
  "description" TEXT NOT NULL,
  "education" TEXT[],
  "certificates" TEXT[],
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Service" (
  "id" SERIAL NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "shortDescription" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "icon" TEXT NOT NULL,
  "treatmentSteps" TEXT[],
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Price" (
  "id" SERIAL NOT NULL,
  "serviceId" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "priceFrom" DECIMAL(12,2) NOT NULL,
  "priceTo" DECIMAL(12,2),
  "unit" TEXT NOT NULL DEFAULT 'услуга',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Booking" (
  "id" SERIAL NOT NULL,
  "publicId" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "normalizedPhone" TEXT NOT NULL,
  "email" TEXT,
  "serviceId" INTEGER,
  "doctorId" INTEGER,
  "preferDate" TIMESTAMP(3),
  "preferTime" TEXT,
  "comment" TEXT,
  "status" "BookingStatus" NOT NULL DEFAULT 'new',
  "source" TEXT NOT NULL DEFAULT 'website',
  "consentAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Review" (
  "id" SERIAL NOT NULL,
  "author" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "text" TEXT NOT NULL,
  "service" TEXT,
  "doctor" TEXT,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "User" (
  "id" SERIAL NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'manager',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "IntegrationEvent" (
  "id" SERIAL NOT NULL,
  "bookingId" INTEGER,
  "kind" "IntegrationKind" NOT NULL,
  "status" "IntegrationStatus" NOT NULL DEFAULT 'pending',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "externalId" TEXT,
  "lastError" TEXT,
  "payload" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "IntegrationEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "_DoctorServices" (
  "A" INTEGER NOT NULL,
  "B" INTEGER NOT NULL
);

CREATE UNIQUE INDEX "Doctor_slug_key" ON "Doctor"("slug");
CREATE INDEX "Doctor_isActive_deletedAt_idx" ON "Doctor"("isActive", "deletedAt");
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");
CREATE INDEX "Service_category_isActive_idx" ON "Service"("category", "isActive");
CREATE UNIQUE INDEX "Price_serviceId_name_key" ON "Price"("serviceId", "name");
CREATE INDEX "Price_isActive_idx" ON "Price"("isActive");
CREATE UNIQUE INDEX "Booking_publicId_key" ON "Booking"("publicId");
CREATE UNIQUE INDEX "Booking_idempotencyKey_key" ON "Booking"("idempotencyKey");
CREATE INDEX "Booking_status_createdAt_idx" ON "Booking"("status", "createdAt");
CREATE INDEX "Booking_normalizedPhone_idx" ON "Booking"("normalizedPhone");
CREATE INDEX "Review_isVisible_createdAt_idx" ON "Review"("isVisible", "createdAt");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "IntegrationEvent_bookingId_kind_key" ON "IntegrationEvent"("bookingId", "kind");
CREATE INDEX "IntegrationEvent_status_kind_idx" ON "IntegrationEvent"("status", "kind");
CREATE UNIQUE INDEX "_DoctorServices_AB_unique" ON "_DoctorServices"("A", "B");
CREATE INDEX "_DoctorServices_B_index" ON "_DoctorServices"("B");

ALTER TABLE "Price" ADD CONSTRAINT "Price_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "IntegrationEvent" ADD CONSTRAINT "IntegrationEvent_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_DoctorServices" ADD CONSTRAINT "_DoctorServices_A_fkey" FOREIGN KEY ("A") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_DoctorServices" ADD CONSTRAINT "_DoctorServices_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
