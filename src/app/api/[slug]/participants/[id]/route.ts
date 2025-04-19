// File: src/app/api/[slug]/participants/[id]/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient, ParticipantStatus } from '@prisma/client'
import { withRole } from '@/utils/authMiddleware'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function PATCH(
  req: Request,
  { params }: { params: { slug: string; id: string } }
) {
  // só ADMIN ou SUPERADMIN
  const authError = await withRole(req, ['ADMIN', 'SUPERADMIN'])
  if (authError) return authError

  const { id, slug } = params
  const body = await req.json()
  const { status } = body

  // valida enum
  if (!Object.values(ParticipantStatus).includes(status)) {
    return NextResponse.json(
      { error: 'Status inválido.' },
      { status: 400 }
    )
  }

  // garante que o participante pertence àquela instituição
  const participant = await prisma.participant.findUnique({
    where: { id: Number(id) },
    select: { institutionId: true }
  })
  if (!participant) {
    return NextResponse.json(
      { error: 'Participante não encontrado.' },
      { status: 404 }
    )
  }

  // opcional: validamos slug → institutionId
  const inst = await prisma.institution.findUnique({
    where: { slug },
    select: { id: true }
  })
  if (!inst || inst.id !== participant.institutionId) {
    return NextResponse.json(
      { error: 'Permissão negada.' },
      { status: 403 }
    )
  }

  const updated = await prisma.participant.update({
    where: { id: Number(id) },
    data: { status }
  })

  return NextResponse.json({ participant: updated }, { status: 200 })
}
