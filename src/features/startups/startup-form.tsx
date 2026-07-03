"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { startupSchema, type StartupValues } from "@/features/startups/schema";
import { industries, stages } from "@/features/startups/constants";
import { useAppStore } from "@/lib/store/app-store";
import { Field } from "@/components/form/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50";

/** Native <select> registers "" for the empty option; convert it to undefined. */
const emptyToUndefined = (v: string) => (v === "" ? undefined : v);

export function StartupForm({
  defaultValues,
  submitLabel = "Save changes",
  onSaved,
}: {
  defaultValues?: Partial<StartupValues>;
  submitLabel?: string;
  onSaved?: () => void;
}) {
  const saveStartup = useAppStore((s) => s.saveStartup);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StartupValues>({
    resolver: zodResolver(startupSchema),
    defaultValues: {
      name: "",
      tagline: "",
      website: "",
      location: "",
      description: "",
      logoUrl: "",
      ...defaultValues,
    },
  });

  const onSubmit = (values: StartupValues) => {
    saveStartup(values);
    toast.success("Startup page saved");
    onSaved?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field label="Startup name" htmlFor="name" required error={errors.name?.message}>
        <Input id="name" placeholder="Terracotta & Co." {...register("name")} />
      </Field>
      <Field
        label="Tagline"
        htmlFor="tagline"
        hint="A short, punchy description"
        error={errors.tagline?.message}
      >
        <Input id="tagline" placeholder="Sustainable homeware, reimagined" {...register("tagline")} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Industry" htmlFor="industry" error={errors.industry?.message}>
          <select
            id="industry"
            className={selectClass}
            {...register("industry", { setValueAs: emptyToUndefined })}
          >
            <option value="">Select industry</option>
            {industries.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Stage" htmlFor="stage" error={errors.stage?.message}>
          <select
            id="stage"
            className={selectClass}
            {...register("stage", { setValueAs: emptyToUndefined })}
          >
            <option value="">Select stage</option>
            {stages.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Website" htmlFor="website" error={errors.website?.message}>
          <Input id="website" placeholder="https://…" {...register("website")} />
        </Field>
        <Field label="Location" htmlFor="location" error={errors.location?.message}>
          <Input id="location" placeholder="Pune, India" {...register("location")} />
        </Field>
      </div>

      <Field label="About the startup" htmlFor="description" error={errors.description?.message}>
        <Textarea
          id="description"
          rows={5}
          placeholder="What are you building, for whom, and why now?"
          {...register("description")}
        />
      </Field>
      <Field
        label="Logo URL"
        htmlFor="logoUrl"
        hint="Logo upload arrives with the backend phase"
        error={errors.logoUrl?.message}
      >
        <Input id="logoUrl" placeholder="https://…" {...register("logoUrl")} />
      </Field>

      <Button type="submit" disabled={isSubmitting} className="h-10">
        {submitLabel}
      </Button>
    </form>
  );
}
