// File: src/components/admin/DeleteBibleVersionButton.tsx
"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DeleteBibleVersionButton({ id }: { id: string }) {
  const router = useRouter();
  const onDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta versão?')) return;
    await fetch('/api/admin/bible-versions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    router.refresh();
  };
  return <Button variant="destructive" size="sm" onClick={onDelete}>Excluir</Button>;
}
