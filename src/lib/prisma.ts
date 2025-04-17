// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Garante que, em ambiente de desenvolvimento com hot‑reload,
// não sejam instanciados múltiplos clients
declare global {
  // eslint‑disable‑next‑line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
