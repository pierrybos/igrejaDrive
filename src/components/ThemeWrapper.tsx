"use client";

import { useEffect, useState } from "react";

export default function ThemeWrapper({
  initialTheme,
  children,
}: {
  initialTheme: string;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState(initialTheme);
  const [mounted, setMounted] = useState(false); // 👈 importante

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setTheme(saved);
    }
    setMounted(true); // agora o cliente montou
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme, mounted]);

  if (!mounted) return <div className="min-h-screen bg-base-100">{children}</div>;

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <button
        className="btn btn-sm btn-secondary fixed top-4 right-4 z-50"
        onClick={() => setTheme((prev) => (prev === "dark" ? initialTheme : "dark"))}
      >
        {theme === "dark" ? "🌞 Claro" : "🌙 Escuro"}
      </button>
      {children}
    </div>
  );
}
