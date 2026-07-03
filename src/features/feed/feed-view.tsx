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

  const following = posts.filter((p) => p.author.handle !== myHandle);
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
