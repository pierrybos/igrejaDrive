// File: src/components/admin/CreateBibleVersionForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateBibleVersionForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("pt");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch('/api/admin/bible-versions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, name, language })
    });
    if (res.ok) {
      setCode(''); setName(''); setLanguage('pt');
      router.refresh();
    } else {
      const body = await res.json();
      setError(body.error || 'Erro ao criar');
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex space-x-2">
      <Input placeholder="Código" value={code} onChange={e => setCode(e.target.value)} required />
      <Input placeholder="Nome da Versão" value={name} onChange={e => setName(e.target.value)} required />
      <Input placeholder="Idioma" value={language} onChange={e => setLanguage(e.target.value)} required />
      <Button type="submit">Criar</Button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
