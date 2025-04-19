-- CreateEnum
CREATE TYPE "ParticipantStatus" AS ENUM ('Pendente', 'Aprovado', 'Rejeitado');

-- CreateTable
CREATE TABLE "BibleVersion" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "language" TEXT NOT NULL,

    CONSTRAINT "BibleVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitutionBibleVersion" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "bibleVersionId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstitutionBibleVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" SERIAL NOT NULL,
    "institutionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "churchGroupState" TEXT NOT NULL,
    "participationDate" TIMESTAMP(3) NOT NULL,
    "programPartId" TEXT,
    "participationTypeId" TEXT,
    "status" "ParticipantStatus" NOT NULL DEFAULT 'Pendente',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isWhatsApp" BOOLEAN NOT NULL DEFAULT false,
    "imageRightsGranted" BOOLEAN NOT NULL DEFAULT false,
    "isMember" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT,
    "performanceType" TEXT NOT NULL DEFAULT 'Solo',
    "microphoneCount" INTEGER NOT NULL DEFAULT 1,
    "bibleVersionId" TEXT,
    "userPhotoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "participantId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BibleVersion_code_key" ON "BibleVersion"("code");

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionBibleVersion_institutionId_bibleVersionId_key" ON "InstitutionBibleVersion"("institutionId", "bibleVersionId");

-- AddForeignKey
ALTER TABLE "InstitutionBibleVersion" ADD CONSTRAINT "InstitutionBibleVersion_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionBibleVersion" ADD CONSTRAINT "InstitutionBibleVersion_bibleVersionId_fkey" FOREIGN KEY ("bibleVersionId") REFERENCES "BibleVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_programPartId_fkey" FOREIGN KEY ("programPartId") REFERENCES "ProgramPart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_participationTypeId_fkey" FOREIGN KEY ("participationTypeId") REFERENCES "ParticipationType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_bibleVersionId_fkey" FOREIGN KEY ("bibleVersionId") REFERENCES "BibleVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
