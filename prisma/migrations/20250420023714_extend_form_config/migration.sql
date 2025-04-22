-- CreateTable
CREATE TABLE "FormConfig" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "showMemberField" BOOLEAN NOT NULL DEFAULT true,
    "memberFieldLabel" TEXT NOT NULL DEFAULT 'É membro dessa denominação?',
    "showImageConsentField" BOOLEAN NOT NULL DEFAULT true,
    "imageConsentLabel" TEXT NOT NULL DEFAULT 'Concedeu uso de imagem?',
    "formHeaderText" TEXT DEFAULT '',
    "showOtherField" BOOLEAN NOT NULL DEFAULT false,
    "otherFieldLabel" TEXT NOT NULL DEFAULT 'Outro campo?',
    "autoConsentForMembers" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormConfig_institutionId_key" ON "FormConfig"("institutionId");

-- AddForeignKey
ALTER TABLE "FormConfig" ADD CONSTRAINT "FormConfig_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
