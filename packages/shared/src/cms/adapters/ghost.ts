/**
 * Ghost adapter (default adapter, ADR-W0 / ADR-W3).
 *
 * All Ghost-specific API calls live in this file — nowhere else.
 * Read operations use the public Content API; write operations use the
 * authenticated Admin API (JWT signed with the admin key).
 *
 * Replacing Ghost with another CMS only requires a new adapter that
 * implements the same ports — the Astro layer stays untouched.
 */
import { createHmac } from "node:crypto";
import type {
  ContentPort,
  ContentQueryOptions,
  CreatePostInput,
  NewsletterPort,
  Page,
  Post,
  Tag,
} from "../ports.js";

/** Configuration for one Ghost instance (one per site, ADR-W3). */
export interface GhostConfig {
  /** Base URL of the Ghost instance, e.g. https://ghost.example.com */
  readonly url: string;
  /** Content API key — read-only, public by design. */
  readonly contentKey: string;
  /** Admin API key ("id:secret") — required for write operations only. */
  readonly adminKey?: string;
}

/** Typed error for any failed Ghost API call. */
export class GhostApiError extends Error {
  /** HTTP status code returned by Ghost (0 for network errors). */
  readonly status: number;
  /** API endpoint that failed (without query string / secrets). */
  readonly endpoint: string;
  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.name = "GhostApiError";
    this.status = status;
    this.endpoint = endpoint;
  }
}

/** Shape of a post/page object returned by the Ghost API (subset we use). */
interface GhostApiPost {
  id: string;
  title: string;
  slug: string;
  html: string | null;
  custom_excerpt: string | null;
  excerpt: string | null;
  feature_image: string | null;
  published_at: string | null;
  tags?: GhostApiTag[];
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  status?: string;
}

/** Shape of a tag object returned by the Ghost API (subset we use). */
interface GhostApiTag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

/** Map a Ghost API tag to the shared Tag type. */
function mapGhostTag(tag: GhostApiTag): Tag {
  return { id: tag.id, name: tag.name, slug: tag.slug, description: tag.description };
}

/** Map a Ghost API post to the shared Post type. */
export function mapGhostPost(post: GhostApiPost): Post {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    html: post.html ?? "",
    excerpt: post.custom_excerpt ?? post.excerpt ?? "",
    feature_image: post.feature_image,
    published_at: post.published_at,
    tags: (post.tags ?? []).map(mapGhostTag),
    meta_title: post.meta_title,
    meta_description: post.meta_description,
    og_image: post.og_image,
    status: post.status === "draft" || post.status === "scheduled" ? post.status : "published",
  };
}

/** Map a Ghost API page to the shared Page type. */
function mapGhostPage(page: GhostApiPost): Page {
  return {
    id: page.id,
    title: page.title,
    slug: page.slug,
    html: page.html ?? "",
    excerpt: page.custom_excerpt ?? page.excerpt ?? "",
    feature_image: page.feature_image,
    published_at: page.published_at,
    meta_title: page.meta_title,
    meta_description: page.meta_description,
  };
}

