import { useEffect, useMemo, useState } from "react";

type Project = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  role?: string;
  links?: {
    github?: string;
    githubLabel?: string;
    demo?: string;
    website?: string;
    paper?: string;
  };
  coverImage?: string;
};

type Props = {
  projects: Project[];
};

const allLabel = "All";
const baseUrl = import.meta.env.BASE_URL;
const tagLabels: Record<string, string> = {
  astro: "Astro",
  cloud: "Cloud",
  dataviz: "Data Viz",
  design: "Design",
  frontend: "Frontend",
  fullstack: "Full Stack",
  ml: "ML",
  nodejs: "Node.js",
  performance: "Performance",
  python: "Python",
  react: "React",
  research: "Research",
};

function toPublicUrl(path: string) {
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${baseUrl}${normalized}`;
}

function toPageUrl(path: string) {
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${baseUrl}${normalized}`;
}

function toDisplayLabel(value: string) {
  return tagLabels[value] ?? value.replace(/(^|\s|-)\S/g, (match) => match.toUpperCase());
}

function getQueryParam(name: string) {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(name) ?? "";
}

function updateQuery(params: Record<string, string>) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  });
  window.history.replaceState({}, "", url.toString());
}

export default function ProjectFilter({ projects }: Props) {
  const allTags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.tags.forEach((tag) => set.add(tag)));
    return [allLabel, ...Array.from(set).sort()];
  }, [projects]);

  const [selectedTag, setSelectedTag] = useState(allLabel);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const initialTag = getQueryParam("tag");
    const initialQuery = getQueryParam("q");
    if (initialTag) setSelectedTag(initialTag);
    if (initialQuery) setQuery(initialQuery);
  }, []);

  useEffect(() => {
    updateQuery({
      tag: selectedTag !== allLabel ? selectedTag : "",
      q: query,
    });
  }, [selectedTag, query]);

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const matchesTag = selectedTag === allLabel || project.tags.includes(selectedTag);
      const matchesQuery = !query
        ? true
        : `${project.title} ${project.description} ${project.tags.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase());
      return matchesTag && matchesQuery;
    });
  }, [projects, selectedTag, query]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`pill border-black ${
                selectedTag === tag ? "bg-black text-white" : "bg-white"
              }`}
            >
              {toDisplayLabel(tag)}
            </button>
          ))}
        </div>
        <div className="w-full shrink-0 xl:w-56">
          <input
            className="w-full rounded-full border-2 border-black px-4 py-2 text-sm font-mono"
            placeholder="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {filtered.map((project) => {
          const projectHref = toPageUrl(`projects/${project.slug}`);
          const coverImage = project.coverImage ? toPublicUrl(project.coverImage) : "";
          const visualClassName = coverImage
            ? "project-card-visual h-72 border-b-2 border-black md:h-80"
            : "project-card-visual h-36 border-b-2 border-black md:h-80";

          return (
            <article key={project.slug} className="card flex flex-col overflow-hidden rounded-3xl">
              <div className={visualClassName}>
                <a
                  href={projectHref}
                  className="block h-full"
                  aria-label={`View ${project.title}`}
                >
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={project.title}
                      className="project-card-image h-full w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="project-card-fallback" aria-hidden="true" />
                  )}
                </a>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div>
                  <h3 className="text-xl font-semibold">
                    <a href={projectHref} className="hover:underline">
                      {project.title}
                    </a>
                  </h3>
                  <p className="mt-2 text-sm text-black/80">{project.description}</p>
                </div>
                {project.role && (
                  <div className="text-xs font-mono uppercase tracking-wide">{project.role}</div>
                )}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="pill border-black">
                      {toDisplayLabel(tag)}
                    </span>
                  ))}
                </div>
                {project.links?.github && (
                  <div className="mt-auto flex flex-wrap items-center gap-3 text-sm font-mono">
                    <a className="pill border-black" href={project.links.github} target="_blank" rel="noreferrer">
                      Git Repo
                    </a>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
