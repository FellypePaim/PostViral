export type SocialPlatform = "instagram" | "threads" | "facebook" | "twitter";

export interface SocialConnection {
  id: string;
  user_id: string;
  platform: SocialPlatform;
  platform_user_id: string;
  platform_username: string | null;
  access_token: string;
  refresh_token: string | null;
  token_expires_at: string | null;
  scopes: string[];
  connected_at: string;
}

export interface ScheduledPost {
  id: string;
  user_id: string;
  carousel_id: string;
  platforms: SocialPlatform[];
  caption: string | null;
  scheduled_for: string | null;
  status: "pending" | "publishing" | "published" | "failed";
  publish_results: Record<string, { success: boolean; post_id?: string; error?: string }> | null;
  image_urls: string[];
  created_at: string;
  published_at: string | null;
}

export interface PublishRequest {
  carousel_id: string;
  platforms: SocialPlatform[];
  caption: string;
  scheduled_for?: string; // ISO string, null = now
  image_urls: string[];
}

export const PLATFORM_INFO: Record<SocialPlatform, {
  name: string;
  icon: string;
  maxImages: number;
  supportsCarousel: boolean;
  supportsNativeSchedule: boolean;
  requiresApiKey: boolean;
}> = {
  instagram: {
    name: "Instagram",
    icon: "instagram",
    maxImages: 10,
    supportsCarousel: true,
    supportsNativeSchedule: true,
    requiresApiKey: false,
  },
  threads: {
    name: "Threads",
    icon: "at-sign",
    maxImages: 10,
    supportsCarousel: true,
    supportsNativeSchedule: true,
    requiresApiKey: false,
  },
  facebook: {
    name: "Facebook",
    icon: "facebook",
    maxImages: 10,
    supportsCarousel: true,
    supportsNativeSchedule: true,
    requiresApiKey: false,
  },
  twitter: {
    name: "X / Twitter",
    icon: "twitter",
    maxImages: 4,
    supportsCarousel: false,
    supportsNativeSchedule: false,
    requiresApiKey: true,
  },
};
