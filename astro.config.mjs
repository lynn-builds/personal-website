import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://lynn-builds.github.io",
  base: process.env.NODE_ENV === "development" ? "/" : "/personal-website/",
  integrations: [react(), tailwind()],
});
