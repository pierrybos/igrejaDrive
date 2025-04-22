// src/components/ThemeTest.tsx
"use client";

import { useEffect, useState } from "react";

const themes = ["azul", "vermelho", "verde", "rosa", "dark"];

export default function ThemeTest() {
  const [theme, setTheme] = useState("azul");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme, mounted]);

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center bg-base-100 text-base-content">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content p-8 transition-all">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Teste de Tema DaisyUI</h1>

        <div className="mb-6 flex gap-3 flex-wrap">
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`btn btn-sm ${theme === t ? "btn-primary" : "btn-outline"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="card bg-base-200 text-base-content shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Componente Exemplo</h2>
          <p className="mb-4">
            Este card muda automaticamente conforme o tema ativo.
          </p>
          <p>Tema atual: {theme}</p>
          <button className="btn btn-secondary">Botão de Ação</button>
          <div className="border border-primary bg-base-100 text-base-content p-4 rounded mt-6">
  <p>Texto dentro de base-100 / base-content</p>
  <p className="text-primary">Texto em `primary`</p>
  <p className="text-secondary">Texto em `secondary`</p>
  <p className="text-accent">Texto em `accent`</p>
</div>
        </div>
      </div>
    </div>
  );
}
