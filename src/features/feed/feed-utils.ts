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
