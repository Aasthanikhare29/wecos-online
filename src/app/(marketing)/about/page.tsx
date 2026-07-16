import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about WeCos — an ecosystem designed to help startups move from idea to execution with clarity, structure, and strategic support.",
};

const stats = [
  { value: "2023", label: "WeCos founded" },
  { value: "25", label: "Industry experts" },
  { value: "100+", label: "Startup connections" },
];

const values = [
  {
    icon: "/about/icon-idea.png",
    title: "Founder-First Thinking",
    description:
      "Every decision starts with one question: will this genuinely help founders grow faster, smarter, and more sustainably?",
  },
  {
    icon: "/about/icon-learn.png",
    title: "Learn & Adapt",
    description:
      "Startups evolve quickly and so do we. Continuous learning, market awareness, and adaptability are at the center of our ecosystem.",
  },
  {
    icon: "/about/icon-build.png",
    title: "Build Together",
    description:
      "Great companies are rarely built alone. We believe collaboration creates stronger businesses, stronger founders, and stronger outcomes.",
  },
  {
    icon: "/about/icon-target.png",
    title: "Impact Over Noise",
    description:
      "We focus on meaningful execution, measurable outcomes, and long-term value instead of vanity metrics and startup theatre.",
  },
];

const testimonials = [
  {
    quote:
      "Building a startup can feel isolating, but WeCos gave us access to mentors, collaborators, and practical guidance exactly when we needed it. It felt less like a service and more like having an experienced growth team beside us.",
    author: "Aditya Gupta",
    role: "Founder, MosClear",
  },
  {
    quote:
      "The ecosystem approach genuinely stands out. From fundraising support to branding and compliance, WeCos helped us solve multiple challenges through one connected network.",
    author: "Parag Kasliwal",
    role: "Founder, Beyond IRR",
  },
  {
    quote:
      "The subscription easily paid for itself through the introductions and strategic sessions alone. The investor interactions and expert guidance added tremendous value to our growth journey.",
    author: "Satvik Thakkar",
    role: "Founder, Six Ladders",
  },
];

const team = [
  {
    name: "Vishnu Gavkare",
    role: "Founder & Ecosystem Lead",
    image: "/about/team-01.jpg",
  },
  {
    name: "Yogita Daswani",
    role: "Growth & Partnerships",
    image: "/about/team-03.jpg",
  },
  {
    name: "Sujata Mishra",
    role: "Brand & Communications",
    image: "/about/team-05.jpg",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-4 sm:pb-20 sm:pt-6">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              About WeCos
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              In a startup journey, the hardest part is rarely the idea.
              <span className="text-primary">
                {" "}It&apos;s everything that comes after it.
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              The uncertainty, the legal setup, the hiring, the fundraising, the
              branding, the sleepless spreadsheets at 1:43 AM and the constant
              feeling that every founder is building an aircraft while still
              assembling the runway.
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              That&apos;s why WeCos was built.
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              Created by founders, operators, and subject matter experts, WeCos
              is an ecosystem designed to help startups move from idea to
              execution with clarity, structure, and strategic support.
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent)]"
            />
            <div className="relative w-full max-w-lg">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-7">
                  <img
                    src="/about/hero-about-01.webp"
                    alt="WeCos team collaboration"
                    className="h-full w-full rounded-2xl object-cover shadow-lg"
                  />
                </div>
                <div className="col-span-5 pt-12">
                  <img
                    src="/about/hero-about-02.webp"
                    alt="WeCos startup ecosystem"
                    className="h-full w-full rounded-2xl object-cover shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* How WeCos Helps */}
      <section className="border-t border-border/60 bg-muted/30 py-16 sm:py-20">
        <Container>
          <SectionHeading
            title="How WeCos helps"
            subtitle="Startups use WeCos to simplify the chaos of building a company. From validating an idea to raising capital and scaling operations, our ecosystem brings founders closer to the people, resources, and expertise they need at every stage of growth."
          />

          <div className="mt-8 space-y-4 text-center">
            <p className="mx-auto max-w-3xl text-muted-foreground">
              Whether it&apos;s legal incorporation, financial compliance,
              branding, talent acquisition, pitch deck preparation, fundraising
              strategy, or technology development, WeCos acts as an extended
              growth partner for ambitious startups. Our network-driven approach
              helps founders move faster, reduce operational friction, and focus
              on building products and businesses that create long-term impact.
            </p>
            <p className="mx-auto max-w-3xl text-muted-foreground">
              Built around collaboration, mentorship, and execution, WeCos
              combines strategic advisory with hands-on support to help startups
              scale with confidence in an increasingly competitive ecosystem.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm"
              >
                <span className="text-4xl font-bold text-primary">
                  {stat.value}
                </span>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Values */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            title="Our Values — it's Simple!"
            subtitle="The principles that guide everything we do at WeCos."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-white/10 bg-black p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative size-16">
                  <img
                    src={value.icon}
                    alt={value.title}
                    className="size-16 object-contain"
                    style={{ filter: "brightness(0) saturate(100%) invert(69%) sepia(88%) saturate(1000%) hue-rotate(3deg) brightness(101%) contrast(106%)" }}
                  />
                </div>
                <h3 className="mt-4 text-lg font-bold tracking-tight text-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border/60 bg-muted/30 py-16 sm:py-20">
        <Container>
          <SectionHeading
            title="Some client feedbacks"
            subtitle="Hear from founders who've grown with WeCos."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.author}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div>
                  <Quote className="size-8 text-primary/20" />
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
                    <span className="text-lg font-bold">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Executive Team */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            title="Our Executive Team"
            subtitle="The people building the ecosystem founders actually need."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 py-16 sm:py-20">
        <Container>
          <div
            className="relative overflow-hidden rounded-[28px] px-6 py-16 text-center text-white sm:px-12"
            style={{
              background:
                "radial-gradient(circle at 0% 100%, rgba(6,182,212,0.95) 0%, rgba(6,182,212,0.45) 16%, transparent 34%), radial-gradient(circle at 100% 0%, rgba(217,70,239,0.95) 0%, rgba(217,70,239,0.45) 18%, transparent 36%), linear-gradient(135deg, #050617 0%, #08051f 45%, #16051f 100%)",
            }}
          >
            <div className="absolute inset-0 bg-black/10" />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
                backgroundSize: "55px 55px",
              }}
            />

            <div className="relative z-10">
              <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                We&apos;re building an ecosystem founders actually need.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/80">
                From mentorship and fundraising support to branding, compliance,
                hiring, and technology, WeCos exists to help startups spend less
                time figuring things out and more time building meaningful
                businesses.
              </p>

              <div className="mt-8 flex justify-center">
                <Link
                  href="/sign-up"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "h-12 rounded-xl bg-primary px-7 text-base text-primary-foreground shadow-[0_12px_30px_rgba(124,58,237,0.35)] hover:bg-primary/90"
                  )}
                >
                  Have what it takes to grow with us?
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
