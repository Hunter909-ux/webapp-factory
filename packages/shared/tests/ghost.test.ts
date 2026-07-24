/**
 * Unit tests for the GhostAdapter (Issue #3 acceptance criterion).
 * Runs against a mocked fetch — no real Ghost instance required.
 * Run with: pnpm --filter @webapp-factory/shared test
 */
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { createGhostAdapter, GhostApiError, mapGhostPost } from "../src/cms/adapters/ghost.ts";

/** Minimal Ghost API post fixture as returned by the Content API. */
const ghostApiPost = {
  id: "abc123",
  title: "Hello World",
  slug: "hello-world",
  html: "<p>Hi</p>",
  custom_excerpt: "Custom excerpt",
  excerpt: "Auto excerpt",
  feature_image: null,
  published_at: "2026-07-24T10:00:00.000Z",
  tags: [{ id: "t1", name: "News", slug: "news", description: null }],
  meta_title: null,
  meta_description: null,
  og_image: null,
  status: "published",
};

const originalFetch = globalThis.fetch;

/** Install a fetch mock that returns the given JSON payload. */
function mockFetch(payload: unknown, status = 200): { calls: string[] } {
  const calls: string[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    calls.push(String(input));
    return new Response(JSON.stringify(payload), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;
  return { calls };
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("GhostAdapter.getPosts", () => {
  it("returns mapped Post[] from the Content API", async () => {
    const { calls } = mockFetch({ posts: [ghostApiPost] });
    const cms = createGhostAdapter({ url: "https://ghost.test", contentKey: "ck" });
    const posts = await cms.getPosts();
    assert.equal(posts.length, 1);
    const post = posts[0];
    assert.ok(post);
    assert.equal(post.id, "abc123");
    assert.equal(post.title, "Hello World");
    assert.equal(post.excerpt, "Custom excerpt");
    assert.equal(post.tags[0]?.slug, "news");
    assert.equal(post.status, "published");
    // The request must go to the Content API with the content key.
    assert.match(calls[0] ?? "", /\/ghost\/api\/content\/posts\/\?/);
    assert.match(calls[0] ?? "", /key=ck/);
  });

  it("passes pagination and tag filter as query params", async () => {
    const { calls } = mockFetch({ posts: [] });
    const cms = createGhostAdapter({ url: "https://ghost.test", contentKey: "ck" });
    await cms.getPosts({ limit: 10, page: 2, tag: "news" });
    assert.match(calls[0] ?? "", /limit=10/);
    assert.match(calls[0] ?? "", /page=2/);
    assert.match(calls[0] ?? "", /filter=tag%3Anews/);
  });
});

describe("GhostAdapter.getPostBySlug", () => {
  it("returns null for a 404 response", async () => {
    mockFetch({ errors: [{ message: "not found" }] }, 404);
    const cms = createGhostAdapter({ url: "https://ghost.test", contentKey: "ck" });
    const post = await cms.getPostBySlug("missing");
    assert.equal(post, null);
  });
});

describe("GhostAdapter error handling", () => {
  it("throws a typed GhostApiError on server errors", async () => {
    mockFetch({ errors: [{ message: "boom" }] }, 500);
    const cms = createGhostAdapter({ url: "https://ghost.test", contentKey: "ck" });
    await assert.rejects(
      () => cms.getPosts(),
      (error: unknown) => error instanceof GhostApiError && error.status === 500,
    );
  });

  it("rejects write operations without an admin key", async () => {
    const cms = createGhostAdapter({ url: "https://ghost.test", contentKey: "ck" });
    await assert.rejects(
      () => cms.createPost({ title: "x", html: "<p>x</p>" }),
      (error: unknown) => error instanceof GhostApiError && error.status === 0,
    );
  });
});

describe("mapGhostPost", () => {
  it("falls back to auto excerpt and empty html", () => {
    const post = mapGhostPost({ ...ghostApiPost, custom_excerpt: null, html: null });
    assert.equal(post.excerpt, "Auto excerpt");
    assert.equal(post.html, "");
  });
});
