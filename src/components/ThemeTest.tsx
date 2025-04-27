// src/components/ThemeTest.tsx
'use client';
import { useTheme } from 'next-themes';
export default function ThemeTest() {
  const { resolvedTheme } = useTheme();
  return (
    <div className="min-h-screen bg-base-100 text-base-content p-8">
      <h1 className="text-3xl font-bold">Tema atual: {resolvedTheme}</h1>
      <div className="card bg-base-200 p-6 rounded-lg shadow">
        <p>Conteúdo do card muda com tema.</p>
      </div>
    </div>
  );
}