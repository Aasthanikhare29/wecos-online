import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/brand/logo";
import { siteConfig, studios, cities, resources } from "@/config/site";

type FooterLink = { label: string; href: string };

const legal: FooterLink[] = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

function FooterCol({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {siteConfig.tagline}. Build. Breathe. Belong — from validation to
              velocity, calmly.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              <a
                href={`mailto:${siteConfig.email}`}
                className="transition-colors hover:text-foreground"
              >
                {siteConfig.email}
              </a>
            </p>
          </div>

          <FooterCol
            title="Studios"
            links={studios.map((s) => ({ label: s.name, href: `/studios/${s.slug}` }))}
          />
          <FooterCol
            title="Coffee Clubs"
            links={cities.map((c) => ({ label: c.name, href: `/coffee-clubs/${c.slug}` }))}
          />
          <FooterCol
            title="Explore"
            links={[
              { label: "About", href: "/about" },
              { label: "Membership", href: "/membership" },
              ...resources.map((r) => ({ label: r.name, href: `/resources/${r.slug}` })),
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}
          </p>
          <nav className="flex gap-5">
            {legal.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
