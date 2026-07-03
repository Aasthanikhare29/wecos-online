"use client";

import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/app/dashboard-header";
import { StartupForm } from "@/features/startups/startup-form";
import { useAppStore } from "@/lib/store/app-store";

export default function StartupEditPage() {
  const router = useRouter();
  const startup = useAppStore((s) => s.startup);

  return (
    <div>
      <DashboardHeader
        title={startup ? "Edit startup page" : "Create startup page"}
        description="Your public startup identity on WeCos."
      />
      <div className="max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8">
        <StartupForm
          defaultValues={startup ?? undefined}
          submitLabel={startup ? "Save changes" : "Create startup page"}
          onSaved={() => router.push("/dashboard/startup")}
        />
      </div>
    </div>
  );
}
