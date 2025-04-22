"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { InstitutionProfileType, DEFAULT_INSTITUTION_PROFILE } from "@/lib/institutionProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "@/components/ui/sonner";

export default function InstitutionProfilePage() {
  const { slug } = useParams();
  const [profile, setProfile] = useState<InstitutionProfileType>(DEFAULT_INSTITUTION_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/${slug}/institution-profile`);
        if (!res.ok) throw new Error("Falha ao carregar dados");
        const data: InstitutionProfileType = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        toast("Erro ao carregar perfil da instituição.", "destructive");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [slug]);

  function handleChange<K extends keyof InstitutionProfileType>(
    field: K,
    value: InstitutionProfileType[K]
  ) {
    setProfile(prev => ({ ...prev, [field]: value }));
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleChange("churchLogoUrl", reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/${slug}/institution-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      const data: InstitutionProfileType = await res.json();
      setProfile(data);
      toast("Dados da igreja salvos com sucesso!");
    } catch (err) {
      console.error(err);
      toast("Falha ao salvar perfil.", "destructive");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Carregando perfil...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dados da Instituição</h1>

      <div className="space-y-1">
        <Label htmlFor="churchName">Nome da Igreja</Label>
        <Input
          id="churchName"
          value={profile.churchName}
          onChange={e => handleChange("churchName", e.target.value)}
          placeholder="Nome completo"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="churchPhone">Telefone</Label>
        <Input
          id="churchPhone"
          value={profile.churchPhone}
          onChange={e => handleChange("churchPhone", e.target.value)}
          placeholder="(XX) XXXX-XXXX"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="churchAddress">Endereço</Label>
        <Input
          id="churchAddress"
          value={profile.churchAddress}
          onChange={e => handleChange("churchAddress", e.target.value)}
          placeholder="Rua, número, bairro, cidade"
        />
      </div>

      <div className="space-y-1">
        <Label>Logotipo da Igreja</Label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
        />
        {profile.churchLogoUrl && (
          <div className="mt-2">
            <Image
              src={profile.churchLogoUrl}
              alt="Preview do Logo"
              width={100}
              height={100}
              className="rounded"
            />
          </div>
        )}
      </div>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full"
      >
        {saving ? "Salvando..." : "Salvar Dados"}
      </Button>
    </div>
  );
}
