// src/app/admin/dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import CreateInstitutionForm from "./create-form";

export default async function AdminDashboardPage() {
  const institutions = await prisma.institution.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Instituições</h1>

      {/* Form de criação */}
      <CreateInstitutionForm />

      {/* Lista de instituições */}
      <ul className="space-y-2">
        {institutions.map((inst) => (
          <li key={inst.id} className="flex justify-between items-center border p-2 rounded">
            <span>
              <strong>{inst.name}</strong> (<code>{inst.slug}</code>)
            </span>
            <span className="text-sm text-gray-500">
              {inst.createdAt.toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
