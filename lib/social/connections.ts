import type { SocialConnection, SocialPlatform } from "./types";

const STORAGE_KEY = "app_social_connections";

export function getSocialConnections(): SocialConnection[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getConnectionByPlatform(platform: SocialPlatform): SocialConnection | null {
  return getSocialConnections().find((c) => c.platform === platform) || null;
}

export function saveSocialConnection(connection: SocialConnection) {
  const all = getSocialConnections().filter(
    (c) => !(c.platform === connection.platform && c.user_id === connection.user_id)
  );
  all.push(connection);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function removeSocialConnection(id: string) {
  const all = getSocialConnections().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

// Simulate OAuth connect (dev local)
export function simulateConnect(platform: SocialPlatform, username: string): SocialConnection {
  const connection: SocialConnection = {
    id: `sc-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    user_id: JSON.parse(localStorage.getItem("app_session") || "{}").user_id || "local",
    platform,
    platform_user_id: `pid-${Date.now()}`,
    platform_username: username,
    access_token: `fake-token-${Date.now()}`,
    refresh_token: null,
    token_expires_at: new Date(Date.now() + 60 * 86400000).toISOString(),
    scopes: ["publish", "read"],
    connected_at: new Date().toISOString(),
  };
  saveSocialConnection(connection);
  return connection;
}
