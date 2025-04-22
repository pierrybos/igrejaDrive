// src/app/[slug]/form-config/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_FORM_CONFIG,
  FormConfigType,
} from "@/lib/formConfig";

export async function GET(request: Request, context: any) {
  // 1) Pega o slug do contexto
  const slug: string = context.params.slug;

  // 2) Busca a instituição pelo slug
  const institution = await prisma.institution.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!institution) {
    return NextResponse.json(
      { error: "Instituição não encontrada." },
      { status: 404 }
    );
  }

  // 3) Busca a config ou utiliza o default
  const cfgInDb = await prisma.formConfig.findUnique({
    where: { institutionId: institution.id },
  });

  const payload: FormConfigType = cfgInDb
    ? {
        showMemberField: cfgInDb.showMemberField,
        memberFieldLabel: cfgInDb.memberFieldLabel,
        showImageConsentField: cfgInDb.showImageConsentField,
        imageConsentLabel: cfgInDb.imageConsentLabel,
        formHeaderText: cfgInDb.formHeaderText ?? "",
        showOtherField: cfgInDb.showOtherField,
        otherFieldLabel: cfgInDb.otherFieldLabel,
        autoConsentForMembers: cfgInDb.autoConsentForMembers,
      }
    : DEFAULT_FORM_CONFIG;

  return NextResponse.json(payload);
}

export async function POST(request: Request, context: any) {
  try {
    const slug = context.params.slug as string;
    const raw = await request.json();

    // 1) sanitiza o body: só pega os campos que importam
    const {
      showMemberField             = DEFAULT_FORM_CONFIG.showMemberField,
      memberFieldLabel            = DEFAULT_FORM_CONFIG.memberFieldLabel,
      showImageConsentField       = DEFAULT_FORM_CONFIG.showImageConsentField,
      imageConsentLabel           = DEFAULT_FORM_CONFIG.imageConsentLabel,
      formHeaderText              = DEFAULT_FORM_CONFIG.formHeaderText,
      showOtherField              = DEFAULT_FORM_CONFIG.showOtherField,
      otherFieldLabel             = DEFAULT_FORM_CONFIG.otherFieldLabel,
      autoConsentForMembers       = DEFAULT_FORM_CONFIG.autoConsentForMembers,
    } = raw;

    // 2) busca a instituição (pra pegar o id de verdade)
    const inst = await prisma.institution.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!inst) {
      return NextResponse.json(
        { error: "Instituição não encontrada." },
        { status: 404 }
      );
    }

    // 3) upsert, usando só as props esperadas
    await prisma.formConfig.upsert({
      where: { institutionId: inst.id },
      create: {
        institutionId: inst.id,
        showMemberField,
        memberFieldLabel,
        showImageConsentField,
        imageConsentLabel,
        formHeaderText,
        showOtherField,
        otherFieldLabel,
        autoConsentForMembers,
      },
      update: {
        showMemberField,
        memberFieldLabel,
        showImageConsentField,
        imageConsentLabel,
        formHeaderText,
        showOtherField,
        otherFieldLabel,
        autoConsentForMembers,
      },
    });

    // 4) devolve só o tipo que o front‑end conhece
    const result: FormConfigType = {
      showMemberField,
      memberFieldLabel,
      showImageConsentField,
      imageConsentLabel,
      formHeaderText,
      showOtherField,
      otherFieldLabel,
      autoConsentForMembers,
    };
    return NextResponse.json(result);
  } catch (err) {
    console.error("POST /api/[slug]/form-config error:", err);
    return NextResponse.json(
      { error: "Não foi possível salvar a configuração." },
      { status: 500 }
    );
  }
}