// /src/hooks/useEventNotices.ts
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

export interface Notice { id: string; message: string }

export function useEventNotices(eventSlug: string) {
  const [notices, setNotices] = useState<Notice[]>([])

  useEffect(() => {
    const q = query(
      collection(db, 'events', eventSlug, 'notices'),
      orderBy('createdAt', 'asc')
    )
    const unsubscribe = onSnapshot(q, snap => {
      setNotices(
        snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
      )
    })
    return unsubscribe
  }, [eventSlug])

  const addNotice = async (message: string) => {
    await addDoc(collection(db, 'events', eventSlug, 'notices'), {
      message,
      createdAt: Date.now(),
    })
  }

  return { notices, addNotice }
}
