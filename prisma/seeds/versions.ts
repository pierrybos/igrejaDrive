import { PrismaClient, BibleVersion } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const versions: Omit<BibleVersion, 'id'>[] = [
    { code: "ACF", name: "Almeida Corrigida Fiel", language: "pt" },
    { code: "ARA", name: "Almeida Revista Atualizada", language: "pt" },
    { code: "ARC", name: "Almeida Revista Corrigida", language: "pt" },
    { code: "A21", name: "Almeida Século 21", language: "pt" },
    { code: "KJA", name: "King James Atualizada", language: "pt" },
    { code: "NAA", name: "Nova Almeida Atualizada", language: "pt" },
    { code: "NBV", name: "Nova Bíblia Viva", language: "pt" },
    { code: "NVI", name: "Nova Versão Internacional", language: "pt" },
    { code: "NVT", name: "Nova Versão Transformadora", language: "pt" },
    { code: "NTLH", name: "Nova Tradução na Linguagem de Hoje", language: "pt" },
  ];

  for (const v of versions) {
    await prisma.bibleVersion.upsert({
      where: { code: v.code },
      update: { name: v.name, language: v.language },
      create: v,
    });
  }
  console.log(`🌱 Seeded ${versions.length} BibleVersion records.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });