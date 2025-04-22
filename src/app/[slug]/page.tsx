// File: src/app/[slug]/page.tsx
import { prisma } from '@/lib/prisma'
import { ParticipantStatus } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { extractDriveFileId } from '@/utils/drive'

type Props = {
  params: { slug: string }
}

interface programPart {
    label: string
}

interface Participant {
  id: string
  name: string
  participationDate: Date
  churchGroupState: string
  userPhotoUrl: string | null
  programPart: programPart
}

interface ImageComponentProps {
  p: {
    userPhotoUrl: string | null
    name: string
  }
}

export function ImageComponent({ p }: ImageComponentProps) {
    const { userPhotoUrl, name } = p

  if(userPhotoUrl){
  const fileId = extractDriveFileId(userPhotoUrl || '')
if (fileId) {
  return (
    <Image
      src={`/api/drive/${fileId}`}
      alt={name}
      width={64}
      height={64}
      unoptimized
      className="rounded-full object-cover"
    />
  )
} 
}
  return <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                <span className="text-gray-500">–</span>
              </div>
}

export default async function Page({ params }: Props) {
  
    const inst = await prisma.institution.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  })
  if (!inst) {
    return <p>Igreja “{params.slug}” não encontrada.</p>
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  
    // busca todos participants aprovados para o slug (evento/instituição)
  const participants: Participant[] = await prisma.participant.findMany({
    where: {
      institutionId: inst.id,
      status: ParticipantStatus.Aprovado,
      participationDate: { gte: today },
      imageRightsGranted: true,
    },
    select: {
      id: true,
      name: true,
      participationDate: true,
      churchGroupState: true,
      userPhotoUrl: true,
      programPart: {
        select: { label: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="p-8 space-y-6">
      <div className="rounded-lg border bg-blue-50 p-4 text-center">
        <p className="mb-2 text-lg">
          Se você foi convidado para nossa programação, preencha o 
        </p>
        <Link
          href={`/${params.slug}/formulario`}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          formulário de participação!
        </Link>
      </div>

      {/* Se não houver participantes aprovados */}
      {participants.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma programação prevista.</p>
      ) : (
        participants.map((p) => {
            // 3. Formata a data
          const dataFormatada = format(
            p.participationDate,
            "dd 'de' MMMM 'de' yyyy",
            { locale: ptBR }
          )

            return (
          <div
            key={p.id}
            className="flex items-center gap-4 rounded-lg border p-4 shadow-sm"
          >
            <ImageComponent p={p} />
            <div>
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <time
                  dateTime={p.participationDate.toISOString()}
                  className="block text-sm text-gray-600"
                >
                  Data: {dataFormatada}
                </time>
              <p className="text-sm text-gray-600">Igreja: {p.churchGroupState}</p>
              <p className="text-sm">
                Parte da programação: {p.programPart?.label ?? '—'}
              </p>
            </div>
          </div>
        )
    })
      )}
    </div>
  )
}
