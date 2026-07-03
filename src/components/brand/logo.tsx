import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

/** WeCos wordmark. Single place to evolve the brand mark. */
export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} home`}
      className={cn(
        "inline-flex items-center gap-2 font-heading text-lg font-extrabold tracking-tight",
        className,
      )}
    >
      <span className="grid size-7 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
        W
      </span>
      <span>{siteConfig.name}</span>
    </Link>
  );
}
