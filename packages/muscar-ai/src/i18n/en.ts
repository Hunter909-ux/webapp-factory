import type { Translations } from "@webapp-factory/shared/i18n";

/**
 * EN dictionary for muscar.ai.
 * Keys match the page sections expected by Agent 2 (Issue #16).
 */
const en: Translations = {
  nav: {
    home: "Home",
    blog: "Blog",
    contact: "Contact",
  },
  hero: {
    headline: "muscar.ai",
    subline: "Open-source tools for systems thinkers.",
  },
  newsletter: {
    placeholder: "your@email.com",
    submit: "Subscribe",
    success: "Check your inbox to confirm.",
    error: "Something went wrong. Please try again.",
  },
  footer: {
    legal: "Legal",
  },
};

export default en;
