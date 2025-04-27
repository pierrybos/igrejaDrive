// /src/app/[slug]/events/[eventSlug]/panel/page.tsx
'use client'

import { use, useState, useEffect } from 'react'
import useSWR from 'swr'
import { useEventVisitors } from '@/hooks/useEventVisitors'
import { useEventNotices }  from '@/hooks/useEventNotices'

interface PanelProps {
  // params é agora uma Promise no client
  params: Promise<{
    slug: string
    eventSlug: string
  }>
}

export default function Panel({ params }: PanelProps) {
  // 1) “desembrulha” o params antes de usar
  const { slug, eventSlug } = use(params)

  const fetcher = (url: string) => fetch(url).then(res => res.json())

  // 1) Busca os dados do evento
  const { data: event, mutate: refreshEvent } = useSWR<{
    id: string
    name: string
    isOpen: boolean
  }>(`/api/${slug}/events/${eventSlug}`, fetcher)

  // 2) Hooks de realtime (Firestore ou sua implementação)
  const { visitors } = useEventVisitors(eventSlug)
  const { notices } = useEventNotices(eventSlug)

  // 3) Estado local para o botão de abrir/encerrar
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    if (event) setIsOpen(event.isOpen)
  }, [event])

  // 4) Alterna aberto/fechado e atualiza
  async function toggleOpen() {
    if (!event) return
    await fetch(
      `/api/${slug}/events/${eventSlug}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: !isOpen }),
      }
    )
    setIsOpen(prev => !prev)
    refreshEvent()
  }

  if (!event) return <p>Carregando…</p>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Painel: {event.name}</h1>

      <button
        onClick={toggleOpen}
        className="mt-2 mb-4 px-4 py-2 bg-purple-500 text-white rounded"
      >
        {isOpen ? 'Encerrar evento' : 'Abrir evento'}
      </button>

      <section className="mt-6">
        <h2 className="text-xl">Visitantes ({visitors.length})</h2>
        <ul className="list-disc pl-5">
          {visitors.map(v => (
            <li key={v.id}>{v.name ?? 'Anônimo'}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl">Avisos ({notices.length})</h2>
        <ul className="list-disc pl-5">
          {notices.map(n => (
            <li key={n.id}>{n.message}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
