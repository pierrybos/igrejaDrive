// src/app/[slug]/dashboard/participants/columns.ts
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Whatsapp, List, Eye, Edit3, Trash2 } from "lucide-react";

type Participant = {
  id: number;
  name: string;
  phone: string | null;
  isWhatsApp: boolean;
  // … outros campos
};

export const participantColumns: ColumnDef<Participant>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  // … suas outras colunas
  {
    id: "whatsapp",
    header: () => null,            // sem título
    cell: ({ row }) => {
      const { phone, isWhatsApp } = row.original;
      if (!isWhatsApp || !phone) return null;

      const clean = phone.replace(/\D/g, "");
      return (
        <a
          href={`https://wa.me/${clean}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex"
        >
          <WhatsApp className="h-5 w-5 text-green-500" />
        </a>
      );
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => <ParticipantActions participant={row.original} />,
  },
];
