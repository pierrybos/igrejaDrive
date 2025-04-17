-- CreateTable
CREATE TABLE "DriveConfig" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "serviceAccountJson" JSONB NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "sharedDriveId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriveConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DriveConfig_institutionId_key" ON "DriveConfig"("institutionId");

-- AddForeignKey
ALTER TABLE "DriveConfig" ADD CONSTRAINT "DriveConfig_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
