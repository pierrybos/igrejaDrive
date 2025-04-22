/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
      },
    },
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      // 1) Tema escuro padrão do DaisyUI
      "dark",
      // 2) Seus temas personalizados
      {
        azul: {
          primary: "#3b82f6",
          secondary: "#60a5fa",
          accent: "#1d4ed8",
          neutral: "#374151",
          "base-100": "#ffffff",
          "base-content": "#1f2937",
        },
        vermelho: {
          primary: "#ef4444",
          secondary: "#f87171",
          accent: "#b91c1c",
          neutral: "#374151",
          "base-100": "#ffffff",
          "base-content": "#1f2937",
        },
        laranja: {
          primary: "#f97316",
          secondary: "#fb923c",
          accent: "#c2410c",
          neutral: "#374151",
          "base-100": "#ffffff",
          "base-content": "#1f2937",
        },
        verde: {
          primary: "#22c55e",
          secondary: "#4ade80",
          accent: "#15803d",
          neutral: "#374151",
          "base-100": "#ffffff",
          "base-content": "#1f2937",
        },
       cinzaClaro: {
          primary: "#9ca3af",
          secondary: "#cbd5e1",
          accent: "#6b7280",
          neutral: "#d1d5db",
          "base-100": "#f8fafc",   // fundo claro suave
          "base-content": "#1f2937", // texto escuro
        },
        cinzaEscuro: {
          primary: "#374151",
          secondary: "#4b5563",
          accent: "#1f2937",
          neutral: "#111827",
          "base-100": "#1f2937",   // fundo escuro
          "base-content": "#f9fafb", // texto claro
        },
        branco: {
          primary: "#ffffff",
          secondary: "#f9fafb",
          accent: "#e5e7eb",
          neutral: "#374151",
          "base-100": "#ffffff",
          "base-content": "#1f2937",
        },
        rosa: {
          primary: "#ec4899",
          secondary: "#f472b6",
          accent: "#be185d",
          neutral: "#374151",
          "base-100": "#ffffff",
          "base-content": "#1f2937",
        },
      },
    ],
  },
};
