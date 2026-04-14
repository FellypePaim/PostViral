const USERS_KEY = "app_users";
const SESSION_KEY = "app_session";

export interface LocalUser {
  id: string;
  email: string;
  password: string;
  created_at: string;
}

export interface LocalSession {
  user_id: string;
  email: string;
  token: string;
}

function getUsers(): LocalUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: LocalUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): LocalSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(session: LocalSession | null) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    document.cookie = `local_auth=${session.token}; path=/; max-age=604800`;
  } else {
    localStorage.removeItem(SESSION_KEY);
    document.cookie = "local_auth=; path=/; max-age=0";
  }
}

export function localSignUp(email: string, password: string): { success: boolean; error?: string; session?: LocalSession } {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    return { success: false, error: "Email ja cadastrado" };
  }

  const id = `user-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const user: LocalUser = {
    id,
    email,
    password,
    created_at: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);

  const session: LocalSession = {
    user_id: id,
    email,
    token: `tok-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  };
  saveSession(session);

  // Save default settings
  const settingsKey = `app_settings_${id}`;
  localStorage.setItem(settingsKey, JSON.stringify({
    id: `settings-${Date.now()}`,
    user_id: id,
    gemini_api_key: null,
    preferred_image_model: "gemini-2.0-flash-exp",
    display_name: email.split("@")[0],
    avatar_url: null,
    plan: "monthly",
    plan_expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
    created_at: new Date().toISOString(),
  }));

  return { success: true, session };
}

export function localSignIn(email: string, password: string): { success: boolean; error?: string; session?: LocalSession } {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { success: false, error: "Email ou senha incorretos" };
  }

  const session: LocalSession = {
    user_id: user.id,
    email: user.email,
    token: `tok-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  };
  saveSession(session);

  return { success: true, session };
}

export function localSignOut() {
  saveSession(null);
}

export function getLocalSettings(userId: string) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`app_settings_${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLocalSettings(userId: string, updates: Record<string, unknown>) {
  const current = getLocalSettings(userId) || {};
  const merged = { ...current, ...updates };
  localStorage.setItem(`app_settings_${userId}`, JSON.stringify(merged));
  return merged;
}
