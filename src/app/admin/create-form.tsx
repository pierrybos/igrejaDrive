// src/app/admin/dashboard/create-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CreateInstitutionForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/institutions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    if (res.ok) {
      setName("");
      setSlug("");
      router.refresh();           // recarrega os dados do server
    } else {
      const body = await res.json();
      setError(body.error || "Erro ao criar");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex flex-col">
        <label className="text-sm">Nome</label>
        <input
          className="border rounded p-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm">Slug</label>
        <input
          className="border rounded p-1"
          value={slug}
          onChange={(e) => setSlug(e.target.value.trim())}
          required
        />
      </div>
      <Button type="submit">Criar</Button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
}
