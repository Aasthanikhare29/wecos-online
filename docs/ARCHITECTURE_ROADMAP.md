# WeCos Platform — Architecture & Phased Roadmap

> Status: DRAFT v1 (planning only — no implementation). Owner: Architecture.
> Guiding principle: **optimize for 10× less technical debt, not the fastest MVP.**
> Every decision answers: *"Will this save engineering time/money/rewrites 6 months from now?"* If yes, build the foundation now; if no, defer behind an interface.

---

## 0. Reconciliations (scope conflicts resolved before planning)

**R1 — The "Studio" name collision.**
- Business plan: **"WeCos Studios"** = WeCos's own paid service arms (Marketing/HR/Finance/Legal/Capital). A revenue vertical.
- This spec: **"Studio"** = a *user-created* company page (LinkedIn Company / Facebook Page). The Phase-1 entity.
- **Decision:** the generic, ownable container entity is internally named **`space`**. A founder's company page is a `space` of `type = 'studio'` (user-facing label "Studio"). WeCos's own service arms stay a **marketing/content concept ("Services")**, *not* a core DB entity. This prevents a permanent code/DB ambiguity. (ADR-0002.)

**R2 — Payments/Membership is missing from the 5-phase spec but is business-critical.**
- The 5 phases (Studio → Network → Events → Clubs → AI) describe the **social substrate**. The business plan is **money-first**: the ₹3,650 membership gates the product and the Month 1–2 launch depends on it; the security mandate makes payments load-bearing.
- **Decision:** treat **Billing/Membership as a Phase-0 foundational system**, not a late phase. Revenue modules (Membership, Validation Engine, Marketplace, Coffee Clubs = Events+Clubs, Learning = Events) **map onto** the substrate rather than replacing the phase order. Mapping called out per phase.

**R3 — Implied-but-unlisted systems** (flagged in Architecture Review, §4): Direct Messaging, Marketplace, Validation Engine, onboarding/email funnel, i18n, GDPR export/delete.

---

## 1. The Core Architectural Bet (the single "build-once" lever)

Everything cross-cutting — comments, reactions, media, reports, activity, notifications, search, mentions, hashtags, embeddings — must attach to **many** content types (profile, space, post, event, club, comment). How we model that relationship is *the* decision that determines whether each system is built once or N times.

**Decision (ADR-0001): discriminated polymorphism via an `entity_type` enum + `entity_id uuid`.**

Every first-class object is addressable as `(entity_type, entity_id)`. Cross-cutting tables carry that pair.

Options considered:
- **(A) Global `nodes` table** — every object FKs to one node row. True FK integrity, single join target. Cost: extra insert + join per object.
- **(B) Discriminated polymorphism** — `(entity_type enum, entity_id uuid)` on cross-cutting tables; no global table. Integrity via triggers + RLS + app guards; composite/partial indexes per type. ✅ **chosen**
- **(C) Per-type join tables** (post_comments, event_comments…) — FK-clean but multiplies tables and kills reuse. ❌

**Why (B):** Postgres cannot FK to a polymorphic pair regardless; (B) scales to billions of attachments with partial indexes; adding a new content type later = **add one enum value, zero migration** of cross-cutting tables; it's the convergent pattern across social platforms (mirrors LinkedIn's URN scheme). Integrity is enforced with per-type triggers + RLS + the service layer.

**Consequence:** comments, reactions, reports, media attachments, mentions, activity, notifications, and search are each built **exactly once**. Every future entity plugs in for free.

---

## 2. Foundational Systems (built before/independent of features)

