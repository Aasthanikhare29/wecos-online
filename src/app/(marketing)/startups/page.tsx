"use client";

/**
 * Startups directory — Product Hunt style: ranked, upvotable list with search,
 * sort and category filters. Reads the shared catalog; every row links to a real
 * company page. Becomes a DB query (with real votes) when the backend is wired.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  ChevronUp,
  Search,
  Crown,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/layout/container";
import { startups } from "@/lib/sample/sample-data";

const compact = (n: number) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
const SORTS = ["Trending", "Newest", "Most discussed", "Featured"] as const;
type Sort = (typeof SORTS)[number];

const CATEGORY_CARDS = [
  "Technology",
  "Marketing",
  "Smart Hiring",
  "Compliance",
  "Accounting",
  "Funding",
  "Operations",
  "Sales",
  "Product & Strategy",
];

export default function StartupsDirectoryPage() {
  const [query, setQuery] = useState("");
const categories = ["All", ...CATEGORY_CARDS];
const [selectedCategories, setSelectedCategories] = useState<string[]>(categories);  const [sort, setSort] = useState<Sort>("Trending");
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
const [selectedStartup, setSelectedStartup] = useState("");
const [email, setEmail] = useState("");
const [successMessage, setSuccessMessage] = useState("");
const [emailError, setEmailError] = useState("");

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const toggleCategory = (c: string) => {
  if (c === "All") {
    setSelectedCategories(categories);
    return;
  }

  setSelectedCategories((prev) => {
    if (prev.includes(c)) {
      return prev.filter((item) => item !== c && item !== "All");
    }

    return [...prev.filter((item) => item !== "All"), c];
  });
};

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = startups.filter((s) => {
      const inCat =
  selectedCategories.includes("All") ||
  selectedCategories.length === 0 ||
  (s.topics ?? []).some((t) =>
    selectedCategories.includes(t)
  );
      const inQ =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        (s.topics ?? []).some((t) => t.toLowerCase().includes(q));
      return inCat && inQ;
    });
    return [...filtered].sort((a, b) => {
      if (sort === "Newest")
        return parseInt(b.overview.founded || "0") - parseInt(a.overview.founded || "0");
      if (sort === "Most discussed") return (b.commentsCount ?? 0) - (a.commentsCount ?? 0);
      return (b.upvotes ?? 0) - (a.upvotes ?? 0);
    });
}, [query, selectedCategories, sort]);

  const toggle = (slug: string) =>
    setUpvoted((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
    const resetFilters = () => {
  setQuery("");
  setSelectedCategories(categories);
  setSort("Trending");
};

return (
  <Container className="py-8 sm:py-12">
    
<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
  {/* LEFT SIDE */}
  <div>
    <h1 className="text-3xl font-bold tracking-tight">
      Discover Startups <span className="text-primary">•</span>
    </h1>

    <p className="mt-1.5 text-muted-foreground">
      Explore innovative startups building on WeCos.
    </p>
  </div>

  {/* RIGHT SIDE */}
  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
  <p className="text-sm font-medium text-muted-foreground">
    Showing {list.length} startups
  </p>


  <Link
    href="/sign-in"
    className={cn(
      buttonVariants({ variant: "default" }),
      "h-10 w-full rounded-xl px-5 text-sm font-bold shadow-sm sm:w-auto"
    )}
  >
    + Submit Startup
  </Link>
</div>
  </div>
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* LEFT FILTER SIDEBAR */}
      <aside className="h-fit overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:sticky lg:top-24">
  {/* SEARCH */}
  <div className="border-b border-border p-5">
    <h3 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
      Search
    </h3>

    <div className="relative mt-3">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search startups..."
        className="h-10 rounded-md pl-9"
      />
    </div>
  </div>

  {/* CATEGORIES */}
  <div className="border-b border-border p-5">
    <div className="flex items-center justify-between">
      <h3 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        Categories
      </h3>

      <button
        type="button"
        onClick={() => setSelectedCategories([])}
        className="text-xs text-muted-foreground hover:text-primary"
      >
        Clear All
      </button>
    </div>

<div className="mt-4 space-y-3">
        {categories.map((c) => (
        <label key={c} className="flex items-center gap-3 text-sm">
  <input
  type="checkbox"
  checked={
    c === "All"
      ? selectedCategories.length === categories.length
      : selectedCategories.includes(c)
  }
  onChange={() => toggleCategory(c)}
  className="size-5 rounded-none border-border accent-primary"
/>
  <span
    className={
     (c === "All"
  ? selectedCategories.length === categories.length
  : selectedCategories.includes(c))
        ? "font-semibold text-foreground"
        : "text-muted-foreground"
    }
  >
    {c}
  </span>
</label>
      ))}
    </div>
  </div>

  {/* TRENDING */}
  <div className="border-b border-border p-5">
    <h3 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
      Trending
    </h3>

    <div className="mt-4 space-y-3">
      {["Trending", "Most Voted", "Newest", "Featured"].map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setSort(item as Sort)}
          className={cn(
            "flex w-full cursor-pointer items-center gap-3 text-sm transition",
            sort === item
              ? "font-semibold text-foreground"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          <span
            className={cn(
              "grid size-4 place-items-center rounded-full border",
              sort === item
                ? "border-primary bg-primary"
                : "border-border"
            )}
          >
            {sort === item && (
              <span className="size-1.5 rounded-full bg-white" />
            )}
          </span>

          {item}
        </button>
      ))}
    </div>
  </div>

  {/* RESET */}
  <div className="p-5">
    <button
      type="button"
      onClick={resetFilters}
      className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-primary/40 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      <RotateCcw className="size-4" />
      Reset Filters
    </button>
  </div>
