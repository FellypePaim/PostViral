"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { authFetch } from "@/lib/auth-fetch";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Save } from "lucide-react";

const IMAGE_MODELS = [
  { value: "gemini-2.0-flash-exp", label: "Nano Banana 2 (Padrao)", cost: "~$0.04/img" },
  { value: "gemini-2.0-flash", label: "Nano Banana", cost: "~$0.04/img" },
  { value: "gemini-2.0-pro-exp", label: "Nano Banana Pro", cost: "~$0.07/img" },
];

export default function ConfiguracoesPage() {
  const { user, settings, signOut, refreshSettings } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<"perfil" | "api" | "social">("perfil");
  const [displayName, setDisplayName] = useState(settings?.display_name || "");
  const [apiKey, setApiKey] = useState(settings?.gemini_api_key || "");
  const [showKey, setShowKey] = useState(false);
  const [imageModel, setImageModel] = useState(
    () => typeof window !== "undefined" ? localStorage.getItem("mpf_image_model") || "gemini-2.0-flash-exp" : "gemini-2.0-flash-exp"
  );
  const [saving, setSaving] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function saveName() {
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("user_settings")
      .update({ display_name: displayName } as never)
      .eq("user_id", user!.id);
    await refreshSettings();
    toast("Nome salvo", "success");
    setSaving(false);
  }

  async function saveApiKey() {
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("user_settings")
      .update({ gemini_api_key: apiKey } as never)
      .eq("user_id", user!.id);
    localStorage.setItem("mpf_image_model", imageModel);
    await refreshSettings();
    toast("Chave salva", "success");
    setSaving(false);
  }

  async function testKey() {
    const res = await authFetch(`/api/test-key?key=${encodeURIComponent(apiKey)}`);
    const data = await res.json();
    if (data.valid) {
      toast("Chave valida", "success");
    } else {
      toast("Chave invalida", "error");
    }
  }

  async function changePassword() {
    if (!newPassword || newPassword.length < 6) {
      toast("Senha deve ter pelo menos 6 caracteres", "error");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast("Erro ao alterar senha", "error");
    } else {
      toast("Senha alterada", "success");
      setOldPassword("");
      setNewPassword("");
    }
  }

  const planLabel = settings?.plan === "annual" ? "Anual" : settings?.plan === "monthly" ? "Mensal" : "Semanal";
  const daysLeft = settings?.plan_expires_at
    ? Math.max(0, Math.ceil((new Date(settings.plan_expires_at).getTime() - Date.now()) / 86400000))
    : 0;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Configuracoes</h1>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("perfil")}
          className={`px-4 py-2 rounded-lg text-sm cursor-pointer ${tab === "perfil" ? "bg-bg-surface-2 text-text-primary" : "text-text-secondary"}`}
        >
          Perfil
        </button>
        <button
          onClick={() => setTab("api")}
          className={`px-4 py-2 rounded-lg text-sm cursor-pointer ${tab === "api" ? "bg-bg-surface-2 text-text-primary" : "text-text-secondary"}`}
        >
          API & IA
        </button>
        <button
          onClick={() => setTab("social")}
          className={`px-4 py-2 rounded-lg text-sm cursor-pointer ${tab === "social" ? "bg-bg-surface-2 text-text-primary" : "text-text-secondary"}`}
        >
          Redes Sociais
        </button>
      </div>

      {tab === "perfil" && (
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <Input
              label="Nome de exibicao"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <Input label="Email" value={user?.email || ""} disabled />
            <Button onClick={saveName} loading={saving} size="sm">
              <Save size={14} className="mr-1.5" />
              Salvar nome
            </Button>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-sm">Alterar senha</h3>
            <Input label="Senha atual" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            <Input label="Nova senha" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Button onClick={changePassword} variant="secondary" size="sm">
              Alterar senha
            </Button>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-2">Plano ativo</h3>
            <p className="text-sm text-text-secondary">
              {planLabel} - {daysLeft > 0 ? `${daysLeft} dias restantes` : "Expirado"}
            </p>
          </Card>

          <Button onClick={signOut} variant="danger" size="sm">
            Encerrar sessao
          </Button>
        </div>
      )}

      {tab === "api" && (
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-sm">Chave de API Gemini</h3>
            <p className="text-xs text-text-secondary">
              Necessaria para gerar imagens com IA. Obtenha em aistudio.google.com
            </p>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza..."
                className="w-full bg-bg-surface-2 border border-border-default rounded-lg px-3 py-2 pr-10 text-sm text-text-primary"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary cursor-pointer"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveApiKey} loading={saving} size="sm">
                Salvar
              </Button>
              <Button onClick={testKey} variant="secondary" size="sm">
                Testar chave
              </Button>
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <h3 className="font-semibold text-sm">Modelo de imagem</h3>
            {IMAGE_MODELS.map((m) => (
              <label key={m.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="model"
                  value={m.value}
                  checked={imageModel === m.value}
                  onChange={(e) => {
                    setImageModel(e.target.value);
                    localStorage.setItem("mpf_image_model", e.target.value);
                  }}
                  className="accent-white"
                />
                <div>
                  <span className="text-sm">{m.label}</span>
                  <span className="text-xs text-text-secondary ml-2">{m.cost}</span>
                </div>
              </label>
            ))}
          </Card>
        </div>
      )}
      {tab === "social" && <SocialTab />}
    </div>
  );
}

