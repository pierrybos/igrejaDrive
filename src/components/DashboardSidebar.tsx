"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface SidebarProps {
  slug: string;
}

export default function DashboardSidebar({ slug }: SidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const sections = [
    { label: 'Visão Geral', href: `/${slug}/dashboard` },
    {
      label: 'Participações',
      items: [
        { label: 'Participações', href: `/${slug}/dashboard/participants` },
        { label: 'Tipos de Participação', href: `/${slug}/dashboard/participation-types` },
        { label: 'Partes do Programa', href: `/${slug}/dashboard/program-parts` },
      ],
    },
    {
      label: 'Configurações',
      items: [
        { label: 'Configurações do Drive', href: `/${slug}/dashboard/drive-config` },
        { label: 'Versões da Bíblia', href: `/${slug}/dashboard/bible-version` },
        { label: 'Dados da Igreja', href: `/${slug}/dashboard/institution-profile`},
        { label: 'Configurações do formulário', href: `/${slug}/dashboard/form-config`},
      ],
    },
  ];

  const toggle = (label: string) =>
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));

  return (
    <nav className="space-y-2">
      {sections.map(section => (
        section.items ? (
          <div key={section.label}>
            <button
              onClick={() => toggle(section.label)}
              className="w-full flex justify-between items-center px-3 py-1 rounded hover:bg-gray-100 focus:outline-none"
            >
              <span>{section.label}</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  openSections[section.label] ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSections[section.label] && (
              <div className="pl-4 space-y-1">
                {section.items.map(item => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block px-3 py-1 rounded hover:bg-gray-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Link
            key={section.label}
            href={section.href}
            className="block px-3 py-1 rounded hover:bg-gray-100"
          >
            {section.label}
          </Link>
        )
      ))}
    </nav>
  );
}
