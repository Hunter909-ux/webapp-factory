/**
 * Schema.org JSON-LD helpers for SEO/AEO (Issue #12).
 *
 * These are pure object factories — no framework dependencies. Pages pass the
 * returned object(s) to the SEOHead component, which serializes them as
 * application/ld+json scripts.
 */

export interface WebSiteSchemaInput {
  name: string;
  url: string;
  description?: string;
}

export interface OrganizationSchemaInput {
  name: string;
  url: string;
  logo?: string;
  sameAs?: readonly string[];
}

export interface ArticleSchemaInput {
  headline: string;
  url: string;
  author: string;
  publishedAt: string | null;
  modifiedAt?: string | null;
  description?: string;
  image?: string | null;
}

export interface PersonSchemaInput {
  name: string;
  url: string;
  image?: string;
  sameAs?: readonly string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

/** Schema.org WebSite object. */
export function createWebSiteSchema(input: WebSiteSchemaInput): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: input.name,
    url: input.url,
    description: input.description,
  };
}

/** Schema.org Organization object. */
export function createOrganizationSchema(input: OrganizationSchemaInput): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input.name,
    url: input.url,
    logo: input.logo,
    sameAs: input.sameAs,
  };
}

/** Schema.org Person object (for founder/owner pages). */
export function createPersonSchema(input: PersonSchemaInput): object {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: input.name,
    url: input.url,
    image: input.image,
    sameAs: input.sameAs,
  };
}

/** Schema.org Article object (for blog posts). */
export function createArticleSchema(input: ArticleSchemaInput): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    url: input.url,
    description: input.description,
    image: input.image,
    author: { "@type": "Person", name: input.author },
    datePublished: input.publishedAt,
    dateModified: input.modifiedAt ?? input.publishedAt,
  };
}

/** Schema.org FAQPage object (AEO — answer engine optimization). */
export function createFAQSchema(items: readonly FAQItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
