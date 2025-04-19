import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  // retorna lista com flag isActive
  const inst = await prisma.institution.findUnique({
    where: { slug: params.slug },
    include: { bibleVersions: { include: { bibleVersion: true } } },
  });
  if (!inst) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(inst.bibleVersions);
}

export async function PATCH(req: Request, { params }: { params: { slug: string } }) {
  const { bibleVersionId, isActive } = await req.json();
  // upsert configura��o
  const inst = await prisma.institution.findUnique({ where: { slug: params.slug }, select: { id: true } });
  if (!inst) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const up = await prisma.institutionBibleVersion.upsert({
    where: { institutionId_bibleVersionId: { institutionId: inst.id, bibleVersionId } },
    create: { institutionId: inst.id, bibleVersionId, isActive },
    update: { isActive },
  });
  return NextResponse.json(up);
}