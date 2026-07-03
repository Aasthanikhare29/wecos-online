import { Container } from "@/components/layout/container";

/**
 * Reusable on-brand placeholder for routes whose full UI is not built yet.
 * Keeps navigation working (no dead links) during the UI-first phase.
 */
export function PagePlaceholder({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      {eyebrow ? (
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {description ? (
        <p className="mt-4 max-w-md text-balance text-muted-foreground">{description}</p>
      ) : null}
      <span className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
        <span className="size-1.5 rounded-full bg-warning" />
        Coming soon
      </span>
    </Container>
  );
}
