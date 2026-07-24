import type { Translations } from "@webapp-factory/shared/i18n";

/**
 * EN dictionary for muscar.ai (Issue #16).
 * All copy matches BMAD Content Konzept section 2.1.
 */
const en: Translations = {
  nav: {
    home: "Home",
    blog: "Blog",
    contact: "Contact",
  },
  hero: {
    headline: "From Second Brain to First Mind.",
    subline:
      "Your Obsidian vault knows more than any AI session. The Context Router makes sure your AI does too.",
    ctaNewsletter: "Join the Newsletter",
    ctaGitHub: "View on GitHub",
  },
  problem: {
    heading: "Every AI session starts at zero.",
    pain1: {
      title: "Invisible context",
      text: "Your notes, your context, your thinking — invisible to every new AI conversation.",
    },
    pain2: {
      title: "Groundhog explanations",
      text: "You explain the same background 50 times. The AI never remembers.",
    },
    pain3: {
      title: "Nowhere to think together",
      text: "Your second brain sits in Obsidian. Your AI brain sits nowhere.",
    },
  },
  solution: {
    heading: "The Context Router changes that.",
    body: "muscar.ai is an open-source MCP server that connects your Obsidian vault to any AI assistant. Your notes become live context. Your thinking becomes the foundation — not the afterthought.",
    step1: {
      title: "Connect",
      text: "Your Obsidian vault becomes a context store.",
    },
    step2: {
      title: "Route",
      text: "The right notes surface at the right moment.",
    },
    step3: {
      title: "Think",
      text: "AI that knows where you left off.",
    },
  },
  openSource: {
    heading: "Built for Systems Thinkers. Open for Everyone.",
    body: "muscar.ai is MIT licensed. No subscriptions, no lock-in. Just a tool that makes your existing system smarter.",
    ctaStar: "Star on GitHub",
    ctaDocs: "Read the Docs",
  },
  newsletter: {
    heading: "Stay in the loop.",
    subline:
      "New releases, architecture insights, and thinking-out-loud posts. No spam. Unsubscribe anytime.",
    placeholder: "your@email.com",
    submit: "Subscribe",
    success: "Check your inbox to confirm your subscription.",
    error: "Something went wrong. Please try again.",
  },
  footer: {
    copyright: "Built by a systems thinker, for systems thinkers.",
    legal: "Legal",
  },
};

export default en;
