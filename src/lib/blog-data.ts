export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  category: string;
  publishedAt: string;
  readTime: string;
  featured?: boolean;
  image?: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-founders-need-community",
    title: "Why Every Founder Needs a Community Before a Co-founder",
    excerpt:
      "Building a startup is lonely. Here's why connecting with other founders first can save you years of mistakes and thousands in wasted capital.",
    content: `Building a startup is one of the most isolating experiences you can go through. You're making decisions with incomplete information, working irregular hours, and carrying the weight of every outcome on your shoulders.

But what if you didn't have to do it alone?

## The Problem with Going Solo

Most founders believe they need a co-founder first. The reality? Finding the right co-founder takes time, and rushing into the wrong partnership can be worse than going solo.

What founders actually need first is **community** — a group of people who understand the journey, have faced similar challenges, and can offer practical advice when you need it most.

## What We've Seen at WeCos

Since launching WeCos, we've observed a pattern: founders who engage with our community early make better decisions, avoid common pitfalls, and maintain their mental health better than those who try to build in isolation.

> "The first Coffee Club I attended changed my perspective completely. I realized the problems I was facing weren't unique — and the solutions were often simpler than I thought." — Aditya Gupta, Founder at MosClear

## The Compound Effect of Connection

When you surround yourself with other founders:

1. **You learn faster** — Instead of making every mistake yourself, you learn from others' experiences
2. **You stay accountable** — Regular meetups create natural checkpoints for your progress
3. **You find opportunities** — Partnerships, introductions, and collaborations happen organically
4. **You maintain perspective** — When things get tough, community keeps you grounded

## How to Start Building Your Community

You don't need to wait for permission or a perfect network. Start with:

- **Local founder meetups** — Even monthly coffee chats make a difference
- **Online communities** — Discord groups, Twitter spaces, or Slack channels
- **Structured programs** — Like WeCos Coffee Clubs, where curated groups meet regularly

The key is consistency. Show up regularly, contribute value, and build relationships before you need them.

## The Bottom Line

Your co-founder might come from your community. Your first customer might be there. Your next investor definitely could be. But more importantly, your sanity will thank you for not trying to do this alone.

Start building your community today. The best time was yesterday. The second best time is now.`,
    author: {
      name: "Vishnu Gavkare",
      role: "Founder & Ecosystem Lead",
    },
    category: "Founder Stories",
    publishedAt: "2026-07-10",
    readTime: "5 min read",
    featured: true,
    image: "https://picsum.photos/seed/community/1200/630",
  },
  {
    slug: "startup-validation-checklist",
    title: "The 10-Point Startup Validation Checklist (Before You Write a Line of Code)",
    excerpt:
      "Most startups fail because they build what nobody wants. Use this checklist to validate your idea before investing time and money.",
    content: `We see it every week: founders who've spent months building a product only to discover nobody wants it. The tragedy? This is entirely preventable.

Here's the 10-point checklist we use at WeCos to help founders validate their ideas before they start building.

## 1. Problem Clarity

Can you describe the problem you're solving in one sentence? Not the solution — the problem.

❌ "We're building an AI-powered task management tool"
✅ "Small teams waste 5+ hours weekly on project status updates that could be automated"

## 2. Customer Interviews

Have you talked to at least 10 potential customers? Not friends, not family — people who actually have the problem you're solving.

The goal isn't to sell your idea. It's to understand their world deeply enough to know if your solution fits.

## 3. Willingness to Pay

Has anyone expressed willingness to pay for a solution? This doesn't mean they'll actually pay — but if they won't even say they would, that's a red flag.

## 4. Existing Alternatives

What are people using today? If there's no alternative, either the problem isn't painful enough or you haven't looked hard enough.

Both are concerning.

## 5. Market Size

Is the market big enough to sustain a business? You don't need to be the next unicorn, but you need enough customers to build something viable.

## 6. Your Unfair Advantage

What do you know or have that others don't? Domain expertise, unique data, special connections — something that gives you a head start.

## 7. Technical Feasibility

Can you build this with your current resources? If not, what would it take? Be honest about the gap between where you are and where you need to be.

## 8. Time Sensitivity

Why now? What's changed in the market that makes this problem more urgent or your solution more possible?

## 9. Scalability Potential

Can this grow beyond a lifestyle business? If you want venture-scale returns, you need venture-scale potential.

## 10. Your Personal Connection

Do you genuinely care about this problem? Startups are a marathon. If you're not passionate about the problem, you'll burn out before you find the solution.

## What to Do Next

Score yourself honestly on each point. If you're below 7/10, you have more validation work to do. If you're above 8/10, you might be ready to start building.

Either way, remember: validation isn't a one-time event. It's an ongoing process that continues long after you launch.`,
    author: {
      name: "Yogita Daswani",
      role: "Growth & Partnerships",
    },
    category: "Startup Growth",
    publishedAt: "2026-07-05",
    readTime: "6 min read",
    image: "https://picsum.photos/seed/validation/1200/630",
  },
  {
    slug: "fundraising-mistakes-first-time-founders",
    title: "7 Fundraising Mistakes First-Time Founders Keep Making",
    excerpt:
      "Raising capital is hard enough without shooting yourself in the foot. Here are the most common mistakes we see and how to avoid them.",
    content: `Raising your first round of funding is one of the biggest milestones for any startup. It's also where many first-time founders make avoidable mistakes that cost them time, equity, and opportunities.

Here are the seven most common fundraising mistakes we see — and how to avoid them.

## 1. Raising Too Early

The #1 mistake? Trying to raise before you have enough traction to justify it.

Investors want to see evidence that your idea works. A pitch deck full of market size numbers won't cut it — they want to see users, revenue, or at least strong engagement metrics.

**The fix:** Bootstrap until you have clear product-market fit signals. Then raise to accelerate, not to survive.

## 2. Raising Too Late

The opposite problem is equally dangerous. Waiting too long to raise means you're negotiating from a position of weakness — running out of cash, making desperate decisions, and losing leverage.

**The fix:** Start building relationships with investors 6-12 months before you need money. By the time you're raising, you should already have warm introductions.

## 3. Not Understanding Your Numbers

If an investor asks about your CAC, LTV, or churn rate and you can't answer confidently, you've already lost the deal.

**The fix:** Know your metrics cold. Practice explaining them simply. If you don't understand your own business metrics, why would anyone invest?

## 4. Targeting the Wrong Investors

Not every investor is right for every stage, sector, or geography. Sending the same pitch to 200 investors is spray-and-pray — and it shows.

**The fix:** Research investors who've funded companies like yours. Personalize every outreach. Quality over quantity, always.

## 5. Overvaluing Your Company

Setting an unrealistic valuation doesn't impress investors — it signals that you don't understand the market.

**The fix:** Look at comparable companies in your sector and stage. Price yourself competitively. A slightly lower valuation that closes fast is better than a high one that never converts.

## 6. Ignoring Legal Terms

Founders often focus so much on valuation that they miss the terms that actually matter — liquidation preferences, board seats, anti-dilution clauses.

**The fix:** Get a lawyer. Read every term. Understand what you're giving up beyond the equity percentage.

## 7. Not Having a Plan for the Money

"We'll use it for growth" isn't a plan. Investors want to see specific milestones the funding will help you achieve.

**The fix:** Create a detailed use of funds breakdown. Show exactly how the money will be deployed and what outcomes it will produce.

## The Bottom Line

Fundraising is a skill, and like any skill, it improves with practice and feedback. The best founders treat every investor meeting as a learning opportunity — whether they get a check or not.

Need help preparing for your first raise? That's exactly what WeCos founders get support with through our mentorship network.`,
    author: {
      name: "Sujata Mishra",
      role: "Brand & Communications",
    },
    category: "Fundraising",
    publishedAt: "2026-06-28",
    readTime: "7 min read",
    image: "https://picsum.photos/seed/fundraising/1200/630",
  },
  {
    slug: "building-personal-brand-as-founder",
    title: "Building Your Personal Brand as a Founder (Without Being Cringe)",
    excerpt:
      "Your personal brand can open doors that cold emails never will. Here's how to build authentically without becoming a LinkedIn influencer.",
    content: `Let's be honest: "personal brand" sounds like something a marketing guru would say while selling you a course. But here's the truth — as a founder, your personal reputation directly impacts your company's success.

The good news? Building a genuine personal brand doesn't require you to become aLinkedIn influencer or post daily motivational quotes.

## Why Personal Branding Matters for Founders

1. **Investors invest in people first** — Before they look at your metrics, they look at you
2. **Talent wants to work with inspiring leaders** — Your brand attracts your team
3. **Partnerships start with trust** — A strong reputation opens doors
4. **Customers connect with humans** — People buy from people they relate to

## The Anti-Cringe Approach

Here's what authentic personal branding looks like:

### Share What You're Learning

Instead of pretending to have all the answers, share what you're discovering along the way.

❌ "Just closed our Series A! Here's how I did it..."
✅ "We just raised our first round. Here are 3 things I wish I'd known beforehand..."

### Be Specific, Not Generic

Vague advice is everywhere. Specific stories and lessons stand out.

❌ "Hard work pays off!"
✅ "Last month we almost lost a major client because we over-promised on delivery. Here's what we learned about scope management..."

### Show the Process, Not Just Results

Everyone shares their wins. The founders who stand out share their journey — including the messy parts.

## Practical Steps

1. **Pick one platform** — Don't try to be everywhere. Choose where your audience actually is
2. **Post consistently** — Even once a week is enough to build presence over time
3. **Engage genuinely** — Comment on others' posts, share insights, be part of conversations
4. **Document, don't create** — Share what's already happening in your journey
5. **Be patient** — Personal branding is a long game. Don't expect overnight results

## What to Avoid

- **Don't sell in every post** — Give value first, sell occasionally
- **Don't fake it** — People can tell when you're performing vs. being genuine
- **Don't compare** — Your journey is unique. Don't try to replicate someone else's brand
- **Don't be afraid to have opinions** — Neutral founders are forgettable founders

## The Bottom Line

Your personal brand is simply your reputation, amplified. Be the founder you'd want to work with, invest in, or buy from — and share that journey authentically.

The best personal brands aren't built in a day. They're built by showing up consistently, being genuinely helpful, and not taking yourself too seriously.`,
    author: {
      name: "Vishnu Gavkare",
      role: "Founder & Ecosystem Lead",
    },
    category: "Founder Stories",
    publishedAt: "2026-06-20",
    readTime: "5 min read",
    image: "https://picsum.photos/seed/branding/1200/630",
  },
  {
    slug: "coffee-clubs-why-they-matter",
    title: "Coffee Clubs: Why Offline Connections Still Matter in a Digital World",
    excerpt:
      "In an era of Zoom calls and Slack channels, there's something irreplaceable about meeting founders face-to-face over coffee.",
    content: `We live in a world where you can connect with anyone, anywhere, at any time. So why do we keep emphasizing the importance of offline meetups?

Because digital connections aren't enough.

## The Problem with Purely Digital Networking

Online communities are great for quick questions, sharing resources, and staying connected. But they have limits:

- **Depth is hard** — It's difficult to build genuine relationships through comments and DMs
- **Context is missing** — Tone, body language, and energy don't translate through screens
- **Accountability is weak** — It's easy to ghost online commitments
- **Serendipity is rare** — Algorithmic feeds show you what's popular, not what's relevant

## What Coffee Clubs Do Differently

Our Coffee Clubs aren't networking events. They're small, curated groups of founders who meet monthly to:

1. **Share progress** — What's working, what's not, what's next
2. **Solve problems** — Real challenges, real advice from people who've been there
3. **Build trust** — Face-to-face time creates bonds that DMs can't
4. **Stay accountable** — Monthly check-ins keep you honest about your goals

## The Science Behind It

Research consistently shows that:

- **Face-to-face interactions build trust faster** — Up to 34x faster than digital communication
- **Small groups create deeper connections** — Intimacy scales down, not up
- **Regular meetings compound** — Monthly touchpoints create meaningful relationships over time
- **Physical presence improves collaboration** — Proximity breeds partnership

## What Founders Say

> "I've tried every online community out there. Coffee Club is the only one where I've actually built real relationships. These aren't just contacts — they're people I can call when things get tough."

> "The monthly cadence is perfect. It's frequent enough to stay connected but not so often that it feels like a burden."

## Join a Coffee Club

WeCos Coffee Clubs are currently active in Mumbai, Pune, Bangalore, Nagpur, and Bhubaneswar.

Each club is limited to 12-15 founders to ensure quality conversations and genuine connections.

Ready to experience the difference offline community makes? [Find a Coffee Club near you](/coffee-clubs).`,
    author: {
      name: "Yogita Daswani",
      role: "Growth & Partnerships",
    },
    category: "Community",
    publishedAt: "2026-06-15",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/coffeeclub/1200/630",
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getFeaturedPost(): BlogPost | undefined {
  return blogPosts.find((post) => post.featured);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

export function getAllCategories(): string[] {
  const categories = new Set(blogPosts.map((post) => post.category));
  return Array.from(categories);
}
