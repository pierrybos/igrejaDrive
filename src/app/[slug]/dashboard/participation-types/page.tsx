// src/app/[slug]/dashboard/participation-types/page.tsx
import { prisma } from "@/lib/prisma";
import ParticipationTypeForm from "./create-form";
import ToggleButton from "@/components/ToggleButton";

export default async function ParticipationTypesPage({ params }: { params: { slug: string } }) {
  const types = await prisma.participationType.findMany({
    where: { institution: { slug: params.slug } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tipos de Participação</h1>
      <ParticipationTypeForm slug={params.slug} />
      <ul className="space-y-2">
        {types.map((t) => (
          <li key={t.id} className="flex justify-between">
            <span>
              [{t.code}] {t.label}
            </span>
            <ToggleButton id={t.id} active={t.isActive} />
          </li>
        ))}
      </ul>
    </div>
  );
}
