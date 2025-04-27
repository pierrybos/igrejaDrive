import { prisma }  from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string; eventSlug: string } }
) {
  const inst = await prisma.institution.findUnique({ 
    where: { slug: params.slug } 
  });
  if (!inst) return NextResponse.json({ error: 'Instituição não encontrada' }, { status: 404 });

  const event = await prisma.event.findFirst({
    where: { 
      slug: params.eventSlug,
      institutionId: inst.id 
    },
    include: {
      areas: true,
      visitors: true,
      notices: true
    }
  });

  return event 
    ? NextResponse.json(event)
    : NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string; eventSlug: string } }
) {
  const { isOpen } = await request.json();
  
  const event = await prisma.event.update({
    where: { 
      slug: params.eventSlug 
    },
    data: { isOpen }
  });

  return NextResponse.json(event);
}
