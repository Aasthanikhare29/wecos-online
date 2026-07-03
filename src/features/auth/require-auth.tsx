"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppStore, useAppHydrated } from "@/lib/store/app-store";

/**
 * Client-side mock gate for the UI-first phase. Redirects to /sign-in when there
 * is no local session. NOTE: this is NOT real security — real gating moves to
 * Next middleware + Supabase session + RLS when the backend is wired.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAppHydrated();
  const session = useAppStore((s) => s.session);

  useEffect(() => {
    if (hydrated && !session) router.replace("/sign-in");
  }, [hydrated, session, router]);

  if (!hydrated) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!session) return null;
  return <>{children}</>;
}
