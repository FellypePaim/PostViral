"use client";

import { useState } from "react";
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
  const [tab, setTab] = useState<"perfil" | "api">("perfil");
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
    </div>
  );
}
