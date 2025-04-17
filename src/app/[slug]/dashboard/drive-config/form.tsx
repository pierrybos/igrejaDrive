"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  slug: string;
  config: {
    serviceAccountJson: any;
    clientEmail: string;
    sharedDriveId: string;
  } | null;
}

export default function DriveConfigForm({ slug, config }: Props) {
  const [jsonText, setJsonText] = useState(
    config ? JSON.stringify(config.serviceAccountJson, null, 2) : ""
  );
  const [clientEmail, setClientEmail] = useState(config?.clientEmail || "");
  const [sharedDriveId, setSharedDriveId] = useState(config?.sharedDriveId || "");
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const serviceAccountJson = JSON.parse(jsonText);
      const res = await fetch(`/api/${slug}/drive-config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceAccountJson, clientEmail, sharedDriveId }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Erro ao salvar");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
      <div>
        <label className="block font-medium">Service Account JSON</label>
        <textarea
          className="w-full h-40 border rounded p-2 font-mono text-sm"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-medium">Client Email</label>
        <input
          className="w-full border rounded p-1"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-medium">Shared Drive ID</label>
        <input
          className="w-full border rounded p-1"
          value={sharedDriveId}
          onChange={(e) => setSharedDriveId(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <Button type="submit">Salvar Configurações</Button>
    </form>
  );
}
