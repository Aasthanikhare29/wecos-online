# Feed System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a client-side social feed to the WeCos workspace — a timeline, a Facebook-style multi-type Add-Post composer, and a single-post page with comments — backed by the existing Zustand mock store.

**Architecture:** Discriminated-union posts (`content.kind` is the discriminant) + a `postTypes` registry mapping each kind → `{ label, icon, Body }`. The feed card, single-post page, and composer are type-agnostic shells driven by the registry. State lives in a feed slice added to `useAppStore`, seeded from `sample-feed.ts`.

**Tech Stack:** Next.js 16 (App Router, modified — read `node_modules/next/dist/docs/` first), React 19, TypeScript, Zustand (persist), base-ui primitives (use `render`, not `asChild`), Tailwind v4 (semantic tokens only), lucide-react icons, date-fns, zod.

---

## Conventions for every task

- **No test runner is installed.** Per-task verification = `npm run lint` (and fix any TS/lint errors). Final verification = `npm run build` + manual preview pass (Task 12).
- **This is not a git repo.** Commit steps are optional. To use them, run `git init` once at the start; otherwise skip every "Commit" step.
- **Colors:** semantic tokens only (`text-primary`, `bg-card`, `text-muted-foreground`, `border-border`, `text-destructive`, `--brand-gold` via `text-[var(--brand-gold)]` etc.). Never hardcode hex.
- **base-ui:** pass a component to the `render` prop (see `sheet.tsx` for the pattern), never `asChild`.

---

## File structure

```
src/features/feed/
  schema.ts            # types only (FeedPost, PostContent union, Comment, Author)
  feed-utils.ts        # nid(), youtubeId(), authorFromProfile(), applyVote()
  post-body.tsx        # 9 body renderers (one named export each) + registry-facing
  post-types.tsx       # postTypes registry + postTypeOrder
  post-actions.tsx     # upvote/downvote/comment/share/bookmark row
  post-card.tsx        # card shell: header + <Body> + <PostActions>
  post-composer.tsx    # collapsed bar + dialog with type switcher + per-kind fields
  comment-thread.tsx   # comment composer + flat comment list
  feed-view.tsx        # timeline + tabs (For you / Following / Bookmarks)
  single-post-view.tsx # full post + comments
src/app/(app)/feed/
  layout.tsx           # wraps children in <DashboardShell>
  page.tsx             # renders <FeedView />
  [id]/page.tsx        # renders <SinglePostView id=... />
src/lib/sample/sample-feed.ts   # seed posts (one per kind, plus a few extra)
src/components/ui/dialog.tsx    # new base-ui dialog primitive
# MODIFY: src/lib/store/app-store.ts          (feed slice)
# MODIFY: src/components/app/dashboard-shell.tsx (Feed nav entry)
```

Two deviations from the spec, both to keep code bounded; lift later if desired:
1. Per-type **composer fields** live in `post-composer.tsx` as a `switch` on `draft.kind` (not in the registry). The registry still drives all *rendering* + the type picker, so the card/timeline stay type-agnostic.
2. The 9 body renderers live in one `post-body.tsx` (named exports) rather than a `post-body/` folder.

---

## Task 1: Add the base-ui Dialog primitive

**Files:**
- Create: `src/components/ui/dialog.tsx`

- [ ] **Step 1: Read the Next.js docs note**

The composer is a client component using a portal-based dialog. No route work here, but before any later route task, skim `node_modules/next/dist/docs/` for App Router / page conventions (per `AGENTS.md`).

- [ ] **Step 2: Create the dialog (modelled on `sheet.tsx`, centered)**

```tsx
"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogClose(props: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogPortal(props: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/40 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs",
        className,
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & { showCloseButton?: boolean }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 grid-rows-[auto_1fr_auto] gap-4 overflow-hidden rounded-2xl border border-border bg-popover p-6 text-popover-foreground shadow-lg transition duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={<Button variant="ghost" size="icon-sm" className="absolute right-3 top-3" />}
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-1", className)} {...props} />
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-footer" className={cn("flex items-center justify-end gap-2", className)} {...props} />
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("font-heading text-lg font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```

- [ ] **Step 3: Verify**

Run: `npm run lint`
Expected: no errors referencing `dialog.tsx`. (If `@base-ui/react/dialog` types differ, mirror exactly what `sheet.tsx` imports — both use the same primitive.)

- [ ] **Step 4: Commit (optional)**

```bash
git add src/components/ui/dialog.tsx
git commit -m "feat(ui): add base-ui dialog primitive"
```

---

## Task 2: Feed types

**Files:**
- Create: `src/features/feed/schema.ts`

- [ ] **Step 1: Define the types**

```ts
/** Feed domain types. Mock-store phase — no zod needed; composer validates inline. */

export type Author = {
  name: string;
  handle: string;
  avatarText: string;
  avatarUrl?: string;
  verified?: boolean;
};

export type PollOption = { id: string; label: string; votes: number };
export type QuizOption = { id: string; label: string; correct: boolean };

/** Discriminated union — `kind` is the single source of post type. */
export type PostContent =
  | { kind: "text"; body: string }
  | { kind: "photo"; body?: string; images: string[] }
  | { kind: "ytVideo"; body?: string; url: string }
  | { kind: "video"; body?: string; src: string; poster?: string }
  | { kind: "poll"; question: string; options: PollOption[]; myChoice?: string }
  | { kind: "quote"; quote: string; source: string }
  | { kind: "question"; body: string }
  | {
      kind: "quiz";
      question: string;
      options: QuizOption[];
      explanation?: string;
      myAnswer?: string;
    }
  | { kind: "achievement"; title: string; detail?: string; metric?: string };

export type PostType = PostContent["kind"];

export type Vote = 1 | 0 | -1;

export type Comment = {
  id: string;
  author: Author;
  body: string;
  createdAt: string; // ISO
  score: number;
  myVote: Vote;
};

export type FeedPost = {
  id: string;
  author: Author;
  createdAt: string; // ISO
  content: PostContent;
  score: number;
  myVote: Vote;
  commentCount: number;
  comments: Comment[];
  bookmarked: boolean;
};
```

