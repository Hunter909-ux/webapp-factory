import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { cms } from "../lib/cms";

export const GET: APIRoute = async (context) => {
  const site = context.site?.toString() ?? "https://patchworkheroes.de";
  let posts: { title: string; slug: string; excerpt: string; published_at: string | null }[] = [];
  try {
    posts = await cms.getPosts({ limit: 20 });
  } catch {
    // Empty feed when Ghost is not yet connected.
  }
  return rss({
    title: "Patchwork Heroes â€” Blog",
    description: "Neueste BeitrÃ¤ge von Patchwork Heroes",
    site,
    items: posts.map((post) => ({
      title: post.title,
      link: `${site}blog/${post.slug}/`,
      description: post.excerpt,
      pubDate: post.published_at ? new Date(post.published_at) : new Date(),
    })),
  });
};
