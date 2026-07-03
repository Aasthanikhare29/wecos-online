"use client";

import Link from "next/link";
import { Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useAppStore } from "@/lib/store/app-store";

export default function DashboardPage() {
  const profile = useAppStore((s) => s.profile);
  const startup = useAppStore((s) => s.startup);
  const firstName = (profile?.fullName ?? "Founder").split(" ")[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome, {firstName}.</h1>
        <p className="mt-1 text-muted-foreground">Here&apos;s your founder workspace.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <User className="size-4" />
            Your profile
          </div>
          <p className="mt-3 text-lg font-semibold">{profile?.fullName ?? "—"}</p>
          {profile?.headline ? (
            <p className="text-sm text-muted-foreground">{profile.headline}</p>
          ) : null}
          <Link
            href="/dashboard/profile"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-5")}
          >
            View profile
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Building2 className="size-4" />
            Your startup
          </div>
          {startup ? (
            <>
              <p className="mt-3 text-lg font-semibold">{startup.name}</p>
              {startup.tagline ? (
                <p className="text-sm text-muted-foreground">{startup.tagline}</p>
              ) : null}
              <Link
                href="/dashboard/startup"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-5")}
              >
                View startup
              </Link>
            </>
          ) : (
            <>
              <p className="mt-3 text-sm text-muted-foreground">
                You haven&apos;t created your startup page yet.
              </p>
              <Link
                href="/dashboard/startup/edit"
                className={cn(buttonVariants({ variant: "default", size: "sm" }), "mt-5")}
              >
                Create startup page
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
