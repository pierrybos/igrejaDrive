// File: src/app/api/[slug]/get-access-token/route.ts
import { NextResponse } from "next/server";
import { google } from "googleapis";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // 1) Busca a DriveConfig para essa instituição:
  const inst = await prisma.institution.findUnique({
    where: { slug },
    select: {
      driveConfig: {
        select: { serviceAccountJson: true }
      }
    }
  });
  if (!inst?.driveConfig) {
    return NextResponse.json(
      { error: "Configuração do Drive não cadastrada para esta instituição." },
      { status: 404 }
    );
  }

  // 2) Cria o cliente GoogleAuth a partir do JSON que salvaste no banco:
  let keyJson: any;
  try {
    keyJson = inst.driveConfig.serviceAccountJson;
  } catch {
    return NextResponse.json(
      { error: "Credenciais inválidas." },
      { status: 500 }
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: keyJson,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  try {
    const client = await auth.getClient();
    const { token } = await client.getAccessToken();
    if (!token) throw new Error("token indefinido");

    const res = NextResponse.json({ accessToken: token });
    // garantia de sempre buscar novo token
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  } catch (e: any) {
    console.error("Erro ao gerar accessToken:", e);
    return NextResponse.json(
      { error: "Não foi possível gerar token", details: e.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
