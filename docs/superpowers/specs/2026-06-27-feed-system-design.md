# Feed System — Design Spec

**Date:** 2026-06-27
**Scope:** Three screens — the feed timeline, the Add-Post composer, and the single feed-post page.
**Status:** Approved for planning.

## Goal

Add a social feed to the logged-in WeCos workspace. Founders post updates in
several formats, vote on each other's posts, comment, share, and bookmark.
Composer layout is Facebook-inspired (collapsed bar that opens a dialog); the
action-row icons follow Tumblr's clean line-icon style. Engagement model is
Reddit/Product-Hunt style upvote/downvote (the existing `startup.upvotes` data
shape already fits).

## Constraints

- **Mock-store, client-side only.** No backend, no Supabase, no Prisma. Posts
  live in the Zustand `useAppStore`, seeded from sample data — consistent with
  the rest of the app today. Designed so a backend can be swapped in later
  without touching the view layer.
- **Modified Next.js.** Read `node_modules/next/dist/docs/` before writing any
  route/page code (per `AGENTS.md`). Heed deprecation notices.
- **base-ui primitives** use the `render` prop, not `asChild`.
- **Design tokens only** — never hardcode colors. Reference the semantic tokens
  in `globals.css` (purple `--primary`, gold `--brand-gold`, etc.).
- Follow the existing `features/<domain>/` module pattern and the
  `dashboard-shell` layout (sidebar nav + mobile bottom bar).

## Architecture — discriminated union + type registry

One `FeedPost` carries a `type` discriminant and a `content` payload union.
A `postTypeRegistry` maps each `type` → `{ icon, label, ComposerFields, PostBody }`.
The feed card, single-post page, and composer are **type-agnostic shells** that
read from the registry. Adding a new post type = one registry entry plus its
fields/body components. No `switch` statements scattered across screens.

Rejected alternatives: per-type components with a big `switch` (the switch
lives in 3 places and grows tangled); Notion-style block arrays (overkill,
messy composer for MVP).

## Post types (9)

| type          | content payload                                              | body render                          |
|---------------|--------------------------------------------------------------|--------------------------------------|
| `text`        | `{ body }`                                                   | rich-ish text block                  |
| `photo`       | `{ body?, images[] }`                                        | text + image grid                    |
| `ytVideo`     | `{ body?, url }`                                             | text + embedded YouTube              |
| `video`       | `{ body?, src, poster? }`                                    | text + `<video>` player              |
| `poll`        | `{ question, options[{id,label,votes}], myChoice? }`         | question + votable option bars       |
| `quote`       | `{ quote, source }`                                          | large quote + attribution            |
| `question`    | `{ body }`                                                   | prompt styled as an ask; answers go in comments |
| `quiz`        | `{ question, options[{id,label,correct}], explanation? }`    | answer, then reveal correct + note   |
| `achievement` | `{ title, detail?, metric? }`                                | milestone/badge card (startup wins)  |

## Data model — `src/features/feed/schema.ts`

```
FeedPost = {
  id: string
  author: Author            // { name, handle, avatarText, avatarUrl?, verified? }
  createdAt: string         // ISO; rendered as relative time
  type: PostType
  content: PostContent      // discriminated union keyed by `type`
  score: number             // upvotes - downvotes
  myVote: 1 | 0 | -1
  commentCount: number
  comments: Comment[]
  bookmarked: boolean
}

Comment = {
  id: string
  author: Author
  body: string
  createdAt: string
  score: number
  myVote: 1 | 0 | -1
}
```