/** Create a short-lived JWT for the Ghost Admin API (HS256, 5 min TTL). */
function createAdminToken(adminKey: string): string {
  const [id, secret] = adminKey.split(":");
  if (!id || !secret) {
    throw new GhostApiError(
      "Invalid admin key format (expected 'id:secret')",
      0,
      "/ghost/api/admin/",
    );
  }
  const now = Math.floor(Date.now() / 1000);
  const base64url = (value: string | Buffer): string => Buffer.from(value).toString("base64url");
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT", kid: id }));
  const payload = base64url(JSON.stringify({ iat: now, exp: now + 300, aud: "/admin/" }));
  const signature = createHmac("sha256", Buffer.from(secret, "hex"))
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${signature}`;
}

/** Fields requested from the Content API for posts and pages. */
const CONTENT_INCLUDE = "tags";

/**
 * GhostAdapter — implements ContentPort against one Ghost instance.
 * Reads go through the Content API, writes through the Admin API.
 */
export class GhostAdapter implements ContentPort {
  private readonly config: GhostConfig;
  constructor(config: GhostConfig) {
    this.config = config;
  }

  /** @inheritdoc */
  async getPosts(options?: ContentQueryOptions): Promise<Post[]> {
    const params = new URLSearchParams({ include: CONTENT_INCLUDE });
    if (options?.limit !== undefined) params.set("limit", String(options.limit));
    if (options?.page !== undefined) params.set("page", String(options.page));
    if (options?.tag) params.set("filter", `tag:${options.tag}`);
    const data = await this.contentRequest<{ posts: GhostApiPost[] }>("posts", params);
    return data.posts.map(mapGhostPost);
  }

  /** @inheritdoc */
  async getPostBySlug(slug: string): Promise<Post | null> {
    const params = new URLSearchParams({ include: CONTENT_INCLUDE });
    try {
      const data = await this.contentRequest<{ posts: GhostApiPost[] }>(
        `posts/slug/${encodeURIComponent(slug)}`,
        params,
      );
      return data.posts[0] ? mapGhostPost(data.posts[0]) : null;
    } catch (error) {
      if (error instanceof GhostApiError && error.status === 404) return null;
      throw error;
    }
  }

  /** @inheritdoc */
  async getPages(): Promise<Page[]> {
    const data = await this.contentRequest<{ pages: GhostApiPost[] }>(
      "pages",
      new URLSearchParams(),
    );
    return data.pages.map(mapGhostPage);
  }

  /** @inheritdoc */
  async getTags(): Promise<Tag[]> {
    const data = await this.contentRequest<{ tags: GhostApiTag[] }>(
      "tags",
      new URLSearchParams({ limit: "all" }),
    );
    return data.tags.map(mapGhostTag);
  }

  /** @inheritdoc */
  async createPost(post: CreatePostInput): Promise<Post> {
    const body = {
      posts: [
        {
          title: post.title,
          html: post.html,
          slug: post.slug,
          custom_excerpt: post.excerpt,
          feature_image: post.feature_image,
          tags: post.tags?.map((name) => ({ name })),
          meta_title: post.meta_title,
          meta_description: post.meta_description,
          status: post.status ?? "draft",
        },
      ],
    };
    const data = await this.adminRequest<{ posts: GhostApiPost[] }>(
      "posts/?source=html",
      "POST",
      body,
    );
    const created = data.posts[0];
    if (!created) throw new GhostApiError("Ghost returned no post", 0, "posts");
    return mapGhostPost(created);
  }

  /** @inheritdoc */
  async updatePost(id: string, post: Partial<CreatePostInput>): Promise<Post> {
    // Ghost requires updated_at for collision detection — fetch current state first.
    const current = await this.adminRequest<{ posts: (GhostApiPost & { updated_at: string })[] }>(
      `posts/${encodeURIComponent(id)}/`,
      "GET",
    );
    const existing = current.posts[0];
    if (!existing) throw new GhostApiError(`Post ${id} not found`, 404, "posts");
    const body = {
      posts: [
        {
          updated_at: existing.updated_at,
          ...(post.title !== undefined && { title: post.title }),
          ...(post.html !== undefined && { html: post.html }),
          ...(post.slug !== undefined && { slug: post.slug }),
          ...(post.excerpt !== undefined && { custom_excerpt: post.excerpt }),
          ...(post.feature_image !== undefined && { feature_image: post.feature_image }),
          ...(post.tags !== undefined && { tags: post.tags.map((name) => ({ name })) }),
          ...(post.meta_title !== undefined && { meta_title: post.meta_title }),
          ...(post.meta_description !== undefined && { meta_description: post.meta_description }),
          ...(post.status !== undefined && { status: post.status }),
        },
      ],
    };
    const data = await this.adminRequest<{ posts: GhostApiPost[] }>(
      `posts/${encodeURIComponent(id)}/?source=html`,
      "PUT",
      body,
    );
    const updated = data.posts[0];
    if (!updated) throw new GhostApiError("Ghost returned no post", 0, "posts");
    return mapGhostPost(updated);
  }

  /** Perform a read-only Content API request. */
  private async contentRequest<T>(endpoint: string, params: URLSearchParams): Promise<T> {
    params.set("key", this.config.contentKey);
    const url = `${this.config.url}/ghost/api/content/${endpoint}/?${params.toString()}`;
    return await requestJson<T>(url, { method: "GET" }, `content/${endpoint}`);
  }

  /** Perform an authenticated Admin API request. */
  private async adminRequest<T>(endpoint: string, method: string, body?: unknown): Promise<T> {
    if (!this.config.adminKey) {
      throw new GhostApiError("Admin key required for write operations", 0, `admin/${endpoint}`);
    }
    const token = createAdminToken(this.config.adminKey);
    const url = `${this.config.url}/ghost/api/admin/${endpoint}`;
    return await requestJson<T>(
      url,
      {
        method,
        headers: {
          Authorization: `Ghost ${token}`,
          "Content-Type": "application/json",
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      },
      `admin/${endpoint}`,
    );
  }
}

/**
 * GhostNewsletterAdapter — implements NewsletterPort via the Ghost Admin API.
 * Broadcasts are Ghost posts published as e-mail-only newsletters.
 */
export class GhostNewsletterAdapter implements NewsletterPort {
  private readonly config: GhostConfig;
  constructor(config: GhostConfig) {
    this.config = config;
  }

  /** @inheritdoc */
  async sendBroadcast(subject: string, html: string): Promise<void> {
    const token = this.requireToken();
    const createUrl = `${this.config.url}/ghost/api/admin/posts/?source=html`;
    const created = await requestJson<{ posts: { id: string; updated_at: string }[] }>(
      createUrl,
      {
        method: "POST",
        headers: { Authorization: `Ghost ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          posts: [{ title: subject, html, status: "draft", email_only: true }],
        }),
      },
      "admin/posts",
    );
    const draft = created.posts[0];
    if (!draft) throw new GhostApiError("Ghost returned no draft post", 0, "admin/posts");
    // Publishing with newsletter param triggers the e-mail send.
    const publishUrl = `${this.config.url}/ghost/api/admin/posts/${draft.id}/?newsletter=default-newsletter`;
    await requestJson(
      publishUrl,
      {
        method: "PUT",
        headers: { Authorization: `Ghost ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          posts: [{ status: "published", updated_at: draft.updated_at }],
        }),
      },
      "admin/posts/publish",
    );
  }

  /** @inheritdoc */
  async addSubscriber(email: string, name?: string): Promise<void> {
    const token = this.requireToken();
    const url = `${this.config.url}/ghost/api/admin/members/`;
    await requestJson(
      url,
      {
        method: "POST",
        headers: { Authorization: `Ghost ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          members: [{ email, name: name ?? null, subscribed: true }],
        }),
      },
      "admin/members",
    );
  }

  /** Ensure an admin key is configured and return a fresh JWT. */
  private requireToken(): string {
    if (!this.config.adminKey) {
      throw new GhostApiError("Admin key required for newsletter operations", 0, "admin/");
    }
    return createAdminToken(this.config.adminKey);
  }
}

/** Shared fetch wrapper with typed error handling (no secrets in errors). */
async function requestJson<T>(url: string, init: RequestInit, endpoint: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new GhostApiError(`Network error calling Ghost (${endpoint})`, 0, endpoint);
  }
  if (!response.ok) {
    throw new GhostApiError(
      `Ghost API error ${response.status} (${endpoint})`,
      response.status,
      endpoint,
    );
  }
  return (await response.json()) as T;
}

/** Factory — the only function site code should call (see src/lib/cms.ts). */
export function createGhostAdapter(config: GhostConfig): GhostAdapter {
  return new GhostAdapter(config);
}

/** Factory for the newsletter adapter. */
export function createGhostNewsletterAdapter(config: GhostConfig): GhostNewsletterAdapter {
  return new GhostNewsletterAdapter(config);
}
