import { defineCollection, z } from "astro:content";

/**
 * Legal content collection — Impressum and Datenschutz.
 * The page components enforce noindex (Issue #9).
 */
const legal = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { legal };
