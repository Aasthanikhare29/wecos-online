"use client";

import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/app/dashboard-header";
import { ProfileForm } from "@/features/profiles/profile-form";
import { useAppStore } from "@/lib/store/app-store";

export default function ProfileEditPage() {
  const router = useRouter();
  const profile = useAppStore((s) => s.profile);

  return (
    <div>
      <DashboardHeader title="Edit profile" description="Update how you appear to other founders." />
      <div className="max-w-xl rounded-2xl border border-border bg-card p-6 sm:p-8">
        <ProfileForm
          defaultValues={{
            fullName: profile?.fullName ?? "",
            headline: profile?.headline ?? "",
            location: profile?.location ?? "",
            bio: profile?.bio ?? "",
            avatarUrl: profile?.avatarUrl ?? "",
          }}
          submitLabel="Save changes"
          onSaved={() => router.push("/dashboard/profile")}
        />
      </div>
    </div>
  );
}
