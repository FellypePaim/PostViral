"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getSession,
  localSignOut,
  getLocalSettings,
  type LocalSession,
} from "@/lib/local-auth";

interface UserLike {
  id: string;
  email: string;
}

interface SettingsLike {
  id: string;
  user_id: string;
  gemini_api_key: string | null;
  preferred_image_model: string;
  display_name: string | null;
  avatar_url: string | null;
  plan: string;
  plan_expires_at: string | null;
  created_at: string;
}

interface AuthContextType {
  user: UserLike | null;
  session: LocalSession | null;
  settings: SettingsLike | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  settings: null,
  loading: true,
  refreshSettings: async () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserLike | null>(null);
  const [session, setSession] = useState<LocalSession | null>(null);
  const [settings, setSettings] = useState<SettingsLike | null>(null);
  const [loading, setLoading] = useState(true);

  function loadSession() {
    const sess = getSession();
    if (sess) {
      setSession(sess);
      setUser({ id: sess.user_id, email: sess.email });
      const s = getLocalSettings(sess.user_id);
      setSettings(s);
    } else {
      setSession(null);
      setUser(null);
      setSettings(null);
    }
    setLoading(false);
  }

  async function refreshSettings() {
    if (session) {
      const s = getLocalSettings(session.user_id);
      setSettings(s);
    }
  }

  async function signOut() {
    localSignOut();
    setUser(null);
    setSession(null);
    setSettings(null);
    window.location.href = "/login";
  }

  useEffect(() => {
    loadSession();

    // Listen for storage changes (other tabs)
    function onStorage(e: StorageEvent) {
      if (e.key === "app_session") loadSession();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, session, settings, loading, refreshSettings, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
