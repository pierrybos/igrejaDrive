// src/components/participants/ParticipantsTableClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ParticipantActions } from "./ParticipantActions";
import { Participant, ParticipantStatus } from "@prisma/client";
import { toast } from "@/components/ui/sonner";
import FilesModal from "@/components/participants/FilesModal";
import { List, Eye, Edit3, Trash2 } from "lucide-react";

interface Props {
  participants: (Participant & { files: { id: string; name: string; url: string }[] })[];
  slug: string;
}

export default function ParticipantsTableClient({ participants, slug }: Props) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filesModalFor, setFilesModalFor] = useState<string | null>(null);

  const changeStatus = async (id: number, status: Participant["status"]) => {
  const res = await fetch(`/api/${slug}/participants/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });0
  if (res.ok) {
    toast("Status atualizado!");
    setEditingId(null);
    router.refresh();
  } else {
    const err = await res.json()
    toast(err.error || 'Não foi possível atualizar.', "destructive");
  }
}

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Status</TableCell>
            <TableCell />
            <TableCell className="text-right">Ações</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{new Date(p.participationDate).toLocaleDateString()}</TableCell>
              <TableCell>
                {editingId === p.id ? (
                    <Select
                  value={p.status}
                  onValueChange={(novo) => changeStatus(p.id, novo as Participant["status"])}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ParticipantStatus).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge
                  variant={p.status === "Aprovado" ? "success" : p.status === "Rejeitado" ? "destructive" : "default"}
                >
                  {p.status}
                </Badge>
                )}
              </TableCell>
              <TableCell>
                {p.phone && p.isWhatsApp && (
                  <a
                    href={`https://wa.me/${p.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                        <path d="M25,2C12.318,2,2,12.318,2,25c0,3.96,1.023,7.854,2.963,11.29L2.037,46.73c-0.096,0.343-0.003,0.711,0.245,0.966 C2.473,47.893,2.733,48,3,48c0.08,0,0.161-0.01,0.24-0.029l10.896-2.699C17.463,47.058,21.21,48,25,48c12.682,0,23-10.318,23-23 S37.682,2,25,2z M36.57,33.116c-0.492,1.362-2.852,2.605-3.986,2.772c-1.018,0.149-2.306,0.213-3.72-0.231 c-0.857-0.27-1.957-0.628-3.366-1.229c-5.923-2.526-9.791-8.415-10.087-8.804C15.116,25.235,13,22.463,13,19.594 s1.525-4.28,2.067-4.864c0.542-0.584,1.181-0.73,1.575-0.73s0.787,0.005,1.132,0.021c0.363,0.018,0.85-0.137,1.329,1.001 c0.492,1.168,1.673,4.037,1.819,4.33c0.148,0.292,0.246,0.633,0.05,1.022c-0.196,0.389-0.294,0.632-0.59,0.973 s-0.62,0.76-0.886,1.022c-0.296,0.291-0.603,0.606-0.259,1.19c0.344,0.584,1.529,2.493,3.285,4.039 c2.255,1.986,4.158,2.602,4.748,2.894c0.59,0.292,0.935,0.243,1.279-0.146c0.344-0.39,1.476-1.703,1.869-2.286 s0.787-0.487,1.329-0.292c0.542,0.194,3.445,1.604,4.035,1.896c0.59,0.292,0.984,0.438,1.132,0.681 C37.062,30.587,37.062,31.755,36.57,33.116z"></path>
                    </svg>
                </a>
                )}
              </TableCell>
              <TableCell className="text-right">
                <ParticipantActions
                  onViewFiles={() => setFilesModalFor(p.id.toString())}
                  onEdit={() => setEditingId(editingId === p.id ? null : p.id)}
                  onDelete={async () => {
                    if (!confirm("Deseja realmente excluir?")) return;
                    await fetch(`/${slug}/api/participants`, {
                      method: "DELETE",
                      body: JSON.stringify({ id: p.id }),
                    });
                    router.refresh();
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filesModalFor && (
        <FilesModal
          open
          onClose={() => setFilesModalFor(null)}
          files={
            participants.find((p) => p.id.toString() === filesModalFor)!.files
          }
        />
      )}
    </>
  );
}
