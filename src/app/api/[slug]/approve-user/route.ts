// src/app/api/[slug]/approve-user/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const { userId } = await req.json();
  // opcional: checar se quem chamou é ADMIN da instiuição ou SUPERADMIN

  await prisma.user.update({
    where: { id: userId },
    data: { isPending: false },
  });

  return NextResponse.json({ ok: true });
}
