// app/institutions/[slug]/events/[eventSlug]/page.tsx (Recepção)
'use client';

import { useState } from 'react';
import { useEventVisitors } from '@/hooks/useEventVisitors';
import useSWR from 'swr';

export default function Reception({ params }: { params: { slug: string; eventSlug: string } }) {
  const { slug, eventSlug } = params;
  const { data: event } = useSWR(
    `/api/${slug}/events/${eventSlug}`
  );
  const visitors = useEventVisitors(slug, eventSlug);
  const noticesFetcher = (url: string) => fetch(url).then(res => res.json());
  const { data: notices } = useSWR(
    `/api/${slug}/events/${eventSlug}/notices`,
    noticesFetcher
  );

  const [form, setForm] = useState({ name: '', phone: '', email: '', anonymous: false, agreeImageRights: false });
  const [noticeText, setNoticeText] = useState('');

  if (!event) return <p>Carregando evento…</p>;
  if (!event.isOpen) return <p>Inscrições encerradas</p>;

  async function submitVisitor(e: React.FormEvent) {
    e.preventDefault();
    await fetch(
      `/api/${slug}/events/${eventSlug}/visitors`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }
    );
    setForm({ name: '', phone: '', email: '', anonymous: false, agreeImageRights: false });
  }

  async function submitNotice(e: React.FormEvent) {
    e.preventDefault();
    await fetch(
      `/api/${slug}/events/${eventSlug}/notices`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: noticeText }) }
    );
    setNoticeText('');
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Recepção: {event.name}</h1>
      <form onSubmit={submitVisitor} className="space-y-2">
        <input type="text" placeholder="Nome" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border p-2 w-full" />
        <input type="text" placeholder="Telefone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="border p-2 w-full" />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="border p-2 w-full" />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.anonymous} onChange={e => setForm({...form, anonymous: e.target.checked})} /> Anônimo
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.agreeImageRights} onChange={e => setForm({...form, agreeImageRights: e.target.checked})} /> Concordo com uso de imagem
        </label>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Cadastrar visitante</button>
      </form>

      <h2 className="mt-6 text-xl">Visitantes</h2>
      <ul className="list-disc pl-5">
        {visitors.map(v => (
          <li key={v.id}>{v.name ?? 'Anônimo'} - {new Date(v.registeredAt).toLocaleTimeString()}</li>
        ))}
      </ul>

      <form onSubmit={submitNotice} className="mt-6 space-y-2">
        <textarea placeholder="Aviso..." value={noticeText} onChange={e => setNoticeText(e.target.value)} className="border p-2 w-full" />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Publicar aviso</button>
      </form>

      <h2 className="mt-6 text-xl">Avisos</h2>
      <ul className="list-disc pl-5">
        {notices?.map(n => (
          <li key={n.id}>{n.message} - {new Date(n.createdAt).toLocaleTimeString()}</li>
        ))}
      </ul>
    </div>
  );
}