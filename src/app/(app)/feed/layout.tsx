import type { ReactNode } from "react";
import { DashboardShell } from "@/components/app/dashboard-shell";

export default function FeedLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
