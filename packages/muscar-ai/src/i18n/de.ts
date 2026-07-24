import type { Translations } from "@webapp-factory/shared/i18n";

/**
 * DE dictionary for muscar.ai.
 * Keys match the page sections expected by Agent 2 (Issue #16).
 */
const de: Translations = {
  nav: {
    home: "Startseite",
    blog: "Blog",
    contact: "Kontakt",
  },
  hero: {
    headline: "muscar.ai",
    subline: "Open-Source-Tools für Systemdenker.",
  },
  newsletter: {
    placeholder: "deine@email.de",
    submit: "Abonnieren",
    success: "Prüfe deinen Posteingang zur Bestätigung.",
    error: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
  },
  footer: {
    legal: "Rechtliches",
  },
};

export default de;
