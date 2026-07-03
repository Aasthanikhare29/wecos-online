import type { ReactNode } from "react";
import { RequireAuth } from "@/features/auth/require-auth";

/** Everything under (app) requires a session (mock now; Supabase + middleware later). */
export default function AppLayout({ children }: { children: ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