| System | Built | Powers later | Core tables |
|---|---|---|---|
| Identity & Auth | P0 | everything | `auth.users` (Supabase), `profiles` |
| Profiles & Settings | P0 | all | `profiles`, generic `settings(scope_type,scope_id,key,value)`, `user_settings` |
| **RBAC: Spaces & Memberships** | P0 | Studio admins, Event organizers, Club roles, Moderators | `spaces`, `memberships(user,scope_type,scope_id,role,status)`, `role_permissions` |
| Media Service | P0 | avatars, logos, post media, event covers, club files | `media`, `media_attachments(media,entity_type,entity_id,role,position)` |
| Social Graph | P0 schema / P2 UI | follow, connect, block, privacy | `relationships(source,target,type,status)` |
| **Activity Stream** | P0 (emit early) | Feed, Notifications, Audit-ish, Analytics, AI | `activities(actor,verb,object_*,target_*,metadata)` append-only |
| Notification Engine | P0 skeleton / P2 live | all engagement | `notifications`, `notification_preferences`; channels: in-app→email→push→SMS |
| Search | P0 abstraction | directory, people, posts, events, clubs | `search_index(entity_type,entity_id,tsv,visibility,...)` via triggers; provider iface |
| Comments | P2 (reusable) | posts, events, clubs | `comments(author,entity_type,entity_id,parent_id,body)` |
| Reactions | P2 (reusable) | everything | `reactions(user,entity_type,entity_id,type)` unique |
| Reporting & Moderation | P0 schema / grows | studios→posts→clubs | `reports`, `moderation_actions`, mod queue |
| Audit Log | P0 | security/compliance | `audit_log` immutable, admin-RLS (distinct from activity) |
| Feature Flags | P0 | gradual rollout of every phase | `feature_flags`, `feature_overrides` |
| **Billing/Membership** | P0 (flagged add) | membership, paid events, marketplace | `subscriptions`, `orders`, `payments`, `idempotency_keys`, `seat_allocations` |
| API/service layer | P0 | all | `/lib/server/services/*`, generic polymorphic endpoints |
| Design System | P0 → grows | all UI | tokens, primitives, polymorphic business components |

**Why emit Activity in Phase 1 even before Feed exists:** the event stream is the source of truth for Feed (P2), Notifications (P2), Analytics, and AI signal (P5). If we don't record `studio.created` / `profile.updated` from day 1, that history is unrecoverable. Feed *delivery* (fan-out-on-read → hybrid fan-out-on-write) is a later **delivery-layer** change on top of the same event source — not a schema rewrite.

**Why Spaces/Memberships now (only Studio uses it in P1):** Studio-admin, Event-organizer (P3), and Club-roles/moderators (P4) are the *same* machinery — `(user, scope, role)`. Build the abstraction once; later phases add a `scope_type`, not a new permission system. This is the "permissions scale naturally" win.

---

## 3. Phase-by-Phase Plan

### Phase 0 — Platform Foundations *(invisible; prevents rewrites)*
1. **Goal:** lay the cross-cutting substrate so P1–P5 plug in by adding enum values + UI, never re-architecting.
2. **Features:** none user-facing (except auth + membership checkout, which P1 needs).
3. **Foundation work:** entity-type convention (ADR-0001); auth+profiles; Spaces/Memberships RBAC; Media service; Activity stream; Notification skeleton + in-app channel; Search index abstraction; Audit log; Feature flags; generic settings; **security infra** (server-only mutations, rate-limit store, CSP/headers, startup secret validation, idempotency) per the security mandate; **billing primitives** + Razorpay + founding-500 atomic `seat_allocations`.
4. **Database:** all foundation tables above; `entity_type` enum seeded with `profile, space`; every table gets `id, created_at, updated_at, created_by, deleted_at` (soft-delete + audit cols mandated). RLS deny-by-default on all.
5. **APIs:** service layer + middleware (Zod validation, cursor pagination, error normalization, rate limiting); scaffolded generic endpoints `/comments`, `/reactions`, `/media`, `/reports`, `/search`.
6. **Components:** design tokens, primitives (Button/Input/Card/Dialog/…), `MediaUploader`, `EntityCard` shell, `SettingsForm`.
7. **Risks:** over-engineering ahead of need. **Mitigation:** build *schema + interfaces*, not speculative UI; flags keep unfinished systems dark.
8. **Future compatibility:** every later phase = `ALTER TYPE entity_type ADD VALUE …` + wire UI. No cross-cutting migration.

