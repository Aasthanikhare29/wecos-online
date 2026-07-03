import type { ReactNode } from "react";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(50%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_12%,transparent),transparent)]"
      />
      <header className="p-6">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-24">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
