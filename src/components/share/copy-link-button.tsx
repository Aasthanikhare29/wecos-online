"use client";

import { Link2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

/** Copies the absolute URL for `path` to the clipboard. */
export function CopyLinkButton({
  path,
  label = "Copy link",
}: {
  path: string;
  label?: string;
}) {
  const onCopy = async () => {
    const url =
      typeof window !== "undefined" ? window.location.origin + path : path;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
    >
      <Link2 className="size-4" />
      {label}
    </button>
  );
}
