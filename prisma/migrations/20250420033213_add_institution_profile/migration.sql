-- CreateTable
CREATE TABLE "InstitutionProfile" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "churchName" TEXT DEFAULT '',
    "churchLogoUrl" TEXT DEFAULT '',
    "churchPhone" TEXT DEFAULT '',
    "churchAddress" TEXT DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstitutionProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionProfile_institutionId_key" ON "InstitutionProfile"("institutionId");

-- AddForeignKey
ALTER TABLE "InstitutionProfile" ADD CONSTRAINT "InstitutionProfile_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
