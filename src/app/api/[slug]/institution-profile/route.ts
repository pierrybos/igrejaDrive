import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_INSTITUTION_PROFILE,
  InstitutionProfileType,
} from "@/lib/institutionProfile";

async function getInstitutionId(slug: string) {
  const inst = await prisma.institution.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!inst) throw new Error("Instituição não encontrada");
  return inst.id;
}

export async function GET(request: Request, context: any) {
  try {
    const slug = context.params.slug as string;
    const institutionId = await getInstitutionId(slug);

    const profile = await prisma.institutionProfile.findUnique({
      where: { institutionId },
    });

    const payload: InstitutionProfileType = profile
      ? {
          churchName: profile.churchName || "",
          churchLogoUrl: profile.churchLogoUrl || "",
          churchPhone: profile.churchPhone || "",
          churchAddress: profile.churchAddress || "",
        }
      : DEFAULT_INSTITUTION_PROFILE;

    return NextResponse.json(payload);
  } catch (err: any) {
    console.error("GET /institution-profile error:", err);
    const status = err.message.includes("não encontrada") ? 404 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

export async function POST(request: Request, context: any) {
  try {
    const slug = context.params.slug as string;
    const body = (await request.json()) as Partial<InstitutionProfileType>;
    const institutionId = await getInstitutionId(slug);

    // sanitiza com defaults
    const data: InstitutionProfileType = {
      churchName: body.churchName ?? DEFAULT_INSTITUTION_PROFILE.churchName,
      churchLogoUrl:
        body.churchLogoUrl ?? DEFAULT_INSTITUTION_PROFILE.churchLogoUrl,
      churchPhone: body.churchPhone ?? DEFAULT_INSTITUTION_PROFILE.churchPhone,
      churchAddress:
        body.churchAddress ?? DEFAULT_INSTITUTION_PROFILE.churchAddress,
    };

    const saved = await prisma.institutionProfile.upsert({
      where: { institutionId },
      create: { institutionId, ...data },
      update: { ...data },
    });

    return NextResponse.json({
      churchName: saved.churchName,
      churchLogoUrl: saved.churchLogoUrl,
      churchPhone: saved.churchPhone,
      churchAddress: saved.churchAddress,
    } as InstitutionProfileType);
  } catch (err) {
    console.error("POST /institution-profile error:", err);
    return NextResponse.json(
      { error: "Não foi possível salvar os dados da igreja." },
      { status: 500 }
    );
  }
}