### Phase 1 — Studio *(business: Month 1–2 launch + Founder Page + Membership)*
1. **Goal:** founders get an identity and a public company page; a searchable directory goes live; membership monetizes from day 1.
2. **Features:** account, profile, create studio (`space type=studio`), public listing, directory browse + filter + search, **membership checkout** (₹3,650, founding-500 cap).
3. **Foundation consumed:** Spaces/Memberships (studio = first space; owner+admin roles), Media (logo/cover/avatar), Search (directory = first consumer), Activity (`studio.created`), Audit, Billing (membership), RLS ownership.
4. **Database:** `space_profiles` (subtype attrs in jsonb + typed columns), `memberships` (owner/admin), `search_index` rows for studios+profiles. Indexes: directory filters (GIN on tsv, btree on city/category/created_at), `memberships(scope_type,scope_id)`, `relationships` pre-created.
5. **APIs:** `spaces` CRUD (service layer, server-only writes), directory query (cursor + FTS + facets), membership invite, billing webhook (signature+idempotency).
6. **Components:** `StudioCard` (= `EntityCard` variant), `DirectoryGrid`, `MediaUploader`, `ProfileForm`, `MemberList`, `PricingCard`/checkout — **all reused in P3/P4**.
7. **Risks:** directory search scaling (mitigated by search abstraction → swappable backend); space-type rigidity (mitigated by `type` enum + jsonb attributes); founding-500 race (atomic seat allocation, §1 security memory).
8. **Future compatibility:** Club & Event are *also* spaces → they inherit memberships/roles/media/search with zero new permission code.

### Phase 2 — Network + Feed
1. **Goal:** social graph + content engine — the retention layer.
2. **Features:** connect/follow/block, posts (text/image/video), likes, comments, shares/reposts, mentions, hashtags, notifications.
3. **Foundation consumed:** relationships (graph activates), activity (feed source), comments, reactions, media (post media), notifications (go live), search (posts+people), mentions→notifications.
4. **Database:** `posts` **(carries `scope_type/scope_id` nullable from day 1 — see future-proofing call)**, `media_attachments` for post media, `hashtags` + `entity_hashtags`, `mentions(entity_type,entity_id,mentioned_user)`, `feed_entries` (only if/when fan-out-on-write needed), shares = `posts.repost_of`. Rich content stored as **Tiptap JSON in jsonb**, never raw HTML (XSS + flexibility).
5. **APIs:** feed (cursor; fan-out-on-read first), posts CRUD, **generic** `/comments` & `/reactions` now wired to real entities, follow/connect, notifications stream (Supabase Realtime).
6. **Components:** `FeedItem`, `Composer` (Tiptap), `CommentThread`, `ReactionBar`, `NotificationCenter`, `MentionInput`, `HashtagChip`, `ShareDialog` — **reused by Events & Clubs verbatim**.
7. **Risks:** feed scaling (fan-out strategy), notification storms (batch/dedup/coalesce), mention/hashtag abuse (rate-limit + honeypot per mandate).
8. **Future compatibility:** Event discussion (P3) and Club posts (P4) are the *same* posts/comments/reactions polymorphic system, scoped by `scope_*`.

### Phase 3 — Events *(business: Coffee Clubs meetups + paid bootcamps/ticketing)*
1. **Goal:** events with RSVP, invites, attendees, discussion; paid ticketing reuses billing.
2. **Features:** create event, RSVP/join, invite, attendee list, event discussion, (paid tickets).
3. **Foundation consumed:** Spaces (event = space, organizer role via memberships), media (cover), activity (`event.created`,`rsvp`), notifications (invites/reminders), comments (discussion), search (discovery), billing (paid tickets reuse `orders`/`payments`).
4. **Database:** `events` (space subtype: `starts_at, ends_at, timezone, location/geo, capacity, visibility, rrule` for recurrence), `rsvps(event,user,status)`, `invitations`. Capacity guarded atomically (same pattern as founding-500).
5. **APIs:** events CRUD, RSVP, invite, attendees, discovery/calendar query.
6. **Components:** `EventCard`, `RSVPControl`, `AttendeeList` (= `MemberList`), `EventDiscussion` (= `CommentThread`), `Calendar`.
7. **Risks:** capacity race (atomic), timezones, recurring events (model `rrule` now to avoid migration).
8. **Future compatibility:** Club events (P4) reuse this; ticketed events reuse billing; reminders reuse notification channels.

