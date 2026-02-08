import { useEffect, useMemo, useState } from "react";

type Project = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  role?: string;
  links?: { github?: string; demo?: string };
  coverImage?: string;
};

type Props = {
  projects: Project[];
};

const allLabel = "All";
const baseUrl = import.meta.env.BASE_URL;

function toPublicUrl(path: string) {
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${baseUrl}${normalized}`;
}

function toPageUrl(path: string) {
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${baseUrl}${normalized}`;
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
      <div className="flex flex-wrap items-center gap-3">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`pill border-black ${
              selectedTag === tag ? "bg-black text-white" : "bg-white"
            }`}
          >
            {tag}
          </button>
        ))}
        <div className="ml-auto flex w-full items-center gap-2 md:w-auto">
          <label className="font-mono text-xs uppercase tracking-wide">cat</label>
          <input
            className="w-full rounded-full border-2 border-black px-4 py-2 text-sm font-mono md:w-56"
            placeholder="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <article key={project.slug} className="card flex flex-col overflow-hidden rounded-3xl">
            <div className="project-card-visual h-40 border-b-2 border-black">
              <a
                href={toPageUrl(`projects/${project.slug}`)}
                className="block h-full"
                aria-label={`View ${project.title}`}
              >
                <img
                  src={toPublicUrl(project.coverImage || `projects/${project.slug}.png`)}
                  alt={project.title}
                  className="project-card-image h-full w-full object-cover"
                  loading="lazy"
                />
              </a>
            </div>
            <div className="flex flex-1 flex-col gap-4 p-6">
              <div>
                <h3 className="text-xl font-semibold">
                  <a href={toPageUrl(`projects/${project.slug}`)} className="hover:underline">
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
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex flex-wrap items-center gap-3 text-sm font-mono">
                <a className="pill border-black" href={toPageUrl(`projects/${project.slug}`)}>cat ./case-study</a>
                {project.links?.demo && (
                  <a className="pill border-black" href={project.links.demo} target="_blank" rel="noreferrer">
                    open demo
                  </a>
                )}
                {project.links?.github && (
                  <a className="pill border-black" href={project.links.github} target="_blank" rel="noreferrer">
                    git repo
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
