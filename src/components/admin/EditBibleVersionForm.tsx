// File: src/components/admin/EditBibleVersionForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Props { version: { id: string; code: string; name: string; language: string } }
export default function EditBibleVersionForm({ version }: Props) {
  const router = useRouter();
  const [code, setCode] = useState(version.code);
  const [name, setName] = useState(version.name);
  const [language, setLanguage] = useState(version.language);
  const [error, setError] = useState("");

  const onSave = async () => {
    setError("");
    const res = await fetch('/api/admin/bible-versions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: version.id, code, name, language })
    });
    if (res.ok) {
      router.refresh();
    } else {
      const body = await res.json();
      setError(body.error || 'Erro ao atualizar');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Editar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Versão</DialogTitle>
          <DialogDescription>Altere os dados abaixo.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input value={code} onChange={e => setCode(e.target.value)} placeholder="Código" />
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
          <Input value={language} onChange={e => setLanguage(e.target.value)} placeholder="Idioma" />
          {error && <p className="text-red-600">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

