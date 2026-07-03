"use client";
import {useState} from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarDays,
  ExternalLink,
  MessageCircle,
  Rocket,
  Star,
  Building,
  ShieldCheck,
  Clock,
  Users,
  Building2,
  Play,
  Mail,
  Phone,
  MapPin,
  Download,
  AlarmClockCheck,
  FileText,
  RefreshCw,
  Satellite,
  Plane,
  Globe,
  Cpu,
  Wrench,
  ArrowRight,
  Heart,
} from "lucide-react";
import {
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaXTwitter,
  FaWhatsapp,
} from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useEffect, useRef,  } from "react";
import { Badge } from "@/components/ui/badge";
export type CompanyReview = {
  client: string;
  company: string;
  rating: number;
  review: string;
  video?: string;
  verticalVideo?: string;

};

export type CompanyUpdate = {
  text: string;
  date: string;
  likes: number;
  comments: number;
  reposts?: number;
};
export type CompanyLeader = { name: string; role: string; handle?: string; avatarText: string };
export type CompanyJob = { title: string; location: string; type: string };
export type CompanyStat = { label: string; value: string };
export type CompanyLink = { label: string; href: string };
export type CompanyProduct = { name: string; description?: string; tag?: string ;  image?: string;};
export type CompanyFunding = {
  totalRaised?: string;
  valuation?: string;
  lastRound?: string;
  investors?: string[];
};
export type CompanyTraction = {
  title?: string;
  points: { label: string; value: number }[];
};
export type CompanyPerson = { name: string; role: string; handle?: string; avatarText: string;image?: string; bio?: string;};
export type CompanyPageData = {
  slug: string;
  name: string;
  verified?: boolean;
  tagline: string;
  industry?: string;
  location?: string;
  about?: string;
  logoText: string;
  logoUrl?: string;
  coverImage?: string;
  bannerClass?: string;
  followers?: number;
  employeesLabel?: string;
  website?: string;
  upvotes?: number;
  commentsCount?: number;
  topics?: string[];
  overview: {
    website?: string;
    industry?: string;
    companySize?: string;
    headquarters?: string;
    founded?: string;
    type?: string;
    specialties?: string[];
  };
  products?: CompanyProduct[];
  funding?: CompanyFunding;
  traction?: CompanyTraction;
  updates?: CompanyUpdate[];
  jobs?: CompanyJob[];
  leadership?: CompanyLeader[];
  people?: CompanyPerson[];
  stats?: CompanyStat[];
  alsoViewed?: { name: string; slug: string; industry: string; logoText: string }[];
  links?: CompanyLink[];
  reviews?: CompanyReview[];
};

const compact = (n?: number) =>
  n == null
    ? undefined
    : new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);


function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card", className)}>{children}</div>
  );
}

function OverviewRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground/90">{children}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-2xl font-bold tracking-tight text-primary">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function PersonAvatar({ text }: { text: string }) {
  return (
    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
      {text}
    </span>
  );
}

export function CompanyPage({ data }: { data: CompanyPageData }) {

  const [activeSection, setActiveSection] = useState("services");
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
const [email, setEmail] = useState("");
const [successMessage, setSuccessMessage] = useState("");
const [emailError, setEmailError] = useState("");
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const [selectedDocument, setSelectedDocument] = useState("");
const [isFavorite, setIsFavorite] = useState(false);
const [animateHeart, setAnimateHeart] = useState(false);
const [activeVideo, setActiveVideo] = useState<string | null>(null);
const [showFullAbout, setShowFullAbout] = useState(false);
const [showReadMore, setShowReadMore] = useState(false);
const videoModalRef = useRef<HTMLDivElement>(null);
const aboutRef = useRef<HTMLParagraphElement>(null);
useEffect(() => {
  if (!activeVideo) return;

  videoModalRef.current?.focus();

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setActiveVideo(null);
    }
  };

  document.addEventListener("keydown", handleEsc);

  return () => {
    document.removeEventListener("keydown", handleEsc);
  };
}, [activeVideo]);



