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
