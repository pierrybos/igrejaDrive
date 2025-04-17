// src/app/[slug]/dashboard/page.tsx
import { prisma } from "@/lib/prisma"; // seu client Prisma
import { ApproveButton } from "@/components/ApproveButton";
import { Role } from "@prisma/client";

interface Props { params: { slug: string } }

export default async function InstitutionDashboard({ params }: Props) {
  const { slug } = params;
  // Busca instituição e seus usuários pendentes
  const institution = await prisma.institution.findUnique({
    where: { slug },
    include: {
      users: { where: { isPending: true } },
    },
  });

  if (!institution) {
    return <p>Instituição “{slug}” não encontrada.</p>;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">{institution.name}</h1>

      <section>
        <h2 className="text-xl font-semibold">Usuários Pendentes</h2>
        {institution.users.length === 0 ? (
          <p>Nenhum usuário aguardando aprovação.</p>
        ) : (
          <ul className="space-y-2">
            {institution.users.map((user) => (
              <li key={user.id} className="flex items-center justify-between">
                <span>{user.email}</span>
                <ApproveButton userId={user.id} slug={slug} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
