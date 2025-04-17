"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ApproveButtonProps {
  userId: string;
  slug: string;
}

export function ApproveButton({ userId, slug }: ApproveButtonProps) {
  const router = useRouter();

  const handleApprove = async () => {
    await fetch(`/api/${slug}/approve-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    router.refresh();
  };

  return (
    <Button size="sm" onClick={handleApprove}>
      Aprovar
    </Button>
  );
}
