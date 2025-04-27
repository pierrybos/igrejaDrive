// src/app/[slug]/store/StoreProvider.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "@/store";              // ajuste o caminho para o seu store

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
