"use client";

import { CircleCheckBig, CircleX } from "lucide-react";
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
        {images.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" className="h-full max-h-96 w-full object-cover" />
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
      <blockquote className="font-heading text-lg font-medium text-foreground">&ldquo;{post.content.quote}&rdquo;</blockquote>
      <figcaption className="mt-1 text-xs text-muted-foreground">&mdash; {post.content.source}</figcaption>
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
              {showRight ? <CircleCheckBig className="size-4" /> : showWrong ? <CircleX className="size-4" /> : null}
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
