"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/layout/container";
import { founders } from "@/lib/sample/sample-data";

const FILTERS = ["All", "Hiring", "Raising", "Investing", "Partnerships"];

export default function FoundersDirectoryPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();

    return founders
      .filter((f) => {
        const inQ =
          !q ||
          f.name.toLowerCase().includes(q) ||
          f.headline.toLowerCase().includes(q) ||
          (f.location ?? "").toLowerCase().includes(q);

        const inF =
          filter === "All" ||
          (f.openTo ?? []).some((o) =>
            o.toLowerCase().includes(filter.toLowerCase())
          );

        return inQ && inF;
      })
      .sort((a, b) => (b.followers ?? 0) - (a.followers ?? 0));
  }, [query, filter]);

  return (
    <Container className="py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Founders on WeCos
          </h1>
          <p className="mt-1.5 text-muted-foreground">
            Meet the founders building calmly. Connect, follow and grow your network.
          </p>
        </div>

        <Link
          href="/sign-up"
          className={cn(buttonVariants({ variant: "default" }), "h-10")}
        >
          Create your profile
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search founders, roles, cities…"
            className="h-10 pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                filter === c
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {list.length} founder{list.length === 1 ? "" : "s"}
      </p>

      {list.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No founders match your search.
        </div>
      ) : (
        <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((f) => (
            <div
              key={f.handle}
              className="h-[380px] max-w-[360px] overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(15,23,42,0.15)]"
            >
              <Link href={`/u/${f.handle}`} className="block">
                <div className="relative h-[72px] overflow-hidden bg-gradient-to-r from-slate-50 via-white to-slate-100">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.10),transparent_35%)]" />
                </div>

                <div className="-mt-8 px-5 pb-4 text-center">
                  <div className="relative mx-auto h-20 w-20">
                    {f.avatarUrl ? (
                      <img
                        src={f.avatarUrl}
                        alt={f.name}
                        className="h-20 w-20 rounded-full border-[4px] border-white object-cover shadow-[0_8px_30px_rgba(0,0,0,0.18)] ring-2 ring-white/60"
                      />
                    ) : (
                      <span className="grid h-20 w-20 place-items-center rounded-full border-[4px] border-white bg-gradient-to-br from-violet-600 to-fuchsia-500 text-xl font-bold text-white shadow-[0_8px_30px_rgba(0,0,0,0.18)] ring-2 ring-white/60">
                        {f.avatarText}
                      </span>
                    )}

                    <span className="absolute right-0 top-1 h-5 w-5 rounded-full border-[3px] border-white bg-cyan-400" />
                  </div>

                  <h3 className="mt-2 text-lg font-bold text-slate-950">
                    {f.name}
                  </h3>

                  <p className="mt-2 text-base font-semibold text-slate-700">
                    {f.currentCompany?.name ?? "WeCos"}
                  </p>

                 
                  <div className="my-3 h-px bg-slate-200" />

                  <div className="flex flex-wrap justify-center gap-2">
                    {(f.skills ?? []).slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-slate-200 pt-4">
                    <button
                      type="button"
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-800 transition-all hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                    >
                      + Connect
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}