"use client";

import { Toaster, toast } from "sonner";

/**
 * Componente que exibe o container de toasts.
 * Deve ser incluído uma única vez no root layout.
 */
export function ToasterWrapper() {
  return <Toaster />;
}

// Exporta o método toast para disparar notificações em toda a app
export { toast };

