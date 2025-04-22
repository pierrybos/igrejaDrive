"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// Tipagem dos campos configuráveis
type FormConfig = {
  showMemberField: boolean;
  memberFieldLabel: string;
  showImageConsentField: boolean;
  imageConsentLabel: string;
  formHeaderText?: string;
  showOtherField: boolean;
  otherFieldLabel: string;
  autoConsentForMembers: boolean;
};

export default function FormConfigPage() {
  const { slug } = useParams();
  const [cfg, setCfg] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carrega configuração da API
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch(`/api/${slug}/form-config/`);
        if (!res.ok) throw new Error("Erro ao carregar configuração");
        const data: FormConfig = await res.json();
        setCfg(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, [slug]);

  // Função genérica para atualizar campos locais
  function handleChange<K extends keyof FormConfig>(field: K, value: FormConfig[K]) {
    if (cfg) setCfg({ ...cfg, [field]: value });
  }

  // Envia salvamento para a API
  async function handleSave() {
    if (!cfg) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/${slug}/form-config/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cfg),
      });
      if (!res.ok) throw new Error("Erro ao salvar configuração");
      const data: FormConfig = await res.json();
      setCfg(data);
      alert("Configurações salvas com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Falha ao salvar configurações.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Carregando configurações...</p>;
  if (!cfg) return <p>Erro ao carregar configuração.</p>;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Configuração do Formulário</h1>

      <div>
        <label className="block font-medium mb-1">
          Texto do cabeçalho do formulário:
        </label>
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          value={cfg.formHeaderText || ""}
          onChange={(e) => handleChange("formHeaderText", e.target.value)}
        />
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={cfg.showMemberField}
            onChange={(e) => handleChange("showMemberField", e.target.checked)}
          />
          <span>Mostrar campo “É membro”</span>
        </label>
        {cfg.showMemberField && (
          <input
            type="text"
            className="mt-1 w-full border rounded p-2"
            value={cfg.memberFieldLabel}
            onChange={(e) => handleChange("memberFieldLabel", e.target.value)}
          />
        )}
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={cfg.showImageConsentField}
            onChange={(e) => handleChange("showImageConsentField", e.target.checked)}
          />
          <span>Mostrar campo “Consentimento de Imagem”</span>
        </label>
        {cfg.showImageConsentField && (
          <input
            type="text"
            className="mt-1 w-full border rounded p-2"
            value={cfg.imageConsentLabel}
            onChange={(e) => handleChange("imageConsentLabel", e.target.value)}
          />
        )}
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={cfg.showOtherField}
            onChange={(e) => handleChange("showOtherField", e.target.checked)}
          />
          <span>Mostrar campo “Outro”</span>
        </label>
        {cfg.showOtherField && (
          <input
            type="text"
            className="mt-1 w-full border rounded p-2"
            value={cfg.otherFieldLabel}
            onChange={(e) => handleChange("otherFieldLabel", e.target.value)}
          />
        )}
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={cfg.autoConsentForMembers}
            onChange={(e) => handleChange("autoConsentForMembers", e.target.checked)}
          />
          <span>Marcar consentimento de imagem automaticamente para membros</span>
        </label>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {saving ? "Salvando..." : "Salvar Configuração"}
      </button>
    </div>
  );
}
