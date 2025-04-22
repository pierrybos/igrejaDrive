// src/app/[slug]/dashboard/layout.tsx
import { Metadata } from "next";
import DashboardSidebar from "@/components/DashboardSidebar";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

interface Props {
  children: ReactNode;
  params: { slug: string };
}

// 1️⃣ Função que o Next chama para gerar <head> dinamicamente
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  // busca só o nome da igreja
  const institution = await prisma.institution.findUnique({
    where: { slug },
    select: { name: true },
  });

  if (!institution) {
    return {
      title: "IgrejaDrive",
      description: "Gerencie sua igreja",
      // você pode incluir openGraph, twitter, etc.
    };
  }

  return {
    title: `${institution.name} • Dashboard`,
    description: `Painel de controle da ${institution.name}`,
    openGraph: {
      title: institution.name,
      description: `Painel de controle da ${institution.name}`,
    },
  };
}

export default async function DashboardLayout({ children, params }: Props) {
  const session = await getServerSession(authOptions);
  const { slug } = params;

  if (!session) {
    return redirect(`/${slug}/login`);
  }
  // SUPERADMIN sempre pode
  if (session.user.role === "SUPERADMIN") {
    return <>{children}</>;
  }


  // 3) Buscar instituição para obter o ID
  const institution = await prisma.institution.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!institution) {
    // slug inválido
    return <p>Instituição “{slug}” não existe.</p>;
  }

  // 4) Primeiro login nesta instituição: associa pelo ID real
  if (!session.user.institutionId) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { institutionId: institution.id },
    });
    // recarrega sessão e layout
    return redirect(`/${slug}/dashboard`);
  }

  // 5) Se ainda pendente → tela de pendência
  if (session.user.isPending) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold">Aguardando aprovação</h2>
        <p>Seu acesso está pendente de aprovação por um administrador.</p>
      </div>
    );
  }

  // 6) Se o usuário já tiver institutionId diferente → não pertence à esta org
  if (session.user.institutionId !== institution.id) {
    return redirect(`/${slug}/login`);
  }

  // 7) Passou por todos os checks → renderiza o dashboard
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r p-4">
        <DashboardSidebar slug={slug} />
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