Comments are **flat** for MVP (no nested replies — that's a later iteration).
Zod schemas back the composer drafts for per-type validation.

## Store — feed slice in `app-store.ts`

Add to `useAppStore`:

- `posts: FeedPost[]` — seeded from `sample-feed.ts`
- `vote(id, dir: 1 | -1)` — toggles/switches the current user's vote, updates `score` + `myVote`
- `addPost(draft)` — prepends a new post authored by the current profile
- `addComment(postId, body)` — appends a flat comment, bumps `commentCount`
- `voteComment(postId, commentId, dir)`
- `toggleBookmark(id)`
- `votePoll(postId, optionId)` / `answerQuiz(postId, optionId)` — record the user's choice locally

## Routes (in the `(app)` route group)

- `/feed` → `feed-view.tsx`: composer bar on top, then the timeline.
  Tabs: **For you / Following / Bookmarks** (Tabs component already exists).
- `/feed/[id]` → `single-post-view.tsx`: the full post, a comment composer,
  then the flat comment thread.
- Add **Feed** (`MessageSquare`/`Newspaper` icon) to the `dashboard-shell` nav
  array — appears in both the desktop sidebar and the mobile bottom bar.

## Add Post — Facebook-inspired composer (`post-composer.tsx`)

- **Collapsed bar** at the top of the feed: avatar + muted prompt
  ("Share something, {firstName}…") + a row of quick-type chips
  (Photo · Video · Poll · Quote · Achievement…). Clicking the bar or any chip
  opens the dialog (chip pre-selects that type).
- **Dialog** (needs a new `ui/dialog.tsx` built on base-ui — not present yet):
  author header → a type-switcher row of 9 icon tabs → the active type's fields
  (pulled from `postTypeRegistry[type].ComposerFields`) → **Post** button.
  Validation via the type's zod schema; Post is disabled until valid.

## Post card (`post-card.tsx`)

Shell used by both the timeline and the single-post page:

1. **Header** — avatar, name (+ verified tick), handle, relative time, a small
   type badge, and a `⋯` menu (bookmark/share/report placeholders).
2. **Body** — `postTypeRegistry[post.type].PostBody` renders the payload
   (`post-body/*.tsx`, one file per type).
3. **Action row** (`post-actions.tsx`) — Tumblr-style line icons:
   - Upvote `ArrowBigUp` · live score · Downvote `ArrowBigDown`
   - Comment `MessageCircle` (count) — links to `/feed/[id]`
   - Share `Share2`
   - Bookmark `Bookmark` / `BookmarkCheck` when active

Active vote state tints with `--primary` (up) / `--destructive` (down).

## Single post page (`single-post-view.tsx`)

The post card (expanded, full body) + a comment composer (textarea + Post) +
the flat comment list. Each comment shows author, relative time, body, and its
own up/down vote control. Unknown `[id]` → a not-found state.

## Files

```
src/features/feed/
  schema.ts              # types + zod
  post-types.tsx         # postTypeRegistry (icon/label/ComposerFields/PostBody per type)
  post-composer.tsx      # collapsed bar + dialog
  post-card.tsx          # card shell
  post-actions.tsx       # upvote/downvote/comment/share/bookmark row
  comment-thread.tsx     # comment composer + flat list
  feed-view.tsx          # timeline + tabs
  single-post-view.tsx   # post + comments
  post-body/
    text.tsx photo.tsx yt-video.tsx video.tsx poll.tsx
    quote.tsx question.tsx quiz.tsx achievement.tsx
src/app/(app)/feed/
  page.tsx               # renders feed-view
  [id]/page.tsx          # renders single-post-view
src/lib/sample/sample-feed.ts   # seed posts across all 9 types
src/components/ui/dialog.tsx     # new base-ui dialog primitive
# edit: src/lib/store/app-store.ts (feed slice)
# edit: src/components/app/dashboard-shell.tsx (nav entry)
```

## Testing / verification

Manual via the preview tools after build:
- Composer opens, each of the 9 types accepts input and posts to the top of the feed.
- Upvote/downvote toggles and switches correctly; score updates.
- Comment adds to the thread and bumps the count; comment votes work.
- Bookmark toggles and the Bookmarks tab filters correctly.
- Poll voting and quiz answering record and reveal state.
- `/feed/[id]` renders the full post + comments; unknown id shows not-found.
- Dark mode + mobile (bottom-nav) layouts hold.

## Out of scope (later iterations)

Nested comment replies, real backend/persistence + RLS, image/video upload to
storage (composer takes URLs/local previews for now), notifications, post
editing/deletion beyond the author's own, feed pagination/infinite scroll,
following-graph wiring (the "Following" tab uses sample relationships for now).
