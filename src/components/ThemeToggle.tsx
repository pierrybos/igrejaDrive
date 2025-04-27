// src/components/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // evita mismatch SSR/CSR
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const current = resolvedTheme; // ou apenas theme

  return (
    <Button onClick={() => setTheme(current === "dark" ? "azul" : "dark")}>
      {current === "dark" ? "🌞 Claro" : "🌙 Escuro?"}
    </Button>
  );
}
