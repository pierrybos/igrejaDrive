"use client";
import { useEffect, useState } from "react";

export function DarkModeToggle({
  onToogleTheme, theme 
}: {
  onToogleTheme: () => void;
  theme?: string;
}) {
  return (
    <button className="btn btn-secondary" onClick={onToogleTheme}>
      {theme === "dark" ? "🌙 Escuro." : "🌞 Claro" }
    </button>
  );
}
