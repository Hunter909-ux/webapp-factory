import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

/**
 * muscar.ai — Astro configuration (ADR-W1: pure SSG).
 * i18n: English is the primary language, German lives under /de/ (ADR PRD 2.3).
 */
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? "https://muscar.ai",
  output: "static",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
