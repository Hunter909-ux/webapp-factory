import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

/**
 * patchworkheroes.de — Astro configuration (ADR-W1: pure SSG).
 * i18n: German is the primary language, English lives under /en/ (PRD 2.3).
 */
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? "https://patchworkheroes.de",
  output: "static",
  i18n: {
    defaultLocale: "de",
    locales: ["de", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