- [ ] **Step 2: Verify**

Run: `npm run lint`
Expected: no errors. (Nothing imports it yet — this just type-checks.)

- [ ] **Step 3: Commit (optional)**

```bash
git add src/features/feed/schema.ts
git commit -m "feat(feed): add feed domain types"
```

---

## Task 3: Feed utilities

**Files:**
- Create: `src/features/feed/feed-utils.ts`

- [ ] **Step 1: Write the helpers**

```ts
import type { Author, Vote } from "./schema";
import type { Profile } from "@/features/profiles/schema";

/** Short non-crypto id for client-only entities (options, comments, posts). */
export function nid() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

/** Extract a YouTube video id from common URL shapes; "" if none. */
export function youtubeId(url: string): string {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/,
  );
  return m ? m[1] : "";
}

function initials(name: string) {
  return (
    name
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "W"
  );
}

/** Build a feed Author from the signed-in profile (mock). */
export function authorFromProfile(p: Profile | null): Author {
  if (!p) return { name: "You", handle: "you", avatarText: "Y" };
  return {
    name: p.fullName || "Founder",
    handle: p.handle,
    avatarText: initials(p.fullName || "Founder"),
    avatarUrl: p.avatarUrl || undefined,
  };
}

/** Toggle/switch a vote. dir is +1 (up) or -1 (down). Returns the new pair. */
export function applyVote(
  score: number,
  myVote: Vote,
  dir: 1 | -1,
): { score: number; myVote: Vote } {
  const next: Vote = myVote === dir ? 0 : dir;
  return { score: score - myVote + next, myVote: next };
}
```

- [ ] **Step 2: Verify**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit (optional)**

```bash
git add src/features/feed/feed-utils.ts
git commit -m "feat(feed): add feed utilities"
```

---

## Task 4: Feed slice in the store

**Files:**
- Modify: `src/lib/store/app-store.ts`

- [ ] **Step 1: Add imports (top of file, with the existing type imports)**

```ts
import type { FeedPost, PostContent, Vote } from "@/features/feed/schema";
import { nid, authorFromProfile, applyVote } from "@/features/feed/feed-utils";
import { sampleFeed } from "@/lib/sample/sample-feed";
```

- [ ] **Step 2: Extend `AppState` (add to the type, after `startup: Startup | null;`)**

```ts
  posts: FeedPost[];

  addPost: (content: PostContent) => string;
  votePost: (id: string, dir: 1 | -1) => void;
  toggleBookmark: (id: string) => void;
  addComment: (postId: string, body: string) => void;
  voteComment: (postId: string, commentId: string, dir: 1 | -1) => void;
  votePoll: (postId: string, optionId: string) => void;
  answerQuiz: (postId: string, optionId: string) => void;
```

- [ ] **Step 3: Add initial state + actions (inside `create(...)`, after `startup: null,`)**

```ts
      posts: sampleFeed,

      addPost: (content) => {
        const id = nid();
        const author = authorFromProfile(get().profile);
        const post: FeedPost = {
          id,
          author,
          createdAt: new Date().toISOString(),
          content,
          score: 1,
          myVote: 1,
          commentCount: 0,
          comments: [],
          bookmarked: false,
        };
        set((s) => ({ posts: [post, ...s.posts] }));
        return id;
      },

      votePost: (id, dir) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === id ? { ...p, ...applyVote(p.score, p.myVote, dir) } : p,
          ),
        })),

      toggleBookmark: (id) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === id ? { ...p, bookmarked: !p.bookmarked } : p,
          ),
        })),

      addComment: (postId, body) =>
        set((s) => {
          const author = authorFromProfile(get().profile);
          return {
            posts: s.posts.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    commentCount: p.commentCount + 1,
                    comments: [
                      ...p.comments,
                      {
                        id: nid(),
                        author,
                        body,
                        createdAt: new Date().toISOString(),
                        score: 1,
                        myVote: 1 as Vote,
                      },
                    ],
                  }
                : p,
            ),
          };
        }),

      voteComment: (postId, commentId, dir) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: p.comments.map((c) =>
                    c.id === commentId
                      ? { ...c, ...applyVote(c.score, c.myVote, dir) }
                      : c,
                  ),
                }
              : p,
          ),
        })),

      votePoll: (postId, optionId) =>
        set((s) => ({
          posts: s.posts.map((p) => {
            if (p.id !== postId || p.content.kind !== "poll") return p;
            const prev = p.content.myChoice;
            if (prev === optionId) return p; // no re-vote on same option
            const options = p.content.options.map((o) => {
              if (o.id === optionId) return { ...o, votes: o.votes + 1 };
              if (o.id === prev) return { ...o, votes: Math.max(0, o.votes - 1) };
              return o;
            });
            return { ...p, content: { ...p.content, options, myChoice: optionId } };
          }),
        })),

      answerQuiz: (postId, optionId) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === postId && p.content.kind === "quiz"
              ? { ...p, content: { ...p.content, myAnswer: optionId } }
              : p,
          ),
        })),
```

- [ ] **Step 4: Leave `persist` version at 1**

Do NOT bump `version`. Persisted state from `wecos-app-v1` lacks `posts`, so zustand's shallow merge keeps the seeded `sampleFeed`; bumping the version would discard the user's existing profile/startup.

- [ ] **Step 5: Verify**

Run: `npm run lint`
Expected: error only that `@/lib/sample/sample-feed` does not exist yet — resolved in Task 5. (If running tasks in order, do Task 5 next, then re-lint.)

