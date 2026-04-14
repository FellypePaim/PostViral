"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Brain } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  instagram_handle: string;
  niche: string;
  target_audience: string;
  tone_of_voice: string;
  content_type: string;
  extra_instructions: string;
}

interface TrainingModalProps {
  open: boolean;
  onClose: () => void;
}

function getProfiles(): Profile[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("app_training_profiles") || "[]"); } catch { return []; }
}

function saveProfiles(profiles: Profile[]) {
  localStorage.setItem("app_training_profiles", JSON.stringify(profiles));
}

export function TrainingModal({ open, onClose }: TrainingModalProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "", instagram_handle: "", niche: "", target_audience: "", tone_of_voice: "", content_type: "", extra_instructions: "",
  });

  useEffect(() => {
    if (open) setProfiles(getProfiles());
  }, [open]);

  function handleSave() {
    if (!form.name.trim()) return;
    const profile: Profile = { ...form, id: `tp-${Date.now()}` };
    const updated = [...profiles, profile];
    saveProfiles(updated);
    setProfiles(updated);
    setCreating(false);
    setForm({ name: "", instagram_handle: "", niche: "", target_audience: "", tone_of_voice: "", content_type: "", extra_instructions: "" });
  }

  if (creating) {
    return (
      <Modal open={open} onClose={() => setCreating(false)} title="Treinar novo perfil" className="max-w-lg">
        <p className="text-sm text-text-secondary mb-4">
          Preencha uma vez. A IA gerara carrosseis no seu estilo automaticamente.
        </p>
        <div className="space-y-3">
          <Input label="Nome do perfil *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Meu canal de financas, Marca pessoal..." />
          <Input label="@ do Instagram" value={form.instagram_handle} onChange={(e) => setForm({ ...form, instagram_handle: e.target.value })} placeholder="@seuusuario" />
          <Input label="Nicho / Area de atuacao" value={form.niche} onChange={(e) => setForm({ ...form, niche: e.target.value })} placeholder="Ex: Financas pessoais, Marketing digital..." />
          <Input label="Publico-alvo" value={form.target_audience} onChange={(e) => setForm({ ...form, target_audience: e.target.value })} placeholder="Ex: Jovens de 20-35 anos, empreendedores..." />
          <Input label="Tom de voz" value={form.tone_of_voice} onChange={(e) => setForm({ ...form, tone_of_voice: e.target.value })} placeholder="Ex: Educativo e direto, descontraido..." />
          <Input label="Tipo de conteudo preferido" value={form.content_type} onChange={(e) => setForm({ ...form, content_type: e.target.value })} placeholder="Ex: Dicas praticas, listas, storytelling..." />
          <div>
            <label className="text-sm font-medium text-text-secondary">Instrucoes extras (opcional)</label>
            <textarea
              value={form.extra_instructions}
              onChange={(e) => setForm({ ...form, extra_instructions: e.target.value })}
              placeholder="Ex: Sempre use dados e estatisticas, termine com uma pergunta..."
              className="w-full mt-1 bg-bg-surface-2 border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary resize-none h-20"
            />
          </div>
          <Button onClick={handleSave} className="w-full" disabled={!form.name.trim()}>
            Salvar perfil
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Perfis de Treinamento" className="max-w-md">
      <p className="text-sm text-text-secondary mb-4">
        Selecione um perfil para criar um carrossel com IA no seu estilo.
      </p>

      {profiles.length === 0 ? (
        <div className="text-center py-8">
          <Brain size={36} className="text-text-secondary/30 mx-auto" />
          <p className="text-sm text-text-secondary mt-3">
            Voce ainda nao tem nenhum perfil treinado.
          </p>
          <p className="text-xs text-text-secondary/60 mt-1">
            Crie o primeiro para gerar carrosseis no seu estilo.
          </p>
          <Button onClick={() => setCreating(true)} className="mt-4">
            <Plus size={15} className="mr-1.5" />
            Treinar primeiro perfil
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {profiles.map((p) => (
            <div key={p.id} className="p-3 bg-bg-surface-3 rounded-lg border border-border-subtle hover:border-border-default cursor-pointer">
              <p className="font-medium text-sm">{p.name}</p>
              <p className="text-xs text-text-secondary mt-0.5">
                {[p.niche, p.tone_of_voice].filter(Boolean).join(" - ") || "Sem detalhes"}
              </p>
            </div>
          ))}
          <Button onClick={() => setCreating(true)} variant="secondary" className="w-full mt-3">
            <Plus size={15} className="mr-1.5" />
            Treinar novo perfil
          </Button>
        </div>
      )}
    </Modal>
  );
}
