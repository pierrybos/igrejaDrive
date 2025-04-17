import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const inst = await prisma.institution.findUnique({
    where: { slug: params.slug },
    include: { DriveConfig: true },
  });
  if (!inst) return NextResponse.json({ error: "Instituição não existe" }, { status: 404 });
  return NextResponse.json(inst.DriveConfig || null);
}

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const { serviceAccountJson, clientEmail, sharedDriveId } = await req.json();
  const inst = await prisma.institution.findUnique({ where: { slug: params.slug } });
  if (!inst) return NextResponse.json({ error: "Instituição não existe" }, { status: 404 });

  const data = {
    institutionId: inst.id,
    serviceAccountJson,
    clientEmail,
    sharedDriveId,
    isActive: true,
  };

  const upserted = await prisma.driveConfig.upsert({
    where: { institutionId: inst.id },
    update: data,
    create: data,
  });

  return NextResponse.json(upserted, { status: 201 });
}
