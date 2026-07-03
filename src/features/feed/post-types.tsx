import type { ComponentType } from "react";
import { Type, Image as ImageIcon, MonitorPlay, Video, ChartColumn, Quote, CircleQuestionMark, Brain, Trophy } from "lucide-react";
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
  text: { label: "Text", icon: Type, Body: Body.TextBody, blank: () => ({ kind: "text", body: "" }) },
  photo: { label: "Photo", icon: ImageIcon, Body: Body.PhotoBody, blank: () => ({ kind: "photo", body: "", images: [] }) },
  ytVideo: { label: "YouTube", icon: MonitorPlay, Body: Body.YtVideoBody, blank: () => ({ kind: "ytVideo", body: "", url: "" }) },
  video: { label: "Video", icon: Video, Body: Body.VideoBody, blank: () => ({ kind: "video", body: "", src: "" }) },
  poll: {
    label: "Poll",
    icon: ChartColumn,
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
  question: { label: "Question", icon: CircleQuestionMark, Body: Body.QuestionBody, blank: () => ({ kind: "question", body: "" }) },
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