- [ ] **Step 6: Commit (optional)**

```bash
git add src/lib/store/app-store.ts
git commit -m "feat(feed): add feed slice to app store"
```

---

## Task 5: Sample feed data

**Files:**
- Create: `src/lib/sample/sample-feed.ts`

- [ ] **Step 1: Write the seed (one post per kind + a couple extras). Reuse the sample founder authors.**

```ts
import type { FeedPost } from "@/features/feed/schema";

const authors = {
  ritika: { name: "Ritika Jain", handle: "ritika-jain", avatarText: "RJ", verified: true },
  aarav: { name: "Aarav Sharma", handle: "aarav-sharma", avatarText: "AS", verified: true },
  neha: { name: "Dr. Neha Verma", handle: "neha-verma", avatarText: "NV", verified: true },
  kabir: { name: "Kabir Rao", handle: "kabir-rao", avatarText: "KR", verified: true },
  sara: { name: "Sara Khan", handle: "sara-khan", avatarText: "SK", verified: true },
} as const;

/** Fixed ISO timestamps so seed ordering is stable (newest first). */
export const sampleFeed: FeedPost[] = [
  {
    id: "seed-achievement",
    author: authors.aarav,
    createdAt: "2026-06-26T09:00:00.000Z",
    content: {
      kind: "achievement",
      title: "PayNova crossed ₹4,000 Cr annual TPV 🎉",
      detail: "18 months after launch. Thank you to the 120k merchants who trust us.",
      metric: "₹4,000 Cr",
    },
    score: 312,
    myVote: 0,
    commentCount: 1,
    comments: [
      {
        id: "c-1",
        author: authors.kabir,
        body: "Huge. Congrats to the whole team.",
        createdAt: "2026-06-26T10:12:00.000Z",
        score: 8,
        myVote: 0,
      },
    ],
    bookmarked: false,
  },
  {
    id: "seed-poll",
    author: authors.kabir,
    createdAt: "2026-06-25T14:30:00.000Z",
    content: {
      kind: "poll",
      question: "What slows your team down most right now?",
      options: [
        { id: "o1", label: "Hiring", votes: 42 },
        { id: "o2", label: "Distribution", votes: 67 },
        { id: "o3", label: "Product velocity", votes: 51 },
        { id: "o4", label: "Fundraising", votes: 23 },
      ],
    },
    score: 88,
    myVote: 0,
    commentCount: 0,
    comments: [],
    bookmarked: false,
  },
  {
    id: "seed-photo",
    author: authors.ritika,
    createdAt: "2026-06-25T08:15:00.000Z",
    content: {
      kind: "photo",
      body: "First production run of our hand-finished dinnerware. Plastic-free, start to finish.",
      images: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1200&q=70"],
    },
    score: 176,
    myVote: 0,
    commentCount: 0,
    comments: [],
    bookmarked: true,
  },
  {
    id: "seed-quiz",
    author: authors.neha,
    createdAt: "2026-06-24T17:45:00.000Z",
    content: {
      kind: "quiz",
      question: "What share of India's clinics are still paper-only?",
      options: [
        { id: "a", label: "~20%", correct: false },
        { id: "b", label: "~45%", correct: false },
        { id: "c", label: "~70%", correct: true },
        { id: "d", label: "~90%", correct: false },
      ],
      explanation: "Roughly 7 in 10 small clinics run entirely on paper records.",
    },
    score: 64,
    myVote: 0,
    commentCount: 0,
    comments: [],
    bookmarked: false,
  },
  {
    id: "seed-quote",
    author: authors.kabir,
    createdAt: "2026-06-24T11:00:00.000Z",
    content: {
      kind: "quote",
      quote: "The factory is the product.",
      source: "On why manufacturing is the real moat",
    },
    score: 140,
    myVote: 0,
    commentCount: 0,
    comments: [],
    bookmarked: false,
  },
  {
    id: "seed-yt",
    author: authors.sara,
    createdAt: "2026-06-23T19:20:00.000Z",
    content: {
      kind: "ytVideo",
      body: "Loved this breakdown of marketplace liquidity — required watching for founders.",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    score: 51,
    myVote: 0,
    commentCount: 0,
    comments: [],
    bookmarked: false,
  },
  {
    id: "seed-question",
    author: authors.ritika,
    createdAt: "2026-06-23T09:30:00.000Z",
    content: {
      kind: "question",
      body: "D2C founders: what's the one ops tool you wish you'd adopted a year earlier?",
    },
    score: 37,
    myVote: 0,
    commentCount: 0,
    comments: [],
    bookmarked: false,
  },
  {
    id: "seed-text",
    author: authors.neha,
    createdAt: "2026-06-22T15:10:00.000Z",
    content: {
      kind: "text",
      body: "Shipped patient follow-up reminders this week. Early data: 22% fewer missed appointments across our pilot clinics. Small feature, outsized impact.",
    },
    score: 95,
    myVote: 0,
    commentCount: 0,
    comments: [],
    bookmarked: false,
  },
];
```

- [ ] **Step 2: Verify**

Run: `npm run lint`
Expected: no errors. Re-run after Task 4 — store should now resolve the import cleanly.

- [ ] **Step 3: Commit (optional)**

```bash
git add src/lib/sample/sample-feed.ts
git commit -m "feat(feed): seed sample feed posts"
```

---

## Task 6: Post body renderers

**Files:**
- Create: `src/features/feed/post-body.tsx`

- [ ] **Step 1: Write all 9 body components. Each takes `{ post }` and reads `post.content`. Poll/quiz are interactive via the store.**