const profileTabs = [
  { id: "services", label: "Services" },
  { id: "team", label: "Team" },
  { id: "clients", label: "Clients" },
  { id: "updates", label: "Recent Updates" },
  { id: "roles", label: "Open Roles" },
];

  const show = {
  overview: true,
  stats: !!data.stats?.length,
  traction: !!data.traction?.points.length,
  funding: !!data.funding,
  products: !!data.products?.length,
  updates: !!data.updates?.length,
  jobs: !!data.jobs?.length,
  people: !!data.people?.length,
  reviews: !!data.reviews?.length,
};
const ReviewCard = ({ r, tall = false }: { r: CompanyReview; tall?: boolean }) => (
  <div
    className={cn(
      "rounded-2xl border border-slate-100 bg-white p-5 shadow-sm",
      tall && "h-full"
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-semibold text-slate-900">{r.client}</p>
        <p className="text-xs text-muted-foreground">{r.company}</p>
      </div>

      <div className="text-sm text-yellow-500">
        {"★".repeat(r.rating)}
      </div>
    </div>

    <p className="mt-4 text-sm leading-relaxed text-slate-700">
      “{r.review}”
    </p>

    {r.video && (
      <button
        type="button"
        onClick={() => setActiveVideo(r.video!)}
        className="group relative mt-4 w-full overflow-hidden rounded-xl border border-slate-200"
      >
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThCsvF6g3mCW4f3yk6h8fo0OVC1_1GkjOoZgnBuWGlnA&s=10"
          alt={`${r.client} testimonial`}
          className="aspect-video w-full object-cover transition duration-300 group-hover:scale-105"
        />

        <span className="absolute inset-0 grid place-items-center bg-black/30">
          <span className="grid size-14 place-items-center rounded-full bg-white text-purple-600 shadow-lg">
            <Play className="size-6 fill-purple-600" />
          </span>
        </span>
      </button>
    )}

    {r.verticalVideo && (
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => setActiveVideo(r.verticalVideo!)}
          className="group relative w-[180px] overflow-hidden rounded-2xl border border-slate-200"
        >
          <img
            src="https://img.youtube.com/vi/9gmhdP82l3k/maxresdefault.jpg"
            alt={`${r.client} short testimonial`}
            className="aspect-[9/16] w-full object-cover transition duration-300 group-hover:scale-105"
          />

          <span className="absolute inset-0 grid place-items-center bg-black/30">
            <span className="grid size-12 place-items-center rounded-full bg-white text-purple-600 shadow-lg">
              <Play className="size-5 fill-purple-600" />
            </span>
          </span>
        </button>
      </div>
    )}
  </div>
);


  return (
<div className="mx-auto max-w-7xl bg-[#f8f7f2] px-4 py-6 sm:px-6 lg:px-8">
<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
      {/* Header */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
  <div className="relative z-10 ">
  <div className="flex flex-col gap-6 md:flex-row md:items-start">

   <div className="grid size-25 place-items-center rounded-full border-4 border-white bg-white shadow-lg">
  {data.logoUrl ? (
    <img
      src={data.logoUrl}
      alt={data.name}
      className="h-full w-full rounded-full object-cover"
    />
  ) : (
    <span className="text-2xl font-bold tracking-widest text-slate-900">
      {data.logoText}
    </span>
  )}
</div>

      <div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold sm:text-3xl">{data.name}</h1>
          {data.verified ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
              <BadgeCheck className="size-4" />
              Verified Business
            </span>
          ) : null}
        </div>

        <div className="mt-4 inline-flex rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700">
          Industry: {data.overview.industry}
        </div>
      </div>
    </div>

    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
<button
  onClick={() => setShowEnquiryModal(true)}
  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 px-8 py-3 text-sm font-semibold text-white shadow-lg sm:w-auto"
>
  <Rocket className="size-4" />
  Enquire Now
</button>

<a
  href="https://www.bookasloth.com"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-900 backdrop-blur transition hover:bg-white/20 sm:w-auto"
>
  <CalendarDays className="size-4" />
  Book a Meeting
</a>
    </div>
  </div>

</section>
          {/* Overview */}
          {show.overview && (
            <Card className="p-5 sm:p-6">
              <h2 className="text-lg font-bold">About {data.name}</h2>
              {data.about ? (
  <>
  <p
    ref={aboutRef}
    className={cn(
      "mt-3 text-sm leading-relaxed whitespace-pre-line text-foreground/90",
      !showFullAbout && "line-clamp-9"
    )}
  >
    {data.about}
  </p>

  {showReadMore && (
    <button
      type="button"
      onClick={() => setShowFullAbout(!showFullAbout)}
      className="mt-3 text-sm font-semibold text-purple-600 hover:text-purple-700"
    >
      {showFullAbout ? "Show Less" : "Read More"}
    </button>
  )}
</>
) : null}
            </Card>
          )}

          {/* Highlights / stats */}
          {show.stats && (
            <Card className="p-5 sm:p-6">
              <h2 className="text-lg font-semibold">Highlights</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {data.stats!.map((s) => (
                  <Metric key={s.label} label={s.label} value={s.value} />
                ))}
              </div>
            </Card>
          )}
<Card className="overflow-hidden">
  <div className="flex overflow-x-auto border-b border-slate-200">
    {profileTabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveSection(tab.id)}
        className={cn(
          "whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-500 transition",
          activeSection === tab.id &&
            "border-b-2 border-purple-600 text-purple-600"
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>

  <div className="p-5 sm:p-6">
    {activeSection === "services" && show.products && (
      <div>
        <h2 className="text-lg font-bold">Our Services</h2>

        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {data.products!.map((p, index) => {

            return (
              <div
                key={p.name}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-hover:border-purple-200"
              >
                <div className="absolute " />

                <div className="mb-5 flex items-start justify-between gap-6">
  <div>
    <h3 className="text-lg font-bold text-slate-900">
      {p.name}
    </h3>
  </div>
</div>

                {p.description && (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {p.description}
                  </p>
                )}

                <div className="mt-5 flex items-center justify-end">
<button
  type="button"
  onClick={() => {
    setSelectedDocument("");
    setShowEnquiryModal(true);
  }}
  className="flex items-center gap-1 text-sm font-semibold text-purple-600 transition group-hover:gap-2"
>
  Enquire
  <ArrowRight className="size-4" />
</button>
</div>
              </div>
            );
          })}
        </div>
      </div>
    )}

    {activeSection === "team" && show.people && (
  <div>
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold">Our Team</h2>
        <p className="mt-1 text-sm text-slate-500">
          Meet the leaders behind our success.
        </p>
      </div>

      
    </div>

    <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
      {data.people!.map((m, index) => {
        const colors = [
          "from-purple-100 to-violet-50 text-purple-600",
          "from-blue-100 to-cyan-50 text-blue-600",
          "from-orange-100 to-yellow-50 text-orange-600",
          "from-green-100 to-emerald-50 text-green-600",
          "from-pink-100 to-rose-50 text-pink-600",
          "from-indigo-100 to-violet-50 text-indigo-600",
        ];

        return (
          <div
            key={m.name}
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-100
              bg-white
              p-5
              text-center
              shadow-sm
              transition-all
              duration-300
              hover:border-purple-200
            "
          >
            <div className="absolute" />

            <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-md">
  {m.image ? (
    <img
      src={m.image}
      alt={m.name}
      className="h-full w-full object-cover"
    />
  ) : (
    <div
      className={cn(
        "grid h-full w-full place-items-center bg-gradient-to-br text-lg font-bold",
        colors[index % colors.length]
      )}
    >
      {m.avatarText}
    </div>
  )}
</div>

            <h3 className="mt-4 text-base font-bold text-slate-900">
              {m.name}
            </h3>

            <p className="mt-1 min-h-[40px] text-sm leading-5 text-slate-500">
              {m.role}
            </p>
            {m.bio && (
  <p className=" min-h-[48px] text-xs leading-5 text-slate-500">
    {m.bio}
  </p>
)}

<div className="mt-4 flex flex-wrap justify-center gap-2">
      <a
    href="#"
    className="grid size-9 place-items-center rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] transition hover:scale-110"
  >
    <FaLinkedinIn className="text-sm" />
  </a>

  <a
    href="#"
    className="grid size-9 place-items-center rounded-lg bg-slate-100 text-black transition hover:scale-110"
  >
    <FaXTwitter className="text-sm" />
  </a>

  <a
    href="#"
    className="grid size-9 place-items-center rounded-lg bg-pink-100 text-pink-600 transition hover:scale-110"
  >
    <FaInstagram className="text-sm" />
  </a>

  <a
    href="#"
    className="grid size-9 place-items-center rounded-lg bg-blue-100 text-blue-600 transition hover:scale-110"
  >
    <FaFacebookF className="text-sm" />
  </a>

  {/* WhatsApp */}
  <a
    href="#"
    className="grid size-9 place-items-center rounded-lg bg-green-100 text-green-600 transition hover:scale-110"
  >
    <FaWhatsapp className="text-sm" />
  </a>
</div>
          </div>
        );
      })}
    </div>
  </div>
)}

    {activeSection === "clients" && (
  <div>
    <h2 className="text-lg font-bold">Our Clients</h2>

    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-5">
      {[
        {
          name: "NASA",
          logo:"/nasa.svg",
        },
        {
          name: "USSF",
          logo:"/usssf.svg",
        },
        {
          name: "Google",
          logo:"/google.svg",
        },
        {
          name: "OneWeb",
          logo:"/oneweb.svg",
        },
        {
          name: "Assets",
          logo:"/assets.jpg",
        },
      ].map((client) => {
        return (
          <div
            key={client.name}
            className="
              group
              rounded-2xl
              border
              border-slate-100
              bg-white
              p-5
              text-center
              shadow-sm
              transition-all
              duration-300
              hover:border-purple-200
            "
          >
           <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
  <img
    src={client.logo}
    alt={client.name}
    className="max-h-12 max-w-12 object-contain transition duration-300 group-hover:scale-110"
  />
</div>

            <p className="font-bold text-slate-900">
              {client.name}
            </p>
          </div>
        );
      })}
    </div>
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
   {[
  {
    icon: Users,
    value: "200+",
    label: "Clients Served",
  },
  {
    icon: Globe,
    value: "30+",
    label: "Countries",
  },
  {
    icon: Building2,
    value: "15+",
    label: "Years Experience",
  },
  {
    icon: Star,
    value: "98%",
    label: "Client Retention",
  },
].map(({ icon: Icon, value, label }) => (
  <div
    key={label}
    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4"
>
<div className="mt-1 grid size-10 shrink-0 place-items-center rounded-lg bg-purple-600 text-white">
      <Icon className="size-5" />
    </div>

    <div className="flex min-w-0 flex-col">
      <p className="text-2xl font-bold leading-none text-slate-900">
        {value}
      </p>

      <p className="mt-1 whitespace-nowrap text-sm leading-tight text-slate-500">
  {label}
</p>
    </div>
  </div>
))}
</div>
  </div>
)}
    {activeSection === "updates" && show.updates && (
      <div>
        <h2 className="text-lg font-bold">Recent Updates</h2>

        <ul className="mt-3 divide-y divide-border">
          {data.updates!.map((p, i) => (
            <li key={i} className="py-4 first:pt-0 last:pb-0">
              <p className="text-sm leading-relaxed text-foreground/90">
                {p.text}
              </p>
              <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                <span>{compact(p.likes)} likes</span>
                <span>{compact(p.comments)} comments</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}

    {activeSection === "roles" && show.jobs && (
      <div>
        <h2 className="text-lg font-bold">Open Roles</h2>

        <ul className="mt-3 divide-y divide-border">
          {data.jobs!.map((j, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-3 py-3 first:pt-0"
            >
              <div>
                <p className="text-sm font-medium">{j.title}</p>
                <p className="text-xs text-muted-foreground">
                  {j.location} · {j.type}
                </p>
              </div>

              <Link
                href="/sign-up"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
</Card>      
{/*Documents */}
<Card className="p-5 sm:p-6">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-lg font-bold">Documents</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Download key documents and resources.
      </p>
    </div>
  </div>

  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {[
      {
        name: "Company Profile",
        color: "from-red-100 to-red-50",
        text: "text-red-600",
      },
      {
        name: "Brochure",
        color: "from-orange-100 to-orange-50",
        text: "text-orange-600",
      },
      {
        name: "Pitch Deck",
        color: "from-yellow-100 to-yellow-50",
        text: "text-yellow-600",
      },
      {
        name: "Catalogue",
        color: "from-blue-100 to-blue-50",
        text: "text-blue-600",
      },
      {
        name: "Rate Card",
        color: "from-green-100 to-green-50",
        text: "text-green-600",
      },
    ].map((doc) => (
      <div
        key={doc.name}
        className="
          group
          rounded-2xl
          border
          border-slate-100
          bg-white
          p-4
          shadow-sm
          transition-all
          duration-300
          hover:border-purple-200
        "
      >
        {/* top */}
        <div className="mb-4 flex items-center justify-between">
          <div
            className={cn(
              "grid size-11 place-items-center rounded-xl bg-gradient-to-br",
              doc.color,
              doc.text
            )}
          >
            <FileText className="size-5" />
          </div>

          <button
  type="button"
  onClick={() => {
    setSelectedDocument(doc.name);
    setShowEnquiryModal(true);
  }}
>
  <Download className="size-4 text-slate-400 transition group-hover:text-purple-600" />
</button>
        </div>

        {/* title */}
        <p className="font-semibold text-slate-900">
          {doc.name}
        </p>

        {/* type */}
        <p className="mt-1 text-xs text-slate-500">
          PDF Document
        </p>

        
      </div>
    ))}
  </div>
</Card>
{/* Reviews */}
{show.reviews && (
  <Card className="p-5 sm:p-6">
    <h2 className="text-lg font-bold">Reviews & Testimonials</h2>

    <div className="mt-5 grid gap-4 lg:grid-cols-2">
      {/* Left column: Sarah + Jennifer */}
      <div className="grid gap-4">
        {data.reviews!
          .filter((_, i) => i !== 1)
          .map((r) => (
            <ReviewCard key={r.client} r={r} />
          ))}
      </div>

      {/* Right column: Michael */}
      <div>
        {data.reviews!
          .filter((_, i) => i === 1)
          .map((r) => (
            <ReviewCard key={r.client} r={r} tall />
          ))}
      </div>
    </div>
  </Card>
)}
        
        </div>

        {/* Right rail (persistent) */}
        <aside className="space-y-5 lg:sticky lg:top-6">
          <Card className="overflow-hidden p-4">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-sm font-bold">
        Favorite Company
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        Add to your favorites
      </p>
    </div>

    <button
      onClick={() => {
        setIsFavorite(!isFavorite);

        setAnimateHeart(true);

        setTimeout(() => {
          setAnimateHeart(false);
        }, 600);
      }}
      className="relative overflow-visible"
    >
      {/* burst */}
      {animateHeart && (
  <>
{/* top */}
<span
  className="heart-particle top-[-18px] left-1/2"
  style={{ "--tx": "0px", "--ty": "-40px" } as React.CSSProperties}
>
    <Heart className="size-3 fill-[#FF3040] text-[#FF3040]" />
</span>

{/* left */}
<span
  className="heart-particle left-[-22px] top-1/2"
  style={{ "--tx": "-35px", "--ty": "-10px" } as React.CSSProperties}
>
    <Heart className="size-3 fill-[#FF3040] text-[#FF3040]" />
</span>

{/* right */}
<span
  className="heart-particle right-[-22px] top-1/2"
  style={{ "--tx": "35px", "--ty": "-10px" } as React.CSSProperties}
>
  <Heart className="size-3 fill-[#FF3040] text-[#FF3040]" />
</span>

{/* bottom left */}
{/* bottom left */}
<span
  className="heart-particle left-[-10px] bottom-[-18px]"
  style={{ "--tx": "-25px", "--ty": "25px" } as React.CSSProperties}
>  <Heart className="size-3 fill-[#FF3040] text-[#FF3040]" />
</span>

{/* bottom right */}
{/* bottom right */}
<span
  className="heart-particle right-[-10px] bottom-[-18px]"
  style={{ "--tx": "25px", "--ty": "25px" } as React.CSSProperties}
>  <Heart className="size-3 fill-[#FF3040] text-[#FF3040]" />
</span>

    
  </>
)}
      <div
        className={cn(
          "grid size-11 place-items-center rounded-full transition-all duration-300",
          isFavorite
            ? "bg-red-50 scale-110"
            : "bg-slate-100 hover:bg-red-50"
        )}
      >
        <Heart
          className={cn(
  "size-5 transition-all duration-300",
  animateHeart && "animate-heart",
            isFavorite
              ? "fill-red-500 text-red-500 scale-125"
              : "text-slate-500"
          )}
        />
      </div>
    </button>
  </div>
</Card>
  <Card className="p-5">
    <h3 className="text-lg font-bold">Quick Facts</h3>

    <div className="mt-5 space-y-5 text-sm">
  <div className="flex gap-3">
    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-100  text-purple-600">
      <CalendarDays className="size-5" />
    </div>

    <div>
      <p className="font-semibold">Founded</p>
      <p className="text-muted-foreground">
        {data.overview.founded}
      </p>
    </div>
  </div>

  <div className="flex gap-3">
    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-100  text-purple-600">
      <MapPin className="size-5" />
    </div>

    <div>
      <p className="font-semibold">Headquarters</p>
      <p className="text-muted-foreground">
        {data.overview.headquarters}
      </p>
    </div>
  </div>

  <div className="flex gap-3">
    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-100  text-purple-600">
      <Building2 className="size-5" />
    </div>

    <div>
      <p className="font-semibold">Business Type</p>
      <p className="text-muted-foreground">
        {data.overview.type}
      </p>
    </div>
  </div>

  <div className="flex gap-3">
    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-100  text-purple-600">
      <ExternalLink className="size-5" />
    </div>

    <div>
      <p className="font-semibold">Website</p>

      <a
        href={data.website}
        target="_blank"
        className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700"
      >
        {data.website?.replace(/^https?:\/\//, "")}
      </a>
    </div>
  </div>
  <div className="mt-6 border-t pt-5">
  <p className="mb-3 text-sm font-semibold text-slate-900">
    Social Presence
  </p>

  <div className="flex flex-wrap gap-2">
    <a
      href="#"
      className="grid size-10 place-items-center rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] transition hover:scale-105"
    >
      <FaLinkedinIn className="text-base" />
    </a>

    <a
      href="#"
      className="grid size-10 place-items-center rounded-xl bg-pink-100 text-pink-600 transition hover:scale-105"
    >
      <FaInstagram className="text-base" />
    </a>

    <a
      href="#"
      className="grid size-10 place-items-center rounded-xl bg-blue-100 text-blue-600 transition hover:scale-105"
    >
      <FaFacebookF className="text-base" />
    </a>

    <a
      href="#"
      className="grid size-10 place-items-center rounded-xl bg-slate-100 text-black transition hover:scale-105"
    >
      <FaXTwitter className="text-base" />
    </a>

    <a
      href="#"
      className="grid size-10 place-items-center rounded-xl bg-red-100 text-red-600 transition hover:scale-105"
    >
      <FaYoutube className="text-base" />
    </a>
  </div>
</div>
</div>
  </Card>

  <Card className="p-5">
    <h3 className="text-lg font-bold">Contact {data.name}</h3>

    <div className="mt-5 space-y-4 text-sm">
      <p><b>Contact Person</b><br />Business Team</p>
      <p><b>Email</b><br />business@spacex.com</p>
      <p><b>Phone</b><br />+1 (310) 363-6000</p>
      <p><b>Office Address</b><br />1 Rocket Road, Hawthorne, CA 90250</p>
    </div>

    <button className="mt-6 w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white">
      Book a Meeting
    </button>

    <button className="mt-3 w-full rounded-xl border py-3 text-sm font-semibold">
      Contact Us
    </button>
  </Card>
  <Card className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
  <h3 className="mb-4 text-base font-bold">
    WeCos Trust Indicators
  </h3>

  <div className="space-y-2.5">
    {[
  {
    label: "Verified Business",
    value: "✓",
    icon: BadgeCheck,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "KYC Verified",
    value: "✓",
    icon:   ShieldCheck,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Active Since",
    value: "2024",
    icon: CalendarDays,
    color: "bg-purple-100 text-purple-600",
  },
  {
    label: "Response Time",
    value: "2h",
    icon: Clock,
    color: "bg-orange-100 text-orange-600",
  },
  {
    label: "Projects",
    value: "120+",
    icon: Rocket,
    color: "bg-pink-100 text-pink-600",
  },
  {
    label: "Repeat Rate",
    value: "85%",
    icon: Users,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    label: "On-Time",
    value: "96%",
    icon: AlarmClockCheck,
    color: "bg-green-100 text-green-600",
  },
  {
    label: "Rating",
    value: "4.8",
    icon: Star,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    label: "Endorsements",
    value: "120+",
    icon: Heart,
    color: "bg-red-100 text-red-600",
  },
].map(({ label, value, icon: Icon, color }) => (
      <div
        key={label}
        className="flex items-center justify-between py-1"
      >
        <div className="flex min-w-0 items-center gap-2">
          <div
  className={cn(
    "grid size-7 shrink-0 place-items-center rounded-full",
    color
  )}
>
  <Icon className="size-4" />
</div>

          <span className="truncate text-xs text-slate-700">
            {label}
          </span>
        </div>

        <span className="ml-2 shrink-0 text-xs font-semibold text-slate-900">
          {value}
        </span>
      </div>
    ))}
  </div>
</Card>

</aside>
{showEnquiryModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">
          Send Enquiry
        </h3>

        <button
          onClick={() => setShowEnquiryModal(false)}
          className="text-2xl text-slate-400 hover:text-slate-700"
        >
          ×
        </button>
      </div>

      <p className="mt-2 text-sm text-slate-500">
        {selectedDocument
  ? `Enter your email address to download ${selectedDocument}.`
  : `Enter your email address and we'll connect you with ${data.name}.`}
      </p>

      <input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-purple-500"
/>

{emailError && (
  <p className="mt-2 text-sm font-medium text-red-600">
    {emailError}
  </p>
)}

{successMessage && (
  <p className="mt-2 text-sm font-medium text-green-600">
    {successMessage}
  </p>
)}

      <div className="mt-5 flex gap-3">
        <button
onClick={async () => {
  setEmailError("");
  setSuccessMessage("");

  if (!email.trim()) {
    setEmailError("Email address is required.");
    return;
  }

  if (!validateEmail(email)) {
    setEmailError("Please enter a valid email address.");
    return;
  }

  try {
    const documentLinks: Record<string, string> = {
      "Company Profile": "/documents/company-profile.pdf",
      "Brochure": "/documents/brochure.pdf",
      "Pitch Deck": "/documents/pitch-deck.pdf",
      "Catalogue": "/documents/catalogue.pdf",
      "Rate Card": "/documents/rate-card.pdf",
    };

    const response = await fetch("/api/company-enquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: email,
        companyName: data.name,
        type: selectedDocument ? "document" : "enquiry",
        documentName: selectedDocument,
        documentLink: selectedDocument
          ? `${window.location.origin}${
              documentLinks[selectedDocument]
            }`
          : "",
      }),
    });

    if (!response.ok) {
      throw new Error("Email failed");
    }

    setSuccessMessage(
      selectedDocument
        ? "Document link has been sent to your email."
        : "Your enquiry has been submitted successfully."
    );

    setTimeout(() => {
      setShowEnquiryModal(false);
      setSuccessMessage("");
      setEmail("");
      setSelectedDocument("");
    }, 2000);

  } catch (err) {
    console.error(err);
    setEmailError("Failed to send email.");
  }
}}

          className="flex-1 rounded-xl bg-purple-600 py-3 font-medium text-white"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}
      </div>
      {activeVideo && (
<div
  ref={videoModalRef}
  tabIndex={-1}
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 outline-none"
  onClick={() => setActiveVideo(null)}
>
<div
  onClick={(e) => e.stopPropagation()}
  className={cn(
    "relative overflow-hidden rounded-2xl bg-black",
    activeVideo?.includes("9gmhdP82l3k")
      ? "w-full max-w-[360px]"
      : "w-full max-w-3xl"
  )}
>      <button
        onClick={() => setActiveVideo(null)}
        className="absolute right-4 top-3 z-10 text-3xl text-white"
      >
        ×
      </button>

      <iframe
        src={`${activeVideo}?autoplay=1`}
        title="Video testimonial"
className={
  activeVideo?.includes("9gmhdP82l3k")
    ? "aspect-[9/16] w-full"
    : "aspect-video w-full"
}        allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  </div>
)}
    </div>
    
    
  );
}
