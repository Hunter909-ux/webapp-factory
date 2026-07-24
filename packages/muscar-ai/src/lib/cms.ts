/**
 * CMS wiring for muscar.ai — the ONLY file that knows which adapter is used.
 * Astro pages/components import `cms` and talk to the ContentPort interface.
 * Swapping Ghost for another CMS means changing only this file (ADR-W0).
 */
import { createGhostAdapter } from "@webapp-factory/shared/cms/adapters/ghost";
import type { ContentPort } from "@webapp-factory/shared/cms/ports";

/**
 * Creates the shared Ghost adapter using environment variables available at
 * SSG build time. `process.env` is used because it reliably receives values
 * from the Docker build environment; `import.meta.env` is kept as fallback.
 */
export const cms: ContentPort = createGhostAdapter({
  url: import.meta.env.GHOST_URL,
  contentKey: process.env.GHOST_CONTENT_KEY || import.meta.env.GHOST_CONTENT_KEY,
  adminKey: process.env.GHOST_ADMIN_KEY || import.meta.env.GHOST_ADMIN_KEY,
});
