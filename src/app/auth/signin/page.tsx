"use client";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";

  return (
    <div className="flex h-screen items-center justify-center">
      <Button onClick={() => signIn("google", { callbackUrl })}>
        Entrar com Google
      </Button>
    </div>
  );
}
