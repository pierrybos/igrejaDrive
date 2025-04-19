// File: src/app/api/[slug]/participants/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, ParticipantStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  context: { params: { slug: string } }
) {
  // 1) Next.js 15 exige await em params
  const { slug } = await context.params;

  const body = await req.json();
  const {
    participantName,
    churchGroupState,
    participationDate,
    programPart,        // vem do front como ID da ProgramPart
    participationType,  // vem como ID da ParticipationType (ou string vazia)
    phone,
    isWhatsApp,
    observations,
    files,              // [{ name, link }]
    imageRightsGranted,
    isMember,
    performanceType,
    microphoneCount,
    userPhoto,          // link da foto
    bibleVersion,       // ID da BibleVersion (ou string vazia)
  } = body;

  // validações mínimas
  if (!participantName || !churchGroupState || !participationDate || !programPart) {
    return NextResponse.json(
      { error: "Campos obrigatórios faltando." },
      { status: 400 }
    );
  }

  // encontra instituição pelo slug
  const institution = await prisma.institution.findUnique({
    where: { slug },
  });
  if (!institution) {
    return NextResponse.json(
      { error: "Instituição não encontrada." },
      { status: 404 }
    );
  }

  // CRIA O PARTICIPANTE usando os campos de FK existentes
  const participant = await prisma.participant.create({
    data: {
      name: participantName,
      churchGroupState,
      participationDate: new Date(participationDate),
      status: ParticipantStatus.Pendente,
      isMember,
      imageRightsGranted,
      phone,
      isWhatsApp,
      observations,
      performanceType: performanceType || "Solo",
      microphoneCount,

      // relações
      programPart: { connect: { id: programPart } },
      participationType: participationType
        ? { connect: { id: participationType } }
        : undefined,
      bibleVersion: bibleVersion
        ? { connect: { id: bibleVersion } }
        : undefined,

      // foto  
      userPhotoUrl: userPhoto || undefined,

      // instituição
      institution: { connect: { id: institution.id } },
    },
  });

  // grava os metadados dos arquivos
  await Promise.all(
    files.map((f: { name: string; link: string }) =>
      prisma.file.create({
        data: {
          name: f.name,
          url: f.link,
          participantId: participant.id,
        },
      })
    )
  );

  return NextResponse.json({ message: "Participante salvo!" }, { status: 201 });
}