```tsx
"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/app-store";
import { youtubeId } from "./feed-utils";
import type { FeedPost } from "./schema";

type BodyProps = { post: FeedPost };

function Text({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{children}</p>;
}

export function TextBody({ post }: BodyProps) {
  if (post.content.kind !== "text") return null;
  return <Text>{post.content.body}</Text>;
}

export function PhotoBody({ post }: BodyProps) {
  if (post.content.kind !== "photo") return null;
  const { body, images } = post.content;
  return (
    <div className="space-y-3">
      <Text>{body}</Text>
      <div className={cn("grid gap-1.5 overflow-hidden rounded-xl", images.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} alt="" className="h-full max-h-96 w-full object-cover" />
        ))}
      </div>
    </div>
  );
}

export function YtVideoBody({ post }: BodyProps) {
  if (post.content.kind !== "ytVideo") return null;
  const id = youtubeId(post.content.url);
  return (
    <div className="space-y-3">
      <Text>{post.content.body}</Text>
      {id ? (
        <div className="aspect-video overflow-hidden rounded-xl border border-border">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${id}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Invalid YouTube link.</p>
      )}
    </div>
  );
}

export function VideoBody({ post }: BodyProps) {
  if (post.content.kind !== "video") return null;
  const { body, src, poster } = post.content;
  return (
    <div className="space-y-3">
      <Text>{body}</Text>
      <video controls poster={poster} className="max-h-96 w-full rounded-xl border border-border" src={src} />
    </div>
  );
}

export function PollBody({ post }: BodyProps) {
  const votePoll = useAppStore((s) => s.votePoll);
  if (post.content.kind !== "poll") return null;
  const { question, options, myChoice } = post.content;
  const total = options.reduce((n, o) => n + o.votes, 0) || 1;
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">{question}</p>
      <div className="space-y-2">
        {options.map((o) => {
          const pct = Math.round((o.votes / total) * 100);
          const mine = myChoice === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => votePoll(post.id, o.id)}
              disabled={!!myChoice}
              className={cn(
                "relative w-full overflow-hidden rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                mine ? "border-primary" : "border-border",
                myChoice ? "cursor-default" : "hover:border-primary/60",
              )}
            >
              <span
                className={cn("absolute inset-y-0 left-0 -z-0", mine ? "bg-accent" : "bg-muted")}
                style={{ width: myChoice ? `${pct}%` : 0 }}
                aria-hidden
              />
              <span className="relative z-10 flex items-center justify-between gap-2">
                <span className={cn(mine && "font-medium text-accent-foreground")}>{o.label}</span>
                {myChoice ? <span className="text-xs text-muted-foreground">{pct}%</span> : null}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">{total} {total === 1 ? "vote" : "votes"}</p>
    </div>
  );
}

export function QuoteBody({ post }: BodyProps) {
  if (post.content.kind !== "quote") return null;
  return (
    <figure className="rounded-xl border-l-4 border-primary bg-accent/40 px-4 py-3">
      <blockquote className="font-heading text-lg font-medium text-foreground">“{post.content.quote}”</blockquote>
      <figcaption className="mt-1 text-xs text-muted-foreground">— {post.content.source}</figcaption>
    </figure>
  );
}

export function QuestionBody({ post }: BodyProps) {
  if (post.content.kind !== "question") return null;
  return (
    <div className="rounded-xl bg-accent/40 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">Question</p>
      <p className="mt-1 text-base font-medium text-foreground">{post.content.body}</p>
    </div>
  );
}

export function QuizBody({ post }: BodyProps) {
  const answerQuiz = useAppStore((s) => s.answerQuiz);
  if (post.content.kind !== "quiz") return null;
  const { question, options, explanation, myAnswer } = post.content;
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">{question}</p>
      <div className="space-y-2">
        {options.map((o) => {
          const answered = !!myAnswer;
          const picked = myAnswer === o.id;
          const showRight = answered && o.correct;
          const showWrong = answered && picked && !o.correct;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => answerQuiz(post.id, o.id)}
              disabled={answered}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                showRight && "border-success text-success",
                showWrong && "border-destructive text-destructive",
                !answered && "border-border hover:border-primary/60",
                answered && !showRight && !showWrong && "border-border opacity-70",
              )}
            >
              <span>{o.label}</span>
              {showRight ? <CheckCircle2 className="size-4" /> : showWrong ? <XCircle className="size-4" /> : null}
            </button>
          );
        })}
      </div>
      {myAnswer && explanation ? <p className="text-xs text-muted-foreground">{explanation}</p> : null}
    </div>
  );
}

export function AchievementBody({ post }: BodyProps) {
  if (post.content.kind !== "achievement") return null;
  const { title, detail, metric } = post.content;
  return (
    <div className="rounded-xl border border-[var(--brand-gold)]/40 bg-[var(--brand-gold)]/10 px-4 py-3">
      <div className="flex items-start gap-3">
        {metric ? (
          <span className="font-heading text-xl font-bold text-foreground">{metric}</span>
        ) : null}
        <div>
          <p className="font-medium text-foreground">{title}</p>
          {detail ? <p className="mt-0.5 text-sm text-muted-foreground">{detail}</p> : null}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit (optional)**

```bash
git add src/features/feed/post-body.tsx
git commit -m "feat(feed): add post body renderers"
```

---

## Task 7: Post-type registry

**Files:**
- Create: `src/features/feed/post-types.tsx`

- [ ] **Step 1: Map each kind → label, icon, Body, and a blank-content factory (used by the composer).**

```tsx
import type { ComponentType } from "react";
import { AlignLeft, Image as ImageIcon, Youtube, Video, BarChart3, Quote, HelpCircle, Brain, Trophy } from "lucide-react";
import { nid } from "./feed-utils";
import * as Body from "./post-body";
import type { FeedPost, PostContent, PostType } from "./schema";

export type PostTypeMeta = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  Body: ComponentType<{ post: FeedPost }>;
  blank: () => PostContent;
};

