// src/app/[slug]/events/[eventSlug]/reception/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVisitors,
  fetchNotices,
  addVisitor,
  addNotice,
} from "@/store/eventSlice";
import type { AppDispatch, RootState } from "@/store";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import { socket } from "@/socket"              // ← importe aqui

interface EventDetails {
  id: string;
  name: string;
  description?: string;
  startsAt: string;
  endsAt?: string;
  hasStreaming: boolean;
  hasPhoto: boolean;
  isOpen: boolean              // ← adicionado

}

interface AreaType {
  id: string;
  allowRecording: boolean;
}

interface NewVisitorData {
  name?: string;
  phone?: string;
  email?: string;
  anonymous: boolean;
  isMember: boolean;
  agreeImageRights: boolean;
}

export default function Reception() {
  // 1) pega slug e eventSlug via hook client
  const { slug, eventSlug } = useParams() as {
    slug: string;
    eventSlug: string;
  };

  // 2) conecta ao Redux
  const dispatch = useDispatch<AppDispatch>();
  const visitors = useSelector((s: RootState) => s.event.visitors);
  const [noticeText, setNoticeText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false)

  // Estado local pra detalhes do evento
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [areas, setAreas] = useState<AreaType[]>([]);
  const [newVisitor, setNewVisitor] = useState<NewVisitorData>({
    name: "",
    phone: "",
    email: "",
    anonymous: false,
    isMember: false,
    agreeImageRights: false,
  });

  useEffect(() => {
    if (slug && eventSlug) {

    // 1) carregar lista de visitantes
    dispatch(fetchVisitors({ slug, eventSlug }));
    dispatch(fetchNotices({ slug, eventSlug }));
    socket.on('visitorAdded', (visitor) => {
      dispatch(setVisitors(visitor))
    })

    // 2) buscar detalhes do evento
    fetch(`/api/${slug}/events/${eventSlug}`)
      .then((res) => res.json())
      .then((data: EventDetails) => setEventDetails(data));

    // 3) buscar áreas do evento
    fetch(`/api/${slug}/events/${eventSlug}/areas`)
      .then((res) => res.json())
      .then((data: AreaType[]) => setAreas(data));
     
    }
    return () => {
      socket.off('visitorAdded')
    }
  
    }, [dispatch, slug, eventSlug]);

  // 5) handlers de envio (exemplo)
  const handleAddVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDetails) return;

    // regra LGPD + áreas:
    if (
      !newVisitor.agreeImageRights &&
      (eventDetails.hasStreaming || eventDetails.hasPhoto)
    ) {
      // verifica se existe área com allowRecording=false
      const hasSafeArea = areas.some((a) => !a.allowRecording);
      if (!hasSafeArea) {
        toast.error(
          "Não há área livre de gravação neste evento. Sem consentimento de uso de imagem não é possível participar."
        );
        return;
      }
    }

    const payload = {
      slug,
      eventSlug,
      name: newVisitor.anonymous ? null : newVisitor.name?? null,
      phone: newVisitor.anonymous ? null : newVisitor.phone ?? null,
      email: newVisitor.anonymous ? null : newVisitor.email ?? null,
      isMember: newVisitor.anonymous ? false : newVisitor.isMember,
      anonymous: newVisitor.anonymous,
      agreeImageRights: newVisitor.agreeImageRights,
    };
    await dispatch(addVisitor(payload))
    // fecha modal e reseta form
    setDialogOpen(false)

    // reset form
    setNewVisitor({
      name: "",
      phone: "",
      email: "",
      anonymous: false,
      isMember: false,
      agreeImageRights: false,
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* 1) Informações básicas do evento */}
      {eventDetails && (
        <>
  <div
    className={
      `px-3 py-1 inline-block rounded-full text-sm font-medium ` +
      (eventDetails.isOpen
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800')
    }
  >
    {eventDetails.isOpen ? 'Evento Aberto' : 'Evento Encerrado'}
  </div>
        <section className="space-y-2">
          <h1 className="text-2xl font-bold">{eventDetails.name}</h1>
          {eventDetails.description && <p>{eventDetails.description}</p>}
          <p>
            Início:{" "}
            {new Date(eventDetails.startsAt).toLocaleString("pt-BR")}
          </p>
          {eventDetails.endsAt && (
            <p>
              Fim:{" "}
              {new Date(eventDetails.endsAt).toLocaleString("pt-BR")}
            </p>
          )}
          <p>
            Streaming: {eventDetails.hasStreaming ? "✅" : "❌"} ·
            Fotos: {eventDetails.hasPhoto ? "✅" : "❌"}
          </p>
        </section>
        </>
      )}

      {/* 2) Botão que abre o diálogo para cadastrar visitante */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setDialogOpen(true)}>Cadastrar Visitante</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md space-y-4">
          <DialogTitle>Novo Visitante</DialogTitle>
          <form onSubmit={handleAddVisitor} className="space-y-4">
            {/* Anonymous */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={newVisitor.anonymous}
                onCheckedChange={(v) =>
                  setNewVisitor((s) => ({ ...s, anonymous: v as boolean }))
                }
              />
              <Label htmlFor="anonymous">Anônimo</Label>
            </div>

            {/* Nome */}
            <div>
              <Label htmlFor="visitorName">Nome</Label>
              <Input
                id="visitorName"
                value={newVisitor.name}
                onChange={(e) =>
                  setNewVisitor((s) => ({ ...s, name: e.target.value }))
                }
                disabled={newVisitor.anonymous}
                required={!newVisitor.anonymous}
              />
            </div>

            {/* Telefone */}
            <div>
              <Label htmlFor="visitorPhone">Telefone</Label>
              <Input
                id="visitorPhone"
                type="tel"
                value={newVisitor.phone}
                onChange={(e) =>
                  setNewVisitor((s) => ({ ...s, phone: e.target.value }))
                }
                disabled={newVisitor.anonymous}
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="visitorEmail">Email</Label>
              <Input
                id="visitorEmail"
                type="email"
                value={newVisitor.email}
                onChange={(e) =>
                  setNewVisitor((s) => ({ ...s, email: e.target.value }))
                }
                disabled={newVisitor.anonymous}
              />
            </div>

            {/* É membro */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isMember"
                checked={newVisitor.isMember}
                onCheckedChange={(v) =>
                  setNewVisitor((s) => ({ ...s, isMember: v as boolean }))
                }
                disabled={newVisitor.anonymous}
              />
              <Label htmlFor="isMember">É membro</Label>
            </div>

            {/* Consentimento de imagem */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeImageRights"
                checked={newVisitor.agreeImageRights}
                onCheckedChange={(v) =>
                  setNewVisitor((s) => ({
                    ...s,
                    agreeImageRights: v as boolean,
                  }))
                }
              />
              <Label htmlFor="agreeImageRights">
                Concorda com uso de imagem?
              </Label>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() =>
                  setNewVisitor({
                    name: "",
                    phone: "",
                    email: "",
                    anonymous: false,
                    isMember: false,
                    agreeImageRights: false,
                  })
                }
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3) Listagem de visitantes cadastrados */}
      <section>
        <h3 className="text-lg font-medium">Visitantes</h3>
        <ul className="list-disc list-inside mt-2 space-y-1">
          {visitors.map((v) => (
            <li key={v.id}>
              {v.anonymous ? <em>Anônimo</em> : v.name}
              {v.phone && ` • 📞 ${v.phone}`}
              {v.email && ` • ✉️ ${v.email}`}
              {v.isMember && " • Membro"}
              {!v.agreeImageRights && " • Sem consentimento de imagem"}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
