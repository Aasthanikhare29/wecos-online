"use client";

import Link from "next/link";
import { ArrowBigDown, ArrowBigUp, Bookmark, BookmarkCheck, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/app-store";
import type { FeedPost } from "./schema";

export function PostActions({ post }: { post: FeedPost }) {
  const votePost = useAppStore((s) => s.votePost);
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);

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
