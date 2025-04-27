// src/app/api/[slug]/events/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }    // ← Promise aqui
) {
  const { slug } = await params;
  const inst = await prisma.institution.findUnique({ where: { slug } })
  if (!inst) return NextResponse.json({ error: 'Instituição não encontrada' }, { status: 404 })

  const events = await prisma.event.findMany({
    where: { institutionId: inst.id },
    orderBy: { startsAt: 'asc' },
  })
  return NextResponse.json(events)
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }    // ← Promise aqui
) {
  const { slug } = await params;

  const inst = await prisma.institution.findUnique({ where: { slug } })
  if (!inst) return NextResponse.json({ error: 'Instituição não encontrada' }, { status: 404 })


  const { name, description, startsAt, endsAt, hasStreaming, hasPhoto } =
    await request.json();

      // → 1) gerar um slug único para o evento
  const eventSlug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  // → 2) incluir `slug: eventSlug` no create
  const evt = await prisma.event.create({
    data: {
      name,
      slug: eventSlug,              // ← indispensável
      description,
      startsAt: new Date(startsAt),
      endsAt: endsAt ? new Date(endsAt) : null,
      hasStreaming,
      hasPhoto,
      institution: { connect: { id: inst.id } },
    },
  });

  return NextResponse.json(evt, { status: 201 });
}
