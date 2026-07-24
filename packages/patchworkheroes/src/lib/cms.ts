/**
 * CMS wiring for patchworkheroes.de — the ONLY file that knows which adapter
 * is used. Astro pages/components import `cms` and talk to the ContentPort
 * interface. Swapping Ghost means changing only this file (ADR-W0).
 */
import { createGhostAdapter } from "@webapp-factory/shared/cms/adapters/ghost";
import type { ContentPort } from "@webapp-factory/shared/cms/ports";

// Debug: log env values at build time.
console.log("[cms] GHOST_URL=", import.meta.env.GHOST_URL, "GHOST_CONTENT_KEY=", import.meta.env.GHOST_CONTENT_KEY ? "set" : "missing");

export const cms: ContentPort = createGhostAdapter({
  url: import.meta.env.GHOST_URL,
  contentKey: import.meta.env.GHOST_CONTENT_KEY,
  adminKey: import.meta.env.GHOST_ADMIN_KEY,
});
