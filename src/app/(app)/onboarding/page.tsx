"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { ProfileForm } from "@/features/profiles/profile-form";
import { StartupForm } from "@/features/startups/startup-form";
import { useAppStore } from "@/lib/store/app-store";

const steps = [
  { title: "Your profile", subtitle: "Tell other founders who you are." },
  { title: "Your startup", subtitle: "Create your public startup page." },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const profile = useAppStore((s) => s.profile);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const finish = () => {
    completeOnboarding();
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 py-10">
      <Logo />

      <div className="mt-10">
        <p className="text-sm font-semibold text-primary">Step {step + 1} of {steps.length}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{steps[step].title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{steps[step].subtitle}</p>
        <div className="mt-4 flex gap-2">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= step ? "bg-primary" : "bg-muted",
              )}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        {step === 0 ? (
          <ProfileForm
            defaultValues={{
              fullName: profile?.fullName ?? "",
              headline: profile?.headline ?? "",
              location: profile?.location ?? "",
              bio: profile?.bio ?? "",
            }}
            submitLabel="Continue"
            onSaved={() => setStep(1)}
          />
        ) : (
          <div className="space-y-4">
            <StartupForm submitLabel="Finish setup" onSaved={finish} />
            <button
              type="button"
              onClick={finish}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
