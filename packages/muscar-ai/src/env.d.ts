/// <reference types="astro/client" />

/** Typed environment variables (values live in Zeabur env vars or local .env). */
interface ImportMetaEnv {
  /** Base URL of the Ghost instance for this site. */
  readonly GHOST_URL: string;
  /** Ghost Content API key (read-only). */
  readonly GHOST_CONTENT_KEY: string;
  /** Ghost Admin API key (write access, optional at build time). */
  readonly GHOST_ADMIN_KEY?: string;
  /** Public site URL, e.g. https://muscar.ai */
  readonly PUBLIC_SITE_URL: string;
  /** Plausible analytics domain. */
  readonly PUBLIC_PLAUSIBLE_DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
