import type { Translations } from "@webapp-factory/shared/i18n";

/**
 * DE dictionary for patchworkheroes.de.
 * Keys match the page sections expected by Agent 3 (Issue #24).
 */
const de: Translations = {
  nav: {
    home: "Startseite",
    blog: "Blog",
    contact: "Kontakt",
  },
  hero: {
    headline: "Patchwork Heroes",
    subline: "Klarheit, Stärke und praktische Tools für Patchworkfamilien.",
  },
  newsletter: {
    placeholder: "deine@email.de",
    submit: "7-Tage-Reset starten",
    success: "Prüfe deinen Posteingang zur Bestätigung.",
    error: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
  },
  footer: {
    legal: "Rechtliches",
  },
};

export default de;
