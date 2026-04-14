import type { ScheduledPost, PublishRequest } from "./types";

const STORAGE_KEY = "app_scheduled_posts";

export function getScheduledPosts(): ScheduledPost[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function createScheduledPost(req: PublishRequest): ScheduledPost {
  const post: ScheduledPost = {
    id: `sp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    user_id: JSON.parse(localStorage.getItem("app_session") || "{}").user_id || "local",
    carousel_id: req.carousel_id,
    platforms: req.platforms,
    caption: req.caption,
    scheduled_for: req.scheduled_for || null,
    status: req.scheduled_for ? "pending" : "publishing",
    publish_results: null,
    image_urls: req.image_urls,
    created_at: new Date().toISOString(),
    published_at: null,
  };

  const all = getScheduledPosts();
  all.push(post);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

  // Simulate instant publish
  if (!req.scheduled_for) {
    setTimeout(() => {
      const posts = getScheduledPosts();
      const idx = posts.findIndex((p) => p.id === post.id);
      if (idx >= 0) {
        const results: Record<string, { success: boolean; post_id?: string }> = {};
        for (const platform of req.platforms) {
          results[platform] = { success: true, post_id: `post-${Date.now()}-${platform}` };
        }
        posts[idx].status = "published";
        posts[idx].publish_results = results;
        posts[idx].published_at = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
      }
    }, 2000);
  }

  return post;
}

export function deleteScheduledPost(id: string) {
  const all = getScheduledPosts().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
