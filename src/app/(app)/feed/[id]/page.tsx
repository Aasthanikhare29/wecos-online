import { SinglePostView } from "@/features/feed/single-post-view";

export default async function FeedPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SinglePostView id={id} />;
}
