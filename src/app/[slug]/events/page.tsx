/*/ app/[slug]/events/page.tsx (Lista de eventos + criação)
'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import Link from 'next/link';

type Event = {
  id: string;
  slug: string;
  name: string;
  startsAt: string;
  isOpen: boolean;
};

export default function EventsListPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const { data: events } = useSWR<Event[]>(`/api/${slug}/events`, fetcher);

  const [form, setForm] = useState({ name: '', description: '', startsAt: '', endsAt: '', hasStreaming: false, hasPhoto: false });

  async function submitNewEvent(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/${slug}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    mutate(`/api/${slug}/events`);
    setForm({ name: '', description: '', startsAt: '', endsAt: '', hasStreaming: false, hasPhoto: false });
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Eventos</h1>
      <form onSubmit={submitNewEvent} className="space-y-2 my-4 border p-4 rounded">
        <input
          required
          type="text"
          placeholder="Nome do evento"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Descrição"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="border p-2 w-full"
        />
        <div className="flex gap-2">
          <input
            required
            type="datetime-local"
            value={form.startsAt}
            onChange={e => setForm({ ...form, startsAt: e.target.value })}
            className="border p-2"
          />
          <input
            type="datetime-local"
            value={form.endsAt}
            onChange={e => setForm({ ...form, endsAt: e.target.value })}
            className="border p-2"
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.hasStreaming}
            onChange={e => setForm({ ...form, hasStreaming: e.target.checked })}
          />
          Transmissão ao vivo
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.hasPhoto}
            onChange={e => setForm({ ...form, hasPhoto: e.target.checked })}
          />
          Haverá fotos
        </label>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Criar Evento
        </button>
      </form>

      <ul className="mt-4 space-y-2">
        {events?.map(evt => (
          <li key={evt.id} className="flex justify-between">
            <Link
              href={`/${slug}/events/${evt.slug}/panel`}
              className="text-blue-600 hover:underline"
            >
              {evt.name} — {new Date(evt.startsAt).toLocaleDateString()}
            </Link>
            {evt.isOpen && (
              <span className="ml-2 px-2 bg-green-200 text-green-800 rounded">Aberto</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} */
// app/[slug]/events/page.tsx
import EventsPageClient from "./EventsPageClient";

export default async function EventsListPage({
  params,
}: {
  params: Promise<{ slug: string }>;               // ← Promise aqui
}) {
  const { slug } = await params;                     // ← await
  // aqui params.slug já é string simples
  return <EventsPageClient slug={slug} />;
}
