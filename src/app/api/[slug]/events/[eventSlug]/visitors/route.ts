// app/api/[slug]/events/[eventSlug]/visitors/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params: { slug, eventSlug } }: { params: { slug: string; eventSlug: string } }
) {
  const inst = await prisma.institution.findUnique({ where: { slug } });
  if (!inst) return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
  const evt = await prisma.event.findFirst({ where: { slug: eventSlug, institutionId: inst.id } });
  if (!evt) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

  const visitors = await prisma.visitor.findMany({
    where: { eventId: evt.id },
    orderBy: { registeredAt: 'asc' },
  });
  return NextResponse.json(visitors);
}

export async function POST(
  request: Request,
  { params: { slug, eventSlug } }: { params: { slug: string; eventSlug: string } }
) {
  const inst = await prisma.institution.findUnique({ where: { slug } });
  if (!inst) return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
  const evt = await prisma.event.findFirst({ where: { slug: eventSlug, institutionId: inst.id } });
  if (!evt) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

  const data = await request.json();
  const visitor = await prisma.visitor.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      anonymous: data.anonymous,
      agreeImageRights: data.agreeImageRights,
      eventId: evt.id,
    },
  });
  return NextResponse.json(visitor, { status: 201 });
}