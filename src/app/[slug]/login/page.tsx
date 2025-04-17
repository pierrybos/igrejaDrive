"use client";
import { signIn } from "next-auth/react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SlugLoginPage() {
  const { slug } = useParams();
  return (
    <div className="flex h-screen items-center justify-center">
      <Button
        onClick={() =>
          signIn("google", {
            callbackUrl: `/${slug}/dashboard`,
          })
        }
      >
        Entrar em {slug}
      </Button>
    </div>
  );
}
