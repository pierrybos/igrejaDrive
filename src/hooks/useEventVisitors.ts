// /src/hooks/useEventVisitors.ts
'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface Visitor { id: string; name: string }

export function useEventVisitors(eventSlug: string) {
  const [visitors, setVisitors] = useState<Visitor[]>([])

  useEffect(() => {
    const q = query(
      collection(db, 'events', eventSlug, 'visitors'),
      orderBy('createdAt', 'asc')
    )
    const unsubscribe = onSnapshot(q, snap => {
      setVisitors(
        snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
      )
    })
    return unsubscribe
  }, [eventSlug])

  const addVisitor = async (name: string) => {
    await addDoc(collection(db, 'events', eventSlug, 'visitors'), {
      name,
      createdAt: Date.now(),
    })
  }

  return { visitors, addVisitor }
}
