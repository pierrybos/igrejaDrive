import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  return NextResponse.json(
    await prisma.participationType.findMany({
      where: { institution: { slug: params.slug } },
      orderBy: { createdAt: "desc" },
    })
  );
}

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const { code, label } = await req.json();
  const inst = await prisma.institution.findUnique({ where: { slug: params.slug } });
  if (!inst) return NextResponse.json({ error: "Instuição não existe" }, { status: 404 });
  const created = await prisma.participationType.create({
    data: { code, label, institutionId: inst.id },
  });
  return NextResponse.json(created, { status: 201 });
}

export async function PATCH(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { id, isActive } = await req.json();
  const updated = await prisma.participationType.update({
    where: { id },
    data: { isActive },
  });
  return NextResponse.json(updated);
}
