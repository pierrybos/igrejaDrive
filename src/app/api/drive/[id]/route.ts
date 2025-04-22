// src/app/api/drive/[id]/route.ts
import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { prisma } from '@/lib/prisma'


export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  // 1) Busca suas credenciais e token no banco
  const cfg = await prisma.driveConfig.findFirst({
    where: { isActive: true },
  })
  if (!cfg) return NextResponse.error()

  // 2) Autentica via service account
  const auth = new google.auth.GoogleAuth({
    credentials: cfg.serviceAccountJson,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  })
  const drive = google.drive({ version: 'v3', auth })

  // 3) Pega o stream do arquivo
  const res = await drive.files.get(
    { fileId: params.id, alt: 'media' },
    { responseType: 'stream' }
  )

  // 4) Retorna o stream direto pro cliente
  return new NextResponse(res.data, {
    headers: {
      'Content-Type': res.headers['content-type'] || 'application/octet-stream',
      // você pode adicionar Cache-Control aqui, ex:
      // 'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