### Phase 4 — Clubs *(business: persistent Coffee-Club chapters / Discord-style communities)*
1. **Goal:** interest communities with roles, content, events, files, announcements.
2. **Features:** members, moderators, roles, posts, events, files, discussions, announcements.
3. **Foundation consumed:** Spaces/Memberships (club = space; rich roles **already modeled** in P0), posts/comments/reactions (club feed via `scope_*`), events (club-scoped), media (files), notifications, search, moderation/reports.
4. **Database:** `clubs` (space subtype), optional `club_channels` (Discord-like), `announcements` = pinned post type, files = `media_attachments(role='file')`. **Mostly reuse — minimal new tables.**
5. **APIs:** club CRUD, membership/roles (reuse), scope-filtered post/event queries.
6. **Components:** `ClubCard`, `ChannelList`, `MemberList`+`RoleBadge`, `AnnouncementBanner`, `FileBrowser` (= `MediaGallery`).
7. **Risks:** scope-filtering perf (pre-indexed via `posts(scope_type,scope_id)` from P2 → **no migration**), permission-matrix complexity (RBAC already general), moderation load (queue + reports exist).
8. **Future compatibility:** P5 AI moderation hooks straight into the existing `reports`/`activities` streams.

### Phase 5 — WeCos AI
1. **Goal:** AI layer across the whole platform.
2. **Features:** AI search/RAG, AI writing (smart compose), feed recommendations, event/club suggestions, AI moderation, profile/company generation, assistant.
3. **Foundation consumed:** activity stream (behavioral signal), search index (retrieval), entity model (uniform context), audit (log AI actions), feature flags (gradual rollout), media (vision later).
4. **Database:** `pgvector` (enable early, embed lazily) → `embeddings(entity_type,entity_id,vector)` or nullable column on key entities; `ai_generations` log; moderation-classifier hooks on report/activity events.
5. **APIs:** Edge Functions calling Claude (`claude-opus-4-8` etc.), RAG over `search_index` + embeddings, streaming responses.
6. **Components:** `AIAssistantPanel`, `SmartCompose` (inside `Composer`), `RecommendationRail`.
7. **Risks:** cost (rate-limit/cache/flags), **prompt injection from user content** (treat all content untrusted — mandate), PII in prompts (privacy), hallucinated moderation (human-in-loop).
8. **Future compatibility:** because activity + search + entity model are already uniform, AI is **additive** — a `pgvector` column + Edge Functions, not a rewrite.

---

## 4. Architecture Review

**What are we forgetting?**
- **Direct Messaging / DMs** — Slack/Discord parity implies it; not in the 5 phases. Needs its own `conversations`/`messages`/`conversation_members` model (DMs are not posts). Recommend a foundational design slot ~P2–P3.
- **Marketplace** (business core) — slots after Clubs; reuses media + billing + spaces + search. No new substrate.
- **Validation Engine** (business core, Month 1–2) — a *feature* on profiles/studio + AI scoring; not new substrate. Slot P1–P2; produces a report + badge entity.
- **Onboarding / email funnel / "Startup Clarity Quiz"** — public, unauth → rate-limit + honeypot/CAPTCHA (mandate).
- **i18n** — India = multi-language; externalize copy from day 1 (cheap now, painful later).
- **GDPR/DPDP export + delete** — `deleted_at` everywhere + an export job (mandate, privacy).

**Which systems should exist earlier?** Activity stream, Spaces/Memberships RBAC, Media, Search index, Notification skeleton, Billing idempotency — all P0 (justified above).

