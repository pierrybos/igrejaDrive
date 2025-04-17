// src/app/[slug]/dashboard/program-parts/page.tsx
import { prisma } from "@/lib/prisma";
import ProgramPartsForm from "./create-form";
import ToggleButton from "@/components/ToggleButton";

export default async function ProgramPartsPage({ params }: { params: { slug: string } }) {
  const types = await prisma.programPart.findMany({
    where: { institution: { slug: params.slug } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Partes do Programa</h1>
      <ProgramPartsForm slug={params.slug} />
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
