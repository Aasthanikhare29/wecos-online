/**
 * Single source of truth for site-wide structured content.
 *
 * IMPORTANT: cities and studios were inconsistent across the navbar, homepage,
 * and footer in the source brief. They are canonicalized here ONCE — every nav,
 * footer, and directory reads from this file. Edit here, it updates everywhere.
 */

export const siteConfig = {
  name: "WeCos",
  legalName: "The Grey Hawks x WeCos",
  tagline: "India's Startup Engine",
  description:
    "Build better, prove faster, grow calmer. WeCos helps founders turn ideas into validated startups — powered by AI systems and guided by human mentors.",
  url: "https://www.wecos.co",
  email: "start@wecos.co",
} as const;

/** Membership + value constants — referenced anywhere price/cap is shown. */
export const pricing = {
  /** Annual membership price in INR. */
  membershipInr: 3650,
  /** Stated total value of member benefits in INR. */
  valueInr: 73500,
  /** Founding-member cap (scarcity + atomic seat allocation later). */
  foundingSeats: 500,
  /** "~₹10/day" framing. */
  perDayInr: 10,
} as const;

export type City = {
  slug: string;
  name: string;
  /** Whether a Coffee Club chapter is live (vs. coming soon). */
  active: boolean;
};

/**
 * Canonical Coffee Club cities. NOTE: brief listed three different city sets
 * (navbar vs homepage vs footer). This is the reconciled launch list — confirm
 * with stakeholders before print/marketing.
 */
export const cities: City[] = [
  { slug: "mumbai", name: "Mumbai", active: true },
  { slug: "pune", name: "Pune", active: true },
  { slug: "bangalore", name: "Bangalore", active: true },
  { slug: "nagpur", name: "Nagpur", active: true },
  { slug: "bhubaneswar", name: "Bhubaneswar", active: true },
];

export type Studio = {
  slug: string;
  name: string;
  /** Short service summary for cards / nav descriptions. */
  summary: string;
};

/** Canonical WeCos Studios (in-house service arms). */
export const studios: Studio[] = [
  { slug: "technology", name: "Technology", summary: "Product, engineering & automation" },
  { slug: "marketing", name: "Marketing", summary: "Ads, SEO, content & growth" },
  { slug: "human-resource", name: "Human Resource", summary: "Recruitment, payroll & policy" },
  { slug: "accounting", name: "Accounting", summary: "Books, taxation & CFO services" },
  { slug: "legal", name: "Legal", summary: "Registrations, contracts & IP" },
];

export type ResourceLink = { slug: string; name: string; summary: string };

export const resources: ResourceLink[] = [
  { slug: "blog", name: "Blog", summary: "Founder stories & insights" },
  { slug: "toolkits", name: "Toolkits", summary: "Templates, trackers & playbooks" },
  { slug: "free", name: "Free Stuff", summary: "Quizzes, guides & lead magnets" },
];

/** Top-level marketing navigation. Dropdown items are derived from the lists above. */
export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; summary?: string }[];
};

export const mainNav: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  { label: "About", href: "/about" },
  {
    label: "Discover",
    href: "/startups",
    children: [
      { label: "Startups", href: "/startups", summary: "Browse the startup directory" },
      { label: "Founders", href: "/founders", summary: "Meet founders on WeCos" },
    ],
  },
  { label: "Membership", href: "/membership" },
  {
    label: "Coffee Clubs",
    href: "/coffee-clubs",
    children: cities.map((c) => ({
      label: c.name,
      href: `/coffee-clubs/${c.slug}`,
    })),
  },
  {
    label: "Resources",
    href: "/resources",
    children: resources.map((r) => ({
      label: r.name,
      href: `/resources/${r.slug}`,
      summary: r.summary,
    })),
  },
  {
    label: "Studios",
    href: "/studios",
    children: studios.map((s) => ({
      label: s.name,
      href: `/studios/${s.slug}`,
      summary: s.summary,
    })),
  },
];
