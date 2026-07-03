import { ArrowUpRight, Handshake, Mail, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/features/profiles/schema";

export function profileInitials(name: string) {
  return (
    name
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "W"
  );
}

/**
 * Presentational profile card — pure, no store. Shared by the owner's dashboard
 * view and the public founder page. Pass `email` ONLY for the owner's own view;
 * omit it on public pages (privacy). Rich sections render only when present.
 */
export function ProfileView({
  profile,
  email,
}: {
  profile: Profile;
  email?: string;
}) {
  const name = profile.fullName || "Founder";

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-start gap-4">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={name}
            className="size-16 rounded-full object-cover"
          />
        ) : (
          <span className="grid size-16 place-items-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
            {profileInitials(name)}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-xl font-semibold">{name}</h2>
          {profile.headline ? (
            <p className="text-muted-foreground">{profile.headline}</p>
          ) : null}
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {email ? (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3.5" />
                {email}
              </span>
            ) : null}
            {profile.location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {profile.location}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {profile.bio ? (
        <p className="mt-6 text-sm leading-relaxed whitespace-pre-line text-foreground/90">
          {profile.bio}
        </p>
      ) : null}

      {profile.openTo ? (
        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-border bg-accent/40 p-4">
          <Handshake className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-sm">
            <span className="font-medium">Open to </span>
            <span className="text-muted-foreground">{profile.openTo}</span>
          </p>
        </div>
      ) : null}

      {profile.skills?.length ? (
        <div className="mt-6">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Skills
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {profile.links?.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {profile.links.map((l) => (
            <a
              key={l.href + l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              {l.label}
              <ArrowUpRight className="size-3.5" />
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
