import type { Translations } from "@webapp-factory/shared/i18n";

/**
 * EN dictionary for patchworkheroes.de.
 * Keys match the page sections expected by Agent 3 (Issue #24).
 */
const en: Translations = {
  nav: {
    home: "Home",
    blog: "Blog",
    contact: "Contact",
  },
  hero: {
    headline: "Patchwork Heroes",
    subline: "Clarity, strength and practical tools for patchwork families.",
  },
  newsletter: {
    placeholder: "your@email.com",
    submit: "Start the 7-day reset",
    success: "Check your inbox to confirm.",
    error: "Something went wrong. Please try again.",
  },
  footer: {
    legal: "Legal",
  },
};

export default en;
