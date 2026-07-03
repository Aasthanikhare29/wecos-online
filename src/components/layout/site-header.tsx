"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { mainNav } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-0.5 lg:flex">
            {mainNav.map((item) =>
              item.children ? (
                <div key={item.href} className="group/nav relative">
                  <button
                    type="button"
                    aria-haspopup="true"
                    className={cn(
                      "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                      isActive(item.href) && "text-foreground",
                    )}
                  >
                    {item.label}
                    <ChevronDown className="size-3.5 transition-transform group-hover/nav:rotate-180" />
                  </button>
                  <div className="invisible absolute left-0 top-full z-50 w-64 translate-y-1 pt-2 opacity-0 transition-all group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100">
                    <div className="overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-lg ring-1 ring-foreground/5">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                        >
                          <span className="block text-sm font-medium text-foreground">
                            {child.label}
                          </span>
                          {"summary" in child && child.summary ? (
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {child.summary}
                            </span>
                          ) : null}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    isActive(item.href) && "text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/sign-in"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className={cn(
              buttonVariants({ variant: "default" }),
              "hidden h-10 px-5 sm:inline-flex",
            )}
          >
            Get started
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "lg:hidden")}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {mainNav.map((item) => (
              <div key={item.href} className="py-0.5">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <div className="mt-1 ml-3 flex flex-col gap-0.5 border-l border-border pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <Link
              href="/sign-up"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: "default" }), "mt-2 h-10")}
            >
              Get started
            </Link>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
