import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const all = await prisma.bibleVersion.findMany({ orderBy: { code: 'asc' } });
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const { code, name, language } = await req.json();
  const created = await prisma.bibleVersion.create({ data: { code, name, language } });
  return NextResponse.json(created, { status: 201 });
}

export async function PATCH(req: Request) {
  const { id, name, language } = await req.json();
  const updated = await prisma.bibleVersion.update({ where: { id }, data: { name, language } });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.bibleVersion.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}