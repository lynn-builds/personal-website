import type { CollectionEntry } from "astro:content";

type ProjectEntry = CollectionEntry<"projects">;

export const projectOrder = [
  "illumination-plus",
  "ransomware-protection-dashboard",
  "static-frame-filtering",
  "zillow-housing-metrics",
  "food-nutrition-diabetes-visualization",
  "auroramap",
  "cryovr-biotest-module",
  "llm-visualization-agent",
  "ai-claims-video-review",
  "enterprise-sales-inventory-analytics",
  "impending-bloom",
  "azure-marketplace-onboarding",
] as const;

const projectOrderIndex = new Map(projectOrder.map((slug, index) => [slug, index]));

export function sortProjects(projects: ProjectEntry[]) {
  return [...projects].sort((a, b) => {
    const aOrder = projectOrderIndex.get(a.slug) ?? Number.POSITIVE_INFINITY;
    const bOrder = projectOrderIndex.get(b.slug) ?? Number.POSITIVE_INFINITY;

    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.data.date < b.data.date ? 1 : -1;
  });
}
