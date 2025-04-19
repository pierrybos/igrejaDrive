"use client";

import { Button } from "@/components/ui/button";
import { FileIcon, EditIcon, TrashIcon } from "lucide-react";

interface ParticipantActionsProps {
  onViewFiles: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ParticipantActions({
  onViewFiles,
  onEdit,
  onDelete,
}: ParticipantActionsProps) {
  return (
    <div className="flex space-x-2">
      <Button
        size="icon"
        variant="outline"
        onClick={onViewFiles}
        aria-label="Ver arquivos"
      >
        <FileIcon />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={onEdit}
        aria-label="Editar participante"
      >
        <EditIcon />
      </Button>
      <Button
        size="icon"
        variant="destructive"
        onClick={onDelete}
        aria-label="Excluir participante"
      >
        <TrashIcon />
      </Button>
    </div>
  );
}
