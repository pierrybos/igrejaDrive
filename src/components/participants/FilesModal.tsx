"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FilesModalProps {
  open: boolean;
  onClose: () => void;
  files: { name: string; url: string }[];
}

export default function FilesModal({ open, onClose, files }: FilesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Arquivos Enviados</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 my-4">
          {files.length > 0 ? (
            files.map((file) => (
              <a
                key={file.url}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:underline text-primary"
              >
                {file.name}
              </a>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum arquivo enviado.</p>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