export const postTypes: Record<PostType, PostTypeMeta> = {
  text: { label: "Text", icon: AlignLeft, Body: Body.TextBody, blank: () => ({ kind: "text", body: "" }) },
  photo: { label: "Photo", icon: ImageIcon, Body: Body.PhotoBody, blank: () => ({ kind: "photo", body: "", images: [] }) },
  ytVideo: { label: "YouTube", icon: Youtube, Body: Body.YtVideoBody, blank: () => ({ kind: "ytVideo", body: "", url: "" }) },
  video: { label: "Video", icon: Video, Body: Body.VideoBody, blank: () => ({ kind: "video", body: "", src: "" }) },
  poll: {
    label: "Poll",
    icon: BarChart3,
    Body: Body.PollBody,
    blank: () => ({
      kind: "poll",
      question: "",
      options: [
        { id: nid(), label: "", votes: 0 },
        { id: nid(), label: "", votes: 0 },
      ],
    }),
  },
  quote: { label: "Quote", icon: Quote, Body: Body.QuoteBody, blank: () => ({ kind: "quote", quote: "", source: "" }) },
  question: { label: "Question", icon: HelpCircle, Body: Body.QuestionBody, blank: () => ({ kind: "question", body: "" }) },
  quiz: {
    label: "Quiz",
    icon: Brain,
    Body: Body.QuizBody,
    blank: () => ({
      kind: "quiz",
      question: "",
      options: [
        { id: nid(), label: "", correct: true },
        { id: nid(), label: "", correct: false },
      ],
      explanation: "",
    }),
  },
  achievement: { label: "Achievement", icon: Trophy, Body: Body.AchievementBody, blank: () => ({ kind: "achievement", title: "", detail: "" }) },
};

export const postTypeOrder: PostType[] = [
  "text", "photo", "ytVideo", "video", "poll", "quote", "question", "quiz", "achievement",
];
```

- [ ] **Step 2: Verify**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit (optional)**

```bash
git add src/features/feed/post-types.tsx
git commit -m "feat(feed): add post-type registry"
```

---

## Task 8: Post actions row

**Files:**
- Create: `src/features/feed/post-actions.tsx`

- [ ] **Step 1: Build the Tumblr-style icon row (upvote/downvote/comment/share/bookmark).**

```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowBigDown, ArrowBigUp, Bookmark, BookmarkCheck, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/app-store";
import type { FeedPost } from "./schema";

