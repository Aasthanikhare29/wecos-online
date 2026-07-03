import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Coffee,
  Compass,
  Leaf,
  Lightbulb,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { pricing, cities } from "@/config/site";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const problems = [
  {
    icon: Lightbulb,
    problem: "Idea Confusion",
    solution: "Validation Engine — AI feedback paired with mentor insight.",
  },
  {
    icon: Compass,
    problem: "Execution Chaos",
    solution: "Growth Toolkit — structured templates, trackers and playbooks.",
  },
  {
    icon: Users,
    problem: "Founder Isolation",
    solution: "Coffee Clubs — real people, real support, every month.",
  },
  {
    icon: BadgeCheck,
    problem: "No Credibility",
    solution: "Founder Page — your public proof of progress.",
  },
  {
    icon: Leaf,
    problem: "Burnout",
    solution: "Calm System — focus, reflection and balanced growth.",
  },
];

const steps = [
  {
    title: "Validate",
    body: "Get your idea reviewed by our Validation Engine. Receive a custom score, feedback and 3 actionable next steps.",
  },
  {
    title: "Build",
    body: "Access the Growth Toolkit: Notion systems, launch templates, OKR trackers and pitch-deck builders. Progress visibly, not chaotically.",
  },
  {
    title: "Belong",
    body: "Join your city's Coffee Club — meet other founders offline, find partners and stay consistent with community accountability.",
  },
];

const benefits = [
  "Startup Validation Report — AI + mentor feedback in 48 hours",
  "Founder Page — your public startup identity",
  "Growth Toolkit — GTM, financials, decks, templates",
  "Founder Fridays — weekly sessions with top operators",
  "Coffee Club Access — monthly meetups in your city",
  "Mentorship Circle — learn from founders who've built before",
  "SaaS Perks & Credits (₹50,000+)",
];

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow ? (
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-pretty text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent)]"
        />
        <Container className="py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="size-3.5 text-primary" />
            Limited to the first {pricing.foundingSeats} founding members
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl md:text-6xl">
            Build Better. Prove Faster. Grow Calmer.
            <span className="mt-2 block text-primary">
              With India's Ultimate Startup Engine.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">
            WeCos helps founders turn ideas into real, validated startups —
            powered by AI systems and guided by human mentors.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className={cn(buttonVariants({ variant: "default" }), "h-12 px-7 text-base")}
            >
              I Have an Idea
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/membership"
              className={cn(buttonVariants({ variant: "outline" }), "h-12 px-7 text-base")}
            >
              I Already Have a Startup
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Join 500+ founders building calmly — one clear step at a time.
          </p>
        </Container>
      </section>

      {/* Why founders choose WeCos */}
      <section className="border-t border-border/60 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Why WeCos"
            title="We don't build in chaos. We build with clarity."
            subtitle="Modern founders juggle 20 tools, dozens of opinions and endless noise. WeCos brings everything together — one calm engine for real progress."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map(({ icon: Icon, problem, solution }) => (
              <div
                key={problem}
                className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
              >
                <div className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{problem}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {solution}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-t border-border/60 bg-muted/30 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="Three calm steps from idea to momentum."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="relative rounded-2xl border border-border bg-card p-7">
                <span className="font-mono text-sm font-semibold text-primary">
                  0{i + 1}
                </span>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Membership */}
      <section className="border-t border-border/60 py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-accent/40 p-8 text-center">
              <p className="text-sm font-semibold tracking-wide text-primary uppercase">
                The Membership
              </p>
              <div className="mt-3 flex items-end justify-center gap-1">
                <span className="text-5xl font-extrabold tracking-tight">
                  {inr(pricing.membershipInr)}
                </span>
                <span className="pb-1.5 text-muted-foreground">/year</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                One year of clarity, structure and belonging — about{" "}
                {inr(pricing.perDayInr)}/day.
              </p>
            </div>
            <div className="p-8">
              <ul className="grid gap-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                      <Check className="size-3.5" />
                    </span>
                    <span className="text-foreground/90">{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/membership"
                className={cn(buttonVariants({ variant: "default" }), "mt-8 h-12 w-full text-base")}
              >
                Join the Founding {pricing.foundingSeats} — {inr(pricing.membershipInr)}/year
              </Link>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Total value {inr(pricing.valueInr)}+. Pay once. Build calmly all year.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Coffee Clubs */}
      <section className="border-t border-border/60 bg-muted/30 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Coffee Clubs"
            title="Because great ideas deserve real conversations."
            subtitle="Monthly city meetups where founders discuss progress, problems and plans — over coffee, not chaos."
          />
          <div className="mt-10 flex flex-wrap justify-center gap-2.5">
            {cities.map((c) => (
              <Link
                key={c.slug}
                href={`/coffee-clubs/${c.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent"
              >
                <Coffee className="size-3.5 text-primary" />
                {c.name}
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/coffee-clubs"
              className={cn(buttonVariants({ variant: "outline" }), "h-11 px-6")}
            >
              Find a Coffee Club near you
            </Link>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
<section className="py-20 sm:py-24">
  <Container>
    <div className="relative overflow-hidden rounded-3xl px-6 py-20 text-center text-white sm:px-12 bg-[linear-gradient(135deg,#3B0B96_0%,#5512D6_55%,#2B0078_100%)]">
      
      {/* Top-right glow */}
      <div className="absolute -top-48 -right-40 h-[520px] w-[520px] rounded-full bg-violet-400/35 blur-[160px]" />

      {/* Bottom-left glow */}
      <div className="absolute -bottom-48 -left-40 h-[480px] w-[480px] rounded-full bg-purple-500/35 blur-[160px]" />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      {/* Decorative circles */}
      <div className="absolute -top-20 right-[-40px] h-60 w-60 rounded-full border border-white/10" />
      <div className="absolute -top-10 right-[-20px] h-44 w-44 rounded-full border border-white/10" />

      <div className="absolute -bottom-16 -left-16 h-52 w-52 rounded-full border border-white/10" />
      <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full border border-white/10" />

      {/* Content */}
      <div className="relative z-10">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          You've got the spark.
          <span className="block">We'll give you the engine.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
          Get validation, clarity and community — all for {inr(pricing.membershipInr)}/year.
        </p>

        <div className="mt-9 flex justify-center">
          <Link
            href="/sign-up"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-14 rounded-2xl border border-white/10 bg-white/15 px-10 text-base text-white backdrop-blur-xl hover:bg-white/20",
            )}
          >
            Start My Engine
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <p className="mt-7 text-sm text-white/70">
          First {pricing.foundingSeats} founders get lifetime recognition on the WeCos Wall of Builders.
        </p>
      </div>
    </div>
  </Container>
</section>
    </>
  );
}