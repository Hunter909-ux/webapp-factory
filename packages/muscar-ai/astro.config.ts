import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

/**
 * muscar.ai — Astro configuration (ADR-W1: pure SSG).
 * i18n: English is the primary language, German lives under /de/ (ADR PRD 2.3).
 * Sitemap filters legal/noindex pages (Issue #12).
 * Security headers are also declared in public/_headers for production static
 * hosting (Zeabur), because SSG does not emit HTTP headers itself.
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
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return !pathname.includes("/impressum") && !pathname.includes("/datenschutz");
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    headers: {
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy":
        "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://plausible.io; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
      "X-Robots-Tag": "noai, noimageai",
    },
  },
});