export function PostActions({ post }: { post: FeedPost }) {
  const votePost = useAppStore((s) => s.votePost);
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);
  const router = useRouter();

  const share = async () => {
    const url = `${window.location.origin}/feed/${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <div className="flex items-center rounded-full bg-muted/60">
        <button
          type="button"
          aria-label="Upvote"
          onClick={() => votePost(post.id, 1)}
          className={cn("rounded-full p-1.5 transition-colors hover:text-primary", post.myVote === 1 && "text-primary")}
        >
          <ArrowBigUp className="size-5" />
        </button>
        <span className={cn("min-w-6 text-center text-sm font-medium tabular-nums", post.myVote === 1 ? "text-primary" : post.myVote === -1 ? "text-destructive" : "text-foreground")}>
          {post.score}
        </span>
        <button
          type="button"
          aria-label="Downvote"
          onClick={() => votePost(post.id, -1)}
          className={cn("rounded-full p-1.5 transition-colors hover:text-destructive", post.myVote === -1 && "text-destructive")}
        >
          <ArrowBigDown className="size-5" />
        </button>
      </div>

      <Link
        href={`/feed/${post.id}`}
        aria-label="Comments"
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm transition-colors hover:bg-muted hover:text-foreground"
      >
        <MessageCircle className="size-5" />
        {post.commentCount > 0 ? <span>{post.commentCount}</span> : null}
      </Link>

      <button
        type="button"
        aria-label="Share"
        onClick={share}
        className="rounded-full p-1.5 transition-colors hover:bg-muted hover:text-foreground"
      >
        <Share2 className="size-5" />
      </button>

      <button
        type="button"
        aria-label="Bookmark"
        onClick={() => toggleBookmark(post.id)}
        className={cn("ml-auto rounded-full p-1.5 transition-colors hover:bg-muted hover:text-foreground", post.bookmarked && "text-primary")}
      >
        {post.bookmarked ? <BookmarkCheck className="size-5" /> : <Bookmark className="size-5" />}
      </button>
    </div>
  );
}
```

Note: `sonner`'s `toast` is already a dependency; `<Toaster />` should be mounted in `app-providers`. If a build error says `Toaster` is missing, add `import { Toaster } from "sonner"` and render `<Toaster richColors position="top-center" />` inside `src/providers/app-providers.tsx`. The `router` import stays for future use; if lint flags it as unused, remove the `useRouter` line.

- [ ] **Step 2: Verify**

Run: `npm run lint`
Expected: no errors (remove `useRouter` if flagged unused).

- [ ] **Step 3: Commit (optional)**

```bash
git add src/features/feed/post-actions.tsx
git commit -m "feat(feed): add post actions row"
```

---

## Task 9: Post card

**Files:**
- Create: `src/features/feed/post-card.tsx`

- [ ] **Step 1: Card shell — header (avatar/name/verified/handle/time/type badge) + Body from registry + actions.**

```tsx
"use client";

import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { postTypes } from "./post-types";
import { PostActions } from "./post-actions";
import type { FeedPost } from "./schema";

export function PostCard({ post, className }: { post: FeedPost; className?: string }) {
  const meta = postTypes[post.content.kind];
  const Body = meta.Body;
  const Icon = meta.icon;

  return (
    <article className={cn("rounded-2xl border border-border bg-card p-4 sm:p-5", className)}>
      <header className="flex items-center gap-3">
        <Link href={`/u/${post.author.handle}`}>
          <Avatar className="size-10">
            {post.author.avatarUrl ? <AvatarImage src={post.author.avatarUrl} alt={post.author.name} /> : null}
            <AvatarFallback>{post.author.avatarText}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <Link href={`/u/${post.author.handle}`} className="truncate font-medium text-foreground hover:underline">
              {post.author.name}
            </Link>
            {post.author.verified ? <BadgeCheck className="size-4 shrink-0 text-primary" /> : null}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            @{post.author.handle} · {formatDistanceToNowStrict(new Date(post.createdAt))} ago
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Icon className="size-3" />
          {meta.label}
        </Badge>
      </header>

      <div className="mt-3">
        <Body post={post} />
      </div>

      <div className="mt-3 border-t border-border pt-2">
        <PostActions post={post} />
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run lint`
Expected: no errors. (Confirm `avatar.tsx` exports `Avatar`, `AvatarFallback`, `AvatarImage` and `badge.tsx` accepts `variant="secondary"` — both exist; if `secondary` is not a badge variant, use the default variant.)

- [ ] **Step 3: Commit (optional)**

```bash
git add src/features/feed/post-card.tsx
git commit -m "feat(feed): add post card shell"
```

---

## Task 10: Composer (Facebook-style)

**Files:**
- Create: `src/features/feed/post-composer.tsx`

- [ ] **Step 1: Collapsed bar + dialog with 9-type switcher and per-kind fields (switch on `draft.kind`).**

```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppStore } from "@/lib/store/app-store";
import { authorFromProfile } from "./feed-utils";
import { postTypes, postTypeOrder } from "./post-types";
import type { PostContent, PostType } from "./schema";

const QUICK: PostType[] = ["photo", "ytVideo", "poll", "quote", "achievement"];

function isComplete(c: PostContent): boolean {
  switch (c.kind) {
    case "text": return c.body.trim().length > 0;
    case "photo": return c.images.filter(Boolean).length > 0 || (c.body ?? "").trim().length > 0;
    case "ytVideo": return c.url.trim().length > 0;
    case "video": return c.src.trim().length > 0;
    case "poll": return c.question.trim().length > 0 && c.options.filter((o) => o.label.trim()).length >= 2;
    case "quote": return c.quote.trim().length > 0;
    case "question": return c.body.trim().length > 0;
    case "quiz": return c.question.trim().length > 0 && c.options.filter((o) => o.label.trim()).length >= 2;
    case "achievement": return c.title.trim().length > 0;
  }
}

export function PostComposer() {
  const profile = useAppStore((s) => s.profile);
  const addPost = useAppStore((s) => s.addPost);
  const author = authorFromProfile(profile);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<PostContent>(postTypes.text.blank());

  const launch = (kind: PostType) => {
    setDraft(postTypes[kind].blank());
    setOpen(true);
  };

  const submit = () => {
    if (!isComplete(draft)) return;
    addPost(draft);
    setOpen(false);
    setDraft(postTypes.text.blank());
  };

  const firstName = (profile?.fullName ?? "there").split(" ")[0];

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            {author.avatarUrl ? <AvatarImage src={author.avatarUrl} alt={author.name} /> : null}
            <AvatarFallback>{author.avatarText}</AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => launch("text")}
            className="flex-1 rounded-full bg-muted px-4 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/70"
          >
            Share something, {firstName}…
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1 border-t border-border pt-2">
          {QUICK.map((k) => {
            const Icon = postTypes[k].icon;
            return (
              <Button key={k} variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => launch(k)}>
                <Icon className="size-4" />
                {postTypes[k].label}
              </Button>
            );
          })}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create post</DialogTitle>
          </DialogHeader>

          <div className="flex flex-wrap gap-1">
            {postTypeOrder.map((k) => {
              const Icon = postTypes[k].icon;
              const active = draft.kind === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setDraft(postTypes[k].blank())}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                    active ? "border-primary bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5" />
                  {postTypes[k].label}
                </button>
              );
            })}
          </div>

          <div className="space-y-3 overflow-y-auto">
            <ComposerFields draft={draft} setDraft={setDraft} />
          </div>

          <div className="flex justify-end">
            <Button onClick={submit} disabled={!isComplete(draft)}>Post</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ComposerFields({ draft, setDraft }: { draft: PostContent; setDraft: (c: PostContent) => void }) {
  switch (draft.kind) {
    case "text":
      return <Textarea autoFocus rows={4} placeholder="What's on your mind?" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />;
    case "question":
      return <Textarea autoFocus rows={3} placeholder="Ask the community a question…" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />;
    case "photo":
      return (
        <>
          <Textarea rows={2} placeholder="Say something about this photo…" value={draft.body ?? ""} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          <Input autoFocus placeholder="Image URL" value={draft.images[0] ?? ""} onChange={(e) => setDraft({ ...draft, images: e.target.value ? [e.target.value] : [] })} />
        </>
      );
    case "ytVideo":
      return (
        <>
          <Textarea rows={2} placeholder="Add a comment…" value={draft.body ?? ""} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          <Input autoFocus placeholder="YouTube URL" value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} />
        </>
      );
    case "video":
      return (
        <>
          <Textarea rows={2} placeholder="Add a comment…" value={draft.body ?? ""} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          <Input autoFocus placeholder="Video file URL (.mp4)" value={draft.src} onChange={(e) => setDraft({ ...draft, src: e.target.value })} />
        </>
      );
    case "quote":
      return (
        <>
          <Textarea autoFocus rows={3} placeholder="The quote…" value={draft.quote} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} />
          <Input placeholder="Attribution / source" value={draft.source} onChange={(e) => setDraft({ ...draft, source: e.target.value })} />
        </>
      );
    case "achievement":
      return (
        <>
          <Input autoFocus placeholder="What did you achieve?" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          <Input placeholder="Metric (optional, e.g. ₹4,000 Cr)" value={draft.metric ?? ""} onChange={(e) => setDraft({ ...draft, metric: e.target.value })} />
          <Textarea rows={2} placeholder="Details (optional)" value={draft.detail ?? ""} onChange={(e) => setDraft({ ...draft, detail: e.target.value })} />
        </>
      );
    case "poll":
      return (
        <>
          <Input autoFocus placeholder="Poll question" value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} />
          {draft.options.map((o, i) => (
            <Input
              key={o.id}
              placeholder={`Option ${i + 1}`}
              value={o.label}
              onChange={(e) =>
                setDraft({ ...draft, options: draft.options.map((x) => (x.id === o.id ? { ...x, label: e.target.value } : x)) })
              }
            />
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setDraft({ ...draft, options: [...draft.options, { id: crypto.randomUUID?.() ?? String(draft.options.length), label: "", votes: 0 }] })}
          >
            + Add option
          </Button>
        </>
      );
    case "quiz":
      return (
        <>
          <Input autoFocus placeholder="Quiz question" value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} />
          {draft.options.map((o, i) => (
            <div key={o.id} className="flex items-center gap-2">
              <Input
                placeholder={`Answer ${i + 1}`}
                value={o.label}
                onChange={(e) =>
                  setDraft({ ...draft, options: draft.options.map((x) => (x.id === o.id ? { ...x, label: e.target.value } : x)) })
                }
              />
              <label className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                <input
                  type="radio"
                  name="quiz-correct"
                  checked={o.correct}
                  onChange={() => setDraft({ ...draft, options: draft.options.map((x) => ({ ...x, correct: x.id === o.id })) })}
                />
                Correct
              </label>
            </div>
          ))}
          <Textarea rows={2} placeholder="Explanation (shown after answering)" value={draft.explanation ?? ""} onChange={(e) => setDraft({ ...draft, explanation: e.target.value })} />
        </>
      );
  }
}
```

Note: `crypto.randomUUID?.()` in the poll "add option" handler avoids importing `nid` into a client edge case; if you prefer, import `nid` from `./feed-utils` and use it. Confirm `Dialog` accepts `open` / `onOpenChange` props (base-ui `Dialog.Root` uses these names — verify against the docs; if base-ui uses `open`/`onOpenChange` they pass straight through `DialogPrimitive.Root`).

- [ ] **Step 2: Verify**

Run: `npm run lint`
Expected: no errors. Confirm `Textarea` (`textarea.tsx`) and `Input` (`input.tsx`) exist — both do.

- [ ] **Step 3: Commit (optional)**

```bash
git add src/features/feed/post-composer.tsx
git commit -m "feat(feed): add facebook-style multi-type composer"
```

---

## Task 11: Comment thread + single-post + feed views + routes + nav

**Files:**
- Create: `src/features/feed/comment-thread.tsx`
- Create: `src/features/feed/feed-view.tsx`
- Create: `src/features/feed/single-post-view.tsx`
- Create: `src/app/(app)/feed/layout.tsx`
- Create: `src/app/(app)/feed/page.tsx`
- Create: `src/app/(app)/feed/[id]/page.tsx`
- Modify: `src/components/app/dashboard-shell.tsx`

- [ ] **Step 1: Comment thread (`comment-thread.tsx`)**

```tsx
"use client";

import { useState } from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store/app-store";
import type { FeedPost } from "./schema";

export function CommentThread({ post }: { post: FeedPost }) {
  const addComment = useAppStore((s) => s.addComment);
  const voteComment = useAppStore((s) => s.voteComment);
  const [body, setBody] = useState("");

  const submit = () => {
    if (!body.trim()) return;
    addComment(post.id, body.trim());
    setBody("");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <Textarea rows={2} placeholder="Add a comment…" value={body} onChange={(e) => setBody(e.target.value)} />
        <div className="mt-2 flex justify-end">
          <Button size="sm" onClick={submit} disabled={!body.trim()}>Comment</Button>
        </div>
      </div>

      {post.comments.length === 0 ? (
        <p className="px-1 text-sm text-muted-foreground">No comments yet. Be the first.</p>
      ) : (
        <ul className="space-y-3">
          {post.comments.map((c) => (
            <li key={c.id} className="flex gap-3 rounded-2xl border border-border bg-card p-4">
              <Avatar className="size-8">
                <AvatarFallback>{c.author.avatarText}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium text-foreground">{c.author.name}</span>{" "}
                  <span className="text-xs text-muted-foreground">@{c.author.handle} · {formatDistanceToNowStrict(new Date(c.createdAt))} ago</span>
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{c.body}</p>
                <div className="mt-1.5 flex items-center gap-1 text-muted-foreground">
                  <button type="button" aria-label="Upvote comment" onClick={() => voteComment(post.id, c.id, 1)} className={cn("rounded p-1 hover:text-primary", c.myVote === 1 && "text-primary")}>
                    <ArrowBigUp className="size-4" />
                  </button>
                  <span className="min-w-5 text-center text-xs tabular-nums">{c.score}</span>
                  <button type="button" aria-label="Downvote comment" onClick={() => voteComment(post.id, c.id, -1)} className={cn("rounded p-1 hover:text-destructive", c.myVote === -1 && "text-destructive")}>
                    <ArrowBigDown className="size-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Feed timeline (`feed-view.tsx`)**

```tsx
"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store/app-store";
import { PostComposer } from "./post-composer";
import { PostCard } from "./post-card";
import type { FeedPost } from "./schema";

function List({ posts }: { posts: FeedPost[] }) {
  if (posts.length === 0) {
    return <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Nothing here yet.</p>;
  }
  return (
    <div className="space-y-4">
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}

export function FeedView() {
  const posts = useAppStore((s) => s.posts);
  const profile = useAppStore((s) => s.profile);
  const myHandle = profile?.handle;

  const following = posts.filter((p) => p.author.handle !== myHandle); // mock: "everyone you follow"
  const bookmarks = posts.filter((p) => p.bookmarked);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-2xl font-bold tracking-tight">Feed</h1>
      <PostComposer />
      <Tabs defaultValue="foryou" className="gap-4">
        <TabsList>
          <TabsTrigger value="foryou">For you</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        </TabsList>
        <TabsContent value="foryou"><List posts={posts} /></TabsContent>
        <TabsContent value="following"><List posts={following} /></TabsContent>
        <TabsContent value="bookmarks"><List posts={bookmarks} /></TabsContent>
      </Tabs>
    </div>
  );
}
```

Note: base-ui `Tabs` uses `value`/`defaultValue` on Root and `value` on each `Tab`/`Panel`. Confirm against `tabs.tsx` usage elsewhere; the prop is `defaultValue` on `Tabs` and `value` on `TabsTrigger`/`TabsContent`.

- [ ] **Step 3: Single-post view (`single-post-view.tsx`)**

```tsx
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { PostCard } from "./post-card";
import { CommentThread } from "./comment-thread";

export function SinglePostView({ id }: { id: string }) {
  const post = useAppStore((s) => s.posts.find((p) => p.id === id));

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Link href="/feed" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to feed
        </Link>
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">This post doesn't exist or was removed.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link href="/feed" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to feed
      </Link>
      <PostCard post={post} />
      <CommentThread post={post} />
    </div>
  );
}
```

- [ ] **Step 4: Feed layout (`app/(app)/feed/layout.tsx`) — inherit the dashboard shell**

```tsx
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/app/dashboard-shell";

