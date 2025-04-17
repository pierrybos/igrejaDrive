"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ParticipationTypeForm({ slug }: { slug: string }) {
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/${slug}/participation-types`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ code, label }),
    });
    if (res.ok) {
      setCode(""); setLabel("");
      router.refresh();
    } else {
      const { error } = await res.json();
      setError(error || "Erro");
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Código" required className="border p-1"/>
      <input value={label} onChange={e=>setLabel(e.target.value)} placeholder="Label" required className="border p-1"/>
      <Button type="submit">Adicionar</Button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
