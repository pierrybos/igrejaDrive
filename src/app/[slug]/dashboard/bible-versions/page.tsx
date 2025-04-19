// ============================================
// File: src/app/[slug]/dashboard/bible-versions/page.tsx
// ============================================
import { prisma } from '@/lib/prisma';
import BibleVersionToggle from '@/components/BibleVersionToggle';

interface Props { params: { slug: string } }

export default async function InstitutionBibleVersionsPage({ params }: Props) {
  const { slug } = params;
  // Busca o status de cada versão pra essa instituição
  const versions = await prisma.bibleVersion.findMany({
    orderBy: { code: 'asc' },
    include: {
      institutions: {
        where: { institution: { slug } },
        select: { isActive: true }
      }
    }
  });

  const items = versions.map(v => ({
    id: v.id,
    code: v.code,
    name: v.name,
    isActive: v.institutions.length > 0 ? v.institutions[0].isActive : false
  }));

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Versões da Bíblia - {slug}</h1>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="flex items-center justify-between border p-4 rounded">
            <div>
              <span className="font-medium">{item.code}</span> — {item.name}
            </div>
            <BibleVersionToggle slug={slug} id={item.id} initial={item.isActive} />
          </li>
        ))}
      </ul>
    </div>
  );

}