export default function FeedLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
```

- [ ] **Step 5: Feed page (`app/(app)/feed/page.tsx`)**

```tsx
import { FeedView } from "@/features/feed/feed-view";

export default function FeedPage() {
  return <FeedView />;
}
```

- [ ] **Step 6: Single-post page (`app/(app)/feed/[id]/page.tsx`)**

In this modified Next.js, route `params` are async — read `node_modules/next/dist/docs/` to confirm the exact signature, then:

```tsx
import { SinglePostView } from "@/features/feed/single-post-view";

export default async function FeedPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SinglePostView id={id} />;
}
```

If the docs show `params` is synchronous in this version, drop `async`/`await` and type it `{ params: { id: string } }`.

- [ ] **Step 7: Add the Feed nav entry (`dashboard-shell.tsx`)**

Edit the `nav` array (currently lines 22-26) and the `lucide-react` import (line 7).

Import — add `Newspaper`:
```ts
import { Building2, LayoutDashboard, LogOut, Newspaper, User } from "lucide-react";
```

Nav array — insert Feed after Overview:
```ts
const nav = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Feed", href: "/feed", icon: Newspaper },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Startup", href: "/dashboard/startup", icon: Building2 },
];
```

- [ ] **Step 8: Verify**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 9: Commit (optional)**

```bash
git add src/features/feed src/app/\(app\)/feed src/components/app/dashboard-shell.tsx
git commit -m "feat(feed): add feed timeline, single-post page, comments, routes, nav"
```

---

## Task 12: Build + manual verification

**Files:** none (verification only)

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: build succeeds with no type errors. Fix any reported errors at their source.

- [ ] **Step 2: Start the preview and sign in**

Start the dev server (preview tools). Sign up / sign in (mock), complete onboarding, then navigate to `/feed`.

- [ ] **Step 3: Walk the checklist** (against the spec's Testing section)

- Feed renders the seeded posts; the composer bar shows at top with quick-type chips.
- Composer opens; each of the 9 types accepts input; **Post** is disabled until valid; posting prepends the new post (authored by you, score 1).
- Upvote/downvote toggles and switches; the score updates and tints (primary/destructive).
- Poll: clicking an option records the vote, fills the bars, shows %, locks further voting.
- Quiz: answering reveals correct (green) / wrong (red) + explanation.
- Comment from `/feed/[id]` appends to the thread and bumps the comment count; comment up/down vote works.
- Share copies the post link (toast).
- Bookmark toggles; the **Bookmarks** tab filters to bookmarked posts; **Following** excludes your own posts.
- `/feed/<unknown>` shows the not-found state.
- Feed nav entry appears in the desktop sidebar and the mobile bottom bar; active state highlights on `/feed`.
- Dark mode (`ThemeToggle`) and mobile width hold; no hardcoded colors leak.

- [ ] **Step 4: Capture proof**

Take a preview screenshot of the feed (light + dark) and the open composer to share with the user.

- [ ] **Step 5: Commit (optional)**

```bash
git add -A
git commit -m "test(feed): verified feed system end-to-end"
```

---

## Self-review (done while writing)

- **Spec coverage:** data model (T2) · store actions incl. votePoll/answerQuiz/voteComment (T4) · sample data all 9 kinds (T5) · registry (T7) · composer FB-style + 9 types (T10) · upvote/downvote/comment/share/bookmark row (T8) · post card (T9) · single post + flat comments (T11) · routes + nav + shell inheritance (T11) · dialog primitive (T1) · manual verification (T12). All spec sections map to a task.
- **Placeholder scan:** no TBD/TODO; every code step has complete code.
- **Type consistency:** `content.kind` discriminant used everywhere; store signatures (`addPost(content)`, `votePost(id,dir)`, `votePoll`, `answerQuiz`, `voteComment`) match their call sites in bodies/actions/composer/comment-thread; `Vote` type reused; `authorFromProfile`/`applyVote`/`nid`/`youtubeId` defined in T3 and imported where used.
- **Known verify-against-docs points (flagged inline):** base-ui `Dialog` open/onOpenChange prop names; base-ui `Tabs` value/defaultValue; Next route `params` sync vs async. Each task says what to check and the fallback.
```
