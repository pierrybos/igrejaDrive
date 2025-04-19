// File: src/app/admin/dashboard/bible-versions/page.tsx
import { prisma } from "@/lib/prisma";
import CreateBibleVersionForm from "@/components/admin/CreateBibleVersionForm";
import EditBibleVersionForm from "@/components/admin/EditBibleVersionForm";
import DeleteBibleVersionButton from "@/components/admin/DeleteBibleVersionButton";

export default async function BibleVersionsPage() {
  const versions = await prisma.bibleVersion.findMany({ orderBy: { code: 'asc' } });

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-2xl font-bold">Versões da Bíblia</h1>
      <CreateBibleVersionForm />
      <div className="space-y-2">
        {versions.map((v) => (
          <div key={v.id} className="flex items-center justify-between border rounded p-4">
            <div>
              <span className="font-medium">{v.code}</span> — {v.name} ({v.language})
            </div>
            <div className="flex space-x-2">
              <EditBibleVersionForm version={v} />
              <DeleteBibleVersionButton id={v.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


