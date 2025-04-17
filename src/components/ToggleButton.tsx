"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ToggleButton({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();
  const handle = async () => {
    await fetch(`/api/${id.startsWith("cm")?"participation-types":"program-parts"}`, {
      method: "PATCH",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ id, isActive: !active }),
    });
    router.refresh();
  };
  return <Button size="sm" variant={active?"default":"outline"} onClick={handle}>
    {active? "Desativar":"Ativar"}
  </Button>;
}
