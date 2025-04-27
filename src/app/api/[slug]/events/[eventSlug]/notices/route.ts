// app/api/[slug]/events/[eventSlug]/notices/route.ts
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

  const notices = await prisma.notice.findMany({ where: { eventId: evt.id }, orderBy: { createdAt: 'asc' } });
  return NextResponse.json(notices);
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
  const notice = await prisma.notice.create({
    data: { message: data.message, eventId: evt.id },
  });
  return NextResponse.json(notice, { status: 201 });
}