</aside>

      {/* RIGHT STARTUP LIST */}
      <main>
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No startups match your search.
          </div>
        ) : (
          <ul className="grid gap-5 sm:gap-6 xl:grid-cols-2">
           {list.map((s) => {
  const up = upvoted.has(s.slug);

  return (
               <li
  key={s.slug}
  className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all border-1 hover:border-purple-700 hover:shadow-md"
>
  
<div className="mb-4 mt-2">
  <div className="flex justify-end">
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
      <Crown className="size-3.5" />
    Recommended
    </span>
  </div>
</div>
{/* TOP ROW */}
<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
<div className="flex min-w-0 items-start gap-3 sm:gap-4">    
    <Link
      href={`/startup/${s.slug}`}
className="-mt-4 size-20 shrink-0 overflow-hidden rounded-full border border-border bg-muted shadow-sm"    >
      <img
        src={s.logoUrl}
        alt={`${s.name} logo`}
        className="h-full w-full object-cover"
      />
    </Link>

    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <Link
          href={`/startup/${s.slug}`}
          className="truncate text-xl font-bold leading-tight "
        >
          {s.name}
        </Link>

        {s.verified && (
          <BadgeCheck className="size-5 shrink-0 text-purple-700" />
        )}
        
      </div>
      

<p className="mt-1 line-clamp-1 text-sm font-medium text-muted-foreground">
          {s.industry}
      </p>
    </div>
  </div>

  <button
    type="button"
    onClick={() => {
      setSelectedStartup(s.name);
      setShowEnquiryModal(true);
    }}
    className={cn(
  buttonVariants({ variant: "outline" }),
"h-9 w-full shrink-0 rounded-xl border-primary px-3 text-xs font-semibold text-primary hover:bg-primary/10 sm:w-auto"
)}
  >
    Enquire
  </button>
</div>
  {/* DESCRIPTION */}
  <p className="mt-5 line-clamp-2 text-sm leading-6 text-muted-foreground">
    {s.tagline}
  </p>

  {/* TOPICS */}
<div className="mt-4 flex flex-wrap gap-2">
  {(s.topics ?? []).slice(0, 6).map((t) => (
    <span
      key={t}
className="rounded-full border border-border bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground"    >
      {t}
    </span>
  ))}
</div>

  {/* STATS */}
  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
    <span>Founded {s.overview.founded}</span>
    <span>•</span>
    <span>WeCos Joined</span>
  </div>

  {/* BOTTOM ROW */}
  <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
    <Link
      href={`/startup/${s.slug}`}
      className="text-sm font-bold text-primary"
    >
      Visit Page
    </Link>

    <button
      type="button"
      onClick={() => toggle(s.slug)}
      aria-pressed={up}
      className={cn(
        "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors",
        up
          ? "bg-primary/10 text-primary"
          : "text-primary hover:bg-primary/10",
      )}
    >
      <ChevronUp className="size-4" />
      {compact((s.upvotes ?? 0) + (up ? 1 : 0))}
    </button>
  </div>
</li>
  );
})}
</ul>
)}
</main>
</div>
{/* ENQUIRY MODAL */}
{showEnquiryModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">
          Send Enquiry
        </h3>

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

      {/* DESCRIPTION */}
 <p className="mt-2 text-sm text-muted-foreground">

        Enter your email address and we'll connect you with{" "}
        <span className="font-semibold text-foreground">
          {selectedStartup}
        </span>.
      </p>

      {/* EMAIL */}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
className="mt-5 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"      />

      {/* ERROR */}
      {emailError && (
        <p className="mt-2 text-sm font-medium text-red-600">
          {emailError}
        </p>
      )}

      {/* SUCCESS */}
      {successMessage && (
        <p className="mt-2 text-sm font-medium text-green-600">
          {successMessage}
        </p>
      )}

      {/* BUTTONS */}
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
              setEmailError(
                "Please enter a valid email address."
              );
              return;
            }

            try {
              const response = await fetch(
                "/api/company-enquiry",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    userEmail: email,
                    companyName: selectedStartup,
                    type: "enquiry",
                  }),
                }
              );

              if (!response.ok) {
                throw new Error();
              }

              setSuccessMessage(
                "Your enquiry has been submitted successfully."
              );

              setTimeout(() => {
                setShowEnquiryModal(false);
                setSuccessMessage("");
                setEmail("");
                setSelectedStartup("");
              }, 2000);
            } catch (err) {
              setEmailError("Failed to send enquiry.");
            }
          }}
          className="flex-1 rounded-xl bg-purple-600 py-3 font-medium text-white hover:bg-purple-700"
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