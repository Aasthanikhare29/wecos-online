"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, ProfileValues } from "@/features/profiles/schema";
import type { Startup, StartupValues } from "@/features/startups/schema";
import type { FeedPost, PostContent, Vote } from "@/features/feed/schema";
import { nid, authorFromProfile, applyVote } from "@/features/feed/feed-utils";
import { sampleFeed } from "@/lib/sample/sample-feed";

/**
 * ⚠️ MOCK DATA LAYER — UI-first phase only. State persists to localStorage so the
 * register → onboard → profile → startup flow is fully interactive without a backend.
 *
 * This is NOT real auth and NOT secure (no password check, no server, no session token).
 * When wiring the backend: replace each action body with a Supabase call + TanStack
 * Query, and move gating to middleware + RLS. The component-facing API stays the same,
 * so screens won't change.
 */

export type Session = { email: string; fullName: string };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

type AppState = {
  session: Session | null;
  onboarded: boolean;
  profile: Profile | null;
  startup: Startup | null;
  posts: FeedPost[];

  addPost: (content: PostContent) => string;
  votePost: (id: string, dir: 1 | -1) => void;
  toggleBookmark: (id: string) => void;
  addComment: (postId: string, body: string) => void;
  voteComment: (postId: string, commentId: string, dir: 1 | -1) => void;
  votePoll: (postId: string, optionId: string) => void;
  answerQuiz: (postId: string, optionId: string) => void;

  signUp: (input: { fullName: string; email: string }) => void;
  signIn: (input: { email: string }) => void;
  signOut: () => void;
  saveProfile: (values: ProfileValues) => void;
  saveStartup: (values: StartupValues) => void;
  completeOnboarding: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      session: null,
      onboarded: false,
      profile: null,
      startup: null,
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
            if (prev === optionId) return p;
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

      signUp: ({ fullName, email }) =>
        set({
          session: { fullName, email },
          onboarded: false,
          profile: {
            id: uid(),
            email,
            handle: slugify(email.split("@")[0] || fullName),
            fullName,
            headline: "",
            location: "",
            bio: "",
            avatarUrl: "",
          },
        }),

      signIn: ({ email }) => {
        const existing = get().profile;
        if (existing && existing.email === email) {
          set({ session: { email, fullName: existing.fullName } });
        } else {
          // No local record (mock) — create a minimal session so the demo flows.
          set({
            session: { email, fullName: email.split("@")[0] || "Founder" },
          });
        }
      },

      signOut: () => set({ session: null }),

      saveProfile: (values) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, ...values }
            : {
                id: uid(),
                email: state.session?.email ?? "",
                handle: slugify(values.fullName),
                ...values,
              },
          session: state.session
            ? { ...state.session, fullName: values.fullName }
            : state.session,
        })),

      saveStartup: (values) =>
        set((state) => ({
          startup: state.startup
            ? { ...state.startup, ...values }
            : { id: uid(), slug: slugify(values.name), ...values },
        })),

      completeOnboarding: () => set({ onboarded: true }),
    }),
    { name: "wecos-app-v1", version: 1 },
  ),
);

/**
 * Guards against SSR/hydration mismatch: persisted store is empty on the server,
 * so client screens must wait for rehydration before reading auth state.
 */
export function useAppHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(useAppStore.persist.hasHydrated());
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);
  return hydrated;
}
