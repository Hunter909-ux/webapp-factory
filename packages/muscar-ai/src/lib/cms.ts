/**
 * CMS wiring for muscar.ai — the ONLY file that knows which adapter is used.
 * Astro pages/components import `cms` and talk to the ContentPort interface.
 * Swapping Ghost for another CMS means changing only this file (ADR-W0).
 */
import { createGhostAdapter } from "@webapp-factory/shared/cms/adapters/ghost";
import type { ContentPort } from "@webapp-factory/shared/cms/ports";

export const cms: ContentPort = createGhostAdapter({
  url: import.meta.env.GHOST_URL,
  contentKey: process.env.GHOST_CONTENT_KEY ?? import.meta.env.GHOST_CONTENT_KEY,
  adminKey: process.env.GHOST_ADMIN_KEY ?? import.meta.env.GHOST_ADMIN_KEY,
});
