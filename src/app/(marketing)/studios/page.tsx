"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { startups } from "@/lib/sample/sample-data";

const TABS = [
  { label: "All", topics: [] as string[] },
  { label: "Technology", topics: ["Technology", "AI", "SaaS", "Developer Tools", "Productivity", "DeepTech", "Hardware", "API", "Space", "Satellites", "Climate"] },
  { label: "Marketing", topics: ["Marketing", "SEO", "Content", "Growth", "Ads", "Social Media", "Branding"] },
  { label: "Funding", topics: ["Funding", "Fintech", "Payments", "Investing"] },
  { label: "Operations", topics: ["Operations", "Compliance", "Accounting", "Smart Hiring"] },
];

export default function StudiosPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState("");

  const activeTopics = TABS.find((t) => t.label === activeTab)?.topics ?? [];

  const filtered = useMemo(() => {
    if (activeTab === "All") return startups;
    return startups.filter((s) =>
      (s.topics ?? []).some((t) => activeTopics.includes(t))
    );
  }, [activeTab, activeTopics]);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  return (
    <Container className="py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            WeCos Studios
          </h1>
          <p className="mt-1.5 text-muted-foreground">
            Premium services, built for founders. Browse startups by category.
          </p>
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Showing {filtered.length} startup{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveTab(tab.label)}
            className={cn(
              "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.label
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No startups in this category.
        </div>
      ) : (
        <ul className="grid gap-5 sm:gap-6 lg:grid-cols-3">
          {filtered.map((s) => (
            <li
              key={s.slug}
              className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-purple-700 hover:shadow-md"
            >
              <Link
                href={`/startup/${s.slug}`}
                className="absolute inset-0 z-0"
                aria-label={`Go to ${s.name}`}
              />

              {/* Recommended */}
              <div className="relative z-10 mb-4 mt-2">
                <div className="flex justify-end">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
                    <Crown className="size-3.5" />
                    Recommended
                  </span>
                </div>
              </div>

              {/* Top row */}
              <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <div className="-mt-4 size-20 shrink-0 overflow-hidden rounded-full border border-border bg-muted shadow-sm">
                    <img
                      src={s.logoUrl}
                      alt={`${s.name} logo`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-xl font-bold leading-tight">
                        {s.name}
                      </span>
                      {s.verified && (
                        <BadgeCheck className="size-5 shrink-0 text-primary" />
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm font-medium text-muted-foreground">
                      {s.industry}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="relative z-10 mt-5 line-clamp-2 text-sm leading-6 text-muted-foreground">
                {s.tagline}
              </p>

              {/* Topics */}
              <div className="relative z-10 mt-4 flex flex-wrap gap-2">
                {(s.topics ?? []).slice(0, 6).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="relative z-10 mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>Founded {s.overview.founded}</span>
                <span>·</span>
                <span>WeCos Joined</span>
              </div>

              {/* Bottom row */}
              <div className="relative z-10 mt-auto flex items-center justify-center border-t border-border pt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedStartup(s.name);
                    setShowEnquiryModal(true);
                  }}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "h-10 px-6 text-sm font-bold"
                  )}
                >
                  Enquire
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Send Enquiry</h3>
              <button
                onClick={() => {
                  setShowEnquiryModal(false);
                  setEmail("");
                  setEmailError("");
                  setSuccessMessage("");
                }}
                className="text-2xl text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email address and we&apos;ll connect you with{" "}
              <span className="font-semibold text-foreground">{selectedStartup}</span>.
            </p>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-5 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />

            {emailError && (
              <p className="mt-2 text-sm font-medium text-destructive">{emailError}</p>
            )}

            {successMessage && (
              <p className="mt-2 text-sm font-medium text-success">{successMessage}</p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                onClick={async () => {
                  setEmailError("");
                  setSuccessMessage("");

                  if (!email.trim()) {
                    setEmailError("Email address is required.");
                    return;
                  }

                  if (!validateEmail(email)) {
                    setEmailError("Please enter a valid email address.");
                    return;
                  }

                  try {
                    const response = await fetch("/api/company-enquiry", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        userEmail: email,
                        companyName: selectedStartup,
                        type: "enquiry",
                      }),
                    });

                    if (!response.ok) throw new Error();

                    setSuccessMessage("Your enquiry has been submitted successfully.");

                    setTimeout(() => {
                      setShowEnquiryModal(false);
                      setSuccessMessage("");
                      setEmail("");
                      setSelectedStartup("");
                    }, 2000);
                  } catch {
                    setEmailError("Failed to send enquiry.");
                  }
                }}
                className="flex-1 rounded-xl bg-primary py-3 font-medium text-primary-foreground hover:bg-primary/90"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
