// src/app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode, useEffect, useState } from "react";

const themes = [
  "azul",
  "vermelho",
  "laranja",
  "verde",
  "cinzaClaro",
  "cinzaEscuro",
  "branco",
  "rosa",
  "dark",
];

export function Providers({
  children
}: {
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  // Só marca montado no cliente, depois do primeiro render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Enquanto não montou, renderiza só as crianças (SSR e CSR inicial iguais) :contentReference[oaicite:0]{index=0}
  if (!mounted) {
    return <>{children}</>;
  }

return (
    // 1️⃣ SessionProvider sempre renderiza (SSR+CSR igual)
    <SessionProvider>
      {mounted ? (
        // 2️⃣ Só depois do mount aplicamos o ThemeProvider
        <NextThemesProvider
          attribute="data-theme"
          defaultTheme="azul"
          themes={themes}
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </NextThemesProvider>
      ) : (
        // Enquanto não montou, renderiza só as páginas (sem tema dinâmico)
        <>{children}</>
      )}
    </SessionProvider>
  );
}
