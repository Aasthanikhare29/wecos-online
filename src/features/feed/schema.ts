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
