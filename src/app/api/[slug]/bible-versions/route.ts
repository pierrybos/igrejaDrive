// ============================================
// File: src/app/api/[slug]/bible-versions/route.ts
// ============================================
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const inst = await prisma.institution.findUnique({
    where: { slug: params.slug },
    select: { id: true }
  });
  if (!inst) return NextResponse.json({ error: 'Instituição não encontrada' }, { status: 404 });

  // Busca todas as versões e o estado para esta instituição
  const versions = await prisma.bibleVersion.findMany({
    orderBy: { code: 'asc' },
    include: {
      institutions: {
        where: { institutionId: inst.id },
        select: { isActive: true }
      }
    }
  });

  // Mapear para um formato simples
  const result = versions.map(v => ({
    id: v.id,
    code: v.code,
    name: v.name,
    language: v.language,
    isActive: v.institutions.length > 0 ? v.institutions[0].isActive : false
  }));

  return NextResponse.json(result);
}

export async function PATCH(req: Request, { params }: { params: { slug: string } }) {
  const { bibleVersionId, isActive } = await req.json();
  const inst = await prisma.institution.findUnique({ where: { slug: params.slug }, select: { id: true } });
  if (!inst) return NextResponse.json({ error: 'Instituição não encontrada' }, { status: 404 });

  const upsert = await prisma.institutionBibleVersion.upsert({
    where: { institutionId_bibleVersionId: { institutionId: inst.id, bibleVersionId } },
    create: { institutionId: inst.id, bibleVersionId, isActive },
    update: { isActive }
  });

  return NextResponse.json(upsert);
}

