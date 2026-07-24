import type { Translations } from "@webapp-factory/shared/i18n";

/**
 * DE dictionary for muscar.ai (Issue #16).
 * All copy matches BMAD Content Konzept section 2.2.
 */
const de: Translations = {
  nav: {
    home: "Startseite",
    blog: "Blog",
    contact: "Kontakt",
  },
  hero: {
    headline: "Vom Second Brain zum First Mind.",
    subline:
      "Dein Obsidian-Vault weiß mehr als jede KI-Sitzung. Der Context Router sorgt dafür, dass deine KI das auch weiß.",
    ctaNewsletter: "Zum Newsletter",
    ctaGitHub: "Auf GitHub ansehen",
  },
  problem: {
    heading: "Jede KI-Sitzung beginnt bei Null.",
    pain1: {
      title: "Unsichtbarer Kontext",
      text: "Deine Notizen, dein Kontext, dein Denken — für jede neue Konversation unsichtbar.",
    },
    pain2: {
      title: "Wiederholte Erklärungen",
      text: "Du erklärst denselben Hintergrund 50 Mal. Die KI erinnert sich nie.",
    },
    pain3: {
      title: "Kein gemeinsames Denkraum",
      text: "Dein Second Brain lebt in Obsidian. Dein KI-Brain lebt nirgends.",
    },
  },
  solution: {
    heading: "Der Context Router ändert das.",
    body: "muscar.ai ist ein Open-Source-MCP-Server, der deinen Obsidian-Vault mit jedem KI-Assistenten verbindet. Deine Notizen werden zum live Kontext. Dein Denken wird zur Grundlage — nicht zum Nachtrag.",
    step1: {
      title: "Verbinden",
      text: "Dein Obsidian-Vault wird zum Context Store.",
    },
    step2: {
      title: "Routen",
      text: "Die richtigen Notizen zur richtigen Zeit.",
    },
    step3: {
      title: "Denken",
      text: "KI, die weiß, wo du aufgehört hast.",
    },
  },
  openSource: {
    heading: "Für Systems Thinkers. Offen für alle.",
    body: "muscar.ai ist MIT-lizenziert. Keine Abos, kein Lock-in. Nur ein Tool, das dein bestehendes System smarter macht.",
    ctaStar: "Star auf GitHub",
    ctaDocs: "Dokumentation",
  },
  newsletter: {
    heading: "Bleib dran.",
    subline:
      "Neue Releases, Architektur-Einblicke und Gedanken-im-Fluss-Posts. Kein Spam. Jederzeit abmeldbar.",
    placeholder: "deine@email.de",
    submit: "Abonnieren",
    success: "Prüfe deinen Posteingang zur Bestätigung.",
    error: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
  },
  footer: {
    copyright: "Gebaut von einem Systemdenker für Systemdenker.",
    legal: "Rechtliches",
  },
};

export default de;
