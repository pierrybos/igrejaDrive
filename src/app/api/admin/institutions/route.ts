// src/app/api/admin/institutions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const institutions = await prisma.institution.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(institutions);
}

export async function POST(req: Request) {
  const { name, slug } = await req.json();
  if (!name || !slug) {
    return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
  }
  const exists = await prisma.institution.findUnique({ where: { slug } });
  if (exists) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }
  const inst = await prisma.institution.create({
    data: { name, slug },
  });
  return NextResponse.json(inst, { status: 201 });
}