function SocialTab() {
  const [connections, setConnections] = useState<Array<{ id: string; platform: string; platform_username: string | null; connected_at: string }>>([]);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadConnections();
  }, []);

  function loadConnections() {
    try {
      const raw = localStorage.getItem("app_social_connections");
      setConnections(raw ? JSON.parse(raw) : []);
    } catch {
      setConnections([]);
    }
  }

  const platforms = [
    { id: "instagram", name: "Instagram", desc: "Publique carrosseis diretamente no Instagram", phase: "Disponivel" },
    { id: "threads", name: "Threads", desc: "Publique carrosseis no Threads", phase: "Disponivel" },
    { id: "facebook", name: "Facebook Pages", desc: "Publique como album na sua Page", phase: "Em breve" },
    { id: "twitter", name: "X / Twitter", desc: "Publique como thread ou post multi-imagem", phase: "Em breve" },
  ];

  function handleConnect(platform: string) {
    if (!username.trim()) return;
    // Simulate OAuth - in production this would redirect to Meta/Twitter OAuth
    const connection = {
      id: `sc-${Date.now()}`,
      user_id: JSON.parse(localStorage.getItem("app_session") || "{}").user_id || "local",
      platform,
      platform_user_id: `pid-${Date.now()}`,
      platform_username: username.trim(),
      access_token: `fake-token-${Date.now()}`,
      refresh_token: null,
      token_expires_at: new Date(Date.now() + 60 * 86400000).toISOString(),
      scopes: ["publish", "read"],
      connected_at: new Date().toISOString(),
    };
    const all = [...connections.filter((c) => c.platform !== platform), connection];
    localStorage.setItem("app_social_connections", JSON.stringify(all));
    setConnections(all);
    setConnectingPlatform(null);
    setUsername("");
    toast(`${platform} conectado`, "success");
  }

  function handleDisconnect(id: string) {
    const all = connections.filter((c) => c.id !== id);
    localStorage.setItem("app_social_connections", JSON.stringify(all));
    setConnections(all);
    toast("Rede desconectada", "success");
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h3 className="font-semibold text-sm mb-1">Redes Sociais</h3>
        <p className="text-xs text-text-secondary mb-4">Conecte suas contas para publicar carrosseis diretamente do editor.</p>

        <div className="space-y-3">
          {platforms.map((p) => {
            const conn = connections.find((c) => c.platform === p.id);
            return (
              <div key={p.id} className="flex items-center justify-between p-3 bg-bg-surface-2 rounded-lg border border-border-subtle">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${conn ? "bg-green-400" : "bg-text-secondary/30"}`} />
                  <div>
                    <span className="text-sm font-medium">{p.name}</span>
                    {conn ? (
                      <span className="text-xs text-green-400 ml-2">@{conn.platform_username}</span>
                    ) : (
                      <span className="text-xs text-text-secondary ml-2">{p.desc}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {p.phase === "Em breve" && !conn ? (
                    <span className="text-[10px] bg-bg-surface-3 text-text-secondary px-2 py-1 rounded-full">Em breve</span>
                  ) : conn ? (
                    <button onClick={() => handleDisconnect(conn.id)} className="text-xs text-red-400 hover:text-red-300 cursor-pointer">Desconectar</button>
                  ) : connectingPlatform === p.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleConnect(p.id)}
                        placeholder="@usuario"
                        className="w-28 bg-bg-surface-3 border border-border-default rounded px-2 py-1 text-xs text-text-primary"
                        autoFocus
                      />
                      <Button size="sm" onClick={() => handleConnect(p.id)}>OK</Button>
                      <button onClick={() => setConnectingPlatform(null)} className="text-xs text-text-secondary cursor-pointer">X</button>
                    </div>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => { setConnectingPlatform(p.id); setUsername(""); }}>Conectar</Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold text-sm mb-1">Como funciona</h3>
        <div className="space-y-2 text-xs text-text-secondary">
          <p>1. Conecte suas redes sociais acima (OAuth seguro)</p>
          <p>2. No editor, clique em "Publicar" no rodape</p>
          <p>3. Selecione as redes, edite a legenda e escolha publicar agora ou agendar</p>
          <p>4. As imagens sao exportadas e publicadas automaticamente</p>
        </div>
      </Card>
    </div>
  );
}
