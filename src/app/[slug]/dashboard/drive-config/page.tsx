import { prisma } from "@/lib/prisma";
import DriveConfigForm from "./form";

interface Props { params: { slug: string } }

export default async function DriveConfigPage({ params }: Props) {
  const inst = await prisma.institution.findUnique({
    where: { slug: params.slug },
    include: { driveConfig: true },
  });
  if (!inst) return <p>Instituição “{params.slug}” não encontrada.</p>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Configurações de Google Drive</h1>
      <DriveConfigForm slug={params.slug} config={inst?.driveConfig || null} />
    </div>
  );
}
