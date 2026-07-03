export const industries = [
  "SaaS",
  "Fintech",
  "E-commerce",
  "Healthtech",
  "Edtech",
  "AI / ML",
  "Consumer",
  "Marketplace",
  "Deeptech",
  "Services",
  "Other",
] as const;

export const stages = [
  "Idea",
  "Building MVP",
  "Launched",
  "Early Revenue",
  "Scaling",
] as const;

export type Industry = (typeof industries)[number];
export type Stage = (typeof stages)[number];
