/**
 * CMS Capability Ports (ADR-W0).
 *
 * Every CMS capability is described as a typed TypeScript interface (port).
 * Ghost is only the default adapter — any port can be re-implemented by a
 * different adapter (Markdown, Strapi, Supabase, ...) without touching the
 * Astro layer. No Astro component may import an adapter directly; they only
 * consume these ports.
 */

// ---------------------------------------------------------------------------
// Shared content types
// ---------------------------------------------------------------------------

/** Publication status of a post or page. */
export type ContentStatus = "draft" | "published" | "scheduled";

/** A content tag (category/topic marker). */
export interface Tag {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string | null;
}

/** A blog post delivered by the CMS. */
export interface Post {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  /** Rendered HTML body of the post. */
  readonly html: string;
  readonly excerpt: string;
  readonly feature_image: string | null;
  /** ISO-8601 timestamp or null when unpublished. */
  readonly published_at: string | null;
  readonly tags: readonly Tag[];
  readonly meta_title: string | null;
  readonly meta_description: string | null;
  readonly og_image: string | null;
  readonly status: ContentStatus;
}

/** A static page (same shape as Post minus tags semantics). */
export interface Page {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly html: string;
  readonly excerpt: string;
  readonly feature_image: string | null;
  readonly published_at: string | null;
  readonly meta_title: string | null;
  readonly meta_description: string | null;
}

/** Input payload for creating a post via the write API. */
export interface CreatePostInput {
  readonly title: string;
  /** HTML body. Adapters convert to their native format if needed. */
  readonly html: string;
  readonly slug?: string;
  readonly excerpt?: string;
  readonly feature_image?: string;
  readonly tags?: readonly string[];
  readonly meta_title?: string;
  readonly meta_description?: string;
  readonly status?: ContentStatus;
}

/** Query options for listing posts. */
export interface ContentQueryOptions {
  /** Maximum number of posts to return. */
  readonly limit?: number;
  /** 1-based page number for pagination. */
  readonly page?: number;
  /** Filter by tag slug. */
  readonly tag?: string;
  /** Include drafts/scheduled posts (requires write/admin access). */
  readonly includeDrafts?: boolean;
}

/** A registered member/subscriber. */
export interface Member {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly created_at: string;
  /** Subscription tier slugs the member belongs to. */
  readonly tiers: readonly string[];
  readonly subscribed_to_newsletter: boolean;
}

// ---------------------------------------------------------------------------
// Capability ports
// ---------------------------------------------------------------------------

/**
 * ContentPort — posts/pages/tags read + write.
 * Default adapter: Ghost (Content API read, Admin API write).
 */
export interface ContentPort {
  /** List published posts (or drafts too, when requested and authorized). */
  getPosts(options?: ContentQueryOptions): Promise<Post[]>;
  /** Fetch a single post by slug; null when not found. */
  getPostBySlug(slug: string): Promise<Post | null>;
  /** List static pages. */
  getPages(): Promise<Page[]>;
  /** List all tags. */
  getTags(): Promise<Tag[]>;
  /** Create a new post (write access required). */
  createPost(post: CreatePostInput): Promise<Post>;
  /** Partially update an existing post (write access required). */
  updatePost(id: string, post: Partial<CreatePostInput>): Promise<Post>;
}

/**
 * MemberPort — registration, tiers, access control.
 * Default adapter: Ghost Members.
 */
export interface MemberPort {
  /** List all members. */
  getMembers(): Promise<Member[]>;
  /** Look up a member by e-mail address; null when not found. */
  getMemberByEmail(email: string): Promise<Member | null>;
}

/**
 * NewsletterPort — broadcasts to subscribers.
 * Default adapter: Ghost Newsletter.
 */
export interface NewsletterPort {
  /** Send a one-off broadcast e-mail to all subscribers. */
  sendBroadcast(subject: string, html: string): Promise<void>;
  /** Add a new subscriber (double opt-in handled by the adapter). */
  addSubscriber(email: string, name?: string): Promise<void>;
}

/**
 * AutomationPort — drip campaigns and sequences.
 * Default adapter: Mailerlite (Ghost has no automation sequences).
 */
export interface AutomationPort {
  /** Enroll a subscriber into a named automation sequence. */
  startSequence(email: string, sequenceId: string): Promise<void>;
  /** Remove a subscriber from a named automation sequence. */
  stopSequence(email: string, sequenceId: string): Promise<void>;
}

/**
 * MonetizationPort — paid content and subscriptions.
 * Default adapter: Ghost Tiers + Stripe.
 */
export interface MonetizationPort {
  /** List available subscription tier slugs. */
  getTiers(): Promise<string[]>;
  /** Check whether a member has access to a given tier. */
  hasAccess(memberEmail: string, tier: string): Promise<boolean>;
}

/** Result of a media upload. */
export interface MediaUploadResult {
  /** Publicly reachable URL of the uploaded asset. */
  readonly url: string;
}

/**
 * MediaPort — image upload and storage.
 * Default adapter: Ghost Storage (local volume).
 */
export interface MediaPort {
  /** Upload a binary asset and return its public URL. */
  uploadImage(data: Blob | ArrayBuffer, filename: string): Promise<MediaUploadResult>;
}

/** A single page-view style analytics data point. */
export interface AnalyticsEvent {
  readonly name: string;
  readonly url: string;
  /** Optional additional properties for the event. */
  readonly props?: Readonly<Record<string, string>>;
}

/**
 * AnalyticsPort — page views and content performance.
 * Default adapter: Plausible SaaS (client-side script; this port covers
 * server-side/custom events where needed).
 */
export interface AnalyticsPort {
  /** Record a custom event. */
  trackEvent(event: AnalyticsEvent): Promise<void>;
}
