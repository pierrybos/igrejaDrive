// ============================================
// File: src/components/BibleVersionToggle.tsx
// ============================================
"use client";
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';

interface Props {
  slug: string;
  id: string;
  initial: boolean;
}

export default function BibleVersionToggle({ slug, id, initial }: Props) {
  const [checked, setChecked] = useState(initial);
  const router = useRouter();

  const onToggle = async (val: boolean) => {
    setChecked(val);
    await fetch(`/api/${slug}/bible-versions`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bibleVersionId: id, isActive: val })
    });
    router.refresh();
  };

  return (
    <Switch checked={checked} onCheckedChange={onToggle} />
  );
}