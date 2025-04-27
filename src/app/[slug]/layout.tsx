// src/app/[slug]/layout.tsx
import { Metadata } from "next";
import React from "react";
import { prisma } from "@/lib/prisma";
import { DEFAULT_INSTITUTION_PROFILE } from "@/lib/institutionProfile";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { StoreProvider } from "./store/StoreProvider";

interface SlugLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;           // ← agora é Promise
}

// Simulação manual temporária
const slugThemes: Record<string, string> = {
  igrejaazul: 'azul',
  igrejavermelha: 'vermelho',
  igrejaverde: 'verde',
  igrejacinza: 'cinzaEscuro',
  igrejalaranja: 'laranja',
  igrejabranca: 'branco',
  igrejarosa: 'rosa',
  igrejanoite: 'dark',
};

// 1️⃣ Next.js invoca isso para montar o <head> dinamicamente
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;           // ← Promise aqui também
}): Promise<Metadata> {
  const { slug } = await params;                // ← await o params

  // busca só o nome da igreja
  const inst = await prisma.institution.findUnique({
    where: { slug },
    select: { id: true },
  });

  let churchName = "IgrejaDrive";
  if (inst) {
    const dbProfile = await prisma.institutionProfile.findUnique({
      where: { institutionId: inst.id },
      select: { churchName: true },
    });
    if (dbProfile?.churchName) {
      churchName = dbProfile.churchName;
    }
  }

  return {
    title: churchName,
    description: `Site da ${churchName}`,
    openGraph: {
      title: churchName,
      description: `Site da ${churchName}`,
    },
  };
}

// 2️⃣: componente de layout
export default async function SlugLayout({
  children,
  params,
}: SlugLayoutProps) {
  const { slug } = await params;                // ← await aqui também

  // carrega só o id da instituição
  const inst = await prisma.institution.findUnique({
    where: { slug },
    select: { id: true },
  });

  /*
  const institution = await prisma.institution.findUnique({
    where: { slug: params.slug },
    select: { colorScheme: true }, // traz só o campo que interessa
  });

  const theme = institution?.colorScheme || 'azul'; // tema padrão se não houver definido
*/
    const theme = slugThemes[slug] || 'azul'; // default azul


  // 2) carrega o profile ou usa defaults
  let profile = DEFAULT_INSTITUTION_PROFILE;
  if (inst) {
    const dbProfile = await prisma.institutionProfile.findUnique({
      where: { institutionId: inst.id },
    });
    if (dbProfile) {
      profile = {
        churchName: dbProfile.churchName || "",
        churchLogoUrl: dbProfile.churchLogoUrl || "",
        churchPhone: dbProfile.churchPhone || "",
        churchAddress: dbProfile.churchAddress || "",
      };
    }
  }

  return (
    <>
    <StoreProvider>
      <Header profile={profile} theme={theme} />
      <div className="flex flex-1 gap-6">
        <main className="flex-1 p-6 bg-base-100 text-base-content rounded-lg shadow-sm">
          {children}
        </main>
      </div>
      <Footer profile={profile} />
      </StoreProvider>
    </>
  );
}
