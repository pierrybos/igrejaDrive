// src/app/providers.tsx
"use client";

import { ReactNode, useEffect, useState } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/store'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

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
  <ReduxProvider store={store}>
    <SessionProvider>
      {mounted ? (
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
        <>{children}</>
      )}
    </SessionProvider>
  </ReduxProvider>
  );
}
