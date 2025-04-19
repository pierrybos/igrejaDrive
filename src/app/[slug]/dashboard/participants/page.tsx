// src/app/[slug]/dashboard/participants/page.tsx
import { PrismaClient } from "@prisma/client";
import { Card } from "@/components/ui/card";
import ParticipantsTableClient from "@/components/participants/ParticipantsTableClient";

const prisma = new PrismaClient();

export default async function ParticipantsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params

  // Busca no servidor os participantes da instituição
  const participants = await prisma.participant.findMany({
    where: { institution: { slug }, isActive: true },
    include: { programPart: true, participationType: true, files: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-4">Participantes</h1>
      {/* passa dados e slug para o Client Component */}
      <ParticipantsTableClient
        participants={participants}
        slug={slug}
      />
    </Card>
  );
}