**Which tables will need future migrations — and how we pre-empt:**
- `posts.scope_type/scope_id` → **add in P2** so Club posts (P4) need no migration.
- `pgvector` → **enable in P0/P1**, embed lazily (adding the extension + backfill later is the costly part).
- `entity_type` enum → extensible by design (`ADD VALUE`).
- Feed delivery (fan-out) → a delivery-layer addition, not a schema change.

**Which APIs to generalize:** `/comments`, `/reactions`, `/media`, `/reports`, `/search`, `/activity` → polymorphic generic endpoints keyed by `(entity_type, entity_id)`, never per-feature duplicates.

**Which components are too feature-specific:** none should be. `StudioCard`/`PostCard`/`EventCard`/`ClubCard` are all `EntityCard` variants. Any bespoke card = debt, flag in review.

**Which services become shared services from day 1:** Media, Notification, Search, Activity, Auth/RBAC, Billing.

**What Meta / LinkedIn / Discord / Notion / GitHub would do differently:**
- **LinkedIn** — formal URN entity scheme (we mirror via `entity_type/id`) + a read-optimized feed store (we abstract feed delivery behind an interface to extract later).
- **Discord** — realtime gateway + channels (we lean on Supabase Realtime; **flag its scaling ceiling** — may need a dedicated gateway at high concurrency).
- **Notion** — block model (overkill here, but we store rich content as **Tiptap JSON in jsonb**, not HTML — security + flexibility).
- **Meta** — TAO-style graph + dedicated fan-out service (we approximate with `relationships` + `activities` + optional `feed_entries`).
- **GitHub** — strong audit + scoped permissions (we have `audit_log` + scoped RBAC from P0).
- **Main gap vs them:** a dedicated search/feed service at extreme scale — mitigated by hiding both behind provider interfaces so they can be extracted without touching callers.

---

## 5. Build-now vs Defer scorecard

**Build now (saves rewrites):** entity model (ADR-0001), Spaces/Memberships RBAC, Media service, Activity stream, Search abstraction, Notification skeleton, Billing idempotency + founding-500 atomicity, `posts.scope_*`, `pgvector` enabled, feature flags, soft-delete + audit columns everywhere.

**Defer behind an interface (build when phase/scale demands):** fan-out-on-write infra, external search engine (Typesense/Meili), push/SMS channels, the AI implementations, DM realtime gateway, Marketplace.

---

## Locked decisions (2026-06-27)
1. **Billing/Membership → Phase 1.** Razorpay + atomic founding-500 seat allocation ship with Studio; entitlement/gating model built in P0.
2. **DMs → deferred until after Clubs (P4+).** Notification + Realtime foundations stay generic in P0 so no DM-shaped assumptions are baked in; later retrofit is contained (safe at 100k scale).
3. **Validation Engine → no AI before P5.** ⚠️ But all-validation-waits-to-P5 breaks the Month 1–2 launch funnel + homepage hero + membership value prop. **Reconciliation (pending final confirm):** ship **manual/mentor-driven validation at launch** (rubric scoring, no AI) producing the same `validation_report`+badge entity; P5 AI *automates* the identical entity (non-breaking swap). Honors "wait for AI" without gutting the business.
4. **Marketplace → Phase 4 (with Clubs).** Clubs create the founder density a peer marketplace needs for liquidity (matches business plan Slide 17 "Marketplace Beta month 5–6"). Reuses billing+media+spaces+search; adds payout/commission logic.
5. **Studio naming (R1) → confirmed.** Internal entity `space`; user-facing "Studio" = `space type='studio'`.

**Locked phase order:** P0 Foundations+billing → P1 Studio+Membership+(manual)Validation → P2 Network+Feed → P3 Events → P4 Clubs **+ Marketplace beta** → P5 AI (incl. validation automation). DMs slotted post-P4.

**Scale target:** ~100k users / ~200k spaces (NOT millions). Postgres-native suffices: fan-out-on-read feed, Postgres FTS, Supabase Realtime. Provider interfaces kept as cheap insurance but heavy scale-out machinery likely never built.
