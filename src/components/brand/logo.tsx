import Image from "next/image";
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
      <Image
        src="/logo.png"
        alt={`${siteConfig.name} logo`}
        width={160}
        height={48}
        className="h-10 w-auto"
        priority
      />
    </Link>
  );
}
