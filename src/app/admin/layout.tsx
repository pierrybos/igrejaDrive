// src/app/admin/layout.tsx
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const metadata = { title: "Admin • Igreja Drive" };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPERADMIN") {
    // se logado mas não for SUPERADMIN, leva de volta ao /
    return redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 shadow">
        <h1 className="text-xl font-semibold">Painel Admin</h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
