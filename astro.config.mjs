import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://lynnhan.me",
  base: "/",
  integrations: [react(), tailwind()],
  vite: {
    optimizeDeps: {
      include: ["three", "three/examples/jsm/controls/OrbitControls.js"],
    },
  },
});
