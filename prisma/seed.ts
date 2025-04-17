// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "pierry.bos@gmail.com" },
    update: {
      role: Role.SUPERADMIN,
      isPending: false,
    },
    create: {
      email: "pierry.bos@gmail.com",
      name: "Pierry Bos Admin",
      role: Role.SUPERADMIN,
      isPending: false,
    },
  });
  console.log("👤 Superadmin criado ou atualizado!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
