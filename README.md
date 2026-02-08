# Portfolio + Blog (Astro)

Modern editorial portfolio with Astro, Tailwind, React islands, and content collections.

## Setup

1. Install dependencies

```bash
npm install
```

2. Update GitHub Pages settings in `astro.config.mjs`

- `site`: `https://<username>.github.io`
- `base`: `/<repo-name>/`

Example for a repo named `personal-website`:

```js
site: "https://lynnhan.github.io",
base: "/personal-website/",
```

3. Run locally

```bash
npm run dev
```

## Content

- Projects: `src/content/projects/*.md`
- Blog posts: `src/content/blog/*.md`

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In GitHub repo settings: Pages → Build and deployment → Source = GitHub Actions.
3. The workflow at `.github/workflows/deploy.yml` will build and deploy on every push to `main`.

## Notes

- Project images live in `public/projects`.
- The projects filter uses a React island and preserves `?tag=` and `?q=`.
